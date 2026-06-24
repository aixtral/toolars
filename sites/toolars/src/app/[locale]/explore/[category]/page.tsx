import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  const categoryTools = getPublicToolsByCategory(label);
  const categoryWorkflows = workflows.filter((workflow) => workflow.category === label);

  return (
    <ToolarsShell active="explore" sidebarActiveHref={getCategoryHref(label)}>
      <div className="page-grid" data-explore-category={category}>
        <div>
          <section className="section">
            <span className="eyebrow">Tool category</span>
            <h1 className="title">{label} tools</h1>
            <p className="subtitle">
              Browse {categoryTools.length.toLocaleString()} Toolars tools in this category. Every listing keeps processing mode, pricing, and AI consent visible before you open it.
            </p>
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
            <h2>Category workflow paths</h2>
            <div className="resource-list">
              {categoryWorkflows.length > 0 ? (
                categoryWorkflows.map((workflow) => (
                  <ResourceCard
                    description={`${workflow.steps.length} steps · ${workflow.estimatedMinutes} min`}
                    href={workflow.href}
                    icon={<Workflow size={20} aria-hidden="true" />}
                    key={workflow.slug}
                    meta={workflow.aiRequired ? "AI consent" : "Local"}
                    title={workflow.title}
                  />
                ))
              ) : (
                <ResourceCard
                  description="Use command search to combine tools, collections, and workflows from this category."
                  href="/"
                  icon={<FolderSearch size={20} aria-hidden="true" />}
                  meta="Explore"
                  title="Find related workflows"
                />
              )}
            </div>
          </section>
        </aside>
      </div>
    </ToolarsShell>
  );
}
