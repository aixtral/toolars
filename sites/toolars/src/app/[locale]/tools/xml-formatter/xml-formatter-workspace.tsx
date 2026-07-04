"use client";

import { ClipboardCheck, ClipboardCopy, Code2, FileCode2, Repeat2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { formatXmlSnippet, type XmlFormatterMode, type XmlFormatterResult } from "@/lib/tools/xml-formatter";

const modes: XmlFormatterMode[] = ["format", "minify"];

export function XmlFormatterWorkspace() {
  const t = useTranslations("tools.xml-formatter.workspace");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("format" as XmlFormatterMode);
  const [indentSize, setIndentSize] = useState(2);
  const [result, setResult] = useState(null as XmlFormatterResult | null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.trim().length > 0;

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const runFormatter = () => {
    setCopied(false);
    setResult(formatXmlSnippet({ input, mode, indentSize }));
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
      toolSlug="xml-formatter"
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
            <span className="badge">{t("badges.twoway")}</span>
            <span>{t("modeCopy")}</span>
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

          <label className="field-label" htmlFor="xml-formatter-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="xml-formatter-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={9}
              value={input}
            />
          </label>

          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="xml-formatter-mode">
              {t("modeLabel")}
              <select
                className="input"
                id="xml-formatter-mode"
                onChange={(event) => {
                  setMode(event.target.value as XmlFormatterMode);
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
            <label className="field-label" htmlFor="xml-formatter-indent">
              {t("indentLabel")}
              <input
                className="input"
                id="xml-formatter-indent"
                max={8}
                min={0}
                onChange={(event) => {
                  setIndentSize(Number(event.target.value));
                  setResult(null);
                  setCopied(false);
                }}
                type="number"
                value={indentSize}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={runFormatter} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {mode === "format" ? t("formatButton") : t("minifyButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getXmlSummary(result, t) : t("emptyResult")}</p>
            </div>
            <FileCode2 size={18} aria-hidden="true" />
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.lines.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("linesLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.tags.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("tagsLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.outputCharacters.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("charactersLabel")}</span>
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
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.structure"), t("reviewItems.whitespace"), t("reviewItems.copy")].map((item, index) => (
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

function getXmlSummary(result: XmlFormatterResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t(`errors.${result.error?.type ?? "format-failed"}`);
  return result.summary;
}
