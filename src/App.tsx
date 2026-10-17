"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { MusicProvider } from './contexts/MusicContext';

const Invitation = dynamic(
  () => import('./screens/Invitation').then((module) => module.Invitation),
  { ssr: false }
);

interface AppProps {
  /** Preview helper: jump straight past the envelope and intro. */
  startAt?: 'envelope' | 'site';
}

export function App({ startAt = 'envelope' }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <MusicProvider>
          <Invitation startAt={startAt} />
        </MusicProvider>
      </LanguageProvider>
    </MotionConfig>);

}
