import { wedding } from '../data/wedding';
import { createRsvpSchema } from './rsvpSchema';
import { isRsvpPastDeadline } from './countdown';
import type { RsvpPayload, RsvpResult, SavedRsvp } from '../types/rsvp';

const PREVIEW_KEY = 'sc-wedding:rsvp-google-form';
const GOOGLE_FORM_RESPONSE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSci4fS2eKxGnNbi668M52-uU-4-TrLHOj_Kk4Fc4TqIcO-G1g/formResponse';
const GOOGLE_FORM_FIELDS = {
  fullName: 'entry.794365108',
  attending: 'entry.8693657',
  guests: 'entry.1001770418'
} as const;
const ATTENDANCE_VALUES = {
  accept: 'Joyfully Accept / සතුටින් සහභාගී වෙමි',
  decline: 'Regretfully Decline / සහභාගී විය නොහැක'
} as const;
const COOLDOWN_MS = 8000;
let lastSuccessAt = 0;

export const rsvpMode = 'live' as const;

export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function samePayload(a: RsvpPayload, b: RsvpPayload) {
  return a.fullName === b.fullName && a.attending === b.attending && a.guests === b.guests;
}

function isSavedRsvp(value: unknown): value is SavedRsvp {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.fullName === 'string' && (
    v.attending === 'accept' || v.attending === 'decline') &&
    typeof v.guests === 'number' &&
    typeof v.updatedAt === 'string');

}

function readPreview(): SavedRsvp | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(PREVIEW_KEY) ?? 'null');
    return isSavedRsvp(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Load an existing response. Live mode requires an opaque guest token, validated by the server. */
export async function loadRsvp(token: string | null): Promise<SavedRsvp | null> {
  void token;
  return readPreview();
}

interface SubmitOptions {
  token: string | null;
  idempotencyKey: string;
  honeypot?: string;
  previous: SavedRsvp | null;
}

export async function submitRsvp(payload: RsvpPayload, opts: SubmitOptions): Promise<RsvpResult> {
  // Same validation the server must run
  const check = createRsvpSchema(wedding.rsvp.maxGuests).safeParse({ ...payload, guests: payload.attending === 'accept' ? payload.guests : 1 });
  if (!check.success) return { ok: false, code: 'validation' };
  if (payload.attending === 'decline' && payload.guests !== 0) return { ok: false, code: 'validation' };

  if (wedding.rsvp.deadlineMode === 'close' && isRsvpPastDeadline()) return { ok: false, code: 'closed' };

  // Duplicate protection: identical to what's already saved → no new submission
  if (opts.previous && samePayload(opts.previous, payload)) return { ok: true, data: opts.previous };

  if (Date.now() - lastSuccessAt < COOLDOWN_MS) return { ok: false, code: 'rate' };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { ok: false, code: 'network' };

  // Bots fill hidden fields — drop silently without storing anything
  if (opts.honeypot) return { ok: true, data: { ...payload, updatedAt: new Date().toISOString() } };

  try {
    const formData = new URLSearchParams({
      [GOOGLE_FORM_FIELDS.fullName]: payload.fullName,
      [GOOGLE_FORM_FIELDS.attending]: ATTENDANCE_VALUES[payload.attending],
      [GOOGLE_FORM_FIELDS.guests]: String(payload.attending === 'accept' ? payload.guests : 1)
    });
    await fetch(GOOGLE_FORM_RESPONSE_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formData.toString()
    });

    const data: SavedRsvp = { ...payload, updatedAt: new Date().toISOString() };
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(data));
    lastSuccessAt = Date.now();
    return { ok: true, data };
  } catch {
    return { ok: false, code: 'network' };
  }
}
