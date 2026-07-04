"use client";

import { ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildRagChunkPreview, type RagChunkVisualizerResult } from "@/lib/tools/rag-chunk-visualizer";

const defaultText = "Intro paragraph explains refunds. Eligibility section covers annual plans. Support escalation notes mention evidence. Closing section lists next actions.";

export function RagChunkVisualizerWorkspace() {
  const t = useTranslations("tools.rag-chunk-visualizer.workspace");
  const [text, setText] = useState(defaultText);
  const [chunkTokens, setChunkTokens] = useState(80);
  const [overlapTokens, setOverlapTokens] = useState(12);
  const [result, setResult] = useState<RagChunkVisualizerResult | null>(null);

  const runChunks = () => setResult(buildRagChunkPreview({ text, chunkTokens, overlapTokens }));

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="rag-chunk-visualizer">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><ClipboardList size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="rag-chunk-text">{t("documentLabel")}<textarea className="input" id="rag-chunk-text" onChange={(event) => setText(event.target.value)} rows={8} value={text} /></label>
          <div className="llm-input-grid" style={{ marginTop: 16 }}>
            <label className="field-label" htmlFor="rag-chunk-size">{t("chunkTokensLabel")}<input className="input" id="rag-chunk-size" min={1} onChange={(event) => setChunkTokens(Number(event.target.value))} type="number" value={chunkTokens} /></label>
            <label className="field-label" htmlFor="rag-chunk-overlap">{t("overlapTokensLabel")}<input className="input" id="rag-chunk-overlap" min={0} onChange={(event) => setOverlapTokens(Number(event.target.value))} type="number" value={overlapTokens} /></label>
          </div>
          <div className="button-row"><button className="button button-solid" onClick={runChunks} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="detail-resource-list">
            {(result?.chunks ?? []).map((chunk) => <article className="detail-resource-row" key={chunk.index}><span className="icon-tile blue">{chunk.index}</span><span><strong>{t("chunkLabel", { index: chunk.index })}</strong><small>{chunk.text}</small></span><span className="badge">{t("overlapLabel", { count: chunk.overlapTokens })}</span></article>)}
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="remediation-list">{[t("reviewItems.boundaries"), t("reviewItems.overlap"), t("reviewItems.tokenizer")].map((item, index) => <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
