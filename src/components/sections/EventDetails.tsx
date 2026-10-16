import React from 'react';
import { CalendarPlusIcon, ClockIcon, MapPinIcon, ShirtIcon, SparklesIcon, CalendarIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { timeline } from '../../data/timeline';
import { wedding } from '../../data/wedding';
import { downloadWeddingIcs } from '../../utils/calendar';
import { Reveal } from '../animation/Reveal';
import { SectionHeading } from './SectionHeading';
import { Countdown } from './Countdown';

export function EventDetails() {
  const { m, locale } = useI18n();

  const details = [
  { icon: CalendarIcon, label: m.event.dateLabel, value: m.event.dateValue },
  { icon: ClockIcon, label: m.event.timeLabel, value: m.event.timeValue },
  { icon: SparklesIcon, label: m.event.ceremonyLabel, value: m.event.ceremonyValue },
  { icon: MapPinIcon, label: m.event.venueLabel, value: m.event.venueValue },
  ...(wedding.dressCode ? [{ icon: ShirtIcon, label: m.event.dressCodeLabel, value: wedding.dressCode[locale] }] : [])];


  return (
    <section id="event" aria-labelledby="event-title" className="paper-texture relative bg-champagne/50 px-5 py-20 md:px-10 md:py-32">
      <SectionHeading id="event-title" title={m.event.title} subtitle={m.event.subtitle} />

      <div className="mx-auto mt-14 grid max-w-6xl gap-14 md:mt-20 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        {/* The date — the one thing guests need most */}
        <Reveal className="text-center md:text-left">
          <p className="font-serif text-2xl italic text-brown-soft">{m.event.weekday}</p>
          <p className="font-serif text-[9rem] font-medium leading-[0.85] text-gold md:text-[11rem]">{m.event.day}</p>
          <p className="mt-2 font-serif text-3xl text-brown md:text-4xl">{m.event.monthYear}</p>
          <div className="mt-8 border-t border-gold-soft pt-8">
            <Countdown align="start" size="md" />
          </div>
          <button
            type="button"
            onClick={() => downloadWeddingIcs(m.event.calendarTitle, m.event.venueValue)}
            className="mt-8 inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap rounded-full border border-gold px-6 text-[15px] text-brown transition-[background-color,transform] duration-150 ease-out-soft hover:bg-ivory active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            
            <CalendarPlusIcon className="h-4 w-4" aria-hidden="true" />
            {m.event.addToCalendar}
          </button>
        </Reveal>

        <div>
          <Reveal>
            <dl className="divide-y divide-gold-soft/70 border-y border-gold-soft/70">
              {details.map(({ icon: Icon, label, value }) =>
              <div key={label} className="flex items-start gap-4 py-4">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                  <div className="grid flex-1 gap-0.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                    <dt className="text-sm text-brown-soft sm:text-base">{label}</dt>
                    <dd className="font-serif text-xl text-brown">{value}</dd>
                  </div>
                </div>
              )}
            </dl>
          </Reveal>

          <Reveal className="mt-14">
            <h3 className="font-serif text-3xl font-medium text-brown">{m.event.timelineTitle}</h3>
            <ol className="relative mt-6 space-y-7 border-l border-gold-soft pl-7">
              {timeline.map((item) => {
                const copy = m.event.timeline[item.id];
                const highlight = item.id === 'poruwa';
                return (
                  <li key={item.id} className="relative">
                    <span
                      className={`absolute -left-[33px] top-2 h-2.5 w-2.5 rounded-full ${highlight ? 'bg-rose ring-4 ring-rose/20' : 'border border-gold bg-ivory'}`}
                      aria-hidden="true" />
                    
                    <p className={`font-serif text-lg ${item.time ? 'text-gold-deep' : 'italic text-brown-soft'}`}>
                      {item.time ? item.time[locale] : m.event.timeTba}
                    </p>
                    <p className={`font-serif text-2xl text-brown ${highlight ? 'font-semibold' : 'font-medium'}`}>{copy.title}</p>
                    <p className="mt-0.5 text-brown-soft">{copy.note}</p>
                  </li>);

              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>);

}