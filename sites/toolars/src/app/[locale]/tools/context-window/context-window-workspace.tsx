"use client";

import { ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { visualizeContextWindow, type ContextWindowResult, type ContextSegmentInput } from "@/lib/tools/context-window";

const defaultSegments = "System | 1200\nUser | 800\nRetrieval | 9000\nTools | 1200\nOutput reserve | 2000";

export function ContextWindowWorkspace() {
  const t = useTranslations("tools.context-window.workspace");
  const rootT = useTranslations();
  const locale = useLocale();
  const [maxTokens, setMaxTokens] = useState(16000);
  const [segmentsText, setSegmentsText] = useState(defaultSegments);
  const [result, setResult] = useState<ContextWindowResult | null>(null);
  const runVisualizer = () => setResult(visualizeContextWindow({ maxTokens, segments: parseSegments(segmentsText) }));

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="context-window">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><ClipboardList size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="context-window-size">{t("windowLabel")}<input className="input" id="context-window-size" min={1} onChange={(event) => setMaxTokens(Number(event.target.value))} type="number" value={maxTokens} /></label>
          <label className="field-label" htmlFor="context-window-segments" style={{ marginTop: 16 }}>{t("segmentsLabel")}<textarea className="input" id="context-window-segments" onChange={(event) => setSegmentsText(event.target.value)} rows={7} value={segmentsText} /></label>
          <div className="button-row"><button className="button button-solid" onClick={runVisualizer} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="llm-metric-grid"><article className="llm-metric"><strong>{result?.remainingTokens.toLocaleString("en-US") ?? "0"}</strong><span>{t("remainingTokens")}</span></article><article className="llm-metric"><strong>{result ? `${result.utilizationPercent}%` : "0%"}</strong><span>{t("utilization")}</span></article></div>
          {(result?.warnings ?? []).map((warning) => <p className="detail-aside-note" key={warning} style={{ marginTop: 16 }}>{warning}</p>)}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("segmentsTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="detail-resource-list">{(result?.segments ?? []).map((segment) => <article className="detail-resource-row" key={segment.label}><span className="icon-tile blue">{segment.percent}%</span><span><strong>{segment.label}</strong><small>{segment.tokens.toLocaleString(locale)} {rootT("commonToolTags.tokens")}</small></span></article>)}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function parseSegments(value: string): ContextSegmentInput[] {
  return value.split(/\r?\n/).map((line) => {
    const [label = "", tokens = "0"] = line.split("|").map((part) => part.trim());
    return { label, tokens: Number(tokens) };
  }).filter((segment) => segment.label || segment.tokens > 0);
}
