import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { FloralSprig } from '../animation/FloralSprig';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { Reveal } from '../animation/Reveal';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSci4fS2eKxGnNbi668M52-uU-4-TrLHOj_Kk4Fc4TqIcO-G1g/viewform';
const GOOGLE_FORM_EMBED_URL = `${GOOGLE_FORM_URL}?embedded=true`;

export function RsvpSection() {
  const { m } = useI18n();

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative overflow-hidden bg-ivory px-4 py-20 md:px-10 md:py-32">
      <FloralSprig className="pointer-events-none absolute -left-10 top-16 hidden w-48 opacity-70 md:block" />
      <FloralSprig flip className="pointer-events-none absolute -right-10 bottom-16 hidden w-48 opacity-70 md:block" />

      <Reveal className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <h2 id="rsvp-title" className="font-serif text-5xl font-medium text-brown outline-none md:text-6xl">
            {m.rsvp.title}
          </h2>
          <OrnamentDivider className="mt-3" />
          <p className="mt-3 font-serif text-lg italic text-brown-soft md:text-xl">{m.rsvp.deadline}</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[30px] border border-gold-soft bg-white shadow-[0_40px_90px_-50px_rgba(86,51,35,0.5)]">
          <iframe
            src={GOOGLE_FORM_EMBED_URL}
            title="Wedding RSVP form"
            loading="lazy"
            className="block h-[980px] w-full border-0 sm:h-[920px]"
          >
            Loading…
          </iframe>
        </div>

        <div className="mt-5 text-center">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-gold bg-ivory px-6 text-sm font-medium text-brown transition-[transform,background-color] hover:bg-champagne active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Open RSVP form in a new tab
            <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
