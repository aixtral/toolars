import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer, Header } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'toolars',
  description: 'Search-first calculators and AI content tools.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
