"use client";

import { BarChart3, ClipboardList, Copy, FileText, Gauge, Hash, ShieldCheck, Sparkles, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { analyzeText, type TextStatsResult } from "@/lib/tools/text-stats";

const statItems = [
  { key: "words", labelKey: "wordsLabel" },
  { key: "characters", labelKey: "charactersLabel" },
  { key: "sentences", labelKey: "sentencesLabel" },
  { key: "paragraphs", labelKey: "paragraphsLabel" },
  { key: "lines", labelKey: "linesLabel" },
  { key: "charactersNoSpaces", labelKey: "charactersNoSpacesLabel" }
] as const;

export function TextStatsWorkspace() {
  const t = useTranslations("tools.text-stats.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<TextStatsResult | null>(null);
  const hasInput = input.trim().length > 0;

  const runAnalysis = () => {
    setResult(analyzeText(input));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
  };

  const clearWorkspace = () => {
    setInput("");
    setResult(null);
  };

  const copySummary = () => {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) return;

    const lines = [
      `${t("wordsLabel")}: ${result.stats.words}`,
      `${t("charactersLabel")}: ${result.stats.characters}`,
      `${t("sentencesLabel")}: ${result.stats.sentences}`,
      `${t("paragraphsLabel")}: ${result.stats.paragraphs}`,
      `${t("readingTimeLabel")}: ${result.stats.readingTime}`,
      `${t("speakingTimeLabel")}: ${result.stats.speakingTime}`
    ];
    void navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="text-stats"
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
            <span className="badge">{t("badges.reading")}</span>
            <span>{t("readingCopy")}</span>
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
            <Type size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="text-stats-input">
            {t("sourceLabel")}
            <textarea
              className="input"
              id="text-stats-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("sourcePlaceholder")}
              rows={10}
              value={input}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={runAnalysis} type="button">
              <Sparkles size={16} aria-hidden="true" /> {t("analyzeButton")}
            </button>
            <button className="button" disabled={!hasInput && !result} onClick={clearWorkspace} type="button">
              <FileText size={16} aria-hidden="true" /> {t("clearButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">
                {result ? t("resultSummary", { words: result.stats.words, paragraphs: result.stats.paragraphs }) : t("emptyResult")}
              </p>
            </div>
            <Gauge size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            {statItems.map((item) => (
              <article className="llm-metric" key={item.key}>
                <strong>{result?.stats[item.key] ?? 0}</strong>
                <span>{t(item.labelKey)}</span>
              </article>
            ))}
          </div>

          <div className="detail-row-list" style={{ marginTop: 20 }}>
            <div className="detail-row">
              <span className="badge">{t("badges.reading")}</span>
              <span>
                {t("readingTimeLabel")}: <strong>{result?.stats.readingTime ?? "0 sec"}</strong>
              </span>
            </div>
            <div className="detail-row">
              <span className="badge">{t("badges.speaking")}</span>
              <span>
                {t("speakingTimeLabel")}: <strong>{result?.stats.speakingTime ?? "0 sec"}</strong>
              </span>
            </div>
          </div>

          <div className="button-row">
            <button className="button" disabled={!result} onClick={copySummary} type="button">
              <Copy size={16} aria-hidden="true" /> {t("copyButton")}
            </button>
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("topWordsTitle")}</h2>
              <p className="tool-description">{result ? t("topWordsDescription") : t("emptyTopWords")}</p>
            </div>
            <Hash size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {result?.topWords.length ? (
              result.topWords.map((item) => (
                <article className="detail-resource-row" key={item.word}>
                  <span className="icon-tile blue">
                    <BarChart3 size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{item.word}</strong>
                    <small>{t("wordUses", { count: item.count })}</small>
                  </span>
                </article>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyTopWords")}</p>
            )}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.length"), t("reviewItems.repetition"), t("reviewItems.structure")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="detail-row-list" style={{ marginTop: 20 }}>
            <div className="detail-row">
              <span className="badge local">{t("badges.local")}</span>
              <span>{t("privacyNote")}</span>
            </div>
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
