import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { useI18n } from '../contexts/LanguageContext';
import { useMusic } from '../contexts/MusicContext';
import { assets } from '../data/wedding';
import { useGuest } from '../hooks/useGuest';
import { applyMeta } from '../utils/seo';
import { EnvelopeScene } from '../components/invitation/EnvelopeScene';
import { IntroVideo } from '../components/invitation/IntroVideo';
import { WeddingSite } from '../components/sections/WeddingSite';

export type InvitationPhase = 'envelope' | 'intro' | 'site';

export function Invitation({ startAt }: {startAt: InvitationPhase;}) {
  const guest = useGuest();
  const reduce = useReducedMotion();
  const music = useMusic();
  const { m, locale } = useI18n();
  const [phase, setPhase] = useState<InvitationPhase>(startAt);

  useEffect(() => {
    applyMeta({ title: m.meta.title, description: m.meta.description, image: assets.couple, locale });
  }, [m, locale]);

  useEffect(() => {
    if (phase === 'site') window.scrollTo(0, 0);
  }, [phase]);

  // Music starts inside the same user gesture that opens the invitation
  const handleOpen = () => {
    music.start();
    setPhase(reduce ? 'site' : 'intro');
  };

  const handleIntroDone = useCallback(() => setPhase('site'), []);

  return (
    <AnimatePresence mode="wait">
      {phase === 'envelope' && <EnvelopeScene key="envelope" guestName={guest.name} onOpen={handleOpen} />}
      {phase === 'intro' && <IntroVideo key="intro" onDone={handleIntroDone} />}
      {phase === 'site' && <WeddingSite key="site" guest={guest} />}
    </AnimatePresence>);

}