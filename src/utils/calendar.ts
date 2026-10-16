import { wedding } from '../data/wedding';

function toIcsUtc(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

export function downloadWeddingIcs(title: string, description: string) {
  const ics = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Samanali & Chamod//Wedding//EN',
  'CALSCALE:GREGORIAN',
  'BEGIN:VEVENT',
  `UID:samanali-chamod-wedding-${wedding.dateKey}@invitation`,
  `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
  `DTSTART:${toIcsUtc(wedding.startISO)}`,
  `DTEND:${toIcsUtc(wedding.endISO)}`,
  `SUMMARY:${escapeIcs(title)}`,
  `DESCRIPTION:${escapeIcs(`${description}\n${wedding.venue.mapsUrl}`)}`,
  `LOCATION:${escapeIcs(`${wedding.venue.name}, Piliyandala, Sri Lanka`)}`,
  'END:VEVENT',
  'END:VCALENDAR'].
  join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'samanali-chamod-wedding.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}