"use client";

import { Calculator, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  compareModelProfiles,
  type ModelComparatorQualityTarget,
  type ModelComparatorResult
} from "@/lib/tools/model-comparator";

export function ModelComparatorWorkspace() {
  const t = useTranslations("tools.model-comparator.workspace");
  const [workloadTokens, setWorkloadTokens] = useState(14000);
  const [latencyTargetMs, setLatencyTargetMs] = useState(1500);
  const [qualityTarget, setQualityTarget] = useState("balanced" as ModelComparatorQualityTarget);
  const [result, setResult] = useState(null as ModelComparatorResult | null);
  const runComparison = () => setResult(compareModelProfiles({ inputTokens: workloadTokens - 2000, outputTokens: 2000, latencyTargetMs, qualityTarget }));

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="model-comparator">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Calculator size={18} aria-hidden="true" /></div>
          <div className="llm-input-grid">
            <label className="field-label" htmlFor="model-workload">{t("workloadLabel")}<input className="input" id="model-workload" min={1} onChange={(event) => setWorkloadTokens(Number(event.target.value))} type="number" value={workloadTokens} /></label>
            <label className="field-label" htmlFor="model-latency">{t("latencyLabel")}<input className="input" id="model-latency" min={1} onChange={(event) => setLatencyTargetMs(Number(event.target.value))} type="number" value={latencyTargetMs} /></label>
            <label className="field-label" htmlFor="model-quality">{t("qualityLabel")}<select className="input" id="model-quality" onChange={(event) => setQualityTarget(event.target.value as ModelComparatorQualityTarget)} value={qualityTarget}><option value="balanced">{t("qualityOptions.balanced")}</option><option value="high">{t("qualityOptions.high")}</option></select></label>
          </div>
          <div className="button-row"><button className="button button-solid" onClick={runComparison} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="llm-metric-grid"><article className="llm-metric"><strong>{result?.recommendedModel.label ?? "-"}</strong><span>{t("recommendedModel")}</span></article><article className="llm-metric"><strong>{result?.rows[0]?.fitScore ?? 0}</strong><span>{t("fitScore")}</span></article></div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("modelRowsTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="detail-resource-list">{(result?.rows ?? []).map((row) => <article className="detail-resource-row" key={row.model.key}><span className="icon-tile blue">{row.fitScore}</span><span><strong>{row.model.label}</strong><small>{row.contextFits ? t("contextFits") : t("contextMisses")}</small></span><span className="badge">{row.formattedEstimatedCost}</span></article>)}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
