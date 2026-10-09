/**
 * Time-zone helpers for the consultation request flow.
 *
 * Everything is computed with Intl so daylight saving is handled by the
 * browser's tz database. No fixed UTC offsets anywhere.
 */

export const CENTRAL_TZ = 'America/Chicago';

/** Consultation hours, Monday to Friday, in Central Time (24h, window start hours). */
export const CT_WINDOW_START_HOURS = [9, 10, 11, 12, 13, 14, 15, 16];
export const CT_WINDOW_LENGTH_HOURS = 1;

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday ... 6 = Saturday */
  weekday: number;
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  let f = partsFormatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
    });
    partsFormatters.set(timeZone, f);
  }
  return f;
}

/** Wall-clock parts of an instant in a given IANA zone. */
export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const out: Record<string, string> = {};
  for (const p of partsFormatter(timeZone).formatToParts(date)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour) % 24,
    minute: Number(out.minute),
    second: Number(out.second),
    weekday: WEEKDAYS[out.weekday] ?? 0,
  };
}

/** Offset of `timeZone` from UTC at `date`, in minutes (e.g. -300 for CDT). */
export function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/** Converts a wall-clock time in `timeZone` to the matching instant. */
export function zonedTimeToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  let ts = guess - zoneOffsetMinutes(new Date(guess), timeZone) * 60000;
  // Second pass corrects guesses that landed on the other side of a DST change.
  ts = guess - zoneOffsetMinutes(new Date(ts), timeZone) * 60000;
  return new Date(ts);
}

/** YYYY-MM-DD of an instant in a zone. */
export function zonedDateKey(date: Date, timeZone: string): string {
  const p = zonedParts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

export function formatTime(date: Date, timeZone: string, withZone = false): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    ...(withZone ? { timeZoneName: 'short' as const } : {}),
  }).format(date);
}

export function formatDay(date: Date, timeZone: string, style: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: style,
    month: style,
    day: 'numeric',
    ...(style === 'long' ? { year: 'numeric' as const } : {}),
  }).format(date);
}

/** "Monday, March 15, 2027, 9:00 AM – 10:00 AM CDT" */
export function formatWindow(start: Date, end: Date, timeZone: string): string {
  return `${formatDay(start, timeZone)}, ${formatTime(start, timeZone)} – ${formatTime(end, timeZone, true)}`;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export interface ConsultWindow {
  /** UTC ISO string of the window start, used as a stable id. */
  id: string;
  start: Date;
  end: Date;
}

export interface ConsultDay {
  /** Visitor-local calendar date, YYYY-MM-DD. */
  key: string;
  /** A representative instant on that local date, for labels. */
  sample: Date;
  windows: ConsultWindow[];
}

/**
 * Builds the request options: Central Time business-day windows (Mon–Fri,
 * 9:00–17:00 America/Chicago) that also fall on a weekday in the visitor's
 * zone, grouped by the visitor's local calendar date,
 * starting from the visitor's tomorrow and limited to `maxDays` dates.
 */
export function buildConsultDays(visitorTz: string, now: Date = new Date(), maxDays = 15): ConsultDay[] {
  const todayLocal = zonedDateKey(now, visitorTz);
  const ct = zonedParts(now, CENTRAL_TZ);
  const days = new Map<string, ConsultDay>();

  // Walk Central Time calendar days. Using noon UTC of the CT date as a cursor
  // keeps the arithmetic free of DST edge cases.
  for (let i = 0; i < 60 && days.size <= maxDays; i++) {
    const cursor = new Date(Date.UTC(ct.year, ct.month - 1, ct.day + i, 12));
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth() + 1;
    const d = cursor.getUTCDate();
    const weekday = cursor.getUTCDay();
    if (weekday === 0 || weekday === 6) continue; // Central Time business days only

    for (const h of CT_WINDOW_START_HOURS) {
      const start = zonedTimeToDate(y, m, d, h, 0, CENTRAL_TZ);
      const end = zonedTimeToDate(y, m, d, h + CT_WINDOW_LENGTH_HOURS, 0, CENTRAL_TZ);
      const key = zonedDateKey(start, visitorTz);
      if (key <= todayLocal) continue; // from tomorrow, visitor's calendar
      const localWeekday = zonedParts(start, visitorTz).weekday;
      if (localWeekday === 0 || localWeekday === 6) continue; // weekday for the visitor too
      let day = days.get(key);
      if (!day) {
        day = { key, sample: start, windows: [] };
        days.set(key, day);
      }
      day.windows.push({ id: start.toISOString(), start, end });
    }
  }

  return [...days.values()].sort((a, b) => (a.key < b.key ? -1 : 1)).slice(0, maxDays);
}
