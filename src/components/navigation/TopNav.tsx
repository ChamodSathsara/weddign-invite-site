import React, { useEffect, useState } from 'react';
import { useI18n } from '../../contexts/LanguageContext';
import { navItems, type NavId } from '../../data/navigation';
import { scrollToSection } from '../../utils/scroll';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MusicToggle } from './MusicToggle';

export function TopNav({ active }: {active: string;}) {
  const { m } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 hidden transition-[background-color,border-color] duration-200 ease-out-soft md:block ${
      scrolled ? 'border-b border-gold-soft/60 bg-ivory/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'}`
      }>
      
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-8">
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="font-script text-3xl text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          aria-label={m.nav.home}>
          
          S <span className="font-serif text-xl">&amp;</span> C
        </button>
        <nav aria-label={m.nav.label}>
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[15px] transition-colors duration-150 ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isActive ? 'text-brown' : 'text-brown-soft hover:text-brown'}`
                    }>
                    
                    {m.nav[item.id as NavId]}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-px bg-gold transition-transform duration-200 ease-out-soft ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                      aria-hidden="true" />
                    
                  </button>
                </li>);

            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <MusicToggle />
        </div>
      </div>
    </header>);

}