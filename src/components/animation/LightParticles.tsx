import React from 'react';

export function LightParticles({ count = 18, className = '' }: {count?: number;className?: string;}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = 2 + i % 4;
        return (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-[#FFE7B0]"
            style={
            {
              left: `${(i * 53 + 7) % 100}%`,
              top: `${(i * 31 + 13) % 90}%`,
              width: size,
              height: size,
              boxShadow: '0 0 8px 2px rgba(255, 220, 150, 0.55)',
              '--dur': `${3 + i % 5}s`,
              '--delay': `${-(i * 0.7)}s`
            } as React.CSSProperties
            } />);


      })}
    </div>);

}