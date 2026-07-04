import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FolderSearch, Workflow } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import {
  exploreCategorySlugs,
  getCategoryHref,
  getCategoryLabelBySlug,
  getPublicToolsByCategory,
  workflows
} from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

export function generateStaticParams() {
  return exploreCategorySlugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabelBySlug(category);
  if (!label) return {};

  const title = `${label} tools — Toolars`;
  const description = `Browse Toolars ${label.toLowerCase()} tools with local-first processing, clear AI consent labels, and reusable workflows.`;

  return {
    title,
    description,
    alternates: { canonical: getCategoryHref(label) },
    openGraph: {
      type: "website",
      title,
      description,
      url: getCategoryHref(label)
    }
  };
}

export default async function ExploreCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = getCategoryLabelBySlug(category);

  if (!label) notFound();

  return (
    <ExploreCategoryView category={category} label={label} />
  );
}

function ExploreCategoryView({ category, label }: Readonly<{ category: string; label: string }>) {
  const categoryTools = getPublicToolsByCategory(label);
  const categoryWorkflows = workflows.filter((workflow) => workflow.category === label);
  const t = useTranslations();
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const categoryName = t(`categories.${category}`);

  return (
    <ToolarsShell active="explore" sidebarActiveHref={getCategoryHref(label)}>
      <div className="page-grid" data-explore-category={category}>
        <div>
          <section className="section">
            <span className="eyebrow">{t("directories.category.eyebrow")}</span>
            <h1 className="title">{t("directories.category.title", { category: categoryName })}</h1>
            <p className="subtitle">{t("directories.category.subtitle", { category: categoryName, count: categoryTools.length.toLocaleString() })}</p>
          </section>

          <section className="section">
            <div className="tool-grid">
              {categoryTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>{t("directories.category.workflowPaths")}</h2>
            <div className="resource-list">
              {categoryWorkflows.length > 0 ? (
                categoryWorkflows.map((workflow) => (
                  <ResourceCard
                    description={`${workflow.steps.length} steps · ${workflow.estimatedMinutes} min`}
                    href={localizedHref(workflow.href)}
                    icon={<Workflow size={20} aria-hidden="true" />}
                    key={workflow.slug}
                    meta={workflow.aiRequired ? "AI consent" : "Local"}
                    title={workflow.title}
                  />
                ))
              ) : (
                <ResourceCard
                  description={t("directories.category.relatedWorkflowDescription")}
                  href={localizedHref("/")}
                  icon={<FolderSearch size={20} aria-hidden="true" />}
                  meta={t("directories.category.relatedWorkflowMeta")}
                  title={t("directories.category.relatedWorkflowTitle")}
                />
              )}
            </div>
          </section>
        </aside>
      </div>
    </ToolarsShell>
  );
}
