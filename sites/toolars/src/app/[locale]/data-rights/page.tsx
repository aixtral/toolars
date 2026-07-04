import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DEFAULT_LOCALE, getAlternateLanguageLinks, isLaunchLocale, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

const DATA_RIGHT_KEYS = ["access", "delete", "optOut", "portability"] as const;

const dataRightHrefs: Record<(typeof DATA_RIGHT_KEYS)[number], string> = {
  access: "mailto:privacy@toolars.app?subject=Data Access Request",
  delete: "mailto:privacy@toolars.app?subject=Data Deletion Request",
  optOut: "mailto:privacy@toolars.app?subject=Do Not Sell My Personal Information",
  portability: "mailto:privacy@toolars.app?subject=Data Portability Request"
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const t = await getTranslations({ locale, namespace: "dataRights" });
  const baseUrl = getSiteBaseUrl();
  const dataRightsPath = "/data-rights";

  return {
    metadataBase: new URL(baseUrl),
    title: t("metadata.title"),
    description: t("metadata.description"),
    alternates: {
      canonical: localizePath(dataRightsPath, locale),
      languages: Object.fromEntries(
        getAlternateLanguageLinks(dataRightsPath, baseUrl).map((link) => [link.hreflang, link.href])
      )
    },
    robots: { index: true, follow: true }
  };
}

export default function DataRightsPage() {
  const t = useTranslations("dataRights");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  return (
    <ToolarsShell active="none" sidebarVariant="none">
      <div className="page-grid data-rights-page">
        <article className="legal-document">
          <header className="legal-document-header">
            <h1 className="title">{t("title")}</h1>
            <p className="legal-intro">{t("intro")}</p>
          </header>

          <div className="data-rights-grid">
            {DATA_RIGHT_KEYS.map((rightKey) => (
              <section className="data-rights-card" key={rightKey}>
                <h2>{t(`rights.${rightKey}.title`)}</h2>
                <p className="tool-description">{t(`rights.${rightKey}.description`)}</p>
                <a className="button button-outline" href={dataRightHrefs[rightKey]}>
                  {t(`rights.${rightKey}.action`)}
                </a>
              </section>
            ))}
          </div>

          <section className="legal-section">
            <h2>{t("expect.title")}</h2>
            <p>{t("expect.description")}</p>
            <p>
              {t("settings.prefix")}{" "}
              <a href={localizePath("/settings", localeCode)}>{t("settings.linkText")}</a>
              {t("settings.suffix")}
            </p>
          </section>
        </article>
      </div>
    </ToolarsShell>
  );
}
