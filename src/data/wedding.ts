/**
 * Single source of truth for wedding facts & configuration.
 * Edit here — every section reads from this file.
 */
export const wedding = {
  bride: { en: 'Samanali', si: 'සමනලී' },
  groom: { en: 'Chamod', si: 'චමෝද්' },
  timezone: 'Asia/Colombo',
  /** Calendar date of the wedding in Asia/Colombo (YYYY-MM-DD) */
  dateKey: '2027-01-20',
  startISO: '2027-01-20T09:00:00+05:30',
  ceremonyISO: '2027-01-20T09:28:00+05:30',
  endISO: '2027-01-20T15:30:00+05:30',
  venue: {
    name: 'Deandra Bolgoda',
    mapsUrl: 'https://maps.app.goo.gl/QqE7RFdvgZZpawfr8',
    /** Only set when you have a verified Google Maps embed URL for the exact venue. */
    mapEmbedUrl: null as string | null
  },
  contacts: [
    { name: 'Chamod', display: '075 880 6437', phone: '+94758806437' },
    { name: 'Samanali', display: '071 180 2628', phone: '+94711802628' }
  ],
  /** Leave null to hide the dress code row entirely. */
  dressCode: null as null | {en: string;si: string;},
  rsvp: {
    deadlineISO: '2026-12-01T23:59:59+05:30',
    /** 'close' = form closes after deadline · 'allowLate' = still accepts, with a notice */
    deadlineMode: 'close' as 'close' | 'allowLate',
    maxGuests: 6,
    /**
     * Your RSVP API (see docs/BACKEND.md). While null, the form runs in clearly
     * labelled preview mode and only stores the response on the guest's device.
     */
    endpoint: null as string | null
  }
};

export const assets = {
  couple: "/Romantic_South_Asian_Wedding_Portrait.png",

  venue: "/venue-wedding-hall.png",

  introVideo: "/Couple_creating_wedding_cartoon_\u2026_20261017003218.mp4",

  /**
   * Licensed instrumental track (e.g. /audio/wedding-theme.mp3).
   * While null, an original, softly generated music-box melody plays instead.
   */
  music: null as string | null
};
