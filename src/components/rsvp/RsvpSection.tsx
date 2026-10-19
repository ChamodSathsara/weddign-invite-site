import React from 'react';
import { Loader2Icon, LockIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { wedding } from '../../data/wedding';
import { isRsvpPastDeadline } from '../../utils/countdown';
import { FloralSprig } from '../animation/FloralSprig';
import { GoldCorners } from '../animation/GoldCorners';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { Reveal } from '../animation/Reveal';
import { RsvpForm } from './RsvpForm';
import { RsvpSuccess } from './RsvpSuccess';
import { useRsvpForm } from './useRsvpForm';

interface RsvpSectionProps {
  token: string | null;
  guestName: string | null;
}

export function RsvpSection({ token, guestName }: RsvpSectionProps) {
  const { m } = useI18n();
  const { form, phase, saved, submitError, onSubmit, edit, maxGuests } = useRsvpForm(token, guestName);
  const pastDeadline = isRsvpPastDeadline();
  const closed = pastDeadline && wedding.rsvp.deadlineMode === 'close';

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative overflow-hidden bg-ivory px-4 py-20 md:px-10 md:py-32">
      <FloralSprig className="pointer-events-none absolute -left-10 top-16 hidden w-48 opacity-70 md:block" />
      <FloralSprig flip className="pointer-events-none absolute -right-10 bottom-16 hidden w-48 opacity-70 md:block" />

      <Reveal className="relative mx-auto max-w-[520px]">
        <div className="paper-texture relative rounded-[30px] border border-gold-soft bg-champagne px-5 pb-8 pt-10 shadow-[0_40px_90px_-50px_rgba(86,51,35,0.5)] sm:px-9 md:pb-10 md:pt-12">
          <div className="pointer-events-none absolute inset-2.5 rounded-[24px] border border-gold/30" aria-hidden="true" />
          <GoldCorners inset="14px" size="h-8 w-8 md:h-10 md:w-10" />

          <div className="relative text-center">
            <h2 id="rsvp-title" className="font-serif text-5xl font-medium text-brown outline-none md:text-6xl">{m.rsvp.title}</h2>
            <OrnamentDivider className="mt-3" />
            <p className="mt-3 font-serif text-lg italic text-brown-soft md:text-xl">{m.rsvp.deadline}</p>
          </div>

          <div className="relative mt-8">
            {phase === 'loading' && (
              <p role="status" className="flex items-center justify-center gap-2 py-10 text-brown-soft">
                <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
                {m.rsvp.loading}
              </p>
            )}
            {phase === 'success' && saved && <RsvpSuccess saved={saved} onEdit={edit} canEdit={!closed} />}
            {phase === 'form' && closed && (
              <div className="py-6 text-center" role="status">
                <LockIcon className="mx-auto h-6 w-6 text-gold-deep" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-2xl text-brown">{m.rsvp.closedTitle}</h3>
                <p className="mt-2 text-brown-soft">{m.rsvp.closedBody}</p>
              </div>
            )}
            {phase === 'form' && !closed && (
              <>
                {pastDeadline && <p className="mb-6 rounded-xl bg-white/60 px-4 py-2.5 text-center text-sm text-brown-soft">{m.rsvp.lateNotice}</p>}
                <RsvpForm form={form} onSubmit={onSubmit} submitError={submitError} maxGuests={maxGuests} isEditing={Boolean(saved)} />
              </>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
