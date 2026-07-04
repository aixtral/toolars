"use client";

import { ClipboardList, FileText, Gauge, Minimize2, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  analyzeSystemPromptCompression,
  type PromptCompressionSuggestion,
  type SystemPromptCompressionResult
} from "@/lib/tools/system-prompt-compressor";

export function SystemPromptCompressorWorkspace() {
  const t = useTranslations("tools.system-prompt-compressor.workspace");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<SystemPromptCompressionResult | null>(null);
  const hasPrompt = prompt.trim().length > 0;

  const runCompression = () => {
    setResult(analyzeSystemPromptCompression({ text: prompt }));
  };

  const updatePrompt = (value: string) => {
    setPrompt(value);
    setResult(null);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="system-prompt-compressor"
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
            <span className="badge">{t("badges.review")}</span>
            <span>{t("reviewCopy")}</span>
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

          <label className="field-label" htmlFor="system-prompt-compressor-input">
            {t("promptLabel")}
            <textarea
              className="input"
              id="system-prompt-compressor-input"
              onChange={(event) => updatePrompt(event.target.value)}
              placeholder={t("promptPlaceholder")}
              rows={10}
              value={prompt}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasPrompt} onClick={runCompression} type="button">
              <Minimize2 size={16} aria-hidden="true" /> {t("compressButton")}
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
              <strong>{result?.originalTokens.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("originalTokens")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.compressedTokens.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("compressedTokens")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.tokensSaved.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("tokensSaved")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.compressionRatio}%` : "0%"}</strong>
              <span>{t("compressionRatio")}</span>
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

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("suggestionsTitle")}</h2>
              <p className="tool-description">{t("suggestionsDescription")}</p>
            </div>
            <Sparkles size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {result?.suggestions.length ? (
              result.suggestions.map((suggestion) => (
                <SuggestionRow key={`${suggestion.type}-${suggestion.original}`} suggestion={suggestion} />
              ))
            ) : (
              <p className="detail-aside-note">{result ? t("noSuggestions") : t("waitingSuggestions")}</p>
            )}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("compressedPromptTitle")}</h2>
              <p className="tool-description">{t("compressedPromptDescription")}</p>
            </div>
            <FileText size={18} aria-hidden="true" />
          </div>
          <pre className="textarea prompt-textarea">{result?.compressedText || t("emptyCompressedPrompt")}</pre>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("preservationTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {(result?.preservationChecks ?? []).map((check, index) => (
              <div className="remediation-row" key={check.key}>
                <span>{index + 1}</span>
                <p>
                  <strong>{check.label}</strong>
                  <br />
                  {check.detail}
                </p>
              </div>
            ))}
            {!result ? <p className="detail-aside-note">{t("waitingPreservation")}</p> : null}
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

function SuggestionRow({ suggestion }: { suggestion: PromptCompressionSuggestion }) {
  const t = useTranslations("tools.system-prompt-compressor.workspace");

  return (
    <article className="detail-resource-row">
      <span className="icon-tile blue">
        <Minimize2 size={16} aria-hidden="true" />
      </span>
      <span>
        <strong>{t(`suggestionTypes.${suggestion.type}`)}</strong>
        <small>
          {suggestion.original}
          {" -> "}
          {suggestion.suggestion}
        </small>
      </span>
      <span className="badge">{t("suggestionSavings", { count: suggestion.savings })}</span>
    </article>
  );
}
