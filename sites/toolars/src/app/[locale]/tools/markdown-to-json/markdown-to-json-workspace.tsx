"use client";

import { ClipboardCheck, ClipboardCopy, FileJson2, FileText, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertMarkdownToJson, type MarkdownToJsonResult } from "@/lib/tools/markdown-to-json";

export function MarkdownToJsonWorkspace() {
  const t = useTranslations("tools.markdown-to-json.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<MarkdownToJsonResult | null>(null);
  const [copied, setCopied] = useState(false);
  const hasInput = input.trim().length > 0;

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const convertMarkdown = () => {
    setCopied(false);
    setResult(convertMarkdownToJson({ input }));
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
      toolSlug="markdown-to-json"
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
            <span className="badge">{t("badges.blocks")}</span>
            <span>{t("blocksCopy")}</span>
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
            <FileText size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="markdown-to-json-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="markdown-to-json-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={11}
              value={input}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={convertMarkdown} type="button">
              <FileJson2 size={16} aria-hidden="true" /> {t("convertButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getMarkdownSummary(result, t) : t("emptyResult")}</p>
            </div>
            <FileJson2 size={18} aria-hidden="true" />
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.structure.headings.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("headingsLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.structure.lists.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("listsLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.structure.links.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("linksLabel")}</span>
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
            {[t("reviewItems.frontmatter"), t("reviewItems.links"), t("reviewItems.export")].map((item, index) => (
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

function getMarkdownSummary(result: MarkdownToJsonResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("errors.conversion-failed");
  return result.summary;
}
