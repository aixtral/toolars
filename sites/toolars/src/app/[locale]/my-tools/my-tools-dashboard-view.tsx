import {
  ArrowRight,
  BadgeDollarSign,
  Bookmark,
  Calculator,
  Clock,
  FileJson,
  FileText,
  Image as ImageIcon,
  Link,
  Mail,
  Puzzle,
  Sparkles,
  Star,
  Workflow
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const recentOutputs = [
  { key: "q2PdfSummary", href: "/tools/pdf-toolkit" },
  { key: "imageCompressionBatch", href: "/tools/pdf-toolkit" },
  { key: "mortgageScenario", href: "/" },
  { key: "csvCleanup", href: "/tools/json-repair" }
] as const;

const favoriteTools = [
  { key: "pdfToolkit", href: "/tools/pdf-toolkit" },
  { key: "jsonRepair", href: "/tools/json-repair" },
  { key: "aiEmailWriter", href: "/explore/ai-developer" },
  { key: "llmCostCalculator", href: "/tools/llm-cost-calculator" }
] as const;

const savedCollections = [
  { key: "pdfOpsKit", href: "/collections/pdf-ops-kit" },
  { key: "aiDeveloperLab", href: "/collections/ai-developer-lab" }
] as const;

const nextWorkflows = [
  { key: "pdfSummary", href: "/workflows/pdf-summary" },
  { key: "llmCostReview", href: "/workflows/llm-cost-review" },
  { key: "mcpToolLaunch", href: "/workflows/mcp-tool-launch" }
] as const;

const sharedLinks = ["marketingReport", "cleanedData", "socialPost"] as const;
const commandChips = ["all", "tools", "workflows", "outputs"] as const;

const kpis = [
  { key: "recentOutputs", value: String(recentOutputs.length), tone: "green", icon: Clock },
  { key: "favoriteTools", value: String(favoriteTools.length), tone: "amber", icon: Star },
  { key: "savedWorkflows", value: String(nextWorkflows.length), tone: "teal", icon: Workflow },
  { key: "aiCredits", value: "0", tone: "purple", icon: BadgeDollarSign }
] as const;

const recentOutputIcons = {
  q2PdfSummary: FileText,
  imageCompressionBatch: ImageIcon,
  mortgageScenario: Calculator,
  csvCleanup: FileJson
} as const;

const recentOutputTones = {
  q2PdfSummary: "rose",
  imageCompressionBatch: "green",
  mortgageScenario: "amber",
  csvCleanup: "teal"
} as const;

const favoriteToolIcons = {
  pdfToolkit: FileText,
  jsonRepair: FileJson,
  aiEmailWriter: Mail,
  llmCostCalculator: Calculator
} as const;

const favoriteToolTones = {
  pdfToolkit: "rose",
  jsonRepair: "teal",
  aiEmailWriter: "purple",
  llmCostCalculator: "amber"
} as const;

const collectionIcons = {
  pdfOpsKit: FileText,
  aiDeveloperLab: Sparkles
} as const;

const collectionTones = {
  pdfOpsKit: "rose",
  aiDeveloperLab: "purple"
} as const;

const workflowIcons = {
  pdfSummary: FileText,
  llmCostReview: Calculator,
  mcpToolLaunch: Workflow
} as const;

const workflowTones = {
  pdfSummary: "rose",
  llmCostReview: "green",
  mcpToolLaunch: "purple"
} as const;

export function MyToolsDashboardView() {
  const t = useTranslations("myToolsDashboard");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  function localizedHref(href: string) {
    return href.startsWith("#") ? href : localizePath(href, localeCode);
  }

  return (
    <div className="my-tools-page" data-my-tools-page="true">
      <section className="section landing-hero">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1 className="title">{t("hero.title")}</h1>
        <p className="subtitle">{t("hero.subtitle")}</p>
        <div className="search-panel landing-search-panel my-tools-command">
          <div className="hero-input">
            <Sparkles size={18} aria-hidden="true" />
            <span>{t("command.prompt")}</span>
            <a className="open-link" href={localizedHref("/workflows/pdf-summary")} aria-label={t("command.runNextWorkflowLabel")}>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="chip-row">
            {commandChips.map((chip) => (
              <span className={chip === "all" ? "chip active" : "chip"} key={chip}>
                {t(`command.chips.${chip}`)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="workspace-kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article className="workspace-kpi-card" key={kpi.key}>
              <span className={`icon-tile ${kpi.tone}`} data-kpi-icon={kpi.key}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span>
                <small>{t(`kpis.${kpi.key}.label`)}</small>
                <strong>{kpi.value}</strong>
                <em>{t(`kpis.${kpi.key}.note`)}</em>
              </span>
            </article>
          );
        })}
      </div>

      <div className="my-tools-grid">
        <section className="panel" id="recent">
          <div className="landing-section-head">
            <h2>{t("recentOutputs.title")}</h2>
            <a className="text-link" href="#recent">
              {t("recentOutputs.viewAll")} <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="workspace-timeline">
            {recentOutputs.map((item) => {
              const Icon = recentOutputIcons[item.key];

              return (
              <a className="workspace-timeline-row" href={localizedHref(item.href)} key={item.key}>
                <span className="timeline-dot" />
                <span className={`icon-tile ${recentOutputTones[item.key]}`} data-recent-output-icon={item.key}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`recentOutputs.items.${item.key}.title`)}</strong>
                  <small>{t(`recentOutputs.items.${item.key}.tool`)}</small>
                </span>
                <span>
                  <small>{t(`recentOutputs.items.${item.key}.time`)}</small>
                  <em>{t(`recentOutputs.items.${item.key}.status`)}</em>
                </span>
                <span className="button button-outline-neutral">{t("recentOutputs.open")}</span>
              </a>
              );
            })}
          </div>
        </section>

        <aside className="workspace-side-stack">
          <section className="panel" id="collections">
            <div className="landing-section-head">
              <h2>{t("savedCollections.title")}</h2>
              <a className="text-link" href={localizedHref("/collections")}>
                {t("savedCollections.viewAll")} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-resource-list">
              {savedCollections.map((collection) => {
                const Icon = collectionIcons[collection.key];

                return (
                <a className="detail-resource-row" href={localizedHref(collection.href)} key={collection.key}>
                  <span className={`icon-tile ${collectionTones[collection.key]}`}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{t(`savedCollections.items.${collection.key}.title`)}</strong>
                    <small>{t(`savedCollections.items.${collection.key}.meta`)}</small>
                  </span>
                  <Bookmark size={16} aria-hidden="true" />
                </a>
                );
              })}
            </div>
          </section>

          <section className="panel" id="workflows">
            <div className="landing-section-head">
              <h2>{t("nextWorkflows.title")}</h2>
              <a className="text-link" href={localizedHref("/workflows")}>
                {t("nextWorkflows.viewAll")} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-resource-list">
              {nextWorkflows.map((workflow) => {
                const Icon = workflowIcons[workflow.key];

                return (
                <a className="detail-resource-row" href={localizedHref(workflow.href)} key={workflow.key}>
                  <span className={`icon-tile ${workflowTones[workflow.key]}`}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{t(`nextWorkflows.items.${workflow.key}.title`)}</strong>
                    <small>{t(`nextWorkflows.items.${workflow.key}.meta`)}</small>
                  </span>
                  <span className="badge local">{t("nextWorkflows.use")}</span>
                </a>
                );
              })}
            </div>
          </section>
        </aside>
      </div>

      <div className="my-tools-grid">
        <section className="panel" id="favorites">
          <div className="landing-section-head">
            <h2>{t("favoriteTools.title")}</h2>
            <a className="text-link" href="#favorites">
              {t("favoriteTools.manage")} <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="favorite-tool-grid">
            {favoriteTools.map((tool) => {
              const Icon = favoriteToolIcons[tool.key];

              return (
              <a className="favorite-tool-card" href={localizedHref(tool.href)} key={tool.key}>
                <span className={`icon-tile ${favoriteToolTones[tool.key]}`} data-favorite-tool-icon={tool.key}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`favoriteTools.items.${tool.key}.title`)}</strong>
                  <small>{t(`favoriteTools.items.${tool.key}.description`)}</small>
                </span>
                <span className="badge">{t(`favoriteTools.items.${tool.key}.badge`)}</span>
                <span className="open-link">{t("favoriteTools.open")}</span>
              </a>
              );
            })}
          </div>
        </section>

        <aside className="workspace-side-stack">
          <section className="panel" id="shared">
            <div className="landing-section-head">
              <h2>{t("sharedLinks.title")}</h2>
              <a className="text-link" href="#shared">
                {t("sharedLinks.viewAll")} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-row-list">
              {sharedLinks.map((name) => (
                <div className="detail-row" key={name}>
                  <span className="badge">
                    <Link size={13} aria-hidden="true" /> {t("sharedLinks.linkLabel")}
                  </span>
                  <span>{t(`sharedLinks.items.${name}`)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel workspace-usage-card">
            <h2>{t("storage.title")}</h2>
            <div className="workspace-meter large">
              <span style={{ width: "24%" }} />
            </div>
            <p className="tool-description">{t("storage.usage")}</p>
            <h2 style={{ marginTop: 18 }}>{t("extension.title")}</h2>
            <p className="tool-description">{t("extension.description")}</p>
            <button disabled className="button button-outline-neutral" type="button">
              <Puzzle size={16} aria-hidden="true" /> {t("extension.action")}
            </button>
          </section>
        </aside>
      </div>

      {isFreeTrialMode() ? null : (
        <div className="workspace-bottom-strip">
          <span className="icon-tile green">
            <Clock size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{t("teamUpsell.title")}</strong>
            <small>{t("teamUpsell.description")}</small>
          </span>
          <button disabled className="button button-outline-neutral" type="button">
            {t("teamUpsell.action")}
          </button>
        </div>
      )}
    </div>
  );
}
