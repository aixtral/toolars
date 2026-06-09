import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer, Header } from '@/components/layout';
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  serializeJsonLd,
} from '@/lib/seo';
import './globals.css';

const SITE_URL = 'https://toolars.com';
const SITE_TITLE = 'toolars | Free Calculators and AI Tools';
const SITE_DESCRIPTION =
  'Search 73 free calculators and account-based AI tools from one fast utility dashboard.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'toolars',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

const siteJsonLd = [buildOrganizationSchema(SITE_URL), buildWebSiteSchema(SITE_URL)];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {siteJsonLd.map((schema) => (
          <script
            key={schema['@type']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
          />
        ))}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
