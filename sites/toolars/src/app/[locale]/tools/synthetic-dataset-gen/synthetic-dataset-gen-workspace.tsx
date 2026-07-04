"use client";

import { Database, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildSyntheticDataset, type SyntheticDatasetResult } from "@/lib/tools/synthetic-dataset-gen";

export function SyntheticDatasetGenWorkspace() {
  const t = useTranslations("tools.synthetic-dataset-gen.workspace");
  const [topic, setTopic] = useState("B2B onboarding events");
  const [schema, setSchema] = useState("account_id:string\nactivation_score:number\nsegment:enum(smb|enterprise)");
  const [rows, setRows] = useState(3);
  const [result, setResult] = useState(null as SyntheticDatasetResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="synthetic-dataset-gen">
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
          <label className="field-label" htmlFor="synthetic-topic">{t("topicLabel")}<input className="input" id="synthetic-topic" onChange={(event) => setTopic(event.target.value)} value={topic} /></label>
          <label className="field-label" htmlFor="synthetic-schema" style={{ marginTop: 16 }}>{t("schemaLabel")}<textarea className="input" id="synthetic-schema" onChange={(event) => setSchema(event.target.value)} rows={7} value={schema} /></label>
          <label className="field-label" htmlFor="synthetic-rows" style={{ marginTop: 16 }}>{t("rowsLabel")}<input className="input" id="synthetic-rows" min={1} max={100} onChange={(event) => setRows(Number(event.target.value))} type="number" value={rows} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(buildSyntheticDataset({ topic, schema, rows }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.json || t("emptyOutput")}</pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div>
          <div className="remediation-list">
            {(result?.reviewChecklist ?? [t("reviewItems.synthetic"), t("reviewItems.privacy"), t("reviewItems.fixtures")]).map((item, index) => (
              <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
