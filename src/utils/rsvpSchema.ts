import { z } from 'zod';
import type { Messages } from '../types/i18n';

export const NAME_PATTERN = /^[\p{L}\p{M}\s.'’\-\u200C\u200D]+$/u;

/** Error messages are translation KEYS so they re-render in the active language. */
export function createRsvpSchema(maxGuests: number) {
  return z.
  object({
    fullName: z.
    string().
    trim().
    min(1, 'nameRequired').
    min(2, 'nameShort').
    max(80, 'nameLong').
    regex(NAME_PATTERN, 'nameInvalid'),
    attending: z.enum(['accept', 'decline'], {
      errorMap: () => ({ message: 'attendingRequired' })
    }),
    guests: z.number({ invalid_type_error: 'guestsRange' }).int('guestsRange'),
    website: z.string().optional()
  }).
  superRefine((value, ctx) => {
    if (value.attending === 'accept' && (value.guests < 1 || value.guests > maxGuests)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['guests'], message: 'guestsRange' });
    }
  });
}

export type RsvpFormValues = z.infer<ReturnType<typeof createRsvpSchema>>;
export type RsvpErrorKey = keyof Messages['rsvp']['errors'];

export function isRsvpErrorKey(value: string | undefined): value is RsvpErrorKey {
  return (
    value === 'nameRequired' ||
    value === 'nameShort' ||
    value === 'nameLong' ||
    value === 'nameInvalid' ||
    value === 'attendingRequired' ||
    value === 'guestsRange');

}