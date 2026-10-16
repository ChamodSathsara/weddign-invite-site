import React from 'react';
import { HeartIcon } from 'lucide-react';
import { useI18n } from '../../contexts/LanguageContext';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownProps {
  align?: 'center' | 'start';
  size?: 'lg' | 'md';
}

export function Countdown({ align = 'center', size = 'lg' }: CountdownProps) {
  const { m } = useI18n();
  const c = useCountdown();
  const justify = align === 'center' ? 'justify-center' : 'justify-center md:justify-start';
  const textAlign = align === 'center' ? 'text-center' : 'text-center md:text-left';

  if (c.status !== 'upcoming') {
    return (
      <div className={`flex flex-col gap-1 ${textAlign}`} role="status">
        <p className={`inline-flex items-center gap-2 font-serif text-2xl text-brown md:text-3xl ${justify}`}>
          <HeartIcon className="h-5 w-5 fill-rose text-rose" aria-hidden="true" />
          {c.status === 'today' ? m.countdown.today : m.countdown.past}
        </p>
        {c.status === 'today' && <p className="text-brown-soft">{m.countdown.todayBody}</p>}
      </div>);

  }

  const units = [
  { value: c.days, label: m.countdown.days },
  { value: c.hours, label: m.countdown.hours },
  { value: c.minutes, label: m.countdown.minutes },
  { value: c.seconds, label: m.countdown.seconds }];


  return (
    <div role="timer" aria-label={m.countdown.label} className={textAlign}>
      <p className="text-sm text-brown-soft">{m.countdown.until}</p>
      <dl className={`mt-2 flex ${justify}`}>
        {units.map((unit, i) =>
        <div
          key={unit.label}
          className={`flex flex-col-reverse items-center px-3 sm:px-5 ${i > 0 ? 'border-l border-gold-soft' : ''} ${i === 0 && align === 'start' ? 'md:pl-0' : ''}`}>
          
            <dt className="mt-1 text-[11px] text-brown-soft sm:text-xs">{unit.label}</dt>
            <dd
            className={`font-serif tabular-nums leading-none text-brown ${size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}
            aria-hidden={unit.label === m.countdown.seconds ? 'true' : undefined}>
            
              {String(unit.value).padStart(2, '0')}
            </dd>
          </div>
        )}
      </dl>
    </div>);

}