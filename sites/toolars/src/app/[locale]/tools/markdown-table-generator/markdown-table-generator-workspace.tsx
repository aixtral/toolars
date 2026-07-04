"use client";

import { Gauge, ShieldCheck, Table } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildMarkdownTable, type MarkdownTableGeneratorResult } from "@/lib/tools/markdown-table-generator";

export function MarkdownTableGeneratorWorkspace() {
  const t = useTranslations("tools.markdown-table-generator.workspace");
  const [csv, setCsv] = useState("Tool,Status,Note\nPrompt Templates,Ready,Local only\nFormatter,Review,Escapes | pipes");
  const [result, setResult] = useState(null as MarkdownTableGeneratorResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="markdown-table-generator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("trustCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Table size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="markdown-csv">{t("csvLabel")}<textarea className="input" id="markdown-csv" onChange={(event) => setCsv(event.target.value)} rows={8} value={csv} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(buildMarkdownTable({ csv }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result ? t("summary", { rows: result.rowCount, columns: result.columnCount }) : t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.markdown || t("emptyOutput")}</pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
