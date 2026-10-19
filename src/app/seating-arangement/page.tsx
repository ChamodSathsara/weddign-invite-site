import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SeatingArrangement } from '../../components/seating/SeatingArrangement';

export const metadata: Metadata = {
  title: 'Seating Arrangement — Samanali & Chamod',
  description: 'Find your table and seat for the wedding of Samanali and Chamod.'
};

export default function SeatingArrangementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <SeatingArrangement />
    </Suspense>
  );
}
