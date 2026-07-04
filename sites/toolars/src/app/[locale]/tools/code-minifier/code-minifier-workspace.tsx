"use client";

import { FileCode2, Minimize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { minifyCode, type CodeMinifierLanguage, type CodeMinifierResult } from "@/lib/tools/code-minifier";

export function CodeMinifierWorkspace() {
  const t = useTranslations("tools.code-minifier.workspace");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState((): CodeMinifierLanguage => "javascript");
  const [result, setResult] = useState((): CodeMinifierResult | null => null);

  const run = () => setResult(minifyCode({ input, language }));

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="code-minifier"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <FileCode2 size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="code-minifier-language">
            {t("languageLabel")}
            <select
              className="input"
              id="code-minifier-language"
              onChange={(event) => setLanguage(event.target.value as CodeMinifierLanguage)}
              value={language}
            >
              <option value="javascript">{t("languages.javascript")}</option>
              <option value="css">{t("languages.css")}</option>
              <option value="html">{t("languages.html")}</option>
            </select>
          </label>
          <label className="field-label" htmlFor="code-minifier-input">
            {t("inputLabel")}
            <textarea className="input" id="code-minifier-input" onChange={(event) => setInput(event.target.value)} rows={9} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={run} type="button">
            <Minimize2 size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>

        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
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
