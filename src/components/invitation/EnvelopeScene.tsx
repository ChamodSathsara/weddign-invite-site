import React from 'react';
import { motion } from 'framer-motion';
import { MailOpenIcon, Volume2Icon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { fmt } from '../../utils/format';
import { FloatingPetals } from '../animation/FloatingPetals';
import { GoldCorners } from '../animation/GoldCorners';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';
import { CouplePortrait } from './CouplePortrait';

interface EnvelopeSceneProps {
  guestName: string | null;
  onOpen: () => void;
}

const EASE = [0.23, 1, 0.32, 1] as const;
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }
};

export function EnvelopeScene({ guestName, onOpen }: EnvelopeSceneProps) {
  const { m, locale } = useI18n();
  const greeting = guestName ? fmt(m.envelope.greeting, { name: guestName }) : m.envelope.fallbackGuest;

  return (
    <motion.main
      className="warm-glow fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ivory px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.3, ease: EASE } }}>
      
      <FloatingPetals count={14} />
      <div className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10">
        <LanguageSwitcher />
      </div>

      <motion.div
        className="paper-texture relative my-auto w-full max-w-[420px] rounded-[30px] border border-gold-soft bg-ivory px-6 pb-7 pt-8 text-center shadow-[0_40px_90px_-40px_rgba(86,51,35,0.45)] md:max-w-[460px] md:px-10"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
        
        <div className="pointer-events-none absolute inset-2.5 rounded-[24px] border border-gold/35" aria-hidden="true" />
        <GoldCorners inset="14px" size="h-9 w-9 md:h-11 md:w-11" />

        <motion.p variants={item} className="relative font-serif text-xl italic text-brown-soft md:text-2xl">
          {greeting}
        </motion.p>

        <motion.div variants={item} className="relative mx-auto mt-5 w-fit">
          <div className="float-soft">
            <CouplePortrait alt={m.hero.portraitAlt} eager className="h-[30svh] max-h-[300px] min-h-[200px]" />
          </div>
        </motion.div>

        <motion.p variants={item} className="relative mt-7 text-sm text-brown-soft">
          {m.envelope.together}
        </motion.p>
        <motion.h1
          variants={item}
          className={`relative mt-1 text-gold ${locale === 'si' ? 'font-serif text-[2.2rem] font-semibold leading-snug' : 'font-script text-[2.9rem] leading-[1.15] md:text-[3.4rem]'}`}>
          
          {m.common.names}
        </motion.h1>
        <motion.p variants={item} className="relative mx-auto mt-1 max-w-[280px] text-[15px] leading-relaxed text-brown">
          {m.envelope.request}
        </motion.p>
        <motion.div variants={item} className="relative mt-3">
          <OrnamentDivider />
          <p className="mt-2 font-serif text-lg tracking-[0.25em] text-brown">{m.envelope.date}</p>
        </motion.div>

        <motion.div variants={item} className="relative mt-5">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-brown px-8 text-[15px] font-medium text-ivory shadow-[0_12px_30px_-12px_rgba(86,51,35,0.7)] transition-[transform,background-color] duration-150 ease-out-soft hover:bg-[#4a2b1e] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory">
            
            <MailOpenIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            {m.envelope.open}
          </button>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-brown-soft">
            <Volume2Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {m.envelope.soundHint}
          </p>
        </motion.div>
      </motion.div>
    </motion.main>);

}