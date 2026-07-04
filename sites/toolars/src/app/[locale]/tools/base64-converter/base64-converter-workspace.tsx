"use client";

import { ClipboardCheck, ClipboardCopy, FileCode2, Gauge, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  convertBase64Payload,
  type Base64Alphabet,
  type Base64ConversionMode,
  type Base64ConverterResult
} from "@/lib/tools/base64-converter";

const modes: Base64ConversionMode[] = ["encode", "decode"];
const alphabets: Base64Alphabet[] = ["standard", "url-safe"];

export function Base64ConverterWorkspace() {
  const t = useTranslations("tools.base64-converter.workspace");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode" as Base64ConversionMode);
  const [alphabet, setAlphabet] = useState("standard" as Base64Alphabet);
  const [result, setResult] = useState(null as Base64ConverterResult | null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.trim().length > 0;

  const runConversion = () => {
    setCopied(false);
    setResult(convertBase64Payload({ alphabet, input, mode }));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const updateMode = (value: string) => {
    setMode(value as Base64ConversionMode);
    setResult(null);
    setCopied(false);
  };

  const updateAlphabet = (value: string) => {
    setAlphabet(value as Base64Alphabet);
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="base64-converter"
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
            <span className="badge">{t("badges.normalize")}</span>
            <span>{t("normalizeCopy")}</span>
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

          <label className="field-label" htmlFor="base64-converter-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="base64-converter-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={10}
              value={input}
            />
          </label>

          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="base64-converter-mode">
              {t("modeLabel")}
              <select className="input" id="base64-converter-mode" onChange={(event) => updateMode(event.target.value)} value={mode}>
                {modes.map((item) => (
                  <option key={item} value={item}>
                    {t(`modes.${item}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label" htmlFor="base64-converter-alphabet">
              {t("alphabetLabel")}
              <select className="input" id="base64-converter-alphabet" onChange={(event) => updateAlphabet(event.target.value)} value={alphabet}>
                {alphabets.map((item) => (
                  <option key={item} value={item}>
                    {t(`alphabets.${item}`)}
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
              <p className="tool-description">{result ? getResultSummary(result, t) : t("emptyResult")}</p>
            </div>
            <Gauge size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.inputBytes.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("inputBytes")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.outputCharacters.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("outputCharacters")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? `${result.stats.expansionRatio.toFixed(2)}x` : "0.00x"}</strong>
              <span>{t("ratio")}</span>
            </article>
          </div>

          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className={result.success ? "badge local" : "badge ai"}>{result.success ? t("badges.ready") : t("badges.error")}</span>
                <span>{result.success ? result.privacyNote : t(`errors.${result.error?.type ?? "conversion-failed"}`)}</span>
              </div>
            </div>
          ) : null}
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
              <h2>{t("warningsTitle")}</h2>
              <p className="tool-description">{t("warningsDescription")}</p>
            </div>
            <TriangleAlert size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {result?.warnings.length ? (
              result.warnings.map((warning) => (
                <article className="detail-resource-row" key={warning.type}>
                  <span className="icon-tile amber">
                    <TriangleAlert size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{t(`warningTitles.${warning.type}`)}</strong>
                    <small>{t(`warningMessages.${warning.type}`)}</small>
                  </span>
                </article>
              ))
            ) : (
              <p className="detail-aside-note">{result ? t("noWarnings") : t("waitingWarnings")}</p>
            )}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("normalizedTitle")}</h2>
              <p className="tool-description">{t("normalizedDescription")}</p>
            </div>
            <FileCode2 size={18} aria-hidden="true" />
          </div>
          <pre className="textarea prompt-textarea">{result?.normalizedInput || t("emptyNormalized")}</pre>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.utf8"), t("reviewItems.secrets"), t("reviewItems.urlSafe")].map((item, index) => (
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

function getResultSummary(result: Base64ConverterResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  if (result.mode === "encode") {
    return t("encodedSummary", {
      inputBytes: result.stats.inputBytes,
      outputCharacters: result.stats.outputCharacters
    });
  }
  return t("decodedSummary", {
    inputCharacters: result.normalizedInput.length,
    outputBytes: result.stats.outputBytes
  });
}
