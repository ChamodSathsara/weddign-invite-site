import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { MusicProvider } from './contexts/MusicContext';
import { Invitation } from './pages/Invitation';

interface AppProps {
  /** Preview helper: jump straight past the envelope and intro. */
  startAt?: 'envelope' | 'site';
}

export function App({ startAt = 'envelope' }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <MusicProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/invite" element={<Invitation startAt={startAt} />} />
              <Route path="*" element={<Invitation startAt={startAt} />} />
            </Routes>
          </BrowserRouter>
        </MusicProvider>
      </LanguageProvider>
    </MotionConfig>);

}