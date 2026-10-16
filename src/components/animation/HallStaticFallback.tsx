import React from 'react';
import { useI18n } from '../../contexts/LanguageContext';
import { hallScenes } from '../../data/hallScenes';
import { Reveal } from './Reveal';

/** Lightweight version for reduced-motion users and low-power devices. */
export function HallStaticFallback() {
  const { m } = useI18n();
  return (
    <section aria-label={m.hall.label} className="paper-texture bg-champagne/50 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-medium text-brown md:text-5xl">{m.hall.scenes.doors.title}</h2>
          <p className="mt-3 text-brown-soft">{m.hall.scenes.doors.caption}</p>
        </div>
        <ol className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
          {hallScenes.map((scene, i) =>
          <Reveal as="li" key={scene.id} className={i === hallScenes.length - 1 ? 'md:col-span-2' : ''}>
              <figure>
                <div className="overflow-hidden rounded-[22px] border border-gold-soft bg-champagne">
                  <img
                  src={scene.src}
                  alt=""
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] h-auto w-full scale-[1.06] object-cover" />
                
                </div>
                <figcaption className="mt-4 text-center">
                  <span className="block font-serif text-2xl font-medium text-brown">{m.hall.scenes[scene.id].title}</span>
                  <span className="mt-1 block text-brown-soft">{m.hall.scenes[scene.id].caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          )}
        </ol>
      </div>
    </section>);

}