"use client";

import { Scan, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { detectJailbreakRisk, type JailbreakDetectionResult } from "@/lib/tools/jailbreak-detector";

export function JailbreakDetectorWorkspace() {
  const t = useTranslations("tools.jailbreak-detector.workspace");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<JailbreakDetectionResult | null>(null);

  function scanPrompt() {
    setResult(detectJailbreakRisk(prompt));
  }

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="jailbreak-detector"
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
            <ShieldAlert size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="jailbreak-prompt">
            {t("promptLabel")}
            <textarea
              className="input"
              id="jailbreak-prompt"
              onChange={(event) => {
                setPrompt(event.target.value);
                setResult(null);
              }}
              rows={9}
              value={prompt}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!prompt.trim()} onClick={scanPrompt} type="button">
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
            <TriangleAlert size={18} aria-hidden="true" />
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.riskScore ?? 0}</strong>
              <span>{t("scoreLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`riskLevels.${result.riskLevel}`) : t("riskLevels.low")}</strong>
              <span>{t("riskLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.findings.length ?? 0}</strong>
              <span>{t("findingsLabel")}</span>
            </article>
          </div>
          <div className="detail-resource-list" style={{ marginTop: 20 }}>
            {result?.findings.length ? result.findings.map((finding) => (
              <article className="detail-resource-row" key={`${finding.categoryKey}-${finding.match}`}>
                <span className="icon-tile amber"><TriangleAlert size={16} aria-hidden="true" /></span>
                <span>
                  <strong>{finding.label}</strong>
                  <small>{finding.match}</small>
                </span>
                <span className="badge ai">{t(`severity.${finding.severity}`)}</span>
              </article>
            )) : <p className="detail-aside-note">{result ? t("noFindings") : t("waitingFindings")}</p>}
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("mitigationsTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {(result?.recommendations ?? [t("waitingMitigations")]).map((item, index) => (
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
