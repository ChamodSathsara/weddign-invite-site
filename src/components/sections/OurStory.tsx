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
        {m.story.milestones.map((milestone, i) => {
          const right = i % 2 === 1;
          return (
            <Reveal as="li" key={milestone.date} delay={0.04 * i} className="relative pb-14 pl-12 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pb-20 md:pl-0">
              <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-ivory md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
                <JasmineFlower className="h-5 w-5" />
              </span>
              <div className={right ? 'md:col-start-2' : 'md:text-right'}>
                <p className="text-sm font-medium text-gold-deep">{milestone.date}</p>
                <h3 className="mt-1 font-serif text-3xl font-medium text-brown">{milestone.title}</h3>
                <p className="mt-3 leading-relaxed text-brown-soft">{milestone.body}</p>
              </div>
            </Reveal>);

        })}
      </ol>

      <Reveal className="mx-auto mt-16 max-w-3xl md:mt-20">
        <blockquote className="rounded-[28px] border border-gold-soft bg-champagne/55 px-7 py-8 text-center font-serif text-xl italic leading-relaxed text-brown shadow-[0_20px_55px_-38px_rgba(86,51,35,0.45)] md:px-12 md:py-10 md:text-2xl">
          {m.story.quote}
        </blockquote>
      </Reveal>

      <Gallery />
    </section>);

}
