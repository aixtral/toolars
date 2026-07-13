import { ArrowRight, CheckCircle2, CircleHelp, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ProcessingMode, ToolDefinition } from "@/data/registry";
import type { DetailBadgeTone, ToolDetailDefinition, ToolDetailRow } from "@/data/tool-details";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { ToolarsRecentToolRecorder } from "@/components/workspace/toolars-recent-tool-recorder";

function badgeClass(tone?: DetailBadgeTone): string {
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

function DetailRows({ rows }: { rows: ToolDetailRow[] }) {
  return (
    <div className="detail-row-list">
      {rows.map((row, index) => (
        <div className="detail-row" key={`${row.badge}-${index}`}>
          <span className={badgeClass(row.tone)}>{row.badge}</span>
          <span>{row.description}</span>
        </div>
      ))}
    </div>
  );
}

export function ToolWorkspaceShellView({ detail }: { detail: ToolDetailDefinition }) {
  const t = useTranslations("toolWorkspace");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => {
    if (href.startsWith("/")) {
      return localizePath(href, localeCode);
    }

    return href;
  };
  const primaryProcessing = detail.tool.processing[0];
  const freeTrial = isFreeTrialMode();
  let pricing = t("pricing.free");
  if (freeTrial && detail.tool.pricing !== "free") {
    pricing = t("pricing.freeTrial");
  } else if (detail.tool.pricing === "freemium") {
    pricing = t("pricing.freemium");
  } else if (detail.tool.pricing === "paid") {
    pricing = t("pricing.paid");
  }

  let procLabel = t("processing.aiConsent");
  if (primaryProcessing === "local") {
    procLabel = t("processing.local");
  } else if (primaryProcessing === "cloud") {
    procLabel = t("processing.cloud");
  }

  return (
    <div className="tool-workspace-shell" data-tool-workspace-shell={detail.tool.slug}>
      <ToolarsRecentToolRecorder locale={localeCode} toolSlug={detail.tool.slug} />
      <div className="llm-cost-layout tool-workspace-handoff-layout">
        <aside className="workspace-panel llm-cost-overview">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1>{t("workspaceTitle", { name: detail.tool.name })}</h1>
          <p className="subtitle">{detail.overview}</p>
          <div className="badge-row detail-badge-row">
            <span className={badgeClass(detail.listingBadge.tone)}>{detail.listingBadge.badge}</span>
            <span className="badge">{pricing}</span>
            <span className={badgeClass(primaryProcessing === "ai-consent" ? "ai" : primaryProcessing === "local" ? "local" : "cloud")}>
              {procLabel}
            </span>
          </div>
          <div className="button-row tool-workspace-action-row">
            <a className="button button-solid" href={localizedHref(detail.tool.aboutHref)}>
              {t("toolDetails")} <ArrowRight size={16} aria-hidden="true" />
            </a>
            {detail.recommendedWorkflow ? (
              <a className="button button-outline-neutral" href={localizedHref(detail.recommendedWorkflow.href)}>
                {t("openWorkflow")}
              </a>
            ) : null}
          </div>
        </aside>

        <main className="workspace-stack">
          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>{detail.trustSection.title}</h2>
              <span className="badge local">{t("badges.sourceBacked")}</span>
            </div>
            <DetailRows rows={detail.trustSection.rows} />
          </section>

          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>{t("sections.workspacePath")}</h2>
              <span className="badge">{t("badges.plan")}</span>
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
              <h2>{t("sections.sourceHandoff")}</h2>
              <span className="badge">{t("badges.buildReady")}</span>
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
              <h2>{t("sections.fullPath")}</h2>
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge local">{t("badges.now")}</span>
                <span>{detail.outcome}</span>
              </div>
              <div className="detail-row">
                <span className="badge">{t("badges.next")}</span>
                <span>{t("fullPath.next")}</span>
              </div>
              <div className="detail-row">
                <span className="badge warn">{t("badges.review")}</span>
                <span>{t("fullPath.review")}</span>
              </div>
            </div>
          </section>

          <section className="workspace-panel">
            <div className="workspace-section-title">
              <h2>{t("sections.relatedTools")}</h2>
              <CircleHelp size={18} aria-hidden="true" />
            </div>
            <div className="detail-resource-list">
              {detail.relatedTools.map((tool) => (
                <a className="detail-resource-row" href={localizedHref(tool.aboutHref)} key={tool.slug}>
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
              <h2>{t("sections.trustBoundary")}</h2>
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <p className="detail-aside-note">
              {t("trustBoundaryNote")}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
