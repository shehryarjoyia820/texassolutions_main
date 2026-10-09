'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarCheck, Clock, ExternalLink, Globe } from 'lucide-react';
import { SITE } from '@/data/site';
import { FormShell, Field, ConsentCheckbox, Honeypot, TextArea } from './forms';
import { HONEYPOT_FIELD, MARKETING_CONSENT_WORDING } from '@/lib/forms';
import { cn } from '@/lib/utils';
import { NoteBox } from './ui';
import {
  CENTRAL_TZ,
  buildConsultDays,
  formatDay,
  formatTime,
  formatWindow,
  isValidTimeZone,
} from './forms/central-time';

/**
 * "Request a consultation time".
 *
 * There is no calendar backend behind this static site, so nothing here
 * reserves a slot. The visitor sends a preferred window and the team confirms
 * by email. Set SCHEDULING_URL to a Calendly / Google Calendar appointment page
 * to offer instant booking against real availability as the primary option.
 */
export const SCHEDULING_URL = '';

const TIMEZONES = [
  { id: 'America/Chicago', label: 'Central Time (Midland, Dallas, Chicago)' },
  { id: 'America/New_York', label: 'Eastern Time (New York, Toronto)' },
  { id: 'America/Denver', label: 'Mountain Time (Denver)' },
  { id: 'America/Phoenix', label: 'Arizona (Phoenix)' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { id: 'America/Anchorage', label: 'Alaska' },
  { id: 'Pacific/Honolulu', label: 'Hawaii' },
  { id: 'America/Mexico_City', label: 'Mexico City' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Berlin', label: 'Central Europe (Berlin, Paris)' },
  { id: 'Asia/Dubai', label: 'Dubai' },
  { id: 'Asia/Riyadh', label: 'Riyadh' },
  { id: 'Asia/Karachi', label: 'Pakistan (Lahore, Karachi)' },
  { id: 'Asia/Kolkata', label: 'India' },
  { id: 'Asia/Singapore', label: 'Singapore' },
  { id: 'Australia/Sydney', label: 'Sydney' },
  { id: 'UTC', label: 'UTC' },
];

const DURATIONS = [
  { id: '20', label: '20 minutes', note: 'Quick fit check' },
  { id: '45', label: '45 minutes', note: 'Scope and pricing' },
];

const SESSION_KEY = 'ts-consultation-requests';
const sentThisSession = new Set<string>(); // fallback when sessionStorage is unavailable

function alreadyRequested(sig: string): boolean {
  if (sentThisSession.has(sig)) return true;
  try {
    const list = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]') as string[];
    return list.includes(sig);
  } catch {
    return false;
  }
}

function rememberRequest(sig: string) {
  sentThisSession.add(sig);
  try {
    const list = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]') as string[];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...list, sig].slice(-20)));
  } catch {
    /* storage blocked; the in-memory set still covers this page view */
  }
}

const optionBtn =
  'rounded-xl border text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent/40';

export function BookingWidget() {
  const [tz, setTz] = useState(CENTRAL_TZ);
  const [detectedTz, setDetectedTz] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [windowId, setWindowId] = useState<string | null>(null);
  const [duration, setDuration] = useState('20');
  const [contact, setContact] = useState({ name: '', email: '', phone: '', notes: '' });
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [honey, setHoney] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Client-only: the visitor's zone and "today" are unknown at build time.
  useEffect(() => {
    let zone = CENTRAL_TZ;
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (resolved && isValidTimeZone(resolved)) zone = resolved;
    } catch {
      /* keep Central Time */
    }
    setDetectedTz(zone);
    setTz(zone);
    setNow(new Date());
  }, []);

  const zoneOptions = useMemo(() => {
    if (detectedTz && !TIMEZONES.some((z) => z.id === detectedTz)) {
      return [{ id: detectedTz, label: `${detectedTz.replace(/_/g, ' ')} (detected)` }, ...TIMEZONES];
    }
    return TIMEZONES.map((z) => (z.id === detectedTz ? { ...z, label: `${z.label} (detected)` } : z));
  }, [detectedTz]);

  const days = useMemo(() => (now ? buildConsultDays(tz, now, 15) : []), [tz, now]);
  const selectedDay = days.find((d) => d.key === dayKey) ?? null;
  const selectedWindow = selectedDay?.windows.find((w) => w.id === windowId) ?? null;
  const zoneLabel = zoneOptions.find((z) => z.id === tz)?.label ?? tz;
  const isCentral = tz === CENTRAL_TZ;

  // A new zone regroups windows by local date, so drop a stale selection.
  const changeZone = (next: string) => {
    setTz(next);
    setDayKey(null);
    setWindowId(null);
  };

  const signature = selectedWindow ? `${contact.email.trim().toLowerCase()}|${selectedWindow.id}` : '';

  return (
    <div className="rounded-2xl border border-line bg-bg-elev p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold">Request a consultation time</h3>
      <p className="mt-1 text-sm text-fg-muted">
        No obligation, no slide deck. Pick a time that suits you and we confirm it by email. We tell you honestly
        whether we are a fit.
      </p>

      {SCHEDULING_URL && (
        <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <a
            href={SCHEDULING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-ink hover:brightness-110"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Book instantly
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="mt-2 text-xs text-fg-subtle">
            See live availability and get a calendar invite straight away. Or request a time below.
          </p>
        </div>
      )}

      {/* time zone */}
      <div className="mt-7">
        <label htmlFor="bk-tz" className="flex items-center gap-2 text-sm font-medium">
          <Globe className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          Your time zone
        </label>
        <select
          id="bk-tz"
          value={tz}
          onChange={(e) => changeZone(e.target.value)}
          disabled={submitted}
          className="mt-2 h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {zoneOptions.map((z) => (
            <option key={z.id} value={z.id}>
              {z.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-fg-subtle">
          Times are shown in your zone with US Central Time (Midland, Texas) alongside. Consultations run Monday to Friday,
          9:00 am to 5:00 pm Central Time.
        </p>
      </div>

      {/* duration */}
      <fieldset className="mt-7 min-w-0">
        <legend className="text-sm font-medium">How long do you need?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DURATIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDuration(d.id)}
              aria-pressed={duration === d.id}
              disabled={submitted}
              className={cn(
                optionBtn,
                'flex min-h-[44px] items-center gap-2.5 p-4',
                duration === d.id ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
              )}
            >
              <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block font-medium">{d.label}</span>
                <span className="block text-xs text-fg-subtle">{d.note}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* day */}
      <fieldset className="mt-7 min-w-0">
        <legend className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-accent" aria-hidden />
          Pick a date
        </legend>
        {days.length === 0 ? (
          <p className="mt-3 text-sm text-fg-subtle">Loading dates…</p>
        ) : (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-8">
            {days.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => {
                  setDayKey(d.key);
                  setWindowId(null);
                }}
                aria-pressed={d.key === dayKey}
                aria-label={formatDay(d.sample, tz)}
                disabled={submitted}
                className={cn(
                  optionBtn,
                  'min-h-[44px] px-2 py-3 text-center',
                  d.key === dayKey ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
                )}
              >
                <span className="block text-[0.6875rem] uppercase tracking-wider text-fg-subtle" aria-hidden>
                  {new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(d.sample)}
                </span>
                <span className="mt-0.5 block font-display text-lg font-semibold" aria-hidden>
                  {new Intl.DateTimeFormat('en-US', { timeZone: tz, day: 'numeric' }).format(d.sample)}
                </span>
                <span className="block text-[0.6875rem] text-fg-subtle" aria-hidden>
                  {new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short' }).format(d.sample)}
                </span>
              </button>
            ))}
          </div>
        )}
      </fieldset>

      {/* windows */}
      {selectedDay && (
        <fieldset className="mt-7 min-w-0">
          <legend className="text-sm font-medium">Pick a preferred time</legend>
          <p className="mt-1 text-xs text-fg-subtle">
            {formatDay(selectedDay.sample, tz)}, shown in {zoneLabel}
            {isCentral ? '.' : ', with Central Time alongside.'}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {selectedDay.windows.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWindowId(w.id)}
                aria-pressed={windowId === w.id}
                disabled={submitted}
                className={cn(
                  optionBtn,
                  'min-h-[44px] px-3 py-2.5',
                  windowId === w.id ? 'border-accent bg-accent/10 text-accent' : 'border-line hover:border-accent/40',
                )}
              >
                <span className="block font-medium">
                  {formatTime(w.start, tz)} – {formatTime(w.end, tz)}
                </span>
                {!isCentral && (
                  <span className="block text-[0.6875rem] text-fg-subtle">
                    {formatTime(w.start, CENTRAL_TZ)} – {formatTime(w.end, CENTRAL_TZ, true)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* request */}
      {selectedWindow && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-t border-line pt-7">
          {!submitted && (
            <div className="mb-5 rounded-xl border border-line bg-bg-soft p-4 text-sm" aria-live="polite">
              <p className="font-medium">Requested time ({duration} minutes)</p>
              <p className="mt-1 text-fg-muted">Your time: {formatWindow(selectedWindow.start, selectedWindow.end, tz)}</p>
              {!isCentral && (
                <p className="text-fg-muted">
                  Central Time: {formatWindow(selectedWindow.start, selectedWindow.end, CENTRAL_TZ)}
                </p>
              )}
              <p className="mt-2 text-xs text-fg-subtle">This is a request. It is not booked until we confirm by email.</p>
            </div>
          )}

          <FormShell
            formName="booking"
            captcha
            fields={{
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              notes: contact.notes,
              duration_minutes: duration,
              visitor_timezone: tz,
              requested_local_time: `${formatWindow(selectedWindow.start, selectedWindow.end, tz)} (${tz})`,
              requested_central_time: `${formatWindow(selectedWindow.start, selectedWindow.end, CENTRAL_TZ)} (${CENTRAL_TZ})`,
              requested_start_utc: selectedWindow.start.toISOString(),
              booking_status: 'Requested, not confirmed. Reply to the visitor to confirm a time.',
              enquiry_consent: consent ? 'yes' : 'no',
              marketing_consent: marketing ? 'yes' : 'no',
              [HONEYPOT_FIELD]: honey,
            }}
            submitLabel="Request this time"
            beforeSubmit={() =>
              alreadyRequested(signature)
                ? 'You have already requested this time in this session. We will confirm by email; no need to send it again.'
                : null
            }
            onSuccess={() => {
              rememberRequest(signature);
              setSubmitted(true);
            }}
            successTitle="Request received"
            successBody="We will confirm a time by email within one business day — your slot is not booked until you receive that confirmation."
          >
            <Honeypot value={honey} onChange={setHoney} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="bk-name"
                label="Name"
                required
                errorMessage="Please enter your name."
                value={contact.name}
                onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                autoComplete="name"
              />
              <Field
                id="bk-email"
                label="Email"
                type="email"
                required
                errorMessage="Please enter your email address so we can confirm the time."
                value={contact.email}
                onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                autoComplete="email"
                inputMode="email"
              />
              <Field
                id="bk-phone"
                label="Phone"
                type="tel"
                value={contact.phone}
                onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                autoComplete="tel"
                inputMode="tel"
                className="sm:col-span-2"
              />
            </div>
            <TextArea
              id="bk-notes"
              label="What would you like to discuss?"
              rows={3}
              value={contact.notes}
              onChange={(v) => setContact((c) => ({ ...c, notes: v }))}
            />
            <ConsentCheckbox id="bk-consent" checked={consent} onChange={setConsent} />
            <ConsentCheckbox
              id="bk-marketing"
              required={false}
              checked={marketing}
              onChange={setMarketing}
              wording={MARKETING_CONSENT_WORDING}
            />
          </FormShell>
        </motion.div>
      )}

      <NoteBox className="mt-7 text-xs">
        Consultation times are confirmed by a person, usually within one business day. The dispatch desk itself is
        staffed 24/7, so urgent carrier issues should go to the phone line ({SITE.phone}) rather than through this
        form.
      </NoteBox>
    </div>
  );
}
