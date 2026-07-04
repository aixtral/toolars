"use client";

import { Braces, FileJson2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { formatJsonDocument, type JsonFormatterResult } from "@/lib/tools/json-formatter";

export function JsonFormatterWorkspace() {
  const t = useTranslations("tools.json-formatter.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JsonFormatterResult | null>(null);

  const format = () => setResult(formatJsonDocument({ input, mode: "format", indent: 2 }));
  const minify = () => setResult(formatJsonDocument({ input, mode: "minify" }));

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="json-formatter"
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
            <FileJson2 size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="json-formatter-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="json-formatter-input"
              onChange={(event) => {
                setInput(event.target.value);
                setResult(null);
              }}
              placeholder={t("inputPlaceholder")}
              rows={9}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input.trim()} onClick={format} type="button">
              {t("formatButton")}
            </button>
            <button className="button button-secondary" disabled={!input.trim()} onClick={minify} type="button">
              {t("minifyButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.success ? t("validLabel") : result?.error?.message ?? t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.valid") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>
            {result?.output || t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <Braces size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
