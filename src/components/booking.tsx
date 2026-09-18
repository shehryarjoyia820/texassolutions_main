'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock, Globe } from 'lucide-react';
import { SITE } from '@/data/site';
import { FormShell, Field, ConsentCheckbox, Honeypot } from './forms';
import { HONEYPOT_FIELD } from '@/lib/forms';
import { cn } from '@/lib/utils';
import { NoteBox } from './ui';

/**
 * Native booking widget with a time-zone picker.
 *
 * To use Cal.com or Calendly instead, replace the slot grid below with their
 * embed and keep the same wrapper. This version exists so the page works with
 * no third-party script and no cookie consent dependency.
 */

const TIMEZONES = [
  { id: 'America/Chicago', label: 'Central Time, Houston', offset: -5 },
  { id: 'America/New_York', label: 'Eastern Time, Toronto', offset: -4 },
  { id: 'America/Los_Angeles', label: 'Pacific Time', offset: -7 },
  { id: 'Europe/London', label: 'UK, London', offset: 1 },
  { id: 'Europe/Berlin', label: 'Central Europe', offset: 2 },
  { id: 'Asia/Karachi', label: 'Pakistan, Lahore', offset: 5 },
  { id: 'Australia/Sydney', label: 'Australia, Sydney', offset: 10 },
];

/** Consultation slots offered, in Central Time, as 24h hours. */
const SLOT_HOURS_CT = [8, 9, 10, 11, 13, 14, 15, 16, 17];

const DURATIONS = [
  { id: '20', label: '20 minutes', note: 'Quick fit check' },
  { id: '45', label: '45 minutes', note: 'Scope and pricing' },
];

export function BookingWidget() {
  const [tz, setTz] = useState(TIMEZONES[0].id);
  const [dayOffset, setDayOffset] = useState(1);
  const [slot, setSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState('20');
  const [contact, setContact] = useState({ name: '', email: '', company: '' });
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');

  const zone = TIMEZONES.find((z) => z.id === tz)!;

  const days = useMemo(() => {
    const out: { offset: number; date: Date; weekend: boolean }[] = [];
    for (let i = 1; i <= 14 && out.length < 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      if (!weekend) out.push({ offset: i, date: d, weekend });
    }
    return out;
  }, []);

  const selectedDay = days.find((d) => d.offset === dayOffset) ?? days[0];

  // Central Time is UTC-5 in this simplified model; shift each slot into the chosen zone.
  const slots = useMemo(
    () =>
      SLOT_HOURS_CT.map((h) => {
        const shifted = (h + (zone.offset - -5) + 24) % 24;
        return {
          id: `${h}`,
          localLabel: formatHour(shifted),
          ctLabel: formatHour(h),
        };
      }),
    [zone],
  );

  return (
    <div className="rounded-2xl border border-line bg-bg-elev p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold">Book a consultation</h3>
          <p className="mt-1 text-sm text-fg-muted">
            No obligation, no slide deck. We tell you honestly whether we are a fit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <label htmlFor="tz" className="sr-only">
            Your time zone
          </label>
          <select
            id="tz"
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="h-10 rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-accent"
          >
            {TIMEZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* duration */}
      <div className="mt-7">
        <p className="text-sm font-medium">How long do you need?</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DURATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDuration(d.id)}
              aria-pressed={duration === d.id}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border p-4 text-left text-sm transition-colors',
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
      </div>

      {/* day */}
      <div className="mt-7">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-accent" aria-hidden />
          Pick a day
        </p>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d.offset}
              onClick={() => {
                setDayOffset(d.offset);
                setSlot(null);
              }}
              aria-pressed={d.offset === dayOffset}
              className={cn(
                'shrink-0 rounded-xl border px-4 py-3 text-center transition-colors',
                d.offset === dayOffset ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/40',
              )}
            >
              <span className="block text-[0.6875rem] uppercase tracking-wider text-fg-subtle">
                {d.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="mt-0.5 block font-display text-lg font-semibold">{d.date.getDate()}</span>
              <span className="block text-[0.6875rem] text-fg-subtle">
                {d.date.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* slots */}
      <div className="mt-7">
        <p className="text-sm font-medium">Pick a time</p>
        <p className="mt-1 text-xs text-fg-subtle">Shown in {zone.label}, with Houston time alongside.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((s) => (
            <button
              key={s.id}
              onClick={() => setSlot(s.id)}
              aria-pressed={slot === s.id}
              className={cn(
                'rounded-lg border px-3 py-2.5 text-sm transition-colors',
                slot === s.id ? 'border-accent bg-accent/10 text-accent' : 'border-line hover:border-accent/40',
              )}
            >
              <span className="block font-medium">{s.localLabel}</span>
              <span className="block text-[0.6875rem] text-fg-subtle">{s.ctLabel} CT</span>
            </button>
          ))}
        </div>
      </div>

      {/* confirm */}
      {slot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 border-t border-line pt-7"
        >
          <p className="mb-5 flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-success" aria-hidden />
            <span>
              {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at{' '}
              <strong>{slots.find((s) => s.id === slot)?.localLabel}</strong> in {zone.label}, {duration} minutes
            </span>
          </p>

          <FormShell
            formName="booking"
            fields={{
              ...contact,
              consent,
              [HONEYPOT_FIELD]: honey,
              timezone: tz,
              duration,
              date: selectedDay.date.toISOString().slice(0, 10),
              slotCentralTime: slots.find((s) => s.id === slot)?.ctLabel,
            }}
            submitLabel="Confirm booking"
            disabled={!consent}
            successTitle="Consultation booked"
            successBody={`We have your slot. A calendar invitation and a dial-in link arrive by email within the hour. If anything changes, call ${SITE.phone}.`}
          >
            <Honeypot value={honey} onChange={setHoney} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="bk-name" label="Name" required value={contact.name} onChange={(v) => setContact((c) => ({ ...c, name: v }))} />
              <Field id="bk-email" label="Email" type="email" required value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} />
              <Field id="bk-company" label="Company" value={contact.company} onChange={(v) => setContact((c) => ({ ...c, company: v }))} />
            </div>
            <ConsentCheckbox id="bk-consent" checked={consent} onChange={setConsent} />
          </FormShell>
        </motion.div>
      )}

      <NoteBox className="mt-7 text-xs">
        Slots reflect our standard consultation hours. The dispatch desk itself is staffed 24/7, so urgent
        carrier issues should go to the phone line rather than through this form.
      </NoteBox>
    </div>
  );
}

function formatHour(h: number) {
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:00 ${suffix}`;
}
