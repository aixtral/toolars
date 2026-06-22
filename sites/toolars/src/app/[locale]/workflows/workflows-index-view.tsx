import {
  ArrowRight,
  FileText,
  Flame,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import { useTranslations } from "next-intl";
import { workflows, type WorkflowDefinition } from "@/data/registry";

const featuredWorkflowSlugs = ["pdf-summary", "llm-cost-review", "mcp-tool-launch"];
const examples = ["Summarize PDF report", "Clean CSV and visualize", "Generate blog post", "Resize images for social"];
const workflowFilters = ["All workflows", "Includes AI", "Local first", "Team ready"];

const workflowMobileTitles: Record<string, string> = {
  "pdf-summary": "PDF Summary Workflow Builder"
};

const workflowMobileDescriptions: Record<string, string> = {
  "pdf-summary": "Merge PDFs, extract text locally, run AI summary with consent, and export citations.",
  "ai-prompt-hardening": "Scan a prompt, detect injection risk, add guardrails, and generate a red-team checklist."
};

const workflowMobileTileValues: Record<string, string> = {
  "pdf-summary": "5"
};

const workflowMobileMinuteLabels: Record<string, string> = {
  "pdf-summary": "6 min"
};

const workflowMobileRunLabels: Record<string, string> = {
  "pdf-summary": "+1.2K runs",
  "ai-prompt-hardening": "+764 runs",
  "llm-cost-review": "+689 runs",
  "mcp-tool-launch": "+534 runs"
};

function workflowTone(workflow: WorkflowDefinition): string {
  if (workflow.category === "PDF") return "rose";
  if (workflow.category === "LLM Cost") return "green";
  if (workflow.category === "RAG / MCP / Agent") return "purple";
  return "amber";
}

function WorkflowCard({ workflow, featured = false }: { workflow: WorkflowDefinition; featured?: boolean }) {
  const tone = workflowTone(workflow);
  const mobileTitle = workflowMobileTitles[workflow.slug] ?? workflow.title;
  const mobileDescription = workflowMobileDescriptions[workflow.slug] ?? workflow.description;
  const mobileTileValue = workflowMobileTileValues[workflow.slug] ?? String(workflow.steps.length);
  const mobileMinuteLabel = workflowMobileMinuteLabels[workflow.slug] ?? `${workflow.estimatedMinutes} min`;
  const mobileRunLabel = workflowMobileRunLabels[workflow.slug] ?? `${workflow.runCount} runs`;

  return (
    <a className={`workflow-index-card ${featured ? "is-featured" : ""}`} href={workflow.href}>
      <span className={`icon-tile ${tone}`}>
        <span className="workflow-card-tile-desktop">{workflow.steps.length}</span>
        <span className="workflow-card-tile-mobile">{mobileTileValue}</span>
      </span>
      <span>
        <strong>
          <span className="workflow-title-desktop">{workflow.title}</span>
          <span className="workflow-title-mobile">{mobileTitle}</span>
        </strong>
        <small>
          <span className="workflow-description-desktop">{workflow.description}</span>
          <span className="workflow-description-mobile">{mobileDescription}</span>
        </small>
      </span>
      <span className="workflow-mini-steps" aria-label={`${workflow.title} steps`}>
        {workflow.steps.slice(0, 3).map((step) => (
          <span className="workflow-mini-step" key={step}>
            {step}
          </span>
        ))}
      </span>
      <span className="tag-list">
        <span className="badge workflow-steps-count">{workflow.steps.length} steps</span>
        <span className={workflow.aiRequired ? "badge ai workflow-ai-state" : "badge local workflow-ai-state"}>{workflow.aiRequired ? "AI step" : "No AI"}</span>
        <span className="badge workflow-minutes">
          <span className="workflow-badge-desktop">{workflow.estimatedMinutes} min</span>
          <span className="workflow-badge-mobile">{mobileMinuteLabel}</span>
        </span>
        <span className="badge warn workflow-runs">
          <span className="workflow-badge-desktop">{workflow.runCount} runs</span>
          <span className="workflow-badge-mobile">{mobileRunLabel}</span>
        </span>
      </span>
      <span className="open-link">
        Start <ArrowRight size={14} aria-hidden="true" />
      </span>
    </a>
  );
}

export function WorkflowsIndexView() {
  const t = useTranslations("workflowsPage");
  const featuredWorkflows = featuredWorkflowSlugs
    .map((slug) => workflows.find((workflow) => workflow.slug === slug))
    .filter((workflow): workflow is WorkflowDefinition => Boolean(workflow));

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
              <span className="workflow-mobile-search-icon">WF</span>
              <Sparkles size={18} aria-hidden="true" />
              <span>{t("searchPrompt")}</span>
              <a className="open-link workflow-search-submit" href="/workflows/pdf-summary">
                <span className="workflow-search-submit-mobile-label">Go</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="workflow-example-row" aria-label="Workflow examples">
            <span>{t("examples")}</span>
            {examples.map((example) => (
              <span className="chip" key={example}>
                {example}
              </span>
            ))}
          </div>
          <div className="workflow-mobile-filter-row" role="group" aria-label="Workflow filters">
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
              <WorkflowCard featured key={workflow.slug} workflow={workflow} />
            ))}
          </div>
        </section>

        <section className="section" id="templates">
          <div className="landing-section-head">
            <h2>{t("popularTemplates")}</h2>
            <a className="text-link" href="/collections">
              {t("browseCollections")}
            </a>
          </div>
          <div className="workflow-template-grid">
            {workflows.map((workflow) => (
              <WorkflowCard key={workflow.slug} workflow={workflow} />
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
            {workflows.map((workflow, index) => (
              <a className="landing-ranked-row" href={workflow.href} key={workflow.slug}>
                <span>{index + 1}</span>
                <span className={`icon-tile ${workflowTone(workflow)}`}>{workflow.category.slice(0, 2).toUpperCase()}</span>
                <strong>{workflow.title}</strong>
                <small>
                  <Flame size={12} aria-hidden="true" /> {workflow.runCount}
                </small>
              </a>
            ))}
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
          <a className="resource-card" href="/workflows/pdf-summary">
            <span className="icon-tile rose">
              <FileText size={18} aria-hidden="true" />
            </span>
            <span>
              <h3>PDF summary</h3>
              <p>Merge, extract, summarize, and export with citations.</p>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>
      </aside>
    </div>
  );
}
