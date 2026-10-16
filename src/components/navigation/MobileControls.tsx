import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MusicToggle } from './MusicToggle';

export function MobileControls() {
  return (
    <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-40 flex items-center gap-2 md:hidden">
      <LanguageSwitcher />
      <MusicToggle />
    </div>);

}