import React from 'react';

interface JasmineFlowerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function JasmineFlower({ className, style }: JasmineFlowerProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true" focusable="false">
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
      <circle cx="20" cy="20" r="3.1" fill="#E3C072" />
    </svg>);

}