import React from 'react';
import { useI18n } from '../../contexts/LanguageContext';
import { Reveal } from '../animation/Reveal';
import { JasmineFlower } from '../animation/JasmineFlower';
import { SectionHeading } from './SectionHeading';
import { Gallery } from './Gallery';

export function OurStory() {
  const { m } = useI18n();

  return (
    <section id="story" aria-labelledby="story-title" className="relative bg-ivory px-5 py-20 md:px-10 md:py-32">
      <SectionHeading id="story-title" title={m.story.title} subtitle={m.story.subtitle} />

      <ol className="relative mx-auto mt-14 max-w-4xl md:mt-20">
        <span className="absolute bottom-2 left-[15px] top-2 w-px bg-gold-soft md:left-1/2" aria-hidden="true" />
        {m.story.milestones.map((title, i) => {
          const right = i % 2 === 1;
          return (
            <Reveal as="li" key={title} delay={0.04 * i} className="relative pb-12 pl-12 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-ivory md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
                <JasmineFlower className="h-5 w-5" />
              </span>
              <div className={right ? 'md:col-start-2' : 'md:text-right'}>
                <p className="text-sm italic text-gold-deep">{m.story.placeholderDate}</p>
                <h3 className="mt-1 font-serif text-3xl font-medium text-brown">{title}</h3>
                <p className="mt-2 text-brown-soft">{m.story.placeholderBody}</p>
              </div>
            </Reveal>);

        })}
      </ol>

      <Gallery />
    </section>);

}