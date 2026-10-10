'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { endSession, passwordMatches, requireAdmin, startSession } from '@/lib/chat/admin-auth';
import { getKnowledgeItem, resolveFlag, saveAdminItem, setKnowledgeStatus } from '@/lib/chat/store';

const failures = new Map<string, number>();

export async function login(_prev: string, form: FormData): Promise<string> {
  const key = 'admin';
  const n = failures.get(key) ?? 0;
  if (n >= 10) return 'Too many attempts. Wait a few minutes and try again.';
  if (!passwordMatches(String(form.get('password') ?? ''))) {
    failures.set(key, n + 1);
    setTimeout(() => failures.set(key, Math.max(0, (failures.get(key) ?? 1) - 1)), 5 * 60_000);
    return 'Incorrect password.';
  }
  failures.delete(key);
  await startSession();
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin');
}

export async function saveItem(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id') || '') || undefined;
  if (id) {
    const existing = await getKnowledgeItem(id);
    if (existing && existing.origin !== 'admin') throw new Error('Website items are edited in the website data files.');
  }
  const saved = await saveAdminItem({
    id,
    title: String(form.get('title') || '').trim().slice(0, 200),
    body: String(form.get('body') || '').trim().slice(0, 20_000),
    category: String(form.get('category') || 'faq'),
    sourcePage: String(form.get('sourcePage') || '').trim().slice(0, 300),
    service: String(form.get('service') || '').trim() || undefined,
  });
  revalidatePath('/admin/knowledge');
  redirect(`/admin/knowledge/${encodeURIComponent(saved)}`);
}

export async function setStatus(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id'));
  const status = String(form.get('status')) as 'active' | 'disabled';
  await setKnowledgeStatus(id, status, status === 'disabled' ? 'Disabled by admin' : 'Approved by admin');
  revalidatePath('/admin/knowledge');
  redirect(`/admin/knowledge/${encodeURIComponent(id)}`);
}

export async function resolve(form: FormData) {
  await requireAdmin();
  await resolveFlag(Number(form.get('id')));
  revalidatePath('/admin/review');
}
