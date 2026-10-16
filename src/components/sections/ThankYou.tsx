import React from 'react';
import { useI18n } from '../../contexts/LanguageContext';
import { assets } from '../../data/wedding';
import { FloatingPetals } from '../animation/FloatingPetals';
import { FloralSprig } from '../animation/FloralSprig';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { Reveal } from '../animation/Reveal';

export function ThankYou() {
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
      </Reveal>
      <p className="relative mt-20 text-xs text-brown-soft">{m.thanks.footer}</p>
    </section>);

}