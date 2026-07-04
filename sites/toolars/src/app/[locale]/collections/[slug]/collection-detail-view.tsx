import {
  Archive,
  ArrowRight,
  BookmarkPlus,
  Calculator,
  FileArchive,
  FileJson,
  FileText,
  Network,
  ScanSearch,
  Share2,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import type { CollectionBadgeTone, CollectionDetailDefinition, CollectionDetailStep } from "@/data/collection-details";
import type { ProcessingMode, ToolDefinition, WorkflowDefinition } from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const processingLabelKey: Record<ProcessingMode, string> = {
  local: "processing.local",
  cloud: "processing.cloud",
  "ai-consent": "processing.aiConsent"
};

const toolArtworkIcons: Record<string, LucideIcon> = {
  "ai-pdf-summarizer": Sparkles,
  "json-repair": FileJson,
  "llm-cost-calculator": Calculator,
  "mcp-server-builder": Network,
  "pdf-compressor": Archive,
  "pdf-merger": FileArchive,
  "pdf-toolkit": FileText,
  "prompt-injection-scanner": ScanSearch
};

const workflowArtworkIcons: Record<string, LucideIcon> = {
  "ai-prompt-hardening": ShieldCheck,
  "llm-cost-review": Calculator,
  "mcp-tool-launch": Network,
  "pdf-summary": FileText
};

const playbookArtworkIcons = [FileJson, ShieldCheck, Network] as const;

function badgeClass(tone?: CollectionBadgeTone): string {
  return tone ? `badge ${tone}` : "badge";
}

function processingTone(tool: ToolDefinition): CollectionBadgeTone {
  if (tool.processing.includes("ai-consent")) return "ai";
  if (tool.processing[0] === "local") return "local";
  return "cloud";
}

function processingBadgeLabel(tool: ToolDefinition, t: ReturnType<typeof useTranslations>): string {
  if (tool.processing.includes("ai-consent")) return t(processingLabelKey["ai-consent"]);
  return t(processingLabelKey[tool.processing[0]]);
}

function stepBadgeLabel(label: string, t: ReturnType<typeof useTranslations>): string {
  if (label === "Local") return t("processing.local");
  if (label === "AI consent") return t("processing.aiConsent");
  if (label === "Security") return t("badges.security");
  if (label === "Launch") return t("badges.launch");
  return label;
}

function localizeCollectionHref(href: string, localeCode: LocaleCode): string {
  if (!href.startsWith("/")) return href;
  return localizePath(href, localeCode);
}

function CollectionToolIcon({ tool }: { tool: ToolDefinition }) {
  const Icon = toolArtworkIcons[tool.slug] ?? Sparkles;

  return <Icon size={18} aria-hidden="true" />;
}

function CollectionPlaybookIcon({ index }: { index: number }) {
  const Icon = playbookArtworkIcons[index] ?? Sparkles;

  return <Icon size={18} aria-hidden="true" />;
}

function CollectionWorkflowIcon({ workflow }: { workflow: WorkflowDefinition }) {
  const Icon = workflowArtworkIcons[workflow.slug] ?? Workflow;

  return <Icon size={18} aria-hidden="true" />;
}

function PathStep({ step, index, badgeLabel }: { step: CollectionDetailStep; index: number; badgeLabel: string }) {
  return (
    <article className="detail-step-row">
      <span className="mcp-stage-number">{index + 1}</span>
      <span>
        <strong>{step.title}</strong>
        <small>{step.description}</small>
      </span>
      <span className={badgeClass(step.tone)}>{badgeLabel}</span>
    </article>
  );
}

export function CollectionDetailView({ detail }: { detail: CollectionDetailDefinition }) {
  const t = useTranslations("collectionDetail");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  function localizedHref(href: string) {
    return localizeCollectionHref(href, localeCode);
  }

  return (
    <div
      className="tool-detail-page collection-detail-page"
      data-collection-page={detail.collection.slug}
      data-collection-density={detail.collection.slug === "pdf-ops-kit" ? "mobile-v2" : undefined}
      data-designed-collection-detail="true"
    >
      <header className="tool-detail-head">
        <div>
          <span className="eyebrow">{detail.eyebrow}</span>
          <h1 className="title">{detail.collection.title}</h1>
          <p className="subtitle collection-hero-summary">{detail.summary}</p>
          <div className="badge-row detail-badge-row">
            <span className="badge workflow">{t(`visibility.${detail.collection.visibility}`)}</span>
            <span className="badge local">{t("counts.tools", { count: detail.collection.toolSlugs.length })}</span>
            <span className="badge">{t("counts.workflows", { count: detail.collection.workflowSlugs.length })}</span>
            {detail.collection.tags.map((tag) => (
              <span className="badge" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="tool-detail-actions">
          <CoreActionModalButton
            className="button button-outline-neutral"
            itemName={detail.collection.title}
            kind="share"
            sharePath={localizedHref(detail.collection.href)}
            shareTitle={t("actions.shareTitle")}
          >
            <Share2 size={16} aria-hidden="true" /> {t("actions.share")}
          </CoreActionModalButton>
          <CoreActionModalButton className="button button-solid" itemName={detail.collection.title} kind="save-collection">
            <BookmarkPlus size={16} aria-hidden="true" /> {t("actions.saveCollection")}
          </CoreActionModalButton>
        </div>
      </header>

      <div className="tool-detail-grid collection-detail-grid">
        <section className="tool-detail-main">
          <section className="panel collection-recommended-panel">
            <div className="collection-section-head">
              <div>
                <h2>{t("sections.recommendedPath")}</h2>
                <p className="tool-description">{t("sections.recommendedDescription")}</p>
              </div>
              <a className="button button-solid" href={localizedHref(detail.secondaryAction.href)}>
                {t(`actionsByCollection.${detail.collection.slug}.secondary`)} <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-step-list">
              {detail.recommendedPath.map((step, index) => (
                <PathStep badgeLabel={stepBadgeLabel(step.badge, t)} index={index} key={step.title} step={step} />
              ))}
            </div>
          </section>

          <section className="panel section collection-tools-panel">
            <div className="collection-section-head">
              <div>
                <h2>{t("sections.tools")}</h2>
                <p className="tool-description">{t("sections.toolsDescription")}</p>
              </div>
              <a className="button button-outline-neutral" href={localizedHref(detail.primaryAction.href)}>
                {t(`actionsByCollection.${detail.collection.slug}.primary`)}
              </a>
            </div>
            <div className="collection-tool-grid">
              {detail.tools.map((tool) => (
                <a className="collection-tool-card" href={localizedHref(tool.href)} key={tool.slug}>
                  <span className={`icon-tile ${tool.accent}`} data-collection-tool-icon={tool.slug}>
                    <CollectionToolIcon tool={tool} />
                  </span>
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.description}</small>
                  </span>
                  <span className={badgeClass(processingTone(tool))}>{processingBadgeLabel(tool, t)}</span>
                </a>
              ))}
            </div>
          </section>

          {detail.playbooks.length > 0 ? (
            <section className="panel section">
              <h2>{t("sections.playbooks")}</h2>
              <div className="detail-resource-list">
                {detail.playbooks.map((playbook, index) => (
                  <article className="detail-resource-row" key={playbook.title}>
                    <span className={`icon-tile ${playbook.accent}`} data-collection-playbook-icon={index}>
                      <CollectionPlaybookIcon index={index} />
                    </span>
                    <span>
                      <strong>{playbook.title}</strong>
                      <small>{playbook.description}</small>
                    </span>
                    <span className="badge workflow">{playbook.outcome}</span>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </section>

        <aside className="right-rail">
          <section className="panel">
            <h2>{t("sections.notes")}</h2>
            <p className="detail-aside-note">{detail.notes}</p>
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge local">{t("labels.curator")}</span>
                <span>{detail.collection.curator}</span>
              </div>
              <div className="detail-row">
                <span className="badge">{t("labels.visibility")}</span>
                <span>{t(`visibility.${detail.collection.visibility}`)}</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>{t("sections.workflows")}</h2>
            <div className="detail-resource-list">
              {detail.workflows.map((workflow) => (
                <a className="detail-resource-row" href={localizedHref(workflow.href)} key={workflow.slug}>
                  <span className="icon-tile purple" data-collection-workflow-icon={workflow.slug}>
                    <CollectionWorkflowIcon workflow={workflow} />
                  </span>
                  <span>
                    <strong>{workflow.title}</strong>
                    <small>
                      {t("workflow.meta", { minutes: workflow.estimatedMinutes, runs: workflow.runCount })}
                    </small>
                  </span>
                  <span className={workflow.aiRequired ? "badge ai" : "badge local"}>
                    {workflow.aiRequired ? t("workflow.ai") : t("workflow.local")}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
