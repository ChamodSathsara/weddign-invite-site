import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface GuestCounterProps {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  describedBy?: string;
}

const btn =
'inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-soft bg-white text-brown transition-[background-color,transform,opacity] duration-150 ease-out-soft hover:bg-champagne active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold';

export function GuestCounter({ id, value, min, max, onChange, decreaseLabel, increaseLabel, describedBy }: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gold-soft bg-white/70 p-1.5">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={decreaseLabel} aria-controls={id}>
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      <output id={id} aria-live="polite" aria-describedby={describedBy} className="font-serif text-3xl tabular-nums text-brown">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={increaseLabel} aria-controls={id}>
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>);

}