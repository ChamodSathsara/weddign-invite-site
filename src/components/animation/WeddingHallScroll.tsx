import React, { Suspense, lazy, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { hallScenes } from '../../data/hallScenes';
import { isLowPowerDevice } from '../../utils/device';
import { HallStaticFallback } from './HallStaticFallback';

const HallCinematic = lazy(() => import('./HallCinematic').then((mod) => ({ default: mod.HallCinematic })));

function HallPlaceholder() {
  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-champagne" aria-hidden="true">
      <img src={hallScenes[0].src} alt="" className="h-full w-full scale-[1.12] object-cover opacity-60" />
    </div>);

}

export function WeddingHallScroll() {
  const reduce = useReducedMotion();
  const [lowPower] = useState(isLowPowerDevice);

  if (reduce || lowPower) return <HallStaticFallback />;

  return (
    <Suspense fallback={<HallPlaceholder />}>
      <HallCinematic />
    </Suspense>);

}