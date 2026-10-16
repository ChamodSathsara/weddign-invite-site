import React from 'react';
import { ImageIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { gallery } from '../../data/gallery';
import { fmt } from '../../utils/format';
import { Reveal } from '../animation/Reveal';

const LAYOUT = [
'col-span-2 md:col-span-1 md:row-span-2 aspect-[2/3] md:aspect-auto',
'aspect-square',
'aspect-square',
'col-span-2 aspect-[2/1]'];


export function Gallery() {
  const { m } = useI18n();
  return (
    <div className="mx-auto mt-24 max-w-5xl md:mt-32">
      <h3 className="text-center font-serif text-4xl font-medium text-brown md:text-5xl">{m.gallery.title}</h3>
      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-5">
        {gallery.map((photo, i) =>
        <Reveal as="li" key={photo.id} delay={0.04 * i} className={LAYOUT[i] ?? 'aspect-square'}>
            {photo.src ?
          <figure className="h-full overflow-hidden rounded-[22px] border border-gold-soft bg-champagne">
                <img
              src={photo.src}
              alt={m.gallery.coupleAlt}
              width={1024}
              height={1536}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top" />
            
              </figure> :

          <figure className="flex h-full flex-col items-center justify-center gap-2 rounded-[22px] border border-dashed border-gold/60 bg-champagne/60 p-4 text-center">
                <ImageIcon className="h-6 w-6 text-gold-deep" aria-hidden="true" />
                <figcaption>
                  <span className="block text-sm font-medium text-brown">{m.gallery.placeholder}</span>
                  <span className="mt-0.5 block break-all font-mono text-[11px] text-brown-soft">
                    {fmt(m.gallery.placeholderHint, { file: photo.file })}
                  </span>
                </figcaption>
              </figure>
          }
          </Reveal>
        )}
      </ul>
    </div>);

}