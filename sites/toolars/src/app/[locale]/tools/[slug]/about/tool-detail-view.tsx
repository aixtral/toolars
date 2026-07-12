import { ArrowRight, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import type { ProcessingMode, ToolDefinition } from "@/data/registry";
import { labDetailSlugs, type DetailBadgeTone, type ToolDetailDefinition, type ToolDetailRow } from "@/data/tool-details";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

type TranslationValues = {
  readonly [key: string]: string | number;
};

type ToolDetailTranslator = (key: string, values?: TranslationValues) => string;

type ProcessingLabelKeyMap = {
  readonly [mode in ProcessingMode]: string;
};

type MessageKeyMap = {
  readonly [label: string]: string;
};

type DetailBadge = {
  readonly label: string;
  readonly tone?: DetailBadgeTone;
};

type DesignedDetailBadgeMap = {
  readonly [slug: string]: readonly DetailBadge[];
};

interface StringSet {
  has(value: string): boolean;
}

function createSlugSet(slugs: readonly string[]): StringSet {
  return new Set(slugs);
}

const processingLabelKey: ProcessingLabelKeyMap = {
  local: "processing.local",
  cloud: "processing.cloud",
  "ai-consent": "processing.aiConsent"
};

const badgeMessageKeys: MessageKeyMap = {
  Verified: "badges.verified",
  Free: "pricing.free",
  Freemium: "pricing.freemium",
  Paid: "pricing.paid",
  Local: "processing.local",
  Cloud: "processing.cloud",
  "AI consent": "processing.aiConsent",
  "Free trial": "pricing.freeTrial",
  "Local first": "badges.localFirst",
  JSON: "badges.json",
  LLM: "badges.llm",
  API: "badges.api",
  "AI security": "badges.aiSecurity",
  Security: "badges.security",
  Prompt: "badges.prompt",
  OWASP: "badges.owasp",
  Cost: "badges.cost",
  Models: "badges.models",
  Tokens: "badges.tokens",
  Workflow: "badges.workflow",
  MCP: "badges.mcp",
  Agent: "badges.agent",
  Tools: "badges.tools",
  Process: "badges.process",
  Consent: "badges.consent",
  Handoff: "badges.handoff",
  Stable: "badges.stable",
  Next: "badges.next",
  Review: "badges.review",
  "Source-backed": "badges.sourceBacked",
  Plan: "badges.plan",
  "Build-ready": "badges.buildReady",
  Now: "badges.now",
  "Native workspace": "badges.nativeWorkspace",
  "PDF workspace": "badges.pdfWorkspace",
  "Local repair": "badges.localRepair",
  "Local calculator": "badges.localCalculator",
  "Health reference": "badges.healthReference",
  "Local finance": "badges.localFinance",
  "VitalCalc source": "badges.vitalCalcSource",
  "Local files": "badges.localFiles",
  Retention: "badges.retention"
};

const designedDetailBadges: DesignedDetailBadgeMap = {
  "pdf-toolkit": [
    { label: "Verified", tone: "local" },
    { label: "Free" },
    { label: "Local", tone: "local" }
  ],
  "json-repair": [
    { label: "Local first", tone: "local" },
    { label: "Freemium" },
    { label: "JSON" },
    { label: "LLM" },
    { label: "API" }
  ],
  "prompt-injection-scanner": [
    { label: "AI security", tone: "warn" },
    { label: "Freemium" },
    { label: "Security" },
    { label: "Prompt" },
    { label: "OWASP" }
  ],
  "llm-cost-calculator": [
    { label: "Local first", tone: "local" },
    { label: "Free" },
    { label: "Cost" },
    { label: "Models" },
    { label: "Tokens" }
  ],
  "mcp-server-builder": [
    { label: "Workflow", tone: "workflow" },
    { label: "Freemium" },
    { label: "MCP" },
    { label: "Agent" },
    { label: "Tools" }
  ]
};

const designedPublicDetailSlugs = createSlugSet(labDetailSlugs);
const aiLabDetailSlugs = createSlugSet(labDetailSlugs.filter((slug) => slug !== "pdf-toolkit"));

type HeroSummaryMap = {
  readonly [slug: string]: string;
};

const designedHeroSummaries: HeroSummaryMap = {
  "pdf-toolkit": "Merge, split, compress, convert, summarize, and export PDFs in one place.",
  "json-repair":
    "Fix malformed LLM JSON output, trailing commas, quotes, and broken arrays. This listing explains the production contract, privacy posture, and handoff notes for the Toolars developer catalog.",
  "prompt-injection-scanner":
    "Scan prompts for jailbreaks, instruction overrides, and hidden payloads. This listing defines the commercial catalog page, trust model, and developer handoff for prompt security workflows.",
  "llm-cost-calculator":
    "Estimate token cost across providers, models, context windows, and traffic. This listing defines the commercial catalog page, local estimation model, and implementation handoff for launch cost reviews.",
  "mcp-server-builder":
    "Draft MCP tool definitions, resources, server manifest, and test payloads. This listing captures the catalog promise, launch review model, and developer handoff for agent-facing tool servers."
};

function badgeClass(tone?: DetailBadgeTone): string {
  return tone ? `badge ${tone}` : "badge";
}

function localizedBadgeLabel(label: string, t: ToolDetailTranslator): string {
  const messageKey = badgeMessageKeys[label];
  return messageKey ? t(messageKey) : label;
}

function pricingLabel(tool: ToolDefinition, t: ToolDetailTranslator): string {
  if (isFreeTrialMode() && tool.pricing !== "free") return t("pricing.freeTrial");
  return t(`pricing.${tool.pricing}`);
}

function processingLabel(mode: ProcessingMode, t: ToolDetailTranslator): string {
  return t(processingLabelKey[mode]);
}

function trialBadgeLabel(label: string, t: ToolDetailTranslator): string {
  const normalizedLabel = isFreeTrialMode() && (label === "Freemium" || label === "Paid") ? "Free trial" : label;
  return localizedBadgeLabel(normalizedLabel, t);
}

function initials(label: string): string {
  return label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function workspaceActionLabel(detail: ToolDetailDefinition, t: ToolDetailTranslator): string {
  return detail.tool.slug === "pdf-toolkit" ? t("actions.openTool") : t("actions.openWorkspace");
}

function detailBadges(
  detail: ToolDetailDefinition,
  t: ToolDetailTranslator
): DetailBadge[] {
  const designedBadges = designedDetailBadges[detail.tool.slug];
  if (designedBadges) return designedBadges.map((badge) => ({ ...badge, label: trialBadgeLabel(badge.label, t) }));

  return [
    { label: localizedBadgeLabel(detail.listingBadge.badge, t), tone: detail.listingBadge.tone },
    { label: pricingLabel(detail.tool, t) },
    ...detail.tool.tags.map((tag) => ({ label: localizedBadgeLabel(tag, t) }))
  ];
}

function isDesignedPublicDetail(detail: ToolDetailDefinition): boolean {
  return designedPublicDetailSlugs.has(detail.tool.slug);
}

function isAiLabDetail(detail: ToolDetailDefinition): boolean {
  return aiLabDetailSlugs.has(detail.tool.slug);
}

function heroSummary(detail: ToolDetailDefinition): string {
  return designedHeroSummaries[detail.tool.slug] ?? `${detail.tool.description} ${detail.summary}`;
}

function genericDetailMetrics(t: ToolDetailTranslator) {
  return [
    { value: "3", label: t("content.metrics.reviewLabel") },
    { value: t("processing.local"), label: t("content.metrics.processingLabel") },
    { value: t("badges.review"), label: t("content.metrics.boundaryLabel") }
  ];
}

function genericDetailSteps(t: ToolDetailTranslator) {
  return [
    {
      title: t("content.steps.prepare.title"),
      description: t("content.steps.prepare.description"),
      badge: t("badges.process"),
      tone: "local" as const
    },
    {
      title: t("content.steps.review.title"),
      description: t("content.steps.review.description"),
      badge: t("badges.review")
    },
    {
      title: t("content.steps.continue.title"),
      description: t("content.steps.continue.description"),
      badge: t("badges.handoff"),
      tone: "workflow" as const
    }
  ];
}

function genericTrustSection(t: ToolDetailTranslator) {
  return {
    title: t("content.trust.title"),
    rows: [
      { badge: t("processing.local"), description: t("content.trust.local"), tone: "local" as const },
      { badge: t("badges.review"), description: t("content.trust.review") },
      { badge: t("badges.handoff"), description: t("content.trust.handoff"), tone: "workflow" as const }
    ]
  };
}

function genericHandoff(t: ToolDetailTranslator) {
  return [
    {
      initials: "UI",
      title: t("content.handoff.workspace.title"),
      description: t("content.handoff.workspace.description"),
      badge: t("badges.stable"),
      accent: "blue"
    },
    {
      initials: "QA",
      title: t("content.handoff.review.title"),
      description: t("content.handoff.review.description"),
      badge: t("badges.review"),
      accent: "emerald"
    }
  ];
}

function localizeInternalHref(href: string, localeCode: LocaleCode): string {
  if (!href.startsWith("/")) return href;
  return localizePath(href, localeCode);
}

function DetailRows({ rows, t }: { rows: ToolDetailRow[]; t: ToolDetailTranslator }) {
  return (
    <div className="detail-row-list">
      {rows.map((row) => (
        <div className="detail-row" key={row.badge}>
          <span className={badgeClass(row.tone)}>{localizedBadgeLabel(row.badge, t)}</span>
          <span>{row.description}</span>
        </div>
      ))}
    </div>
  );
}

export function ToolDetailView({ detail }: { detail: ToolDetailDefinition }) {
  const tTools = useTranslations(`tools.${detail.tool.slug}`);
  const t = useTranslations("toolDetail") as ToolDetailTranslator;
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const isEnglishBaseline = localeCode === DEFAULT_LOCALE;
  const metrics = isEnglishBaseline ? detail.metrics : genericDetailMetrics(t);
  const steps = isEnglishBaseline ? detail.howItWorks : genericDetailSteps(t);
  const trustSection = isEnglishBaseline ? detail.trustSection : genericTrustSection(t);
  const handoff = isEnglishBaseline ? detail.handoff : genericHandoff(t);

  return (
    <div
      className="tool-detail-page"
      data-ai-lab-detail={isAiLabDetail(detail) ? "true" : undefined}
      data-designed-public-detail={isDesignedPublicDetail(detail) ? "true" : undefined}
      data-public-detail-density={detail.tool.slug === "pdf-toolkit" ? "pdf-toolkit-mobile-v2" : undefined}
      data-tool-detail={detail.tool.slug}
    >
      <header className="tool-detail-head">
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="title">{t("title", { name: tTools("name") })}</h1>
          <p className="subtitle tool-detail-hero-summary">
            {isEnglishBaseline ? heroSummary(detail) : t("content.hero", { name: tTools("name") })}
          </p>
          <div className="badge-row detail-badge-row">
            {detailBadges(detail, t).map((badge) => (
              <span className={badgeClass(badge.tone)} key={badge.label}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        <div className="tool-detail-actions">
          <CoreActionModalButton
            className="button button-outline-neutral"
            itemName={tTools("name")}
            kind="share"
            sharePath={localizeInternalHref(detail.tool.aboutHref, localeCode)}
            shareTitle={t("share.title")}
          >
            <Share2 size={16} aria-hidden="true" /> {t("share.action")}
          </CoreActionModalButton>
          <a className="button button-solid tool-detail-primary-action" href={localizeInternalHref(detail.workspaceHref, localeCode)}>
            {workspaceActionLabel(detail, t)} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="tool-detail-grid">
        <section className="tool-detail-main">
          <section className="panel tool-detail-overview-panel">
            <h2>{t("sections.overview")}</h2>
            <p className="subtitle">
              {isEnglishBaseline ? detail.overview : t("content.overview", { name: tTools("name") })}
            </p>
            <div className="detail-metric-grid">
              {metrics.map((metric) => (
                <div className="detail-metric" key={`${metric.value}-${metric.label}`}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel section tool-detail-how-it-works-panel">
            <h2>{t("sections.howItWorks")}</h2>
            <div className="detail-step-list">
              {steps.map((step, index) => (
                <article className="detail-step-row" key={step.title}>
                  <span className="mcp-stage-number">{index + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.description}</small>
                  </span>
                  <span className={badgeClass(step.tone)}>{localizedBadgeLabel(step.badge, t)}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel section">
            <h2>{trustSection.title}</h2>
            <DetailRows rows={trustSection.rows} t={t} />
          </section>

          <section className="panel section">
            <h2>{t("sections.implementationHandoff")}</h2>
            <div className="detail-resource-list">
              {handoff.map((item) => (
                <article className="detail-resource-row" key={item.title}>
                  <span className={`icon-tile ${item.accent}`}>{item.initials}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="badge">{localizedBadgeLabel(item.badge, t)}</span>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="right-rail">
          <section className="panel">
            <h2>{t("sections.includedCollections")}</h2>
            <div className="detail-resource-list">
              {detail.includedCollections.map((collection) => (
                <a className="detail-resource-row" href={localizeInternalHref(collection.href, localeCode)} key={collection.slug}>
                  <span className="icon-tile purple">{collection.toolSlugs.length}</span>
                  <span>
                    <strong>{collection.title}</strong>
                    <small>{collection.curator}</small>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>{t("sections.relatedTools")}</h2>
            <div className="detail-resource-list">
              {detail.relatedTools.map((tool) => (
                <a className="detail-resource-row" href={localizeInternalHref(tool.aboutHref, localeCode)} key={tool.slug}>
                  <span className={`icon-tile ${tool.accent}`}>{initials(tool.name)}</span>
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.category}</small>
                  </span>
                  <span className={badgeClass(tool.processing[0] === "ai-consent" ? "ai" : tool.processing[0] === "local" ? "local" : "cloud")}>
                    {processingLabel(tool.processing[0], t)}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {detail.recommendedWorkflow ? (
            <section className="panel">
              <h2>{t("sections.recommendedWorkflow")}</h2>
              <a className="detail-resource-row" href={localizeInternalHref(detail.recommendedWorkflow.href, localeCode)}>
                <span className="icon-tile rose">{detail.recommendedWorkflow.steps.length}</span>
                <span>
                  <strong>{detail.recommendedWorkflow.title}</strong>
                  <small>
                    {t("workflow.meta", {
                      minutes: detail.recommendedWorkflow.estimatedMinutes,
                      runs: detail.recommendedWorkflow.runCount
                    })}
                  </small>
                </span>
              </a>
              <p className="detail-aside-note">
                {isEnglishBaseline ? t("workflow.outcome", { outcome: detail.outcome }) : t("content.outcome")}
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
