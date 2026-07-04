"use client";

import { ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertHtmlMarkdown, type HtmlMarkdownDirection, type HtmlMarkdownResult } from "@/lib/tools/html-markdown-converter";

export function HtmlMarkdownConverterWorkspace() {
  const t = useTranslations("tools.html-markdown-converter.workspace");
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("html-to-markdown" as HtmlMarkdownDirection);
  const [result, setResult] = useState(null as HtmlMarkdownResult | null);

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="html-markdown-converter"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="html-markdown-direction">
            {t("directionLabel")}
            <select
              className="input"
              id="html-markdown-direction"
              onChange={(event) => setDirection(event.target.value as HtmlMarkdownDirection)}
              value={direction}
            >
              <option value="html-to-markdown">{t("directions.htmlToMarkdown")}</option>
              <option value="markdown-to-html">{t("directions.markdownToHtml")}</option>
            </select>
          </label>
          <label className="field-label" htmlFor="html-markdown-input">
            {t("inputLabel")}
            <textarea className="input" id="html-markdown-input" onChange={(event) => setInput(event.target.value)} rows={9} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(convertHtmlMarkdown({ input, direction }))} type="button">
            <ArrowLeftRight size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result ? t("readyResult") : t("emptyResult")}</p>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>
            {result?.output || t("emptyOutput")}
          </pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("reviewTitle")}</h2>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
