"use client";

import { ClipboardCheck, ClipboardCopy, FileText, Pilcrow, RefreshCcw, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateLoremIpsum, type LoremIpsumResult } from "@/lib/tools/lorem-ipsum";

export function LoremIpsumWorkspace() {
  const t = useTranslations("tools.lorem-ipsum.workspace");
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [result, setResult] = useState<LoremIpsumResult | null>(null);
  const [copied, setCopied] = useState(false);

  const generateCopy = () => {
    setCopied(false);
    setResult(generateLoremIpsum({ paragraphs, wordsPerParagraph, startWithLorem }));
  };

  const copyAll = async () => {
    if (!result?.text || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="lorem-ipsum"
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
            <span className="badge">{t("badges.range")}</span>
            <span>{t("rangeCopy")}</span>
          </div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("optionsTitle")}</h2>
              <p className="tool-description">{t("optionsDescription")}</p>
            </div>
            <Pilcrow size={18} aria-hidden="true" />
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="lorem-ipsum-paragraphs">
              {t("paragraphsLabel")}
              <input
                className="input"
                id="lorem-ipsum-paragraphs"
                max={100}
                min={1}
                onChange={(event) => {
                  setParagraphs(Number(event.target.value));
                  setResult(null);
                  setCopied(false);
                }}
                type="number"
                value={paragraphs}
              />
            </label>
            <label className="field-label" htmlFor="lorem-ipsum-words">
              {t("wordsLabel")}
              <input
                className="input"
                id="lorem-ipsum-words"
                max={500}
                min={5}
                onChange={(event) => {
                  setWordsPerParagraph(Number(event.target.value));
                  setResult(null);
                  setCopied(false);
                }}
                type="number"
                value={wordsPerParagraph}
              />
            </label>
          </div>

          <div className="detail-row-list" style={{ marginTop: 18 }}>
            <label className="detail-row" htmlFor="lorem-ipsum-start">
              <span className="badge">{t("badges.classic")}</span>
              <span>{t("startLabel")}</span>
              <input
                aria-label={t("startLabel")}
                checked={startWithLorem}
                id="lorem-ipsum-start"
                onChange={(event) => {
                  setStartWithLorem(event.target.checked);
                  setResult(null);
                  setCopied(false);
                }}
                type="checkbox"
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" onClick={generateCopy} type="button">
              <RefreshCcw size={16} aria-hidden="true" /> {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getLoremSummary(result, t) : t("emptyResult")}</p>
            </div>
            <FileText size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.paragraphs.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("paragraphCountLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.words.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("wordCountLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.characters.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("characterCountLabel")}</span>
            </article>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("outputTitle")}</h2>
              <p className="tool-description">{t("outputDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.text} onClick={copyAll} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>

          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.text || t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.overflow"), t("reviewItems.realism"), t("reviewItems.copy")].map((item, index) => (
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
            <FileText size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getLoremSummary(result: LoremIpsumResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t(`errors.${result.error?.type ?? "generation-failed"}`);
  return t("generatedSummary", {
    paragraphs: result.stats.paragraphs,
    words: result.stats.words
  });
}
