export type TimelineId = 'arrival' | 'poruwa' | 'celebrations' | 'farewell';

export interface TimelineItem {
  id: TimelineId;
  /** null = time not yet announced */
  time: {en: string;si: string;} | null;
}

/** Add / reorder items here. Titles & notes live in the message dictionaries. */
export const timeline: TimelineItem[] = [
{ id: 'arrival', time: { en: '9:00 AM', si: 'පෙ.ව. 9:00' } },
{ id: 'poruwa', time: { en: '9:28 AM', si: 'පෙ.ව. 9:28' } },
{ id: 'celebrations', time: null },
{ id: 'farewell', time: { en: '3:30 PM', si: 'ප.ව. 3:30' } }];
