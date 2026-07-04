"use client";

import { Gauge, Search, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { compareEmbeddingChunks, type EmbeddingPlaygroundResult } from "@/lib/tools/embedding-playground";

const defaultQuery = "refund annual subscription";
const defaultChunks = "Security settings and SSO\nAnnual subscription refunds are available within 14 days\nPricing page explains monthly plan limits";

export function EmbeddingPlaygroundWorkspace() {
  const t = useTranslations("tools.embedding-playground.workspace");
  const [query, setQuery] = useState(defaultQuery);
  const [chunksText, setChunksText] = useState(defaultChunks);
  const [result, setResult] = useState<EmbeddingPlaygroundResult | null>(null);

  const runComparison = () => {
    setResult(compareEmbeddingChunks({ query, chunks: chunksText.split(/\r?\n/) }));
  };

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="embedding-playground">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("reviewCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Search size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="embedding-query">{t("queryLabel")}<textarea className="input" id="embedding-query" onChange={(event) => setQuery(event.target.value)} rows={3} value={query} /></label>
          <label className="field-label" htmlFor="embedding-chunks" style={{ marginTop: 16 }}>{t("chunksLabel")}<textarea className="input" id="embedding-chunks" onChange={(event) => setChunksText(event.target.value)} rows={8} value={chunksText} /></label>
          <div className="button-row"><button className="button button-solid" onClick={runComparison} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="detail-resource-list">
            {(result?.rows ?? []).map((row) => (
              <article className="detail-resource-row" key={row.index}>
                <span className="icon-tile blue">{row.score}</span>
                <span><strong>{row.index === result?.rows[0]?.index ? t("topMatch") : t("chunkLabel", { index: row.index })}</strong><small>{row.text}</small></span>
                <span className="badge">{row.sharedTokens.join(", ") || t("noSharedTokens")}</span>
              </article>
            ))}
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="remediation-list">{[t("reviewItems.tokenizer"), t("reviewItems.semantic"), t("reviewItems.privacy")].map((item, index) => <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>)}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
