import { ArrowRight, BookmarkPlus, Share2 } from "lucide-react";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import type { CollectionBadgeTone, CollectionDetailDefinition, CollectionDetailStep } from "@/data/collection-details";
import type { ProcessingMode, ToolDefinition } from "@/data/registry";

const processingLabel: Record<ProcessingMode, string> = {
  local: "Local",
  cloud: "Cloud",
  "ai-consent": "AI consent"
};

function badgeClass(tone?: CollectionBadgeTone): string {
  return tone ? `badge ${tone}` : "badge";
}

function initials(label: string): string {
  return label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function processingTone(tool: ToolDefinition): CollectionBadgeTone {
  if (tool.processing.includes("ai-consent")) return "ai";
  if (tool.processing[0] === "local") return "local";
  return "cloud";
}

function processingBadgeLabel(tool: ToolDefinition): string {
  if (tool.processing.includes("ai-consent")) return processingLabel["ai-consent"];
  return processingLabel[tool.processing[0]];
}

function PathStep({ step, index }: { step: CollectionDetailStep; index: number }) {
  return (
    <article className="detail-step-row">
      <span className="mcp-stage-number">{index + 1}</span>
      <span>
        <strong>{step.title}</strong>
        <small>{step.description}</small>
      </span>
      <span className={badgeClass(step.tone)}>{step.badge}</span>
    </article>
  );
}

export function CollectionDetailView({ detail }: { detail: CollectionDetailDefinition }) {
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
            <span className="badge workflow">{detail.collection.visibility}</span>
            <span className="badge local">{detail.collection.toolSlugs.length} tools</span>
            <span className="badge">{detail.collection.workflowSlugs.length} workflows</span>
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
            sharePath={detail.collection.href}
            shareTitle="Share collection"
          >
            <Share2 size={16} aria-hidden="true" /> Share
          </CoreActionModalButton>
          <CoreActionModalButton className="button button-solid" itemName={detail.collection.title} kind="save-collection">
            <BookmarkPlus size={16} aria-hidden="true" /> Save collection
          </CoreActionModalButton>
        </div>
      </header>

      <div className="tool-detail-grid collection-detail-grid">
        <section className="tool-detail-main">
          <section className="panel collection-recommended-panel">
            <div className="collection-section-head">
              <div>
                <h2>Recommended path</h2>
                <p className="tool-description">Start with the highest-confidence route through this collection.</p>
              </div>
              <a className="button button-solid" href={detail.secondaryAction.href}>
                {detail.secondaryAction.label} <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="detail-step-list">
              {detail.recommendedPath.map((step, index) => (
                <PathStep index={index} key={step.title} step={step} />
              ))}
            </div>
          </section>

          <section className="panel section collection-tools-panel">
            <div className="collection-section-head">
              <div>
                <h2>Tools in this collection</h2>
                <p className="tool-description">Catalog entries and workspaces that make up the collection.</p>
              </div>
              <a className="button button-outline-neutral" href={detail.primaryAction.href}>
                {detail.primaryAction.label}
              </a>
            </div>
            <div className="collection-tool-grid">
              {detail.tools.map((tool) => (
                <a className="collection-tool-card" href={tool.href} key={tool.slug}>
                  <span className={`icon-tile ${tool.accent}`}>{initials(tool.name)}</span>
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.description}</small>
                  </span>
                  <span className={badgeClass(processingTone(tool))}>{processingBadgeLabel(tool)}</span>
                </a>
              ))}
            </div>
          </section>

          {detail.playbooks.length > 0 ? (
            <section className="panel section">
              <h2>Playbooks</h2>
              <div className="detail-resource-list">
                {detail.playbooks.map((playbook) => (
                  <article className="detail-resource-row" key={playbook.title}>
                    <span className={`icon-tile ${playbook.accent}`}>{initials(playbook.title)}</span>
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
            <h2>Collection notes</h2>
            <p className="detail-aside-note">{detail.notes}</p>
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge local">Curator</span>
                <span>{detail.collection.curator}</span>
              </div>
              <div className="detail-row">
                <span className="badge">Visibility</span>
                <span>{detail.collection.visibility}</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Workflows included</h2>
            <div className="detail-resource-list">
              {detail.workflows.map((workflow) => (
                <a className="detail-resource-row" href={workflow.href} key={workflow.slug}>
                  <span className="icon-tile purple">{workflow.steps.length}</span>
                  <span>
                    <strong>{workflow.title}</strong>
                    <small>
                      {workflow.estimatedMinutes} min · {workflow.runCount} runs
                    </small>
                  </span>
                  <span className={workflow.aiRequired ? "badge ai" : "badge local"}>
                    {workflow.aiRequired ? "AI" : "Local"}
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
