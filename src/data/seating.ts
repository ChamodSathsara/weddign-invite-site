export interface SeatAssignment {
  id: string;
  table: number;
  seat: number;
  name: string;
}

export const TABLE_COUNT = 10;
export const SEATS_PER_TABLE = 15;

/** Replace these placeholders with the final guest list in seating order. */
export const guestNames = Array.from(
  { length: TABLE_COUNT * SEATS_PER_TABLE },
  (_, index) => `Guest ${String(index + 1).padStart(3, '0')}`
);

export const seatingAssignments: SeatAssignment[] = guestNames.map((name, index) => {
  const table = Math.floor(index / SEATS_PER_TABLE) + 1;
  const seat = index % SEATS_PER_TABLE + 1;
  return { id: `T${table}S${seat}`, table, seat, name };
});

export const seatingByTable = Array.from({ length: TABLE_COUNT }, (_, index) => ({
  table: index + 1,
  seats: seatingAssignments.slice(index * SEATS_PER_TABLE, (index + 1) * SEATS_PER_TABLE)
}));
