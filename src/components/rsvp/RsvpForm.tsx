import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { AlertCircleIcon, CheckIcon, HeartIcon, Loader2Icon, SendIcon, XIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { fmt } from '../../utils/format';
import { isRsvpErrorKey, type RsvpFormValues } from '../../utils/rsvpSchema';
import type { RsvpErrorCode } from '../../types/rsvp';
import { GuestCounter } from './GuestCounter';

interface RsvpFormProps {
  form: UseFormReturn<RsvpFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  submitError: RsvpErrorCode | null;
  maxGuests: number;
  isEditing: boolean;
}

const EASE = [0.23, 1, 0.32, 1] as const;
const labelCls = 'block text-[15px] font-medium text-brown';

export function RsvpForm({ form, onSubmit, submitError, maxGuests, isEditing }: RsvpFormProps) {
  const { m } = useI18n();
  const {
    register,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = form;
  const attending = watch('attending');

  const errorText = (message: string | undefined) =>
  isRsvpErrorKey(message) ? fmt(m.rsvp.errors[message], { max: maxGuests }) : message ? m.rsvp.submitErrors.validation : null;

  const nameError = errorText(errors.fullName?.message);
  const attendingError = errorText(errors.attending?.message);
  const guestsError = errorText(errors.guests?.message);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7" aria-busy={isSubmitting}>
      {isEditing && <p className="rounded-xl bg-white/60 px-4 py-2.5 text-center text-sm text-brown-soft">{m.rsvp.editingNotice}</p>}

      {/* Full name */}
      <div>
        <label htmlFor="rsvp-name" className={labelCls}>
          {m.rsvp.fullName} <span className="text-rose" aria-hidden="true">*</span>
        </label>
        <input
          id="rsvp-name"
          type="text"
          autoComplete="name"
          maxLength={80}
          placeholder={m.rsvp.namePlaceholder}
          aria-required="true"
          aria-invalid={nameError ? 'true' : 'false'}
          aria-describedby={nameError ? 'rsvp-name-error' : undefined}
          className={`mt-2 block min-h-[52px] w-full rounded-2xl border bg-white/80 px-4 text-[16px] text-brown placeholder:text-brown-soft/60 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-gold/40 ${
          nameError ? 'border-rose' : 'border-gold-soft focus:border-gold'}`
          }
          {...register('fullName')} />
        
        {nameError &&
        <p id="rsvp-name-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-[#9A4F4A]">
            <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {nameError}
          </p>
        }
      </div>

      {/* Attendance */}
      <fieldset aria-describedby={attendingError ? 'rsvp-attending-error' : undefined}>
        <legend className={labelCls}>
          {m.rsvp.attending} <span className="text-rose" aria-hidden="true">*</span>
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(['accept', 'decline'] as const).map((value) => {
            const Icon = value === 'accept' ? CheckIcon : XIcon;
            return (
              <label key={value} className="relative cursor-pointer">
                <input type="radio" value={value} className="peer sr-only" {...register('attending')} />
                <span className="flex min-h-[54px] items-center gap-3 whitespace-nowrap rounded-2xl border border-gold-soft bg-white/80 px-4 text-[15px] text-brown transition-[background-color,border-color,color] duration-150 ease-out-soft hover:border-gold peer-checked:border-brown peer-checked:bg-brown peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-champagne">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current">
                    <Icon className={`h-3.5 w-3.5 ${attending === value ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                  </span>
                  {value === 'accept' ? m.rsvp.accept : m.rsvp.decline}
                </span>
              </label>);

          })}
        </div>
        {attendingError &&
        <p id="rsvp-attending-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-[#9A4F4A]">
            <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {attendingError}
          </p>
        }
      </fieldset>

      {/* Guests — hidden for declines (recorded as 0) */}
      <AnimatePresence initial={false} mode="wait">
        {attending === 'accept' &&
        <motion.div
          key="guests"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="overflow-hidden">
          
            <div role="group" aria-labelledby="rsvp-guests-label">
              <p id="rsvp-guests-label" className={labelCls}>
                {m.rsvp.guests}
              </p>
              <p id="rsvp-guests-help" className="mt-0.5 text-sm text-brown-soft">
                {fmt(m.rsvp.guestsHelp, { max: maxGuests })}
              </p>
              <div className="mt-2">
                <Controller
                control={control}
                name="guests"
                render={({ field }) =>
                <GuestCounter
                  id="rsvp-guests"
                  value={field.value}
                  min={1}
                  max={maxGuests}
                  onChange={(v) => field.onChange(Math.min(maxGuests, Math.max(1, v)))}
                  decreaseLabel={m.rsvp.decrease}
                  increaseLabel={m.rsvp.increase}
                  describedBy="rsvp-guests-help" />

                } />
              
              </div>
              {guestsError &&
            <p role="alert" className="mt-2 text-sm text-[#9A4F4A]">
                  {guestsError}
                </p>
            }
            </div>
          </motion.div>
        }
        {attending === 'decline' &&
        <motion.p
          key="decline"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="flex items-start gap-2 overflow-hidden text-sm text-brown-soft">
          
            <HeartIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
            {m.rsvp.declineNote}
          </motion.p>
        }
      </AnimatePresence>

      {/* Honeypot (bots only) */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="rsvp-website">{m.rsvp.honeypot}</label>
        <input id="rsvp-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submitError &&
      <div role="alert" className="flex items-start gap-2 rounded-2xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-[#7E3F3B]">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {m.rsvp.submitErrors[submitError]}
        </div>
      }

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-brown px-6 text-[15px] font-medium text-ivory shadow-[0_12px_30px_-14px_rgba(86,51,35,0.7)] transition-[transform,background-color,opacity] duration-150 ease-out-soft hover:bg-[#4a2b1e] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-champagne">
        
        {isSubmitting ?
        <>
            <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
            {m.rsvp.sending}
          </> :

        <>
            {isEditing ? m.rsvp.update : m.rsvp.send}
            <SendIcon className="h-4 w-4" aria-hidden="true" />
          </>
        }
      </button>
    </form>);

}