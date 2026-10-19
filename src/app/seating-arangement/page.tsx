import type { Metadata } from 'next';
import { SeatingArrangement } from '../../components/seating/SeatingArrangement';

export const metadata: Metadata = {
  title: 'Seating Arrangement — Samanali & Chamod',
  description: 'Find your table and seat for the wedding of Samanali and Chamod.'
};

export default function SeatingArrangementPage() {
  return <SeatingArrangement />;
}
