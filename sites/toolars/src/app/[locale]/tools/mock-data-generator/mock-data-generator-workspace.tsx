"use client";

import { Database, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateMockData, type MockDataGeneratorResult } from "@/lib/tools/mock-data-generator";

export function MockDataGeneratorWorkspace() {
  const t = useTranslations("tools.mock-data-generator.workspace");
  const [fields, setFields] = useState("id:number\nemail:email\nstatus:enum(active|paused)");
  const [rows, setRows] = useState(2);
  const [result, setResult] = useState(null as MockDataGeneratorResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="mock-data-generator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("trustCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Database size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="mock-fields">{t("fieldsLabel")}<textarea className="input" id="mock-fields" onChange={(event) => setFields(event.target.value)} rows={7} value={fields} /></label>
          <label className="field-label" htmlFor="mock-rows" style={{ marginTop: 16 }}>{t("rowsLabel")}<input className="input" id="mock-rows" min={1} max={50} onChange={(event) => setRows(Number(event.target.value))} type="number" value={rows} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(generateMockData({ fields, rows }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result ? t("summary", { rows: result.records.length }) : t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.json || t("emptyOutput")}</pre>
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
