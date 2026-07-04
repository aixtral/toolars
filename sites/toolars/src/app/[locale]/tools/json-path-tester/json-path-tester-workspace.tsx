"use client";

import { Braces, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { runJsonPathQuery, type JsonPathTesterResult } from "@/lib/tools/json-path-tester";

export function JsonPathTesterWorkspace() {
  const t = useTranslations("tools.json-path-tester.workspace");
  const [jsonInput, setJsonInput] = useState("");
  const [path, setPath] = useState("$.store.book[*].author");
  const [result, setResult] = useState<JsonPathTesterResult | null>(null);

  const runQuery = () => setResult(runJsonPathQuery({ jsonInput, path }));

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="json-path-tester"
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
            <Braces size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="json-path-json-input">
            {t("jsonInputLabel")}
            <textarea className="input" id="json-path-json-input" onChange={(event) => setJsonInput(event.target.value)} rows={9} value={jsonInput} />
          </label>
          <label className="field-label" htmlFor="json-path-expression">
            {t("pathLabel")}
            <input className="input" id="json-path-expression" onChange={(event) => setPath(event.target.value)} value={path} />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!jsonInput.trim() || !path.trim()} onClick={runQuery} type="button">
              {t("runButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? t("matchSummary", { count: result.stats.matchCount }) : t("emptyResult")}</p>
            </div>
            <Search size={18} aria-hidden="true" />
          </div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>
            {result?.success ? result.output : result?.error?.message ?? t("emptyOutput")}
          </pre>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
