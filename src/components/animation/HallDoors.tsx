import React from 'react';
import { JasmineFlower } from './JasmineFlower';

function DoorLeaf({ side }: {side: 'left' | 'right';}) {
  const edge = side === 'left' ? 'right-3 md:right-5' : 'left-3 md:left-5';
  return (
    <div
      data-door={side}
      className={`paper-texture relative h-full w-1/2 bg-champagne ${side === 'left' ? 'origin-left border-r' : 'origin-right border-l'} border-gold/60`}
      style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
      
      <div className="absolute inset-4 flex flex-col gap-4 md:inset-8 md:gap-6">
        <div className="relative flex-[3] rounded-t-[999px] border border-gold/70">
          <div className="absolute inset-2 rounded-t-[999px] border border-gold/30 md:inset-3" />
          <JasmineFlower className="absolute left-1/2 top-[22%] h-8 w-8 -translate-x-1/2 md:h-10 md:w-10" />
        </div>
        <div className="relative flex-1 rounded-md border border-gold/70">
          <div className="absolute inset-2 rounded border border-gold/30" />
        </div>
      </div>
      <span className={`absolute top-1/2 h-16 w-1.5 -translate-y-1/2 rounded-full bg-gold md:h-24 ${edge}`} />
    </div>);

}

export function HallDoors() {
  return (
    <div data-doors className="absolute inset-0 z-20 flex" style={{ perspective: '1600px' }} aria-hidden="true">
      <DoorLeaf side="left" />
      <DoorLeaf side="right" />
    </div>);

}