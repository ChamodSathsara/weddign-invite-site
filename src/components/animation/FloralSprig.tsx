import React from 'react';

interface FloralSprigProps {
  className?: string;
  flip?: boolean;
}

const LEAVES = [
{ x: 74, y: 196, r: -50 },
{ x: 88, y: 168, r: 40 },
{ x: 70, y: 140, r: -45 },
{ x: 84, y: 112, r: 35 },
{ x: 66, y: 84, r: -40 },
{ x: 80, y: 56, r: 30 }];


const FLOWERS = [
{ x: 92, y: 14, s: 1 },
{ x: 60, y: 70, s: 0.8 },
{ x: 96, y: 128, s: 0.9 },
{ x: 58, y: 178, s: 0.7 }];


/** Hand-drawn style jasmine branch. Decorative only. */
export function FloralSprig({ className, flip }: FloralSprigProps) {
  return (
    <svg
      viewBox="0 0 160 240"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
      focusable="false">
      
      <path
        d="M80 238 C 70 190, 96 150, 76 100 S 62 36, 92 10"
        stroke="#9AAA8C"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round" />
      
      {LEAVES.map((leaf, i) =>
      <ellipse
        key={i}
        cx={leaf.x}
        cy={leaf.y}
        rx="6"
        ry="15"
        fill="#A9B79B"
        opacity="0.75"
        transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`} />

      )}
      {FLOWERS.map((f, i) =>
      <g key={i} transform={`translate(${f.x - 20 * f.s} ${f.y - 20 * f.s}) scale(${f.s})`}>
          {[0, 72, 144, 216, 288].map((deg) =>
        <ellipse
          key={deg}
          cx="20"
          cy="10.5"
          rx="5.4"
          ry="9.6"
          fill="#FFFFFF"
          stroke="#E6D3AE"
          strokeWidth="0.7"
          transform={`rotate(${deg} 20 20)`} />

        )}
          <circle cx="20" cy="20" r="3" fill="#E3C072" />
        </g>
      )}
    </svg>);

}