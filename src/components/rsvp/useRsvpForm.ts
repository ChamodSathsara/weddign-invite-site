import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wedding } from '../../data/wedding';
import { createRsvpSchema, type RsvpFormValues } from '../../utils/rsvpSchema';
import { loadRsvp, newIdempotencyKey, submitRsvp } from '../../utils/rsvpService';
import type { RsvpErrorCode, RsvpPayload, SavedRsvp } from '../../types/rsvp';

export type RsvpPhase = 'loading' | 'form' | 'success';

export function useRsvpForm(token: string | null, guestName: string | null) {
  const maxGuests = wedding.rsvp.maxGuests;
  const schema = useMemo(() => createRsvpSchema(maxGuests), [maxGuests]);
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: guestName ?? '', guests: 1, website: '' },
    mode: 'onTouched'
  });

  const [phase, setPhase] = useState<RsvpPhase>('loading');
  const [saved, setSaved] = useState<SavedRsvp | null>(null);
  const [submitError, setSubmitError] = useState<RsvpErrorCode | null>(null);
  const idempotencyKey = useRef(newIdempotencyKey());

  // Load an existing response (secure token in live mode; this device in preview mode)
  useEffect(() => {
    let cancelled = false;
    loadRsvp(token).
    then((existing) => {
      if (cancelled) return;
      if (existing) {
        setSaved(existing);
        form.reset({
          fullName: existing.fullName,
          attending: existing.attending,
          guests: Math.max(1, existing.guests),
          website: ''
        });
        setPhase('success');
      } else {
        setPhase('form');
      }
    }).
    catch(() => !cancelled && setPhase('form'));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    const payload: RsvpPayload = {
      fullName: values.fullName.trim().replace(/\s+/g, ' '),
      attending: values.attending,
      // Declines are stored with 0 guests
      guests: values.attending === 'accept' ? values.guests : 0
    };
    const result = await submitRsvp(payload, {
      token,
      idempotencyKey: idempotencyKey.current,
      honeypot: values.website,
      previous: saved
    });
    if (result.ok) {
      setSaved(result.data);
      setPhase('success');
      idempotencyKey.current = newIdempotencyKey();
    } else {
      setSubmitError(result.code);
    }
  });

  const edit = () => {
    setSubmitError(null);
    setPhase('form');
  };

  return { form, phase, saved, submitError, onSubmit, edit, maxGuests };
}