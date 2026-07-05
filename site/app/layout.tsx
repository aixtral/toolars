import type { ReactNode } from 'react';

/**
 * Root layout — a thin passthrough.
 *
 * The <html> and <body> tags live in app/[locale]/layout.tsx because the
 * `lang` attribute is locale-dependent. This file exists only so Next.js has
 * a root layout; it renders children directly. API routes and the locale
 * segment both hang off app/ and neither needs html here.
 *
 * Note: globals.css is imported from app/[locale]/layout.tsx so the styles
 * are bundled with the locale-aware shell.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
