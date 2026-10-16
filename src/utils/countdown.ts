import { wedding } from '../data/wedding';

export type WeddingStatus = 'upcoming' | 'today' | 'past';

export interface CountdownValue {
  status: WeddingStatus;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const colomboFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: wedding.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

/** YYYY-MM-DD of `date` as seen in Asia/Colombo */
export function colomboDateKey(date: Date): string {
  return colomboFormatter.format(date);
}

export function getCountdown(now: Date): CountdownValue {
  const key = colomboDateKey(now);
  if (key === wedding.dateKey) return { status: 'today', days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (key > wedding.dateKey) return { status: 'past', days: 0, hours: 0, minutes: 0, seconds: 0 };

  const diff = Math.max(0, new Date(wedding.startISO).getTime() - now.getTime());
  const total = Math.floor(diff / 1000);
  return {
    status: 'upcoming',
    days: Math.floor(total / 86400),
    hours: Math.floor(total % 86400 / 3600),
    minutes: Math.floor(total % 3600 / 60),
    seconds: total % 60
  };
}

export function isRsvpPastDeadline(now: Date = new Date()): boolean {
  return now.getTime() > new Date(wedding.rsvp.deadlineISO).getTime();
}