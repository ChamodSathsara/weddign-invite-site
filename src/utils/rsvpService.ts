import { wedding } from '../data/wedding';
import { createRsvpSchema } from './rsvpSchema';
import { isRsvpPastDeadline } from './countdown';
import type { RsvpPayload, RsvpResult, SavedRsvp } from '../types/rsvp';

const PREVIEW_KEY = 'sc-wedding:rsvp-preview';
const COOLDOWN_MS = 8000;
let lastSuccessAt = 0;

export const rsvpMode: 'live' | 'preview' = wedding.rsvp.endpoint ? 'live' : 'preview';

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
  if (rsvpMode === 'preview') return readPreview();
  if (!token || !wedding.rsvp.endpoint) return null;
  const res = await fetch(`${wedding.rsvp.endpoint}?token=${encodeURIComponent(token)}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin'
  });
  if (!res.ok) return null;
  const data: unknown = await res.json();
  return isSavedRsvp(data) ? data : null;
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

  if (rsvpMode === 'preview' || !wedding.rsvp.endpoint) {
    await new Promise((r) => window.setTimeout(r, 650));
    const saved: SavedRsvp = { ...payload, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(saved));
    } catch {
      return { ok: false, code: 'generic' };
    }
    lastSuccessAt = Date.now();
    return { ok: true, data: saved };
  }

  try {
    const res = await fetch(wedding.rsvp.endpoint, {
      method: opts.token ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Idempotency-Key': opts.idempotencyKey
      },
      credentials: 'same-origin',
      body: JSON.stringify({ ...payload, token: opts.token ?? undefined })
    });
    if (res.status === 429) return { ok: false, code: 'rate' };
    if (res.status === 403 || res.status === 410) return { ok: false, code: 'closed' };
    if (res.status === 401 || res.status === 404) return { ok: false, code: 'invalidToken' };
    if (res.status === 400 || res.status === 422) return { ok: false, code: 'validation' };
    if (!res.ok) return { ok: false, code: 'generic' };
    const data: unknown = await res.json();
    lastSuccessAt = Date.now();
    return { ok: true, data: isSavedRsvp(data) ? data : { ...payload, updatedAt: new Date().toISOString() } };
  } catch {
    return { ok: false, code: 'network' };
  }
}