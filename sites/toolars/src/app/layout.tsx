/**
 * Root layout. The <html>/<body> and all site chrome (footer, cookie consent
 * banner) live in app/[locale]/layout.tsx so the <html lang> attribute can be
 * driven by the active locale. This root layout is a passthrough required by
 * the App Router so that special files (sitemap/robots/manifest/api) and the
 * [locale] segment both resolve.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
