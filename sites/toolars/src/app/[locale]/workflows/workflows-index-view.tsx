import {
  ArrowRight,
  Calculator,
  FileText,
  Flame,
  FolderOpen,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { workflows, type WorkflowDefinition } from "@/data/registry";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const featuredWorkflowSlugs = ["pdf-summary", "llm-cost-review", "mcp-tool-launch"];
const workflowIcons = {
  "pdf-summary": FileText,
  "ai-prompt-hardening": ShieldCheck,
  "llm-cost-review": Calculator,
  "mcp-tool-launch": Network
} as const;

type WorkflowCardMessage = {
  title: string;
  description: string;
  steps: string[];
  categoryShort: string;
  mobileTitle?: string;
  mobileDescription?: string;
  mobileTileValue?: string;
  mobileMinutes?: string;
  mobileRuns?: string;
};

type WorkflowCardLabels = {
  stepsAriaLabel: (title: string) => string;
  stepsCount: (count: number) => string;
  minutes: (minutes: number) => string;
  runs: (runs: string) => string;
  aiStep: string;
  noAi: string;
  start: string;
};

function workflowTone(workflow: WorkflowDefinition): string {
  if (workflow.category === "PDF") return "rose";
  if (workflow.category === "LLM Cost") return "green";
  if (workflow.category === "RAG / MCP / Agent") return "purple";
  return "amber";
}

function workflowCopy(workflow: WorkflowDefinition, messages: Record<string, WorkflowCardMessage>): WorkflowCardMessage {
  return messages[workflow.slug] ?? {
    title: workflow.title,
    description: workflow.description,
    steps: workflow.steps,
    categoryShort: workflow.category.slice(0, 2).toUpperCase()
  };
}

function getWorkflowIcon(workflow: WorkflowDefinition) {
  return workflowIcons[workflow.slug as keyof typeof workflowIcons] ?? Workflow;
}

function isWorkflowDefinition(workflow: WorkflowDefinition | undefined): workflow is WorkflowDefinition {
  return Boolean(workflow);
}

function WorkflowCard({
  workflow,
  copy,
  labels,
  featured = false,
  localizedHref
}: {
  workflow: WorkflowDefinition;
  copy: WorkflowCardMessage;
  labels: WorkflowCardLabels;
  featured?: boolean;
  localizedHref: (href: string) => string;
}) {
  const tone = workflowTone(workflow);
  const Icon = getWorkflowIcon(workflow);
  const steps = copy.steps.length ? copy.steps : workflow.steps;
  const mobileTitle = copy.mobileTitle ?? copy.title;
  const mobileDescription = copy.mobileDescription ?? copy.description;
  const mobileMinuteLabel = copy.mobileMinutes ?? labels.minutes(workflow.estimatedMinutes);
  const mobileRunLabel = copy.mobileRuns ?? labels.runs(workflow.runCount);

  return (
    <a className={`workflow-index-card ${featured ? "is-featured" : ""}`} href={localizedHref(workflow.href)}>
      <span className={`icon-tile ${tone}`} data-workflow-card-icon={workflow.slug}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <span>
        <strong>
          <span className="workflow-title-desktop">{copy.title}</span>
          <span className="workflow-title-mobile">{mobileTitle}</span>
        </strong>
        <small>
          <span className="workflow-description-desktop">{copy.description}</span>
          <span className="workflow-description-mobile">{mobileDescription}</span>
        </small>
      </span>
      <span className="workflow-mini-steps" aria-label={labels.stepsAriaLabel(copy.title)}>
        {steps.slice(0, 3).map((step) => (
          <span className="workflow-mini-step" key={step}>
            {step}
          </span>
        ))}
      </span>
      <span className="tag-list">
        <span className="badge workflow-steps-count">{labels.stepsCount(steps.length)}</span>
        <span className={workflow.aiRequired ? "badge ai workflow-ai-state" : "badge local workflow-ai-state"}>{workflow.aiRequired ? labels.aiStep : labels.noAi}</span>
        <span className="badge workflow-minutes">
          <span className="workflow-badge-desktop">{labels.minutes(workflow.estimatedMinutes)}</span>
          <span className="workflow-badge-mobile">{mobileMinuteLabel}</span>
        </span>
        <span className="badge warn workflow-runs">
          <span className="workflow-badge-desktop">{labels.runs(workflow.runCount)}</span>
          <span className="workflow-badge-mobile">{mobileRunLabel}</span>
        </span>
      </span>
      <span className="open-link">
        {labels.start} <ArrowRight size={14} aria-hidden="true" />
      </span>
    </a>
  );
}

export function WorkflowsIndexView() {
  const t = useTranslations("workflowsPage");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const examples = t.raw("exampleItems") as string[];
  const workflowFilters = t.raw("filters") as string[];
  const workflowMessages = t.raw("workflowCards") as Record<string, WorkflowCardMessage>;
  const cardLabels: WorkflowCardLabels = {
    stepsAriaLabel: (title) => t("card.stepsAriaLabel", { title }),
    stepsCount: (count) => t("card.stepsCount", { count }),
    minutes: (minutes) => t("card.minutes", { minutes }),
    runs: (runs) => t("card.runs", { runs }),
    aiStep: t("card.aiStep"),
    noAi: t("card.noAi"),
    start: t("card.start")
  };
  const featuredWorkflows = featuredWorkflowSlugs
    .map((slug) => workflows.find((workflow) => workflow.slug === slug))
    .filter(isWorkflowDefinition);

  function localizedHref(href: string) {
    return href.startsWith("#") ? href : localizePath(href, localeCode);
  }

  return (
    <div
      className="page-grid workflow-index-page"
      data-workflows-desktop-layout="workflow-market-v2"
      data-workflows-index="true"
      data-workflows-density="mobile-v2"
      data-workflows-mobile-layout="template-directory"
    >
      <div>
        <section className="section landing-hero">
          <span className="eyebrow">{t("pageEyebrow")}</span>
          <h1 className="title">{t("pageHeroTitle")}</h1>
          <p className="subtitle">{t("pageHeroCopy")}</p>
          <div className="landing-action-row">
            <button className="button button-solid" type="button">
              <Workflow size={16} aria-hidden="true" /> {t("createWorkflow")}
            </button>
            <button className="button button-outline-neutral" type="button">
              <FolderOpen size={16} aria-hidden="true" /> {t("browseTemplates")}
            </button>
          </div>
          <button className="button button-solid workflow-mobile-primary-action" type="button">
            {t("buildFromScratch")}
          </button>
          <div className="search-panel landing-search-panel">
            <div className="hero-input">
              <span className="workflow-mobile-search-icon">{t("searchIconLabel")}</span>
              <Sparkles size={18} aria-hidden="true" />
              <span>{t("searchPrompt")}</span>
              <a className="open-link workflow-search-submit" href={localizedHref("/workflows/pdf-summary")}>
                <span className="workflow-search-submit-mobile-label">{t("searchSubmitMobile")}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="workflow-example-row" aria-label={t("examplesAriaLabel")}>
            <span>{t("examples")}</span>
            {examples.map((example) => (
              <span className="chip" key={example}>
                {example}
              </span>
            ))}
          </div>
          <div className="workflow-mobile-filter-row" role="group" aria-label={t("filtersAriaLabel")}>
            {workflowFilters.map((filter, index) => (
              <button className={index === 0 ? "chip active" : "chip"} aria-pressed={index === 0 ? "true" : "false"} key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="landing-section-head">
            <h2 aria-label={t("featuredMobile")}>
              <span className="workflow-heading-desktop">{t("featuredDesktop")}</span>
              <span className="workflow-heading-mobile">{t("featuredMobile")}</span>
            </h2>
            <a className="text-link" href="#templates">
              {t("viewAllFeatured")} <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="workflow-feature-grid">
            {featuredWorkflows.map((workflow) => (
              <WorkflowCard copy={workflowCopy(workflow, workflowMessages)} featured key={workflow.slug} labels={cardLabels} localizedHref={localizedHref} workflow={workflow} />
            ))}
          </div>
        </section>

        <section className="section" id="templates">
          <div className="landing-section-head">
            <h2>{t("popularTemplates")}</h2>
            <a className="text-link" href={localizedHref("/collections")}>
              {t("browseCollections")}
            </a>
          </div>
          <div className="workflow-template-grid">
            {workflows.map((workflow) => (
              <WorkflowCard copy={workflowCopy(workflow, workflowMessages)} key={workflow.slug} labels={cardLabels} localizedHref={localizedHref} workflow={workflow} />
            ))}
          </div>
        </section>
      </div>

      <aside className="right-rail">
        <section className="panel">
          <div className="landing-section-head">
            <h2>{t("trending")}</h2>
            <a className="text-link" href="#templates">
              {t("viewAll")}
            </a>
          </div>
          <div className="landing-ranked-list">
            {workflows.map((workflow, index) => {
              const copy = workflowCopy(workflow, workflowMessages);
              const Icon = getWorkflowIcon(workflow);

              return (
                <a className="landing-ranked-row" href={localizedHref(workflow.href)} key={workflow.slug}>
                  <span>{index + 1}</span>
                  <span className={`icon-tile ${workflowTone(workflow)}`} data-workflow-ranked-icon={workflow.slug}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <strong>{copy.title}</strong>
                  <small>
                    <Flame size={12} aria-hidden="true" /> {workflow.runCount}
                  </small>
                </a>
              );
            })}
          </div>
        </section>

        <section className="panel landing-build-card">
          <h2>{t("buildTitle")}</h2>
          <p className="tool-description">{t("buildDescription")}</p>
          <button className="button button-outline-neutral" type="button">
            <Workflow size={16} aria-hidden="true" /> {t("createCustom")}
          </button>
        </section>

        <section className="panel">
          <h2>{t("trustTitle")}</h2>
          <div className="landing-trust-list">
            <div className="landing-trust-row">
              <span className="badge ai">{t("trustAi")}</span>
              <p>{t("trustAiDescription")}</p>
            </div>
            <div className="landing-trust-row">
              <span className="badge local">{t("trustLocal")}</span>
              <p>{t("trustLocalDescription")}</p>
            </div>
            <div className="landing-trust-row">
              <span className="badge local">
                <ShieldCheck size={13} aria-hidden="true" /> {t("trustFiles")}
              </span>
              <p>{t("trustFilesDescription")}</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>{t("startFast")}</h2>
          <a className="resource-card" href={localizedHref("/workflows/pdf-summary")}>
            <span className="icon-tile rose">
              <FileText size={18} aria-hidden="true" />
            </span>
            <span>
              <h3>{t("fastStartResource.title")}</h3>
              <p>{t("fastStartResource.description")}</p>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>
      </aside>
    </div>
  );
}
