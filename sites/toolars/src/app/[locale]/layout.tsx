import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { PostHogProviderWrapper } from "@/components/analytics/posthog-provider";
import { CookieConsentBanner } from "@/components/consent/cookie-consent-banner";
import { SiteFooter } from "@/components/shell/site-footer";
import { LAUNCH_LOCALES, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { getAlternateLanguageLinks } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

const SITE_NAME = "Toolars";
const SITE_DESCRIPTION =
  "Toolars unifies traditional calculators, AI tools, and repeatable workflows into one search-first workspace. Local-first, AI clearly labeled, free to start.";

export function generateStaticParams() {
  return LAUNCH_LOCALES.map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : "en";
  const baseUrl = getSiteBaseUrl();
  const localizedPath = localizePath("/", localeCode);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${SITE_NAME} — All tools. One workspace.`,
      template: `%s · ${SITE_NAME}`
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
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
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: localizedPath,
      languages: Object.fromEntries(
        getAlternateLanguageLinks("/", baseUrl).map((link) => [link.hreflang, link.href])
      )
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: localeCode,
      title: `${SITE_NAME} — All tools. One workspace.`,
      description: SITE_DESCRIPTION,
      url: localizedPath
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — All tools. One workspace.`,
      description: SITE_DESCRIPTION
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
      icon: "/favicon.svg"
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
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : "en";
  const hreflang = LAUNCH_LOCALES.find((entry) => entry.code === localeCode)?.hreflang ?? localeCode;

  // Enable static rendering for this locale.
  setRequestLocale(localeCode);

  const messages = await getMessages();

  return (
    <html lang={hreflang}>
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
