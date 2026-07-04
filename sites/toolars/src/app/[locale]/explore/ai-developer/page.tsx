import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { Code2, FileJson, ScanSearch, WalletCards, Workflow } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { ResourceCard } from "@/components/tools/resource-card";
import { ToolCard } from "@/components/tools/tool-card";
import { aiDeveloperLabTools, sourceInventory, workflows, type WorkflowDefinition } from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { buildLocalizedPageMetadata } from "@/lib/seo/localized-page-metadata";

type WorkflowCardMessage = {
  title: string;
};

const aiDeveloperWorkflowCategories = new Set(["AI Security", "LLM Cost", "RAG / MCP / Agent"]);

function isAiDeveloperWorkflow(workflow: WorkflowDefinition): boolean {
  return aiDeveloperWorkflowCategories.has(workflow.category);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedPageMetadata({ locale, page: "aiDeveloper" });
}

export default function AiDeveloperLabPage() {
  const t = useTranslations("directories.aiDeveloper");
  const workflowT = useTranslations("workflowsPage");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const workflowMessages = workflowT.raw("workflowCards") as Record<string, WorkflowCardMessage>;
  const labWorkflows = workflows.filter(isAiDeveloperWorkflow);

  function localizedHref(href: string) {
    return href.startsWith("#") ? href : localizePath(href, localeCode);
  }

  return (
    <ToolarsShell active="ai-developer">
      <div className="page-grid">
        <div>
          <section className="section">
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="title">{t("heroTitle")}</h1>
            <p className="subtitle">{t("heroSubtitle")}</p>
          </section>

          <section className="workflow-strip" aria-label={t("metricsAriaLabel")}>
            <ResourceCard description={t("metrics.labTools.description")} href="#tools" icon={<Code2 size={20} aria-hidden="true" />} meta={`${aiDeveloperLabTools.length}`} title={t("metrics.labTools.title")} />
            <ResourceCard description={t("metrics.categories.description")} href="#tools" icon={<ScanSearch size={20} aria-hidden="true" />} meta={`${Object.keys(sourceInventory.aixtralLab.categories).length}`} title={t("metrics.categories.title")} />
            <ResourceCard description={t("metrics.localFirst.description")} href="#tools" icon={<FileJson size={20} aria-hidden="true" />} meta={t("metrics.localFirst.meta")} title={t("metrics.localFirst.title")} />
          </section>

          <section className="section" id="tools">
            <div className="tool-grid">
              {aiDeveloperLabTools.map((tool) => (
                <ToolCard tool={tool} key={tool.slug} />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-rail">
          <section className="panel">
            <h2>{t("recommendedTitle")}</h2>
            <div className="resource-list">
              <ResourceCard description={t("recommendedPlaybooks.jsonRepair.description")} href={localizedHref("/tools/json-repair")} icon={<FileJson size={20} aria-hidden="true" />} meta={t("recommendedPlaybooks.jsonRepair.meta")} title={t("recommendedPlaybooks.jsonRepair.title")} />
              <ResourceCard description={t("recommendedPlaybooks.promptHardening.description")} href={localizedHref("/workflows/ai-prompt-hardening")} icon={<ScanSearch size={20} aria-hidden="true" />} meta={t("recommendedPlaybooks.promptHardening.meta")} title={t("recommendedPlaybooks.promptHardening.title")} />
              <ResourceCard description={t("recommendedPlaybooks.costReview.description")} href={localizedHref("/workflows/llm-cost-review")} icon={<WalletCards size={20} aria-hidden="true" />} meta={t("recommendedPlaybooks.costReview.meta")} title={t("recommendedPlaybooks.costReview.title")} />
            </div>
          </section>
          <section className="panel">
            <h2>{t("workflowsTitle")}</h2>
            <div className="resource-list">
              {labWorkflows.map((workflow) => (
                <ResourceCard description={t("workflowDescription", { minutes: workflow.estimatedMinutes, runs: workflow.runCount })} href={localizedHref(workflow.href)} icon={<Workflow size={20} aria-hidden="true" />} key={workflow.slug} title={workflowMessages[workflow.slug]?.title ?? workflow.title} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </ToolarsShell>
  );
}
