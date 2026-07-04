"use client";

import { Database, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateSyntheticDataset, type SyntheticDatasetGeneratorResult } from "@/lib/tools/synthetic-dataset-generator";

export function SyntheticDatasetGeneratorWorkspace() {
  const t = useTranslations("tools.synthetic-dataset-generator.workspace");
  const [scenario, setScenario] = useState("Support classifier evals");
  const [fields, setFields] = useState("ticket:string\nlabel:enum(billing|bug)");
  const [count, setCount] = useState(2);
  const [result, setResult] = useState(null as SyntheticDatasetGeneratorResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="synthetic-dataset-generator">
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
          <label className="field-label" htmlFor="fixture-scenario">{t("scenarioLabel")}<input className="input" id="fixture-scenario" onChange={(event) => setScenario(event.target.value)} value={scenario} /></label>
          <label className="field-label" htmlFor="fixture-fields" style={{ marginTop: 16 }}>{t("fieldsLabel")}<textarea className="input" id="fixture-fields" onChange={(event) => setFields(event.target.value)} rows={7} value={fields} /></label>
          <label className="field-label" htmlFor="fixture-count" style={{ marginTop: 16 }}>{t("countLabel")}<input className="input" id="fixture-count" min={1} max={100} onChange={(event) => setCount(Number(event.target.value))} type="number" value={count} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(generateSyntheticDataset({ scenario, fields, count }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result ? t("readyResult") : t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.jsonl || t("emptyOutput")}</pre>
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
