import { ArrowRight, Bookmark } from "lucide-react";
import type { ToolDefinition } from "@/data/registry";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { ToolIcon } from "./tool-icon";

const processingLabel: Record<string, string> = {
  local: "Local",
  cloud: "Cloud",
  "ai-consent": "AI consent"
};

function pricingLabel(tool: ToolDefinition): string {
  if (isFreeTrialMode() && tool.pricing !== "free") return "Free trial";
  if (tool.pricing === "freemium") return "Freemium";
  if (tool.pricing === "paid") return "Paid";
  return "Free";
}

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <article className="tool-card">
      <div className="tool-card-top">
        <span className="icon-tile">
          <ToolIcon tool={tool} />
        </span>
        <div>
          <h3 className="tool-name">{tool.name}</h3>
          <p className="tool-description">{tool.description}</p>
        </div>
      </div>
      <div className="tag-list" aria-label={`${tool.name} tags`}>
        {tool.tags.slice(0, 3).map((tag) => (
          <span className="badge" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="tag-list">
        <span className="badge">{tool.type === "ai" ? "AI-powered" : tool.type}</span>
        {tool.processing.slice(0, 2).map((mode) => (
          <span className={`badge ${mode === "local" ? "local" : mode === "ai-consent" ? "ai" : "cloud"}`} key={mode}>
            {processingLabel[mode]}
          </span>
        ))}
      </div>
      <div className="tool-footer">
        <span className="badge local">{pricingLabel(tool)}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Bookmark size={16} color="#6b7280" aria-hidden="true" />
          <a className="open-link" href={tool.href}>
            Open <ArrowRight size={14} aria-hidden="true" />
          </a>
        </span>
      </div>
    </article>
  );
}
