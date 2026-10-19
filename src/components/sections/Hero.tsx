import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, LocateFixedIcon } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '../../contexts/LanguageContext';
import { fmt } from '../../utils/format';
import { scrollToSection } from '../../utils/scroll';
import { FloatingPetals } from '../animation/FloatingPetals';
import { FloralSprig } from '../animation/FloralSprig';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { CouplePortrait } from '../invitation/CouplePortrait';
import { Countdown } from './Countdown';

const EASE = [0.23, 1, 0.32, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: EASE, delay }
});

export function Hero({ guestName }: {guestName: string | null;}) {
  const { m, locale } = useI18n();

  return (
    <section id="home" aria-labelledby="home-title" className="warm-glow relative overflow-hidden bg-ivory pb-24 pt-20 md:flex md:min-h-[100svh] md:items-center md:pb-16 md:pt-24">
      <FloatingPetals count={10} />
      <FloralSprig className="pointer-events-none absolute -left-10 -top-8 w-36 rotate-[200deg] opacity-80 md:w-52" />
      <FloralSprig flip className="pointer-events-none absolute -right-12 bottom-10 hidden w-48 opacity-70 md:block" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-10">
        <div className="order-2 text-center md:order-1 md:text-left">
          {guestName &&
          <motion.p {...rise(0)} className="font-serif text-xl italic text-brown-soft">
              {fmt(m.hero.personal, { name: guestName })}
            </motion.p>
          }
          <motion.h1 {...rise(0.05)} id="home-title" className="mt-2 outline-none">
            {m.hero.titleBefore &&
            <span className="block font-serif text-2xl italic text-brown md:text-3xl">{m.hero.titleBefore}</span>
            }
            <span
              className={`block text-gold ${
              locale === 'si' ?
              'mt-1 font-serif text-[2.6rem] font-semibold leading-snug md:text-6xl' :
              'font-script text-[3.6rem] leading-[1.1] sm:text-7xl md:text-[5.6rem]'}`
              }>
              
              {m.common.names}
            </span>
            {m.hero.titleAfter &&
            <span className="mt-1 block font-serif text-2xl text-brown md:text-3xl">{m.hero.titleAfter}</span>
            }
          </motion.h1>

          <motion.div {...rise(0.1)}>
            <p className="mt-4 font-serif text-2xl tracking-[0.08em] text-brown md:text-3xl">{m.hero.date}</p>
            <OrnamentDivider className="mt-4" align="start" />
          </motion.div>

          <motion.p {...rise(0.15)} className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-brown-soft md:mx-0">
            {m.hero.body}
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-8">
            <Countdown align="start" />
          </motion.div>

          <motion.div {...rise(0.25)} className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <button
              type="button"
              onClick={() => scrollToSection('story')}
              className="group inline-flex min-h-[52px] items-center gap-2 whitespace-nowrap rounded-full bg-brown px-7 text-[15px] font-medium text-ivory transition-[transform,background-color] duration-150 ease-out-soft hover:bg-[#4a2b1e] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory">
              
              {m.hero.cta}
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-150 ease-out-soft group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <Link
              href="/seating-arangement"
              className="inline-flex min-h-[52px] items-center gap-2 whitespace-nowrap rounded-full border border-gold bg-ivory/80 px-7 text-[15px] font-medium text-brown transition-[transform,background-color] duration-150 ease-out-soft hover:bg-champagne active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory">
              <LocateFixedIcon className="h-4 w-4" aria-hidden="true" />
              {m.hero.seatingCta}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="order-1 mx-auto md:order-2"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}>
          
          <div className="float-soft">
            <CouplePortrait alt={m.hero.portraitAlt} eager className="h-[48svh] max-h-[460px] min-h-[300px] md:h-[72svh] md:max-h-[640px]" />
          </div>
        </motion.div>
      </div>
    </section>);

}
