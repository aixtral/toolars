"use client";

import { Database } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { formatSqlQuery, type SqlFormatterResult } from "@/lib/tools/sql-formatter";

export function SqlFormatterWorkspace() {
  const t = useTranslations("tools.sql-formatter.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null as SqlFormatterResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="sql-formatter">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="sql-input">
            {t("inputLabel")}
            <textarea className="input" id="sql-input" onChange={(event) => setInput(event.target.value)} rows={9} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(formatSqlQuery({ input }))} type="button">
            <Database size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.error?.message ?? (result ? t("readyResult") : t("emptyResult"))}</p>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.output || t("emptyOutput")}</pre>
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
