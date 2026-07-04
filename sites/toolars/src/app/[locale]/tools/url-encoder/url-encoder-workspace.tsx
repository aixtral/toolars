"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertUrlComponent, type UrlConversionMode, type UrlEncoderResult } from "@/lib/tools/url-encoder";

const modes: UrlConversionMode[] = ["encode", "decode"];

export function UrlEncoderWorkspace() {
  const t = useTranslations("tools.url-encoder.workspace");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode" as UrlConversionMode);
  const [result, setResult] = useState(null as UrlEncoderResult | null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.length > 0;

  const runConversion = () => {
    setCopied(false);
    setResult(convertUrlComponent({ input, mode }));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const updateMode = (value: string) => {
    setMode(value as UrlConversionMode);
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
      toolSlug="url-encoder"
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
            <span className="badge">{t("badges.percent")}</span>
            <span>{t("percentCopy")}</span>
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
            <Link2 size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="url-encoder-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="url-encoder-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={8}
              value={input}
            />
          </label>

          <label className="field-label" htmlFor="url-encoder-mode" style={{ marginTop: 16 }}>
            {t("modeLabel")}
            <select className="input" id="url-encoder-mode" onChange={(event) => updateMode(event.target.value)} value={mode}>
              {modes.map((item) => (
                <option key={item} value={item}>
                  {t(`modes.${item}`)}
                </option>
              ))}
            </select>
          </label>

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
              <p className="tool-description">{result ? getUrlResultSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>{result?.success ? t("badges.ready") : result ? t("badges.error") : t("badges.waiting")}</span>
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
              <strong>{result ? `${result.stats.expansionRatio.toFixed(2)}x` : "0.00x"}</strong>
              <span>{t("ratio")}</span>
            </article>
          </div>

          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t(`errors.${result.error?.type ?? "conversion-failed"}`)}</span>
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
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.percent"), t("reviewItems.component"), t("reviewItems.secrets")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("validationTitle")}</h2>
            <TriangleAlert size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("waitingValidation")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getUrlResultSummary(result: UrlEncoderResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return result.mode === "encode"
    ? t("encodedSummary", {
        inputCharacters: result.stats.inputCharacters,
        outputCharacters: result.stats.outputCharacters
      })
    : t("decodedSummary", {
        inputCharacters: result.stats.inputCharacters,
        outputCharacters: result.stats.outputCharacters
      });
}
