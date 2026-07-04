import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PostHogProviderWrapper } from "@/components/analytics/posthog-provider";
import { CookieConsentBanner } from "@/components/consent/cookie-consent-banner";
import { SiteFooter } from "@/components/shell/site-footer";
import { LAUNCH_LOCALES, getLocaleDirection, isLaunchLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { getAlternateLanguageLinks } from "@/lib/i18n";
import { TOOLARS_FAVICON_URL } from "@/lib/seo/brand-icons";
import { getLocalizedSiteMetadataCopy } from "@/lib/seo/localized-page-metadata";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export function generateStaticParams() {
  return LAUNCH_LOCALES.map((locale) => ({ locale: locale.code }));
}

export function resolveLayoutLocale(locale: string): {
  localeCode: LocaleCode;
  hreflang: string;
  dir: ReturnType<typeof getLocaleDirection>;
} {
  if (!isLaunchLocale(locale)) notFound();

  const localeCode: LocaleCode = locale;
  const hreflang = LAUNCH_LOCALES.find((entry) => entry.code === localeCode)?.hreflang ?? localeCode;
  const dir = getLocaleDirection(localeCode);

  return { localeCode, hreflang, dir };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { localeCode } = resolveLayoutLocale(locale);
  const baseUrl = getSiteBaseUrl();
  const localizedPath = localizePath("/", localeCode);
  const { siteName, tagline, description } = getLocalizedSiteMetadataCopy(localeCode);
  const defaultTitle = `${siteName} — ${tagline}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: `%s · ${siteName}`
    },
    description,
    applicationName: siteName,
    keywords: [
      "online tools",
      "free calculators",
      "AI tools",
      "PDF tools",
      "JSON tools",
      "developer tools",
      "prompt engineering",
      "LLM cost calculator",
      "MCP server builder",
      "workflow automation"
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: localizedPath,
      languages: Object.fromEntries(
        getAlternateLanguageLinks("/", baseUrl).map((link) => [link.hreflang, link.href])
      )
    },
    openGraph: {
      type: "website",
      siteName,
      locale: localeCode,
      title: defaultTitle,
      description,
      url: localizedPath
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    icons: {
      icon: [
        {
          url: TOOLARS_FAVICON_URL,
          type: "image/svg+xml"
        }
      ]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { localeCode, hreflang, dir } = resolveLayoutLocale(locale);

  // Enable static rendering for this locale.
  setRequestLocale(localeCode);

  const messages = await getMessages();

  return (
    <html lang={hreflang} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PostHogProviderWrapper>
            {children}
          </PostHogProviderWrapper>
          <SiteFooter />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
