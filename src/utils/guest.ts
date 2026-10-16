const MAX_NAME_LENGTH = 60;

/** Characters allowed in a guest display name: letters (any script), combining marks, digits, a little punctuation, Sinhala ZWJ/ZWNJ. */
const ALLOWED_CHAR = /[\p{L}\p{M}\p{N}\s.'’&,\-\u200C\u200D]/u;

/**
 * Display-only. A name from the URL is NEVER authorization — it is purely a greeting.
 * URLSearchParams has already decoded the value once; we never double-decode.
 */
export function sanitizeGuestName(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = Array.from(raw.normalize('NFC')).
  filter((ch) => ALLOWED_CHAR.test(ch)).
  join('').
  replace(/\s+/g, ' ').
  trim();
  if (!cleaned) return null;
  const chars = Array.from(cleaned);
  return chars.length > MAX_NAME_LENGTH ? chars.slice(0, MAX_NAME_LENGTH).join('').trim() : cleaned;
}

/**
 * Format check only — an opaque random token (e.g. 32 bytes base64url).
 * The server is the only authority on whether a token is valid.
 */
export function readGuestToken(raw: string | null): string | null {
  if (!raw) return null;
  return /^[A-Za-z0-9_-]{20,128}$/.test(raw) ? raw : null;
}