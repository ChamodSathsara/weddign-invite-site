import React from 'react';
import { JasmineFlower } from './JasmineFlower';

export function OrnamentDivider({ className = '', align = 'center' }: {className?: string;align?: 'center' | 'start';}) {
  return (
    <div
      className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-center md:justify-start'} ${className}`}
      aria-hidden="true">
      
      <span className="h-px w-12 bg-gold/60 md:w-16" />
      <JasmineFlower className="h-4 w-4" />
      <span className="h-px w-12 bg-gold/60 md:w-16" />
    </div>);

}