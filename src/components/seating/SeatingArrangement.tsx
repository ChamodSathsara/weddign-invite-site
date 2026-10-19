'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftIcon, SearchIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { seatingAssignments, seatingByTable, type SeatAssignment } from '../../data/seating';
import { sanitizeGuestName } from '../../utils/guest';

const normalize = (value: string) => value.trim().toLocaleLowerCase();

function TableMap({
  table,
  seats,
  selected,
  onSelect,
  tableRef
}: {
  table: number;
  seats: SeatAssignment[];
  selected: string | null;
  onSelect: (seat: SeatAssignment) => void;
  tableRef?: (element: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={tableRef}
      className={`relative rounded-[28px] border bg-ivory p-3 shadow-[0_18px_50px_-35px_rgba(86,51,35,0.45)] transition-colors duration-300 ${
        seats.some((seat) => seat.id === selected) ? 'border-gold bg-champagne/55' : 'border-gold-soft/70'
      }`}
    >
      <svg viewBox="0 0 280 280" className="mx-auto block w-full max-w-[310px]" role="group" aria-label={`Table ${table}`}>
        <circle cx="140" cy="140" r="62" fill="#F3E7D0" stroke="#B88A44" strokeWidth="2" />
        <circle cx="140" cy="140" r="52" fill="none" stroke="#D9BE8C" strokeWidth="1" strokeDasharray="3 5" />
        <text x="140" y="135" textAnchor="middle" className="fill-brown font-serif text-[19px] font-semibold">
          TABLE
        </text>
        <text x="140" y="158" textAnchor="middle" className="fill-gold-deep font-serif text-[25px] font-semibold">
          {table}
        </text>

        {seats.map((seat, index) => {
          const angle = -Math.PI / 2 + index * (Math.PI * 2 / seats.length);
          const x = 140 + Math.cos(angle) * 105;
          const y = 140 + Math.sin(angle) * 105;
          const isSelected = selected === seat.id;
          return (
            <g
              key={seat.id}
              role="button"
              tabIndex={0}
              aria-label={`${seat.name}, Table ${seat.table}, Seat ${seat.seat}`}
              onClick={() => onSelect(seat)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(seat);
              }}
              className="cursor-pointer outline-none"
            >
              {isSelected && <circle cx={x} cy={y} r="21" fill="none" stroke="#B88A44" strokeWidth="3" className="animate-pulse" />}
              <circle cx={x} cy={y} r="16" fill={isSelected ? '#563323' : '#FFF9EF'} stroke={isSelected ? '#B88A44' : '#D9BE8C'} strokeWidth="2" />
              <text x={x} y={y + 3.5} textAnchor="middle" className={`pointer-events-none text-[9px] font-semibold ${isSelected ? 'fill-ivory' : 'fill-brown'}`}>
                S{seat.seat}
              </text>
              <title>{`${seat.name} — ${seat.id}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SeatingArrangement() {
  const params = useSearchParams();
  const personalizedName = sanitizeGuestName(params?.get('name') ?? null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SeatAssignment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const tableRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const personalizedSelectionDone = useRef(false);

  const suggestions = useMemo(() => {
    const value = normalize(query);
    if (!value) return [];
    return seatingAssignments
      .filter((guest) => normalize(guest.name).includes(value) || normalize(guest.id).includes(value))
      .slice(0, 6);
  }, [query]);

  const chooseGuest = (guest: SeatAssignment) => {
    setSelected(guest);
    setQuery(guest.name);
    setNotFound(false);
    window.setTimeout(() => tableRefs.current[guest.table]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  useEffect(() => {
    if (personalizedSelectionDone.current || !personalizedName) return;
    personalizedSelectionDone.current = true;
    const match = seatingAssignments.find((guest) => normalize(guest.name) === normalize(personalizedName));
    setQuery(personalizedName);
    if (!match) return;
    setSelected(match);
    window.setTimeout(() => tableRefs.current[match.table]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
  }, [personalizedName]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = normalize(query);
    const match = seatingAssignments.find((guest) => normalize(guest.name) === value || normalize(guest.id) === value)
      ?? seatingAssignments.find((guest) => normalize(guest.name).includes(value));
    if (match && value) chooseGuest(match);
    else {
      setSelected(null);
      setNotFound(true);
    }
  };

  return (
    <main className="paper-texture min-h-screen bg-ivory text-brown">
      <header className="sticky top-0 z-[60] border-b border-gold-soft/70 bg-champagne/95 px-5 py-4 shadow-sm backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href={personalizedName ? `/?name=${encodeURIComponent(personalizedName)}` : '/'} className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-sm text-brown transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Invitation
          </Link>
          <p className="font-serif text-xl text-gold-deep md:text-2xl">Samanali &amp; Chamod</p>
        </div>
      </header>

      <section className="px-5 pb-10 pt-12 text-center md:px-10 md:pt-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold-deep">20 January 2027</p>
          <h1 className="mt-3 font-serif text-[2.8rem] font-medium leading-tight md:text-6xl">Seating Arrangement</h1>
          <p className="mx-auto mt-4 max-w-xl text-brown-soft">ඔබගේ නම හෝ seat ID එක search කර, ඔබට වෙන් කළ table එක සහ seat එක සොයාගන්න.</p>
        </div>

        <div className="sticky top-[76px] z-50 mx-auto mt-9 max-w-2xl rounded-[26px] border border-gold-soft bg-ivory/95 p-3 shadow-[0_18px_55px_-28px_rgba(86,51,35,0.45)] backdrop-blur">
          <form onSubmit={handleSearch} className="flex gap-2">
            <label htmlFor="guest-search" className="sr-only">Search guest name or seat ID</label>
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-deep" aria-hidden="true" />
              <input
                id="guest-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setNotFound(false);
                }}
                autoComplete="off"
                placeholder="Guest name or T1S1"
                className="min-h-[52px] w-full rounded-2xl border border-gold-soft bg-white/80 py-3 pl-12 pr-4 text-base outline-none transition-shadow focus:ring-2 focus:ring-gold/40"
              />
            </div>
            <button type="submit" className="min-h-[52px] shrink-0 rounded-2xl bg-brown px-5 font-medium text-ivory transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              Search
            </button>
          </form>

          {query && suggestions.length > 0 && (!selected || query !== selected.name) && (
            <ul className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-gold-soft bg-white p-1 text-left shadow-lg">
              {suggestions.map((guest) => (
                <li key={guest.id}>
                  <button type="button" onClick={() => chooseGuest(guest)} className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left hover:bg-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                    <span>{guest.name}</span>
                    <span className="font-mono text-xs text-gold-deep">{guest.id}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[70] mx-auto grid max-w-xl grid-cols-2 gap-2 rounded-[24px] border border-gold bg-brown p-3 text-ivory shadow-[0_20px_70px_rgba(35,16,10,0.48)] md:grid-cols-[1fr_auto_auto] md:items-center md:gap-3 md:p-4 md:text-left" role="status" aria-live="polite">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Seat found</p>
              <p className="mt-0.5 font-serif text-xl md:text-2xl">{selected.name}</p>
              <p className="mt-0.5 font-mono text-xs text-ivory/70">{selected.id}</p>
            </div>
            <div className="rounded-2xl bg-ivory/10 px-4 py-2 text-center md:px-5 md:py-3">
              <span className="block text-xs text-gold-soft">TABLE</span>
              <strong className="font-serif text-2xl md:text-3xl">{selected.table}</strong>
            </div>
            <div className="rounded-2xl bg-gold px-4 py-2 text-center text-brown md:px-5 md:py-3">
              <span className="block text-xs">SEAT</span>
              <strong className="font-serif text-2xl md:text-3xl">{selected.seat}</strong>
            </div>
          </div>
        )}

        {notFound && <p className="mx-auto mt-5 max-w-xl rounded-2xl bg-rose/10 px-5 py-3 text-rose">නම හමු නොවීය. කරුණාකර spelling එක හෝ seat ID එක පරීක්ෂා කරන්න.</p>}
      </section>

      <section aria-label="Wedding hall seating map" className="mx-auto max-w-6xl px-4 pb-24 md:px-10">
        <div className="rounded-t-[80px] border border-gold bg-champagne/65 px-5 py-7 text-center shadow-sm">
          <SparklesIcon className="mx-auto h-5 w-5 text-gold-deep" aria-hidden="true" />
          <p className="mt-1 font-serif text-2xl font-medium md:text-3xl">Wedding Stage · පෝරුව</p>
        </div>

        <div className="mx-auto h-12 w-px bg-gold-soft md:h-16" aria-hidden="true" />
        <div className="relative rounded-[34px] border border-gold-soft bg-white/55 px-3 py-8 md:px-8 md:py-12">
          <div className="pointer-events-none absolute bottom-10 left-1/2 top-10 hidden w-20 -translate-x-1/2 rounded-full border-x border-dashed border-gold-soft/80 bg-champagne/20 md:block" aria-hidden="true" />
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-x-28 md:gap-y-10">
            {seatingByTable.map(({ table, seats }) => (
              <TableMap
                key={table}
                table={table}
                seats={seats}
                selected={selected?.id ?? null}
                onSelect={chooseGuest}
                tableRef={(element) => { tableRefs.current[table] = element; }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-sm items-center justify-center gap-3 rounded-b-[34px] border-x border-b border-gold-soft bg-champagne/60 px-5 py-5 text-center">
          <UsersIcon className="h-5 w-5 text-gold-deep" aria-hidden="true" />
          <span className="font-medium">Entrance · ප්‍රවේශය</span>
        </div>
      </section>
    </main>
  );
}
