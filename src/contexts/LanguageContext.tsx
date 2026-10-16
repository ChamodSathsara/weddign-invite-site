import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en } from '../data/messages/en';
import { si } from '../data/messages/si';
import type { Locale, Messages } from '../types/i18n';

const STORAGE_KEY = 'sc-wedding:locale';
const dictionaries: Record<Locale, Messages> = { en, si };

interface LanguageState {
  locale: Locale;
  m: Messages;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageState | null>(null);

function readInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'si') return stored;
    const cookie = document.cookie.match(/(?:^|; )NEXT_LOCALE=(en|si)/);
    if (cookie) return cookie[1] as Locale;
  } catch {

    /* storage unavailable */}
  return 'en';
}

export function LanguageProvider({ children }: {children: React.ReactNode;}) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {

      /* ignore */}
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const value = useMemo(() => ({ locale, m: dictionaries[locale], setLocale }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): LanguageState {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider');
  return ctx;
}