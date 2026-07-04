"use client";

import { ClipboardCheck, ClipboardCopy, Code2, FileCode2, Repeat2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  convertHtmlEntities,
  type HtmlEntityConversionMode,
  type HtmlEntityConverterResult,
  type HtmlEntityStyle
} from "@/lib/tools/html-entity-encoder";

const modes: HtmlEntityConversionMode[] = ["encode", "decode"];
const styles: HtmlEntityStyle[] = ["named", "decimal", "hex"];
const initialMode: HtmlEntityConversionMode = "encode";
const initialStyle: HtmlEntityStyle = "named";

export function HtmlEntityEncoderWorkspace() {
  const t = useTranslations("tools.html-entity-encoder.workspace");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState(initialMode);
  const [style, setStyle] = useState(initialStyle);
  const [result, setResult] = useState(null as HtmlEntityConverterResult | null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.length > 0;

  const runConversion = () => {
    setCopied(false);
    setResult(convertHtmlEntities({ input, mode, style }));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result?.output || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="html-entity-encoder"
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
            <span className="badge">{t("badges.safe")}</span>
            <span>{t("safeCopy")}</span>
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
            <Code2 size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="html-entity-encoder-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="html-entity-encoder-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={8}
              value={input}
            />
          </label>

          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="html-entity-encoder-mode">
              {t("modeLabel")}
              <select
                className="input"
                id="html-entity-encoder-mode"
                onChange={(event) => {
                  setMode(event.target.value as HtmlEntityConversionMode);
                  setResult(null);
                  setCopied(false);
                }}
                value={mode}
              >
                {modes.map((item) => (
                  <option key={item} value={item}>
                    {t(`modes.${item}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="html-entity-encoder-style">
              {t("styleLabel")}
              <select
                className="input"
                id="html-entity-encoder-style"
                onChange={(event) => {
                  setStyle(event.target.value as HtmlEntityStyle);
                  setResult(null);
                  setCopied(false);
                }}
                value={style}
              >
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {t(`styles.${item}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={runConversion} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getHtmlEntitySummary(result, t) : t("emptyResult")}</p>
            </div>
            <FileCode2 size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.inputCharacters.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("inputCharacters")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.outputCharacters.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("outputCharacters")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.convertedEntities.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("convertedEntities")}</span>
            </article>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("outputTitle")}</h2>
              <p className="tool-description">{t("outputDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.output} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>

          <pre aria-label={t("outputLabel")} className="textarea prompt-textarea">
            {result?.output || t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{result?.mode === "decode" ? t("reviewItems.decode") : t("reviewItems.encode")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.render"), t("reviewItems.unknown"), t("reviewItems.copy")].map((item, index) => (
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
            <FileCode2 size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getHtmlEntitySummary(result: HtmlEntityConverterResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return result.mode === "encode"
    ? t("encodedSummary", { count: result.stats.convertedEntities })
    : t("decodedSummary", { count: result.stats.convertedEntities });
}
