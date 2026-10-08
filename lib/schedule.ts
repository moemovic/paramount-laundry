// Shared scheduling rules — used by both the booking form and the API,
// so the server enforces exactly what the customer sees.

export const TIMEZONE = "Africa/Lagos";

/** Opening hours per weekday (0 = Sunday). null = closed. */
export const OPENING: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 8, close: 19 },
  2: { open: 8, close: 19 },
  3: { open: 8, close: 19 },
  4: { open: 10, close: 19 },
  5: { open: 8, close: 19 },
  6: { open: 8, close: 19 },
};

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** How far ahead customers may book. */
export const MAX_DAYS_AHEAD = 120;

/** Pickup windows are one hour long: 10–11 AM up to the 5–6 PM slot. */
export const SLOT_START_HOURS = [10, 11, 12, 13, 14, 15, 16, 17];

export function formatHour(h: number): string {
  if (h === 12) return "12 PM";
  if (h === 0 || h === 24) return "12 AM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

export function slotLabel(start: number): string {
  const end = start + 1;
  const sameMeridiem = (start < 12 && end < 12) || start >= 12;
  const left = sameMeridiem && end !== 12 ? String(start > 12 ? start - 12 : start) : formatHour(start);
  return `${left} – ${formatHour(end)}`;
}

/** "YYYY-MM-DD" for a calendar day. */
export function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function parseKey(key: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  const dt = new Date(Date.UTC(y, m, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m || dt.getUTCDate() !== d) return null;
  return { y, m, d };
}

/** Weekday (0–6) of a date key, independent of the viewer's timezone. */
export function weekdayOf(key: string): number {
  const p = parseKey(key)!;
  return new Date(Date.UTC(p.y, p.m, p.d)).getUTCDay();
}

/** Current date key and hour in Lagos. */
export function lagosNow(now: Date = new Date()): { key: string; hour: number; y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const y = get("year");
  const m = get("month") - 1;
  const d = get("day");
  return { key: toKey(y, m, d), hour: get("hour"), y, m, d };
}

function daysBetween(a: string, b: string): number {
  const pa = parseKey(a)!;
  const pb = parseKey(b)!;
  return Math.round((Date.UTC(pb.y, pb.m, pb.d) - Date.UTC(pa.y, pa.m, pa.d)) / 86400000);
}

export type DayStatus = "ok" | "past" | "closed" | "too-far";

export function dayStatus(key: string, now = lagosNow()): DayStatus {
  const diff = daysBetween(now.key, key);
  if (diff < 0) return "past";
  if (diff > MAX_DAYS_AHEAD) return "too-far";
  if (!OPENING[weekdayOf(key)]) return "closed";
  return "ok";
}

export type SlotStatus = "ok" | "closed" | "passed";

/** Whether a slot is within opening hours and still in the future (booked-ness is checked separately). */
export function slotStatus(key: string, start: number, now = lagosNow()): SlotStatus {
  const hours = OPENING[weekdayOf(key)];
  if (!SLOT_START_HOURS.includes(start)) return "closed";
  if (!hours || start < hours.open || start + 1 > hours.close) return "closed";
  if (key === now.key && start <= now.hour) return "passed";
  return "ok";
}

export function prettyDate(key: string): string {
  const p = parseKey(key)!;
  return `${WEEKDAYS[weekdayOf(key)]}, ${p.d} ${MONTHS[p.m]} ${p.y}`;
}
