import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { Download, FileText, Table2, Workflow } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import { pdfTools } from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { buildItemListSchema } from "@/lib/seo/json-ld";
import { buildLocalizedPageMetadata } from "@/lib/seo/localized-page-metadata";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

const chipKeys = ["allPdf", "mergeSplit", "compress", "convert", "summarize", "extractData", "signProtect"] as const;
const featuredResourceKeys = ["summary", "tables", "merge"] as const;
const pdfDirectoryToolCount = 128;
const recommendedStepKeys = ["extractContent", "aiSummarize", "exportShare"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedPageMetadata({ locale, page: "pdfDirectory" });
}

export default function PdfDirectoryPage() {
  const t = useTranslations("directories.pdf");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => (href.startsWith("#") ? href : localizePath(href, localeCode));
  const pdfListSchema = buildItemListSchema(
    { name: t("title"), path: "/explore/pdf" },
    pdfTools,
    getSiteBaseUrl()
  );
  const featuredResources = [
    {
      href: "/workflows/pdf-summary",
      icon: <Workflow size={20} aria-hidden="true" />
    },
    {
      href: "/workflows/pdf-summary",
      icon: <Table2 size={20} aria-hidden="true" />
    },
    {
      href: "/tools/pdf-toolkit",
      icon: <Download size={20} aria-hidden="true" />
    }
  ] as const;
  const recommendedSteps = [
    {
      href: "/tools/pdf-toolkit",
      icon: <FileText size={20} aria-hidden="true" />
    },
    {
      href: "/workflows/pdf-summary",
      icon: <Workflow size={20} aria-hidden="true" />
    },
    {
      href: "/tools/pdf-toolkit",
      icon: <Download size={20} aria-hidden="true" />
    }
  ] as const;

  return (
    <>
      <JsonLd schema={pdfListSchema} />
      <ToolarsShell active="pdf">
        <div className="page-grid pdf-directory-page" data-pdf-directory-layout="desktop-market-v2">
        <div>
          <section className="section">
            <p className="subtitle">{t("eyebrow")}</p>
            <h1 className="title">{t("heroTitle")}</h1>
            <p className="subtitle">{t("heroSubtitle")}</p>

            <div className="directory-toolbar">
              <input className="input-like" defaultValue={t("toolbar.defaultSearch")} aria-label={t("toolbar.searchLabel")} />
              <select className="select-like" aria-label={t("toolbar.platformLabel")}>
                <option>{t("toolbar.allPlatforms")}</option>
              </select>
              <select className="select-like" aria-label={t("toolbar.sortLabel")}>
                <option>{t("toolbar.sortTrending")}</option>
              </select>
              <button className="button button-outline" type="button">
                {t("toolbar.filters")}
              </button>
            </div>

            <div className="chip-row">
              {chipKeys.map((key, index) => (
                <span className={`chip ${index === 0 ? "active" : ""}`} key={key}>
                  {t(`chips.${key}`)}
                </span>
              ))}
            </div>
          </section>

          <section className="workflow-strip pdf-directory-featured" aria-label={t("featured.ariaLabel")}>
            <div className="pdf-directory-featured-head">{t("featured.title")}</div>
            {featuredResources.map((resource, index) => {
              const key = featuredResourceKeys[index];

              return (
                <ResourceCard
                  description={t(`featured.resources.${key}.description`)}
                  href={localizedHref(resource.href)}
                  icon={resource.icon}
                  key={key}
                  meta={t(`featured.resources.${key}.meta`)}
                  title={t(`featured.resources.${key}.title`)}
                />
              );
            })}
          </section>

          <section className="section">
            <h2>{t("results.toolsFound", { count: pdfDirectoryToolCount })}</h2>
            <div className="tool-grid pdf-directory-tool-grid">
              {pdfTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>{t("recommended.title")}</h2>
            <div className="resource-list">
              {recommendedSteps.map((step, index) => {
                const key = recommendedStepKeys[index];

                return (
                  <ResourceCard
                    description={t(`recommended.steps.${key}.description`)}
                    href={localizedHref(step.href)}
                    icon={step.icon}
                    key={key}
                    meta={`${index + 1}`}
                    title={t(`recommended.steps.${key}.title`)}
                  />
                );
              })}
            </div>
          </section>
          <section className="panel">
            <h2>{t("trust.title")}</h2>
            <p className="tool-description">{t("trust.description")}</p>
          </section>
        </aside>
        </div>
      </ToolarsShell>
    </>
  );
}
