import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { assets } from '../data/wedding';
import { createMusicEngine, type MusicEngine } from '../utils/ambientMusic';

const MUTE_KEY = 'sc-wedding:muted';

interface MusicState {
  started: boolean;
  muted: boolean;
  /** Call synchronously inside a click/tap handler. */
  start: () => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicState | null>(null);

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function MusicProvider({ children }: {children: React.ReactNode;}) {
  const engineRef = useRef<MusicEngine | null>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const mutedRef = useRef(muted);
  const startedRef = useRef(started);
  mutedRef.current = muted;
  startedRef.current = started;

  const ensureEngine = () => {
    if (!engineRef.current) engineRef.current = createMusicEngine(assets.music);
    return engineRef.current;
  };

  const start = useCallback(() => {
    const engine = ensureEngine();
    setStarted(true);
    if (engine && !mutedRef.current) engine.play();
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    const engine = ensureEngine();
    if (next) engine?.pause();else
    {
      engine?.play();
      setStarted(true);
    }
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    } catch {

      /* ignore */}
  }, []);

  // Pause when the tab is hidden; resume on return
  useEffect(() => {
    const onVisibility = () => {
      const engine = engineRef.current;
      if (!engine || !startedRef.current || mutedRef.current) return;
      if (document.hidden) engine.pause();else
      engine.play();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const value = useMemo(() => ({ started, muted, start, toggleMute }), [started, muted, start, toggleMute]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicState {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider');
  return ctx;
}