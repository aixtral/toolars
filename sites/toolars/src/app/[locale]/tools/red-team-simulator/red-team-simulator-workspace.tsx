"use client";

import { ClipboardList, FlaskConical, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { runRedTeamSimulation, type RedTeamSimulationResult } from "@/lib/tools/red-team-simulator";

export function RedTeamSimulatorWorkspace() {
  const t = useTranslations("tools.red-team-simulator.workspace");
  const [targetPrompt, setTargetPrompt] = useState("");
  const [result, setResult] = useState<RedTeamSimulationResult | null>(null);

  const run = () => setResult(runRedTeamSimulation({ targetPrompt }));

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="red-team-simulator"
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
            <FlaskConical size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="red-team-target">
            {t("targetLabel")}
            <textarea className="input" id="red-team-target" onChange={(event) => { setTargetPrompt(event.target.value); setResult(null); }} rows={9} value={targetPrompt} />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!targetPrompt.trim()} onClick={run} type="button">
              <FlaskConical size={16} aria-hidden="true" /> {t("runButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
            </div>
            <span className={result ? "badge ai" : "badge"}>{result ? t(`riskLevels.${result.overallRisk}`) : t("badges.waiting")}</span>
          </div>
          <div className="detail-resource-list">
            {(result?.scores ?? []).map((score) => (
              <article className="detail-resource-row" key={score.vector}>
                <span className="icon-tile amber"><ShieldAlert size={16} aria-hidden="true" /></span>
                <span>
                  <strong>{t(`vectors.${score.vector}`)}</strong>
                  <small>{score.score.toLocaleString("en-US")} / {score.maxScore.toLocaleString("en-US")}</small>
                </span>
                <span className="badge">{Math.round((score.score / score.maxScore) * 100)}%</span>
              </article>
            ))}
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("casesTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <div className="detail-resource-list">
            {result?.testCases.slice(0, 5).map((testCase) => (
              <article className="detail-resource-row" key={testCase.id}>
                <span className="icon-tile blue"><FlaskConical size={16} aria-hidden="true" /></span>
                <span>
                  <strong>{t(`vectors.${testCase.vector}`)}</strong>
                  <small>{testCase.description}</small>
                </span>
                <span className="badge">{testCase.severity}</span>
              </article>
            )) ?? <p className="detail-aside-note">{t("waitingCases")}</p>}
          </div>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
