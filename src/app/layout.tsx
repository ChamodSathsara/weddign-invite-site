import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../index.css';

export const metadata: Metadata = {
  title: 'Samanali & Chamod — Wedding Invitation',
  description: 'You are warmly invited to celebrate the wedding of Samanali and Chamod.',
  openGraph: {
    type: 'website',
    title: 'Samanali & Chamod — Wedding Invitation',
    description: 'You are warmly invited to celebrate the wedding of Samanali and Chamod.',
    images: ['/Romantic_South_Asian_Wedding_Portrait.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samanali & Chamod — Wedding Invitation',
    description: 'You are warmly invited to celebrate the wedding of Samanali and Chamod.',
    images: ['/Romantic_South_Asian_Wedding_Portrait.png']
  }
};

export const viewport: Viewport = {
  themeColor: '#FFF9EF',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
