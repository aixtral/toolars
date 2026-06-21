import { ArrowRight, CheckCircle2, CircleHelp, ShieldCheck } from "lucide-react";
import type { ProcessingMode, ToolDefinition } from "@/data/registry";
import type { DetailBadgeTone, ToolDetailDefinition, ToolDetailRow } from "@/data/tool-details";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

const processingLabel: Record<ProcessingMode, string> = {
  local: "Local",
  cloud: "Cloud",
  "ai-consent": "AI consent"
};

function badgeClass(tone?: DetailBadgeTone): string {
  return tone ? `badge ${tone}` : "badge";
}

function pricingLabel(tool: ToolDefinition): string {
  if (isFreeTrialMode() && tool.pricing !== "free") return "Free trial";
  return tool.pricing === "freemium" ? "Freemium" : tool.pricing === "paid" ? "Paid" : "Free";
}

function initials(label: string): string {
  return label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

export function ToolWorkspaceShellView({ detail }: { detail: ToolDetailDefinition }) {
  const primaryProcessing = detail.tool.processing[0];

  return (
    <div className="tool-workspace-shell" data-tool-workspace-shell={detail.tool.slug}>
      <div className="llm-cost-layout tool-workspace-handoff-layout">
        <aside className="workspace-panel llm-cost-overview">
          <span className="eyebrow">Tool workspace</span>
          <h1>{detail.tool.name} workspace</h1>
          <p className="subtitle">{detail.overview}</p>
          <div className="badge-row detail-badge-row">
            <span className={badgeClass(detail.listingBadge.tone)}>{detail.listingBadge.badge}</span>
            <span className="badge">{pricingLabel(detail.tool)}</span>
            <span className={badgeClass(primaryProcessing === "ai-consent" ? "ai" : primaryProcessing === "local" ? "local" : "cloud")}>
              {processingLabel[primaryProcessing]}
            </span>
          </div>
          <div className="button-row tool-workspace-action-row">
            <a className="button button-solid" href={detail.tool.aboutHref}>
              Tool details <ArrowRight size={16} aria-hidden="true" />
            </a>
            {detail.recommendedWorkflow ? (
              <a className="button button-outline-neutral" href={detail.recommendedWorkflow.href}>
                Open recommended workflow
              </a>
            ) : null}
          </div>
        </aside>

        <main className="workspace-stack">
          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>{detail.trustSection.title}</h2>
              <span className="badge local">Source-backed</span>
            </div>
            <div className="detail-metric-grid tool-workspace-metric-grid">
              {detail.metrics.map((metric) => (
                <div className="detail-metric" key={`${metric.value}-${metric.label}`}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
            <DetailRows rows={detail.trustSection.rows} />
          </section>

          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>Workspace path</h2>
              <span className="badge">Plan</span>
            </div>
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

          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>Source handoff</h2>
              <span className="badge">Build-ready</span>
            </div>
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
        </main>

        <aside className="workspace-stack">
          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>Full calculator path</h2>
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge local">Now</span>
                <span>{detail.outcome}</span>
              </div>
              <div className="detail-row">
                <span className="badge">Next</span>
                <span>Promote source formulas, inputs, validation, saved scenarios, and export state into a dedicated interactive workspace.</span>
              </div>
              <div className="detail-row">
                <span className="badge warn">Review</span>
                <span>Keep caveats visible before users rely on financial, health, tax, or planning outputs.</span>
              </div>
            </div>
          </section>

          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>Related tools</h2>
              <CircleHelp size={18} aria-hidden="true" />
            </div>
            <div className="detail-resource-list">
              {detail.relatedTools.map((tool) => (
                <a className="detail-resource-row" href={tool.aboutHref} key={tool.slug}>
                  <span className={`icon-tile ${tool.accent}`}>{initials(tool.name)}</span>
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.category}</small>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>Trust boundary</h2>
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <p className="detail-aside-note">
              This workspace keeps the public listing CTA reachable while preserving the local-first and AI-consent labels from the source
              detail.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
