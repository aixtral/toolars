import { ArrowRight, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import type { ProcessingMode, ToolDefinition } from "@/data/registry";
import { labDetailSlugs, type DetailBadgeTone, type ToolDetailDefinition, type ToolDetailRow } from "@/data/tool-details";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

const processingLabel: Record<ProcessingMode, string> = {
  local: "Local",
  cloud: "Cloud",
  "ai-consent": "AI consent"
};

const designedDetailBadges: Record<string, Array<{ label: string; tone?: DetailBadgeTone }>> = {
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

const designedPublicDetailSlugs = new Set<string>(labDetailSlugs);
const aiLabDetailSlugs = new Set<string>(labDetailSlugs.filter((slug) => slug !== "pdf-toolkit"));

const designedHeroSummaries: Record<string, string> = {
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

function pricingLabel(tool: ToolDefinition): string {
  if (isFreeTrialMode() && tool.pricing !== "free") return "Free trial";
  return tool.pricing === "freemium" ? "Freemium" : tool.pricing === "paid" ? "Paid" : "Free";
}

function trialBadgeLabel(label: string): string {
  if (!isFreeTrialMode()) return label;
  return label === "Freemium" || label === "Paid" ? "Free trial" : label;
}

function initials(label: string): string {
  return label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function workspaceActionLabel(detail: ToolDetailDefinition): string {
  return detail.tool.slug === "pdf-toolkit" ? "Open tool" : "Open workspace";
}

function detailBadges(detail: ToolDetailDefinition): Array<{ label: string; tone?: DetailBadgeTone }> {
  const designedBadges = designedDetailBadges[detail.tool.slug];
  if (designedBadges) return designedBadges.map((badge) => ({ ...badge, label: trialBadgeLabel(badge.label) }));

  return [
    { label: detail.listingBadge.badge, tone: detail.listingBadge.tone },
    { label: pricingLabel(detail.tool) },
    ...detail.tool.tags.map((tag) => ({ label: tag }))
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

function DetailRows({ rows }: { rows: ToolDetailRow[] }) {
  return (
    <div className="detail-row-list">
      {rows.map((row) => (
        <div className="detail-row" key={row.badge}>
          <span className={badgeClass(row.tone)}>{row.badge}</span>
          <span>{row.description}</span>
        </div>
      ))}
    </div>
  );
}

export function ToolDetailView({ detail }: { detail: ToolDetailDefinition }) {
  const tTools = useTranslations(`tools.${detail.tool.slug}`);
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
          <span className="eyebrow">Public tool listing</span>
          <h1 className="title">{tTools("name")} details</h1>
          <p className="subtitle tool-detail-hero-summary">
            {heroSummary(detail)}
          </p>
          <div className="badge-row detail-badge-row">
            {detailBadges(detail).map((badge) => (
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
            sharePath={detail.tool.aboutHref}
            shareTitle="Share this tool"
          >
            <Share2 size={16} aria-hidden="true" /> Share
          </CoreActionModalButton>
          <a className="button button-solid tool-detail-primary-action" href={detail.workspaceHref}>
            {workspaceActionLabel(detail)} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="tool-detail-grid">
        <section className="tool-detail-main">
          <section className="panel tool-detail-overview-panel">
            <h2>Overview</h2>
            <p className="subtitle">{detail.overview}</p>
            <div className="detail-metric-grid">
              {detail.metrics.map((metric) => (
                <div className="detail-metric" key={`${metric.value}-${metric.label}`}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel section tool-detail-how-it-works-panel">
            <h2>How it works</h2>
            <div className="detail-step-list">
              {detail.howItWorks.map((step, index) => (
                <article className="detail-step-row" key={step.title}>
                  <span className="mcp-stage-number">{index + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.description}</small>
                  </span>
                  <span className={badgeClass(step.tone)}>{step.badge}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel section">
            <h2>{detail.trustSection.title}</h2>
            <DetailRows rows={detail.trustSection.rows} />
          </section>

          <section className="panel section">
            <h2>Implementation handoff</h2>
            <div className="detail-resource-list">
              {detail.handoff.map((item) => (
                <article className="detail-resource-row" key={item.title}>
                  <span className={`icon-tile ${item.accent}`}>{item.initials}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="badge">{item.badge}</span>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="right-rail">
          <section className="panel">
            <h2>Included in collections</h2>
            <div className="detail-resource-list">
              {detail.includedCollections.map((collection) => (
                <a className="detail-resource-row" href={collection.href} key={collection.slug}>
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
            <h2>Related tools</h2>
            <div className="detail-resource-list">
              {detail.relatedTools.map((tool) => (
                <a className="detail-resource-row" href={tool.aboutHref} key={tool.slug}>
                  <span className={`icon-tile ${tool.accent}`}>{initials(tool.name)}</span>
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.category}</small>
                  </span>
                  <span className={badgeClass(tool.processing[0] === "ai-consent" ? "ai" : tool.processing[0] === "local" ? "local" : "cloud")}>
                    {processingLabel[tool.processing[0]]}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {detail.recommendedWorkflow ? (
            <section className="panel">
              <h2>Recommended workflow</h2>
              <a className="detail-resource-row" href={detail.recommendedWorkflow.href}>
                <span className="icon-tile rose">{detail.recommendedWorkflow.steps.length}</span>
                <span>
                  <strong>{detail.recommendedWorkflow.title}</strong>
                  <small>
                    {detail.recommendedWorkflow.estimatedMinutes} min · {detail.recommendedWorkflow.runCount} runs
                  </small>
                </span>
              </a>
              <p className="detail-aside-note">{detail.outcome} is the primary catalog outcome for this detail page.</p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
