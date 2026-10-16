import React from 'react';
import { JasmineFlower } from './JasmineFlower';

interface FloatingPetalsProps {
  count?: number;
  className?: string;
}

/** Deterministic, CSS-only falling jasmine. Hidden for reduced-motion users. */
export function FloatingPetals({ count = 12, className = '' }: FloatingPetalsProps) {
  const petals = Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    size: 10 + i * 7 % 14,
    dur: 14 + i * 5 % 11,
    delay: -(i * 2.7 % 18),
    drift: (i % 2 === 0 ? 1 : -1) * (20 + i * 13 % 60),
    spin: 180 + i * 47 % 360,
    flower: i % 3 === 0
  }));

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {petals.map((p, i) => {
        const style = {
          left: `${p.left}%`,
          top: 0,
          width: p.size,
          height: p.size,
          '--dur': `${p.dur}s`,
          '--delay': `${p.delay}s`,
          '--drift': `${p.drift}px`,
          '--spin': `${p.spin}deg`
        } as React.CSSProperties;
        return p.flower ?
        <JasmineFlower key={i} className="petal absolute opacity-0" style={style} /> :

        <span
          key={i}
          className="petal absolute block rounded-[60%_40%_60%_40%] border border-champagne bg-white opacity-0"
          style={{ ...style, height: p.size * 0.6 }} />;


      })}
    </div>);

}