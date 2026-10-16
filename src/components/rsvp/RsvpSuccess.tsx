import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, PencilIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { fmt } from '../../utils/format';
import type { SavedRsvp } from '../../types/rsvp';

interface RsvpSuccessProps {
  saved: SavedRsvp;
  onEdit: () => void;
  canEdit: boolean;
}

export function RsvpSuccess({ saved, onEdit, canEdit }: RsvpSuccessProps) {
  const { m } = useI18n();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accepted = saved.attending === 'accept';

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="py-4 text-center">
      
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-white">
        <HeartIcon className={`h-6 w-6 ${accepted ? 'fill-rose text-rose' : 'text-gold-deep'}`} aria-hidden="true" />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-serif text-3xl font-medium leading-tight text-brown outline-none">
        {accepted ? m.rsvp.successAcceptTitle : m.rsvp.successDeclineTitle}
      </h3>
      <p className="mt-2 font-serif text-xl text-brown">{saved.fullName}</p>
      <p className="mx-auto mt-2 max-w-xs text-brown-soft">
        {accepted ? fmt(m.rsvp.successAcceptBody, { count: saved.guests }) : m.rsvp.successDeclineBody}
      </p>
      {canEdit &&
      <button
        type="button"
        onClick={onEdit}
        className="mt-7 inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap rounded-full border border-gold px-6 text-[15px] text-brown transition-[background-color,transform] duration-150 ease-out-soft hover:bg-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        
          <PencilIcon className="h-4 w-4" aria-hidden="true" />
          {m.rsvp.edit}
        </button>
      }
    </motion.div>);

}