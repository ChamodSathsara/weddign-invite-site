import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronDownIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { hallScenes } from '../../data/hallScenes';
import { HallDoors } from './HallDoors';
import { FloralSprig } from './FloralSprig';
import { LightParticles } from './LightParticles';

const STEP_IDS = ['doors', ...hallScenes.map((scene) => scene.id)] as const;

/** Auto-playing cinematic walk through the venue. */
export function HallCinematic() {
  const { m } = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let observer: IntersectionObserver | undefined;
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', root);
      const captions = gsap.utils.toArray<HTMLElement>('[data-caption]', root);
      const foreground = gsap.utils.toArray<HTMLElement>('[data-fg]', root);
      const hint = root.querySelector('[data-hint]');
      const progress = root.querySelector('[data-film-progress]');

      gsap.set(layers, { opacity: 0, scale: 1.04, transformOrigin: '50% 55%' });
      gsap.set(layers[0], { opacity: 1 });
      gsap.set(captions, { opacity: 0, y: 28 });
      gsap.set(captions[0], { opacity: 1, y: 0 });
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });

      const marks: number[] = [0];
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

      timeline
        .to('[data-door="left"]', { rotateY: -112, duration: 1.8, ease: 'power2.inOut' }, 0.5)
        .to('[data-door="right"]', { rotateY: 112, duration: 1.8, ease: 'power2.inOut' }, 0.5)
        .to('[data-doors]', { autoAlpha: 0, duration: 0.45 }, 1.95)
        .to(captions[0], { opacity: 0, y: -28, duration: 0.45 }, 1.25)
        .to(hint, { opacity: 0, duration: 0.35 }, 0.35)
        .to(layers[0], { scale: 1.24, yPercent: -2, duration: 2.4, ease: 'power1.inOut' }, 0);

      let time = 2.4;
      layers.forEach((layer, index) => {
        const caption = captions[index + 1];
        marks.push(time);
        timeline
          .to(caption, { opacity: 1, y: 0, duration: 0.55 }, time)
          .to(layer, { scale: '+=0.28', yPercent: '-=2', duration: 2.8, ease: 'power1.inOut' }, time);

        if (index < layers.length - 1) {
          const next = layers[index + 1];
          timeline
            .to(caption, { opacity: 0, y: -28, duration: 0.45 }, time + 2.05)
            .to(layer, { scale: 1.85, opacity: 0, filter: 'blur(5px)', duration: 0.9, ease: 'power1.in' }, time + 2.25)
            .fromTo(
              next,
              { opacity: 0, scale: 1.02, filter: 'blur(4px)' },
              { opacity: 1, scale: 1.1, filter: 'blur(0px)', duration: 0.9, ease: 'power1.out', immediateRender: false },
              time + 2.25
            )
            .fromTo(
              foreground,
              { xPercent: 0, scale: 1, opacity: 0.95 },
              { xPercent: (i: number) => i === 0 ? -70 : 70, scale: 1.8, opacity: 0, duration: 0.9, immediateRender: false },
              time + 2.25
            )
            .fromTo(
              foreground,
              { xPercent: (i: number) => i === 0 ? 25 : -25, scale: 0.85, opacity: 0 },
              { xPercent: 0, scale: 1, opacity: 0.95, duration: 0.75, immediateRender: false },
              time + 3.15
            );
          time += 3.9;
        } else {
          time += 2.8;
        }
      });

      timeline.eventCallback('onUpdate', () => {
        const currentTime = timeline.time();
        let index = 0;
        marks.forEach((mark, i) => {
          if (currentTime >= mark - 0.05) index = i;
        });
        setActive((previous) => previous === index ? previous : index);
        gsap.set(progress, { scaleX: timeline.progress() });
      });

      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) timeline.play();
        else if (timeline.progress() < 1) timeline.pause();
      }, { threshold: [0, 0.55] });
      observer.observe(root);
    }, root);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} aria-label={m.hall.label} className="relative h-[100svh] w-full overflow-hidden bg-brown">
      {hallScenes.map((scene, index) => (
        <img
          key={scene.id}
          data-layer
          src={scene.src}
          alt=""
          aria-hidden="true"
          width={1200}
          height={900}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover will-change-[transform,opacity,filter]"
        />
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,226,170,0.18),transparent_60%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(45,22,14,0.38)_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-brown/85 via-brown/35 to-transparent" aria-hidden="true" />
      <LightParticles className="z-10" />

      <div data-fg className="pointer-events-none absolute -bottom-6 -left-10 z-[15] w-40 md:-left-6 md:w-64" aria-hidden="true">
        <FloralSprig />
      </div>
      <div data-fg className="pointer-events-none absolute -bottom-6 -right-10 z-[15] w-40 md:-right-6 md:w-64" aria-hidden="true">
        <FloralSprig flip />
      </div>

      <HallDoors />

      <div className="absolute inset-0 z-30">
        {STEP_IDS.map((id) => {
          const scene = m.hall.scenes[id];
          const isDoors = id === 'doors';
          return (
            <div
              key={id}
              data-caption
              className={isDoors
                ? 'absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center'
                : 'absolute inset-x-0 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] px-6 text-center md:bottom-20'}
            >
              <h2 className={`font-serif text-4xl font-medium leading-tight md:text-6xl ${isDoors ? 'inline-block rounded-2xl bg-ivory/90 px-6 py-3 text-brown' : 'text-ivory'}`}>
                {scene.title}
              </h2>
              <p className={`mx-auto mt-3 max-w-md text-base md:text-lg ${isDoors ? 'text-brown' : 'text-ivory/90'}`}>
                <span className={isDoors ? 'rounded-full bg-ivory/90 px-4 py-1' : ''}>{scene.caption}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div data-hint className="absolute inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-1 text-sm text-brown md:bottom-10">
        <span className="rounded-full bg-ivory/90 px-4 py-1.5">{m.hall.hint}</span>
        <ChevronDownIcon className="h-5 w-5 motion-safe:animate-bounce" aria-hidden="true" />
      </div>

      <ol className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5 md:right-8" aria-hidden="true">
        {STEP_IDS.map((id, index) => (
          <li key={id} className={`h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-200 ease-out-soft ${index === active ? 'scale-150 bg-gold' : 'bg-ivory/60'}`} />
        ))}
      </ol>

      <div className="absolute inset-x-0 bottom-0 z-40 h-[3px] bg-ivory/20" aria-hidden="true">
        <div data-film-progress className="h-full origin-left scale-x-0 bg-gold" />
      </div>
    </section>
  );
}
