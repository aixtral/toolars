"use client";

import { MessageSquareWarning, Scan, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { scanToxicity, type ToxicityScanResult } from "@/lib/tools/toxicity-scanner";

export function ToxicityScannerWorkspace() {
  const t = useTranslations("tools.toxicity-scanner.workspace");
  const [text, setText] = useState("");
  const [result, setResult] = useState<ToxicityScanResult | null>(null);

  const runScan = () => {
    setResult(scanToxicity(text));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="toxicity-scanner"
    >
      <section className="workspace-panel prompt-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <MessageSquareWarning size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="toxicity-text">
            {t("textLabel")}
            <textarea className="input" id="toxicity-text" onChange={(event) => { setText(event.target.value); setResult(null); }} rows={9} value={text} />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!text.trim()} onClick={runScan} type="button">
              <Scan size={16} aria-hidden="true" /> {t("scanButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
            </div>
            <span className={result?.riskLevel === "safe" ? "badge local" : "badge ai"}>{result ? t(`riskLevels.${result.riskLevel}`) : t("badges.waiting")}</span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.safetyScore ?? 100}</strong>
              <span>{t("safetyScoreLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.categories.filter((category) => category.flagged).length ?? 0}</strong>
              <span>{t("flaggedLabel")}</span>
            </article>
          </div>
          <div className="detail-resource-list" style={{ marginTop: 20 }}>
            {result?.categories.filter((category) => category.flagged).map((category) => (
              <article className="detail-resource-row" key={category.key}>
                <span className="icon-tile amber"><MessageSquareWarning size={16} aria-hidden="true" /></span>
                <span>
                  <strong>{category.label}</strong>
                  <small>{category.matches.join(", ")}</small>
                </span>
                <span className="badge ai">{Math.round(category.score * 100)}%</span>
              </article>
            )) ?? <p className="detail-aside-note">{t("waitingCategories")}</p>}
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("notesTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {(result?.recommendations ?? [t("waitingNotes")]).map((item, index) => (
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
