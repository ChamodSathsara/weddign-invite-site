import React from 'react';
import { assets } from '../../data/wedding';
import { FloralSprig } from '../animation/FloralSprig';

interface CouplePortraitProps {
  alt: string;
  className?: string;
  eager?: boolean;
  florals?: boolean;
}

/** The original couple illustration, untouched, inside an arched gold frame. */
export function CouplePortrait({ alt, className = '', eager = false, florals = true }: CouplePortraitProps) {
  return (
    <div className={`relative aspect-[2/3] ${className}`}>
      <div className="absolute -inset-2 rounded-t-[999px] rounded-b-[28px] border border-gold/50" aria-hidden="true" />
      <div className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[22px] border border-gold bg-champagne shadow-[0_24px_60px_-28px_rgba(86,51,35,0.45)]">
        <img
          src={assets.couple}
          alt={alt}
          width={1024}
          height={1536}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover object-top" />
        
      </div>
      {florals &&
      <>
          <FloralSprig className="pointer-events-none absolute -bottom-6 -left-8 w-20 md:-left-12 md:w-28" />
          <FloralSprig flip className="pointer-events-none absolute -bottom-6 -right-8 w-20 md:-right-12 md:w-28" />
        </>
      }
    </div>);

}