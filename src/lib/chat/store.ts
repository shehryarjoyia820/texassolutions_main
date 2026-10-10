import { neon } from '@neondatabase/serverless';
import { randomBytes, createHash } from 'node:crypto';
import { buildSiteKnowledge, hashText, publishedAmounts, dollarAmounts, type KbItem } from './knowledge';

/**
 * Persistence for leads, conversations, knowledge and review flags.
 *
 * Production uses Postgres (Neon via the Vercel Marketplace sets DATABASE_URL).
 * Without a database URL everything is kept in memory so the chatbot can be
 * tried locally; nothing survives a restart in that mode.
 */

export interface LeadProfile {
  services?: string[];
  budget?: string;
  timeline?: string;
  requirements?: string;
  language?: string;
  recommended?: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  privacyAck: boolean;
  marketingConsent: boolean;
  sourcePage: string;
  profile: LeadProfile;
  messageCount: number;
  emailedCount: number;
  needsHuman: boolean;
  lastMessageAt: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Flag {
  id: number;
  kind: 'conflict' | 'incomplete' | 'unanswered' | 'handoff';
  ref: string;
  detail: string;
  createdAt: string;
  resolved: boolean;
}

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
export const hasDatabase = Boolean(DB_URL);
const sql = hasDatabase ? neon(DB_URL) : null;

/* ------------------------------------------------------------------ */
/*  In-memory fallback (local development only)                        */
/* ------------------------------------------------------------------ */

interface Mem {
  leads: Map<string, Lead & { tokenHash: string }>;
  messages: Map<string, ChatMessage[]>;
  kb: Map<string, KbItem>;
  flags: Flag[];
}
const g = globalThis as unknown as { __tsChatMem?: Mem };
const mem: Mem = (g.__tsChatMem ??= { leads: new Map(), messages: new Map(), kb: new Map(), flags: [] });

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

let schemaReady: Promise<void> | null = null;
function ensureSchema() {
  if (!sql) return Promise.resolve();
  schemaReady ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS chat_leads (
      id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), name text NOT NULL, email text NOT NULL,
      phone text NOT NULL DEFAULT '', company text NOT NULL DEFAULT '', website text NOT NULL DEFAULT '',
      privacy_ack boolean NOT NULL, marketing_consent boolean NOT NULL DEFAULT false, source_page text NOT NULL DEFAULT '',
      token_hash text NOT NULL, profile jsonb NOT NULL DEFAULT '{}'::jsonb, message_count int NOT NULL DEFAULT 0,
      emailed_count int NOT NULL DEFAULT 0, needs_human boolean NOT NULL DEFAULT false, last_message_at timestamptz)`;
    await sql`CREATE INDEX IF NOT EXISTS chat_leads_email ON chat_leads (lower(email))`;
    await sql`CREATE TABLE IF NOT EXISTS chat_messages (
      id bigserial PRIMARY KEY, lead_id text NOT NULL REFERENCES chat_leads(id) ON DELETE CASCADE,
      role text NOT NULL, content text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
    await sql`CREATE INDEX IF NOT EXISTS chat_messages_lead ON chat_messages (lead_id, id)`;
    await sql`CREATE TABLE IF NOT EXISTS chat_kb (
      id text PRIMARY KEY, title text NOT NULL, body text NOT NULL, category text NOT NULL, source_page text NOT NULL DEFAULT '',
      service text, origin text NOT NULL, status text NOT NULL DEFAULT 'active', flag_reason text,
      hash text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
    await sql`CREATE TABLE IF NOT EXISTS chat_flags (
      id bigserial PRIMARY KEY, kind text NOT NULL, ref text NOT NULL, detail text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(), resolved boolean NOT NULL DEFAULT false)`;
  })().catch((e) => {
    schemaReady = null;
    throw e;
  });
  return schemaReady;
}

/* ------------------------------------------------------------------ */
/*  Leads                                                              */
/* ------------------------------------------------------------------ */

const tokenHash = (t: string) => createHash('sha256').update(t).digest('hex');

function newLeadId() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `TS-${ymd}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToLead(r: any): Lead {
  return {
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    name: r.name,
    email: r.email,
    phone: r.phone,
    company: r.company,
    website: r.website,
    privacyAck: r.privacy_ack,
    marketingConsent: r.marketing_consent,
    sourcePage: r.source_page,
    profile: r.profile ?? {},
    messageCount: r.message_count,
    emailedCount: r.emailed_count,
    needsHuman: r.needs_human,
    lastMessageAt: r.last_message_at ? new Date(r.last_message_at).toISOString() : null,
  };
}

export async function createLead(input: Omit<Lead, 'id' | 'createdAt' | 'profile' | 'messageCount' | 'emailedCount' | 'needsHuman' | 'lastMessageAt'>) {
  await ensureSchema();
  const id = newLeadId();
  const token = randomBytes(24).toString('base64url');
  const th = tokenHash(token);
  if (sql) {
    await sql`INSERT INTO chat_leads (id, name, email, phone, company, website, privacy_ack, marketing_consent, source_page, token_hash)
      VALUES (${id}, ${input.name}, ${input.email}, ${input.phone}, ${input.company}, ${input.website}, ${input.privacyAck}, ${input.marketingConsent}, ${input.sourcePage}, ${th})`;
  } else {
    mem.leads.set(id, { ...input, id, createdAt: new Date().toISOString(), profile: {}, messageCount: 0, emailedCount: 0, needsHuman: false, lastMessageAt: null, tokenHash: th });
    mem.messages.set(id, []);
  }
  return { id, token };
}

/** Returns the lead only when the browser token matches; past chats are never shown by email alone. */
export async function authLead(id: string, token: string): Promise<Lead | null> {
  if (!id || !token) return null;
  await ensureSchema();
  const th = tokenHash(token);
  if (sql) {
    const rows = await sql`SELECT * FROM chat_leads WHERE id = ${id} AND token_hash = ${th}`;
    return rows[0] ? rowToLead(rows[0]) : null;
  }
  const l = mem.leads.get(id);
  return l && l.tokenHash === th ? l : null;
}

export async function getLead(id: string): Promise<Lead | null> {
  await ensureSchema();
  if (sql) {
    const rows = await sql`SELECT * FROM chat_leads WHERE id = ${id}`;
    return rows[0] ? rowToLead(rows[0]) : null;
  }
  return mem.leads.get(id) ?? null;
}

export async function listLeads(limit = 200): Promise<Lead[]> {
  await ensureSchema();
  if (sql) return (await sql`SELECT * FROM chat_leads ORDER BY created_at DESC LIMIT ${limit}`).map(rowToLead);
  return [...mem.leads.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function otherLeadsForEmail(email: string, exceptId: string): Promise<Lead[]> {
  await ensureSchema();
  if (sql) return (await sql`SELECT * FROM chat_leads WHERE lower(email) = lower(${email}) AND id <> ${exceptId} ORDER BY created_at DESC`).map(rowToLead);
  return [...mem.leads.values()].filter((l) => l.email.toLowerCase() === email.toLowerCase() && l.id !== exceptId);
}

export async function updateLeadAfterTurn(id: string, profile: LeadProfile, needsHuman: boolean) {
  if (sql) {
    await sql`UPDATE chat_leads SET profile = ${JSON.stringify(profile)}::jsonb, needs_human = needs_human OR ${needsHuman},
      last_message_at = now() WHERE id = ${id}`;
  } else {
    const l = mem.leads.get(id);
    if (l) Object.assign(l, { profile, needsHuman: l.needsHuman || needsHuman, lastMessageAt: new Date().toISOString() });
  }
}

export async function setEmailedCount(id: string, count: number) {
  if (sql) await sql`UPDATE chat_leads SET emailed_count = GREATEST(emailed_count, ${count}) WHERE id = ${id}`;
  else {
    const l = mem.leads.get(id);
    if (l) l.emailedCount = Math.max(l.emailedCount, count);
  }
}

/* ------------------------------------------------------------------ */
/*  Messages                                                           */
/* ------------------------------------------------------------------ */

export async function addMessage(leadId: string, role: ChatMessage['role'], content: string) {
  if (sql) {
    await sql`INSERT INTO chat_messages (lead_id, role, content) VALUES (${leadId}, ${role}, ${content})`;
    await sql`UPDATE chat_leads SET message_count = message_count + 1, last_message_at = now() WHERE id = ${leadId}`;
  } else {
    mem.messages.get(leadId)?.push({ role, content, createdAt: new Date().toISOString() });
    const l = mem.leads.get(leadId);
    if (l) l.messageCount += 1;
  }
}

export async function getMessages(leadId: string): Promise<ChatMessage[]> {
  await ensureSchema();
  if (sql) {
    const rows = await sql`SELECT role, content, created_at FROM chat_messages WHERE lead_id = ${leadId} ORDER BY id`;
    return rows.map((r: any) => ({ role: r.role, content: r.content, createdAt: new Date(r.created_at).toISOString() }));
  }
  return mem.messages.get(leadId) ?? [];
}

export async function userMessagesToday(leadId: string): Promise<number> {
  if (sql) {
    const rows = await sql`SELECT count(*)::int AS n FROM chat_messages WHERE lead_id = ${leadId} AND role = 'user' AND created_at > now() - interval '1 day'`;
    return rows[0]?.n ?? 0;
  }
  return (mem.messages.get(leadId) ?? []).filter((m) => m.role === 'user').length;
}

/* ------------------------------------------------------------------ */
/*  Knowledge base                                                     */
/* ------------------------------------------------------------------ */

function rowToKb(r: any): KbItem {
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    category: r.category,
    sourcePage: r.source_page,
    service: r.service ?? undefined,
    origin: r.origin,
    status: r.status,
    flagReason: r.flag_reason,
    hash: r.hash,
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

let synced: Promise<void> | null = null;

/**
 * Brings the knowledge table in line with the deployed website data. Runs once
 * per server instance, so every deploy refreshes it. Changed items get a new
 * updated date; items the website no longer publishes are disabled.
 */
export function syncSiteKnowledge(): Promise<void> {
  synced ??= (async () => {
    await ensureSchema();
    const site = buildSiteKnowledge();
    const now = new Date().toISOString();
    if (sql) {
      const existing = new Map<string, string>(
        (await sql`SELECT id, hash, status FROM chat_kb WHERE origin = 'site'`).map((r: any) => [r.id, `${r.hash}|${r.status}`]),
      );
      for (const d of site) {
        const h = hashText(`${d.title}\n${d.body}\n${d.sourcePage}`);
        const prev = existing.get(d.id);
        if (prev?.startsWith(`${h}|`)) {
          existing.delete(d.id);
          continue;
        }
        await sql`INSERT INTO chat_kb (id, title, body, category, source_page, service, origin, status, hash, updated_at)
          VALUES (${d.id}, ${d.title}, ${d.body}, ${d.category}, ${d.sourcePage}, ${d.service ?? null}, 'site', 'active', ${h}, now())
          ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, category = EXCLUDED.category,
            source_page = EXCLUDED.source_page, service = EXCLUDED.service, hash = EXCLUDED.hash, updated_at = now(),
            status = CASE WHEN chat_kb.status = 'disabled' AND chat_kb.flag_reason = 'Removed from website' THEN 'active' ELSE chat_kb.status END`;
        existing.delete(d.id);
      }
      for (const id of existing.keys()) {
        await sql`UPDATE chat_kb SET status = 'disabled', flag_reason = 'Removed from website', updated_at = now() WHERE id = ${id}`;
      }
    } else {
      for (const d of site) {
        const h = hashText(`${d.title}\n${d.body}\n${d.sourcePage}`);
        const prev = mem.kb.get(d.id);
        if (prev?.hash === h) continue;
        mem.kb.set(d.id, { ...d, origin: 'site', status: prev?.status ?? 'active', hash: h, updatedAt: now });
      }
    }
    await reviewKnowledge();
  })().catch((e) => {
    synced = null;
    throw e;
  });
  return synced;
}

export async function listKnowledge(): Promise<KbItem[]> {
  await syncSiteKnowledge();
  if (sql) return (await sql`SELECT * FROM chat_kb ORDER BY origin, category, id`).map(rowToKb);
  return [...mem.kb.values()];
}

let kbCache: { at: number; items: KbItem[] } | null = null;
/** Active items for answering, cached for 30 seconds so admin edits show up almost at once. */
export async function activeKnowledge(): Promise<KbItem[]> {
  if (kbCache && Date.now() - kbCache.at < 30_000) return kbCache.items;
  const items = (await listKnowledge()).filter((i) => i.status === 'active');
  kbCache = { at: Date.now(), items };
  return items;
}

export async function getKnowledgeItem(id: string): Promise<KbItem | null> {
  await syncSiteKnowledge();
  if (sql) {
    const rows = await sql`SELECT * FROM chat_kb WHERE id = ${id}`;
    return rows[0] ? rowToKb(rows[0]) : null;
  }
  return mem.kb.get(id) ?? null;
}

export async function saveAdminItem(input: { id?: string; title: string; body: string; category: string; sourcePage: string; service?: string }) {
  await syncSiteKnowledge();
  const id = input.id || `admin-${randomBytes(4).toString('hex')}`;
  const h = hashText(`${input.title}\n${input.body}\n${input.sourcePage}`);
  if (sql) {
    await sql`INSERT INTO chat_kb (id, title, body, category, source_page, service, origin, status, hash, updated_at)
      VALUES (${id}, ${input.title}, ${input.body}, ${input.category}, ${input.sourcePage}, ${input.service || null}, 'admin', 'active', ${h}, now())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, category = EXCLUDED.category,
        source_page = EXCLUDED.source_page, service = EXCLUDED.service, hash = EXCLUDED.hash, status = 'active', flag_reason = NULL, updated_at = now()
      WHERE chat_kb.origin = 'admin'`;
  } else {
    mem.kb.set(id, { id, title: input.title, body: input.body, category: input.category as KbItem['category'], sourcePage: input.sourcePage, service: input.service, origin: 'admin', status: 'active', hash: h, updatedAt: new Date().toISOString() });
  }
  kbCache = null;
  await reviewKnowledge();
  return id;
}

export async function setKnowledgeStatus(id: string, status: KbItem['status'], reason: string | null = null) {
  if (sql) await sql`UPDATE chat_kb SET status = ${status}, flag_reason = ${reason} WHERE id = ${id}`;
  else {
    const it = mem.kb.get(id);
    if (it) Object.assign(it, { status, flagReason: reason });
  }
  kbCache = null;
}

/**
 * Flags admin-written items that quote prices the website does not publish,
 * that repeat a website topic with different figures, or that are missing a
 * body or source page. Flagged items are not used for answers until an admin
 * approves them.
 */
export async function reviewKnowledge() {
  const all = sql ? (await sql`SELECT * FROM chat_kb`).map(rowToKb) : [...mem.kb.values()];
  const site = all.filter((i) => i.origin === 'site' && i.status !== 'disabled');
  const published = publishedAmounts(site);
  for (const it of all.filter((i) => i.origin === 'admin' && i.status === 'active' && i.flagReason !== 'Approved by admin')) {
    const problems: string[] = [];
    if (it.body.trim().length < 20) problems.push('Body is empty or too short');
    if (!it.sourcePage.trim()) problems.push('No source page');
    const unknown = dollarAmounts(it.body).filter((n) => !published.has(n));
    if (unknown.length) problems.push(`Quotes amounts the website does not publish: ${[...new Set(unknown)].map((n) => `$${n.toLocaleString('en-US')}`).join(', ')}`);
    const twin = site.find((s) => s.title.toLowerCase() === it.title.toLowerCase());
    if (twin) problems.push(`Same topic as website item "${twin.id}"; check the two agree`);
    if (problems.length) {
      const reason = problems.join('. ');
      await setKnowledgeStatus(it.id, 'flagged', reason);
      await addFlag(problems.some((p) => p.startsWith('Body') || p.startsWith('No source')) ? 'incomplete' : 'conflict', it.id, reason);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Flags                                                              */
/* ------------------------------------------------------------------ */

export async function addFlag(kind: Flag['kind'], ref: string, detail: string) {
  await ensureSchema();
  if (sql) {
    const dup = await sql`SELECT 1 FROM chat_flags WHERE kind = ${kind} AND ref = ${ref} AND detail = ${detail} AND NOT resolved LIMIT 1`;
    if (!dup.length) await sql`INSERT INTO chat_flags (kind, ref, detail) VALUES (${kind}, ${ref}, ${detail})`;
  } else if (!mem.flags.some((f) => f.kind === kind && f.ref === ref && f.detail === detail && !f.resolved)) {
    mem.flags.push({ id: mem.flags.length + 1, kind, ref, detail, createdAt: new Date().toISOString(), resolved: false });
  }
}

export async function listFlags(includeResolved = false): Promise<Flag[]> {
  await ensureSchema();
  if (sql) {
    const rows = includeResolved
      ? await sql`SELECT * FROM chat_flags ORDER BY created_at DESC LIMIT 300`
      : await sql`SELECT * FROM chat_flags WHERE NOT resolved ORDER BY created_at DESC LIMIT 300`;
    return rows.map((r: any) => ({ id: Number(r.id), kind: r.kind, ref: r.ref, detail: r.detail, createdAt: new Date(r.created_at).toISOString(), resolved: r.resolved }));
  }
  return mem.flags.filter((f) => includeResolved || !f.resolved).slice().reverse();
}

export async function resolveFlag(id: number) {
  if (sql) await sql`UPDATE chat_flags SET resolved = true WHERE id = ${id}`;
  else {
    const f = mem.flags.find((x) => x.id === id);
    if (f) f.resolved = true;
  }
}
