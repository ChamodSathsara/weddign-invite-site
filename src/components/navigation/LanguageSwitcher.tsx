import React from 'react';
import { useI18n } from '../../contexts/LanguageContext';
import type { Locale } from '../../types/i18n';

const OPTIONS: {value: Locale;label: string;lang: string;}[] = [
{ value: 'en', label: 'EN', lang: 'en' },
{ value: 'si', label: 'සිංහල', lang: 'si' }];


export function LanguageSwitcher({ className = '' }: {className?: string;}) {
  const { locale, setLocale, m } = useI18n();
  return (
    <div
      role="group"
      aria-label={m.common.languageLabel}
      className={`inline-flex items-center rounded-full border border-gold-soft bg-ivory/90 p-1 text-sm backdrop-blur-sm ${className}`}>
      
      {OPTIONS.map((opt) => {
        const selected = opt.value === locale;
        return (
          <button
            key={opt.value}
            type="button"
            lang={opt.lang}
            aria-pressed={selected}
            onClick={() => setLocale(opt.value)}
            className={`min-h-[36px] min-w-[44px] whitespace-nowrap rounded-full px-3 font-medium transition-[background-color,color] duration-150 ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            selected ? 'bg-brown text-ivory' : 'text-brown hover:bg-champagne'}`
            }>
            
            {opt.label}
          </button>);

      })}
    </div>);

}