import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getLegalDocument } from "@/data/legal";
import { DEFAULT_LOCALE, getAlternateLanguageLinks, isLaunchLocale, localizePath } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const document = await getLegalDocument("terms-of-service", locale);
  const baseUrl = getSiteBaseUrl();
  const termsPath = "/terms";
  const localizedTermsPath = localizePath(termsPath, locale);
  const description =
    document?.intro ??
    "The terms that govern your use of Toolars: acceptable use, AI consent, your content, fees, and limitations.";

  return {
    metadataBase: new URL(baseUrl),
    title: document?.title ?? "Terms of Service",
    description,
    alternates: {
      canonical: localizedTermsPath,
      languages: Object.fromEntries(
        getAlternateLanguageLinks(termsPath, baseUrl).map((link) => [link.hreflang, link.href])
      )
    },
    openGraph: {
      type: "article",
      title: `${document?.title ?? "Terms of Service"} — Toolars`,
      description,
      url: localizedTermsPath
    }
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale: routeLocale } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const document = await getLegalDocument("terms-of-service", locale);
  if (!document) return null;
  return (
    <ToolarsShell active="none" sidebarVariant="none">
      <div className="page-grid legal-page">
        <LegalDocumentView document={document} />
      </div>
    </ToolarsShell>
  );
}
