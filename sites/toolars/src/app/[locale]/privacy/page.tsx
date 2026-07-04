import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { getLegalDocument } from "@/data/legal";
import { DEFAULT_LOCALE, getAlternateLanguageLinks, isLaunchLocale, localizePath } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const document = await getLegalDocument("privacy-policy", locale);
  const baseUrl = getSiteBaseUrl();
  const privacyPath = "/privacy";
  const localizedPrivacyPath = localizePath(privacyPath, locale);
  const description =
    document?.intro ??
    "How Toolars collects, uses, and protects your information. Local-first processing, explicit AI consent, and your GDPR and CCPA data rights.";

  return {
    metadataBase: new URL(baseUrl),
    title: document?.title ?? "Privacy Policy",
    description,
    alternates: {
      canonical: localizedPrivacyPath,
      languages: Object.fromEntries(
        getAlternateLanguageLinks(privacyPath, baseUrl).map((link) => [link.hreflang, link.href])
      )
    },
    openGraph: {
      type: "article",
      title: `${document?.title ?? "Privacy Policy"} — Toolars`,
      description,
      url: localizedPrivacyPath
    }
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale: routeLocale } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const document = await getLegalDocument("privacy-policy", locale);
  if (!document) return null;
  return (
    <ToolarsShell active="none" sidebarVariant="none">
      <div className="page-grid legal-page">
        <LegalDocumentView document={document} />
      </div>
    </ToolarsShell>
  );
}
