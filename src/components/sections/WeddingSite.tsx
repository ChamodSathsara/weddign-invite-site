import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '../../contexts/LanguageContext';
import { navIds } from '../../data/navigation';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import type { Guest } from '../../hooks/useGuest';
import { WeddingHallScroll } from '../animation/WeddingHallScroll';
import { BottomNav } from '../navigation/BottomNav';
import { MobileControls } from '../navigation/MobileControls';
import { TopNav } from '../navigation/TopNav';
import { RsvpSection } from '../rsvp/RsvpSection';
import { EventDetails } from './EventDetails';
import { Hero } from './Hero';
import { OurStory } from './OurStory';
import { ThankYou } from './ThankYou';
import { Venue } from './Venue';

export function WeddingSite({ guest }: {guest: Guest;}) {
  const { m } = useI18n();
  const reduce = useReducedMotion();
  useSmoothScroll(!reduce);
  const active = useActiveSection(navIds);

  return (
    <motion.div
      className="min-h-screen w-full bg-ivory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
      
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brown focus:px-4 focus:py-2 focus:text-ivory">
        
        {m.common.skipToContent}
      </a>
      <TopNav active={active} />
      <MobileControls />
      <main id="main" className="pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        <Hero guestName={guest.name} />
        <WeddingHallScroll />
        <OurStory />
        <EventDetails />
        <Venue />
        <RsvpSection token={guest.token} guestName={guest.name} />
        <ThankYou />
      </main>
      <BottomNav active={active} />
    </motion.div>);

}
