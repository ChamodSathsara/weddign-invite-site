import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../contexts/LanguageContext';
import { navItems } from '../../data/navigation';
import { scrollToSection } from '../../utils/scroll';

export function BottomNav({ active }: {active: string;}) {
  const { m } = useI18n();
  return (
    <nav
      aria-label={m.nav.label}
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-gold-soft/70 bg-ivory/95 backdrop-blur-md md:hidden">
      
      <ul className="mx-auto grid max-w-md grid-cols-5 px-1">
        {navItems.map(({ id, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => scrollToSection(id)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={m.nav[id]}
                className="relative flex min-h-[60px] w-full flex-col items-center justify-center gap-1 rounded-xl px-1 pt-2 pb-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold">
                
                {isActive &&
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute top-0 h-[2px] w-8 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  aria-hidden="true" />

                }
                <Icon
                  className={`h-5 w-5 transition-colors duration-150 ${isActive ? 'text-gold-deep' : 'text-brown-soft'}`}
                  strokeWidth={isActive ? 2 : 1.6}
                  fill={isActive && id === 'story' ? 'currentColor' : 'none'}
                  aria-hidden="true" />
                
                <span
                  className={`whitespace-nowrap text-[11px] leading-none transition-colors duration-150 ${isActive ? 'font-medium text-brown' : 'text-brown-soft'}`}
                  aria-hidden="true">
                  
                  {m.navShort[id]}
                </span>
              </button>
            </li>);

        })}
      </ul>
    </nav>);

}