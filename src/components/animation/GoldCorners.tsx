import React from 'react';

interface GoldCornersProps {
  className?: string;
  size?: string;
  inset?: string;
}

function Corner({ style, size }: {style: React.CSSProperties;size: string;}) {
  return (
    <svg viewBox="0 0 64 64" className={`absolute ${size} text-gold`} style={style} aria-hidden="true" focusable="false">
      <path d="M2 62 V16 Q2 2 16 2 H62" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <path d="M8 56 V20 Q8 8 20 8 H56" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.6" />
      <path d="M14 30 Q14 14 30 14" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      <circle cx="34" cy="8" r="1.1" fill="currentColor" />
      <circle cx="8" cy="34" r="1.1" fill="currentColor" />
    </svg>);

}

export function GoldCorners({ className = '', size = 'h-10 w-10 md:h-14 md:w-14', inset = '10px' }: GoldCornersProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Corner size={size} style={{ top: inset, left: inset }} />
      <Corner size={size} style={{ top: inset, right: inset, transform: 'scaleX(-1)' }} />
      <Corner size={size} style={{ bottom: inset, left: inset, transform: 'scaleY(-1)' }} />
      <Corner size={size} style={{ bottom: inset, right: inset, transform: 'scale(-1,-1)' }} />
    </div>);

}