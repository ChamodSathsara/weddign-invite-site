import React from 'react';
import { ExternalLinkIcon, NavigationIcon, ShieldCheckIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { assets, wedding } from '../../data/wedding';
import { Reveal } from '../animation/Reveal';
import { OrnamentDivider } from '../animation/OrnamentDivider';
import { GoldCorners } from '../animation/GoldCorners';

export function Venue() {
  const { m } = useI18n();
  return (
    <section id="location" aria-labelledby="location-title" className="relative bg-ivory px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal className="text-center md:text-left">
          <h2 id="location-title" className="font-serif text-[2.6rem] font-medium leading-tight text-brown outline-none md:text-6xl">
            {m.venue.title}
          </h2>
          <OrnamentDivider className="mt-4" align="start" />
          <p className="mt-6 text-brown-soft">{m.venue.subtitle}</p>
          <p className="mt-2 font-serif text-4xl text-gold-deep md:text-5xl">{wedding.venue.name}</p>
          <p className="mt-1 font-serif text-xl text-brown">{m.venue.address}</p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href={wedding.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brown px-7 text-[15px] font-medium text-ivory transition-[transform,background-color] duration-150 ease-out-soft hover:bg-[#4a2b1e] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:w-auto">
              
              <NavigationIcon className="h-4 w-4" aria-hidden="true" />
              {m.venue.directions}
              <span className="sr-only">{m.venue.newTab}</span>
            </a>
            <a
              href={wedding.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gold px-7 text-[15px] text-brown transition-[transform,background-color] duration-150 ease-out-soft hover:bg-champagne active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-auto">
              
              <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
              {m.venue.openMaps}
              <span className="sr-only">{m.venue.newTab}</span>
            </a>
          </div>

          <p className="mx-auto mt-6 flex max-w-sm items-start gap-2 text-left text-sm text-brown-soft md:mx-0">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
            {m.venue.privacy}
          </p>
        </Reveal>

        <Reveal>
          {wedding.venue.mapEmbedUrl ?
          <div className="relative overflow-hidden rounded-[26px] border border-gold-soft">
              <iframe
              src={wedding.venue.mapEmbedUrl}
              title={wedding.venue.name}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full" />
            
            </div> :

          <figure className="relative">
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[26px] border border-gold bg-champagne">
                <img
                src={assets.venue}
                alt={m.venue.imageAlt}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover" />
              
                <GoldCorners className="opacity-80" />
              </div>
              <figcaption className="mt-3 text-center text-xs italic text-brown-soft">{m.venue.imageCaption}</figcaption>
            </figure>
          }
        </Reveal>
      </div>
    </section>);

}
