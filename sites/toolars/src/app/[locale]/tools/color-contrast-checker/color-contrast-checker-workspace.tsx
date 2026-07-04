"use client";

import { Accessibility, ArrowLeftRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { checkColorContrast, type ContrastCheckResult } from "@/lib/tools/color-contrast-checker";

export function ColorContrastCheckerWorkspace() {
  const t = useTranslations("tools.color-contrast-checker.workspace");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [result, setResult] = useState<ContrastCheckResult | null>(null);

  const runCheck = () => {
    setResult(checkColorContrast({ foreground, background }));
  };

  const swapColors = () => {
    setForeground(background);
    setBackground(foreground);
    setResult(null);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="color-contrast-checker"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row">
            <span className="badge local">{t("badges.local")}</span>
            <span>{t("localCopy")}</span>
          </div>
          <div className="detail-row">
            <span className="badge">{t("badges.wcag")}</span>
            <span>{t("wcagCopy")}</span>
          </div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <Accessibility size={18} aria-hidden="true" />
          </div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="contrast-foreground">
              {t("foregroundLabel")}
              <input className="input" id="contrast-foreground" onChange={(event) => { setForeground(event.target.value); setResult(null); }} value={foreground} />
            </label>
            <label className="field-label" htmlFor="contrast-background">
              {t("backgroundLabel")}
              <input className="input" id="contrast-background" onChange={(event) => { setBackground(event.target.value); setResult(null); }} value={background} />
            </label>
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={runCheck} type="button">
              <ShieldCheck size={16} aria-hidden="true" /> {t("checkButton")}
            </button>
            <button className="button" onClick={swapColors} type="button">
              <ArrowLeftRight size={16} aria-hidden="true" /> {t("swapButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? result.summary : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.ready") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedRatio ?? "0.00:1"}</strong>
              <span>{t("ratioLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.success && result.wcag.aa.normal ? t("passLabel") : t("failLabel")}</strong>
              <span>{t("aaNormalLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.success && result.wcag.aaa.normal ? t("passLabel") : t("failLabel")}</strong>
              <span>{t("aaaNormalLabel")}</span>
            </article>
          </div>

          <div className="detail-row-list" style={{ marginTop: 20 }}>
            <div className="detail-row">
              <span className={result?.wcag.aa.normal ? "badge local" : "badge ai"}>{t("aaNormalLabel")}</span>
              <span>{result?.wcag.aa.normal ? t("passCopy") : t("failCopy")}</span>
            </div>
            <div className="detail-row">
              <span className={result?.wcag.aaa.normal ? "badge local" : "badge"}>{t("aaaNormalLabel")}</span>
              <span>{result?.wcag.aaa.normal ? t("passCopy") : t("failCopy")}</span>
            </div>
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div
            aria-label={t("previewLabel")}
            style={{
              background,
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: foreground,
              padding: 24
            }}
          >
            <strong>{t("previewText")}</strong>
            <p className="detail-aside-note" style={{ color: "inherit" }}>{t("previewCopy")}</p>
          </div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.normal"), t("reviewItems.large"), t("reviewItems.tokens")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
