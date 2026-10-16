import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDownIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { hallScenes } from '../../data/hallScenes';
import { HallDoors } from './HallDoors';
import { FloralSprig } from './FloralSprig';
import { LightParticles } from './LightParticles';

gsap.registerPlugin(ScrollTrigger);

const STEP_IDS = ['doors', ...hallScenes.map((s) => s.id)] as const;

/** Pinned, scroll-scrubbed "walk" through the venue: doors → archway → corridor → aisle → poruwa → celebration. */
export function HallCinematic() {
  const { m, locale } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Copy length changes with language → recompute pin positions
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => window.clearTimeout(id);
  }, [locale]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', root);
      const caps = gsap.utils.toArray<HTMLElement>('[data-caption]', root);
      const fg = gsap.utils.toArray<HTMLElement>('[data-fg]', root);
      const hint = root.querySelector('[data-hint]');

      gsap.set(layers, { opacity: 0, scale: 1.12, transformOrigin: '50% 55%' });
      gsap.set(layers[0], { opacity: 1 });
      gsap.set(caps, { opacity: 0, y: 28 });
      gsap.set(caps[0], { opacity: 1, y: 0 });

      const marks: number[] = [0];
      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      // Doors swing open while the camera eases forward
      tl.to('[data-door="left"]', { rotateY: -112, duration: 1 }, 0).
      to('[data-door="right"]', { rotateY: 112, duration: 1 }, 0).
      to('[data-doors]', { autoAlpha: 0, duration: 0.25 }, 0.85).
      to(caps[0], { opacity: 0, y: -28, duration: 0.3 }, 0.5).
      to(hint, { opacity: 0, duration: 0.2 }, 0.1).
      to(layers[0], { scale: 1.3, duration: 1 }, 0);

      let t = 1;
      layers.forEach((layer, i) => {
        const cap = caps[i + 1];
        marks.push(t);
        tl.to(cap, { opacity: 1, y: 0, duration: 0.3 }, t);
        tl.to(layer, { scale: '+=0.22', duration: 1.2 }, t);

        if (i < layers.length - 1) {
          const next = layers[i + 1];
          tl.to(cap, { opacity: 0, y: -28, duration: 0.3 }, t + 1.0);
          // Walk forward: current scene rushes past, next scene emerges from depth
          tl.to(layer, { scale: 2.1, opacity: 0, duration: 0.6, ease: 'power1.in' }, t + 1.2);
          tl.fromTo(next, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1.16, duration: 0.6, immediateRender: false }, t + 1.2);
          // Foreground florals sweep outward past the "camera", then return from depth
          tl.fromTo(
            fg,
            { xPercent: 0, scale: 1, opacity: 0.95 },
            { xPercent: (idx: number) => idx === 0 ? -70 : 70, scale: 1.8, opacity: 0, duration: 0.6, immediateRender: false },
            t + 1.2
          );
          tl.fromTo(
            fg,
            { xPercent: (idx: number) => idx === 0 ? 25 : -25, scale: 0.85, opacity: 0 },
            { xPercent: 0, scale: 1, opacity: 0.95, duration: 0.5, immediateRender: false },
            t + 1.8
          );
          t += 1.8;
        } else {
          t += 1.2;
        }
      });

      const total = tl.duration();
      ScrollTrigger.create({
        trigger: root,
        animation: tl,
        start: 'top top',
        end: () => `+=${window.innerHeight * 5}`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const time = self.progress * total;
          let idx = 0;
          marks.forEach((mark, i) => {
            if (time >= mark - 0.05) idx = i;
          });
          setActive((prev) => prev === idx ? prev : idx);
        }
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} aria-label={m.hall.label} className="relative h-[100svh] w-full overflow-hidden bg-brown">
      {hallScenes.map((scene, i) =>
      <img
        key={scene.id}
        data-layer
        src={scene.src}
        alt=""
        aria-hidden="true"
        width={1200}
        height={900}
        loading={i === 0 ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover will-change-transform" />

      )}

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,226,170,0.18),transparent_60%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-brown/85 via-brown/35 to-transparent" aria-hidden="true" />
      <LightParticles className="z-10" />

      <div data-fg className="pointer-events-none absolute -bottom-6 -left-10 z-[15] w-40 md:-left-6 md:w-64" aria-hidden="true">
        <FloralSprig />
      </div>
      <div data-fg className="pointer-events-none absolute -bottom-6 -right-10 z-[15] w-40 md:-right-6 md:w-64" aria-hidden="true">
        <FloralSprig flip />
      </div>

      <HallDoors />

      {/* Captions */}
      <div className="absolute inset-0 z-30">
        {STEP_IDS.map((id) => {
          const scene = m.hall.scenes[id];
          const isDoors = id === 'doors';
          return (
            <div
              key={id}
              data-caption
              className={
              isDoors ?
              'absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center' :
              'absolute inset-x-0 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] px-6 text-center md:bottom-20'
              }>
              
              <h2
                className={`font-serif text-4xl font-medium leading-tight md:text-6xl ${isDoors ? 'inline-block rounded-2xl bg-ivory/90 px-6 py-3 text-brown' : 'text-ivory'}`}>
                
                {scene.title}
              </h2>
              <p className={`mx-auto mt-3 max-w-md text-base md:text-lg ${isDoors ? 'text-brown' : 'text-ivory/90'}`}>
                <span className={isDoors ? 'rounded-full bg-ivory/90 px-4 py-1' : ''}>{scene.caption}</span>
              </p>
            </div>);

        })}
      </div>

      <div
        data-hint
        className="absolute inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-1 text-sm text-brown md:bottom-10">
        
        <span className="rounded-full bg-ivory/90 px-4 py-1.5">{m.hall.hint}</span>
        <ChevronDownIcon className="h-5 w-5 motion-safe:animate-bounce" aria-hidden="true" />
      </div>

      {/* Progress */}
      <ol className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5 md:right-8" aria-hidden="true">
        {STEP_IDS.map((id, i) =>
        <li
          key={id}
          className={`h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-200 ease-out-soft ${i === active ? 'scale-150 bg-gold' : 'bg-ivory/60'}`} />

        )}
      </ol>
    </section>);

}