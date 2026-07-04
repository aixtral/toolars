"use client";

import { Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { testMcpContract, type McpTesterResult } from "@/lib/tools/mcp-tester";

const defaultManifest = JSON.stringify({ name: "toolars-research-kit", tools: [{ name: "search_private_docs", description: "Search private docs.", inputSchema: { type: "object", properties: { query: { type: "string" }, max_results: { type: "number" } }, required: ["query"] } }] }, null, 2);
const defaultPayload = JSON.stringify({ query: "refund policy", max_results: 5 }, null, 2);

export function McpTesterWorkspace() {
  const t = useTranslations("tools.mcp-tester.workspace");
  const [manifestJson, setManifestJson] = useState(defaultManifest);
  const [payloadJson, setPayloadJson] = useState(defaultPayload);
  const [result, setResult] = useState<McpTesterResult | null>(null);

  const runValidation = () => setResult(testMcpContract({ manifestJson, payloadJson }));

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="mcp-tester">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Sparkles size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="mcp-manifest">{t("manifestLabel")}<textarea className="input" id="mcp-manifest" onChange={(event) => setManifestJson(event.target.value)} rows={9} value={manifestJson} /></label>
          <label className="field-label" htmlFor="mcp-payload" style={{ marginTop: 16 }}>{t("payloadLabel")}<textarea className="input" id="mcp-payload" onChange={(event) => setPayloadJson(event.target.value)} rows={5} value={payloadJson} /></label>
          <div className="button-row"><button className="button button-solid" onClick={runValidation} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="llm-metric-grid">
            <article className="llm-metric"><strong>{result ? t(`statuses.${result.status}`) : t("statuses.review")}</strong><span>{t("metrics.status")}</span></article>
            <article className="llm-metric"><strong>{result?.requiredFields.length ?? 0}</strong><span>{t("metrics.required")}</span></article>
          </div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="remediation-list">{(result?.checks ?? []).map((check, index) => <div className="remediation-row" key={check.label}><span>{index + 1}</span><p><strong>{check.label}</strong><br />{check.detail}</p></div>)}{!result ? <p className="detail-aside-note">{t("waitingReview")}</p> : null}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
