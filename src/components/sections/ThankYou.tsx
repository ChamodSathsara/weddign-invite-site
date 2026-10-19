import React from 'react';
import { PhoneIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { assets, wedding } from '../../data/wedding';
import { FloatingPetals } from '../animation/FloatingPetals';
import { FloralSprig } from '../animation/FloralSprig';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { PhysicalInvitationDownload } from '../invitation/PhysicalInvitationDownload';
import { Reveal } from '../animation/Reveal';

export function ThankYou({ guestName }: { guestName: string | null }) {
  const { m, locale } = useI18n();
  return (
    <section aria-labelledby="thanks-title" className="warm-glow relative overflow-hidden bg-champagne/60 px-5 pb-36 pt-24 text-center md:pb-24 md:pt-32">
      <FloatingPetals count={16} />
      <Reveal className="relative mx-auto max-w-2xl">
        <div className="relative mx-auto w-44 md:w-56">
          <div className="aspect-[4/5] overflow-hidden rounded-[999px] border border-gold bg-ivory p-1.5">
            <img
              src={assets.couple}
              alt={m.thanks.closingAlt}
              width={1024}
              height={1536}
              loading="lazy"
              decoding="async"
              className="h-full w-full rounded-[999px] object-cover object-[50%_18%]" />
            
          </div>
          <FloralSprig className="pointer-events-none absolute -bottom-4 -left-12 w-20" />
          <FloralSprig flip className="pointer-events-none absolute -bottom-4 -right-12 w-20" />
        </div>

        <h2 id="thanks-title" className="mt-12 font-serif text-[2.4rem] font-medium leading-tight text-brown md:text-6xl">
          {m.thanks.title}
        </h2>
        <OrnamentDivider className="mt-6" />
        <p className="mt-6 font-serif text-xl italic text-brown-soft">{m.thanks.body}</p>
        <p className={`mt-1 text-gold ${locale === 'si' ? 'font-serif text-4xl font-semibold' : 'font-script text-6xl md:text-7xl'}`}>
          {m.common.names}
        </p>
        <p className="mt-3 font-serif text-lg tracking-[0.25em] text-brown">{m.envelope.date}</p>
        <PhysicalInvitationDownload guestName={guestName} />

        <div className="mx-auto mt-10 max-w-lg border-t border-gold-soft pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-gold-deep">
            {locale === 'si' ? 'සම්බන්ධ වන්න' : 'Contact Us'}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {wedding.contacts.map((contact) => (
              <a
                key={contact.name}
                href={`tel:${contact.phone}`}
                aria-label={`Call ${contact.name} on ${contact.display}`}
                className="group flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border border-gold-soft bg-ivory/75 px-5 text-left shadow-sm transition-[transform,border-color,background-color] hover:border-gold hover:bg-ivory active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne text-gold-deep transition-colors group-hover:bg-gold group-hover:text-brown">
                  <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-serif text-lg leading-tight text-brown">{contact.name}</span>
                  <span className="mt-0.5 block text-sm tracking-[0.08em] text-brown-soft">{contact.display}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
      <p className="relative mt-20 text-xs text-brown-soft">{m.thanks.footer}</p>
    </section>);

}
