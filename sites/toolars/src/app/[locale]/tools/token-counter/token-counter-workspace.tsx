"use client";

import { useState } from "react";
import { Calculator, ClipboardList, DollarSign, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  calculateTokenCount,
  tokenCounterProfiles,
  type TokenCounterModelKey,
  type TokenCounterResult
} from "@/lib/tools/token-counter";

const defaultText = "";
const defaultModel: TokenCounterModelKey = "gpt-4o";

export function TokenCounterWorkspace() {
  const t = useTranslations("tools.token-counter.workspace");
  const [text, setText] = useState(defaultText);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [result, setResult] = useState(null as TokenCounterResult | null);
  const hasPrompt = text.trim().length > 0;

  const runCount = () => {
    setResult(calculateTokenCount({ text, selectedModel }));
  };

  const updateText = (value: string) => {
    setText(value);
    setResult(null);
  };

  const updateModel = (value: string) => {
    setSelectedModel(value as TokenCounterModelKey);
    setResult(null);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="token-counter"
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
            <span className="badge">{t("badges.estimate")}</span>
            <span>{t("estimateCopy")}</span>
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
            <span className="badge local">{t("badges.local")}</span>
          </div>

          <label className="field-label" htmlFor="token-counter-text">
            {t("promptLabel")}
            <textarea
              className="input"
              id="token-counter-text"
              onChange={(event) => updateText(event.target.value)}
              placeholder={t("promptPlaceholder")}
              rows={10}
              value={text}
            />
          </label>

          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="token-counter-model">
              {t("modelLabel")}
              <select className="input" id="token-counter-model" onChange={(event) => updateModel(event.target.value)} value={selectedModel}>
                {Object.values(tokenCounterProfiles).map((profile) => (
                  <option key={profile.key} value={profile.key}>
                    {profile.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasPrompt} onClick={runCount} type="button">
              <Calculator size={16} aria-hidden="true" /> {t("countButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? result.summary : t("emptyResult")}</p>
            </div>
            <Gauge size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.estimatedTokens.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("tokensLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedEstimatedCost ?? "$0.000000"}</strong>
              <span>{t("costLabel")}</span>
            </article>
          </div>

          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge">{t("charactersBadge")}</span>
                <span>{t("characters", { count: result.characterCount })}</span>
              </div>
              <div className="detail-row">
                <span className="badge">{t("wordsBadge")}</span>
                <span>{t("words", { count: result.wordCount, lines: result.lineCount })}</span>
              </div>
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
            <div>
              <h2>{t("modelComparisonTitle")}</h2>
              <p className="tool-description">{t("modelComparisonDescription")}</p>
            </div>
            <DollarSign size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {(result?.modelRows ?? Object.values(tokenCounterProfiles).map((model) => ({
              model,
              estimatedCost: 0,
              formattedEstimatedCost: "$0.000000"
            }))).map((row) => (
              <article className="detail-resource-row" key={row.model.key}>
                <span className="icon-tile blue">
                  <DollarSign size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>{row.model.label}</strong>
                  <small>{t("perThousand", { cost: row.model.costPerThousandTokens })}</small>
                </span>
                <span className="badge">{row.formattedEstimatedCost}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.context"), t("reviewItems.tokenizer"), t("reviewItems.cost")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("handoffTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
