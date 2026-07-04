"use client";

import { FileSearch, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { checkHallucinations, type HallucinationCheckResult } from "@/lib/tools/hallucination-checker";

export function HallucinationCheckerWorkspace() {
  const t = useTranslations("tools.hallucination-checker.workspace");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState("");
  const [result, setResult] = useState<HallucinationCheckResult | null>(null);
  const canCheck = answer.trim().length > 0;

  const runCheck = () => setResult(checkHallucinations({ answer, sources }));

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="hallucination-checker"
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
            <FileSearch size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="hallucination-answer">
            {t("answerLabel")}
            <textarea className="input" id="hallucination-answer" onChange={(event) => { setAnswer(event.target.value); setResult(null); }} rows={7} value={answer} />
          </label>
          <label className="field-label" htmlFor="hallucination-sources" style={{ marginTop: 16 }}>
            {t("sourcesLabel")}
            <textarea className="input" id="hallucination-sources" onChange={(event) => { setSources(event.target.value); setResult(null); }} rows={5} value={sources} />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!canCheck} onClick={runCheck} type="button">
              <FileSearch size={16} aria-hidden="true" /> {t("checkButton")}
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
              <strong>{result?.score ?? 0}</strong>
              <span>{t("scoreLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`riskLevels.${result.riskLevel}`) : t("riskLevels.low")}</strong>
              <span>{t("riskLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.unsupportedClaims ?? 0}</strong>
              <span>{t("unsupportedLabel")}</span>
            </article>
          </div>
          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge local">{t("badges.local")}</span>
                <span>{result.privacyNote}</span>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("claimsTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="detail-resource-list">
            {result?.claims.length ? result.claims.slice(0, 6).map((claim) => (
              <article className="detail-resource-row" key={`${claim.type}-${claim.text}`}>
                <span className={`icon-tile ${claim.supported ? "green" : "amber"}`}><TriangleAlert size={16} aria-hidden="true" /></span>
                <span>
                  <strong>{t(`claimTypes.${claim.type}`)}</strong>
                  <small>{claim.text}</small>
                </span>
                <span className={claim.supported ? "badge local" : "badge ai"}>{claim.supported ? t("supported") : t("unsupported")}</span>
              </article>
            )) : <p className="detail-aside-note">{result ? t("noClaims") : t("waitingClaims")}</p>}
          </div>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
