export type Attendance = 'accept' | 'decline';

export interface RsvpPayload {
  fullName: string;
  attending: Attendance;
  /** 0 when declining */
  guests: number;
}

export interface SavedRsvp extends RsvpPayload {
  updatedAt: string;
}

export type RsvpErrorCode = 'generic' | 'rate' | 'network' | 'closed' | 'validation' | 'invalidToken';

export type RsvpResult =
{ok: true;data: SavedRsvp;} |
{ok: false;code: RsvpErrorCode;};