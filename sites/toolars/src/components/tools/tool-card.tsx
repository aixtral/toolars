import { ArrowRight, Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PricingMode, ProcessingMode, ToolDefinition, ToolType } from "@/data/registry";
import { getToolTagMessageKey } from "@/lib/i18n/tool-tags";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { ToolIcon } from "./tool-icon";

const processingLabelKey: Record<ProcessingMode, "processing.local" | "processing.cloud" | "processing.aiConsent"> = {
  local: "processing.local",
  cloud: "processing.cloud",
  "ai-consent": "processing.aiConsent"
};

const pricingLabelKey: Record<PricingMode, "pricing.free" | "pricing.freemium" | "pricing.paid"> = {
  free: "pricing.free",
  freemium: "pricing.freemium",
  paid: "pricing.paid"
};

const toolTypeLabelKey: Record<ToolType, "toolTypes.traditional" | "toolTypes.aiPowered" | "toolTypes.workflow"> = {
  traditional: "toolTypes.traditional",
  ai: "toolTypes.aiPowered",
  workflow: "toolTypes.workflow"
};

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const tTool = useTranslations(`tools.${tool.slug}`);
  const tCommon = useTranslations("common");
  const tTag = useTranslations("commonToolTags");
  const tToolDetail = useTranslations("toolDetail");
  const tSubmitTool = useTranslations("submitTool");
  const name = tTool("name");
  const description = tTool("description");
  const pricingMessageKey = isFreeTrialMode() && tool.pricing !== "free" ? "pricing.freeTrial" : pricingLabelKey[tool.pricing];

  return (
    <article className="tool-card">
      <div className="tool-card-top">
        <span className="icon-tile">
          <ToolIcon tool={tool} />
        </span>
        <div>
          <h3 className="tool-name">{name}</h3>
          <p className="tool-description">{description}</p>
        </div>
      </div>
      <div className="tag-list" aria-label={`${name} ${tSubmitTool("fields.tags")}`}>
        {tool.tags.slice(0, 3).map((tag) => (
          <span className="badge" key={tag}>
            {tTag(getToolTagMessageKey(tag))}
          </span>
        ))}
      </div>
      <div className="tag-list">
        <span className="badge">{tSubmitTool(toolTypeLabelKey[tool.type])}</span>
        {tool.processing.slice(0, 2).map((mode) => (
          <span className={`badge ${mode === "local" ? "local" : mode === "ai-consent" ? "ai" : "cloud"}`} key={mode}>
            {tToolDetail(processingLabelKey[mode])}
          </span>
        ))}
      </div>
      <div className="tool-footer">
        <span className="badge local">{tToolDetail(pricingMessageKey)}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Bookmark size={16} color="#6b7280" aria-hidden="true" />
          <a className="open-link" href={tool.href}>
            {tCommon("open")} <ArrowRight size={14} aria-hidden="true" />
          </a>
        </span>
      </div>
    </article>
  );
}
