"use client";

import { ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { planTokenBudget, type TokenBudgetAllocationInput, type TokenBudgetPlan } from "@/lib/tools/token-budget-planner";

const defaultAllocations = "System | 1500\nUser | 2500\nRetrieval | 18000\nTools | 3000\nOutput reserve | 5000";

export function TokenBudgetPlannerWorkspace() {
  const t = useTranslations("tools.token-budget-planner.workspace");
  const [totalBudget, setTotalBudget] = useState(32000);
  const [allocationsText, setAllocationsText] = useState(defaultAllocations);
  const [result, setResult] = useState<TokenBudgetPlan | null>(null);
  const runBudget = () => setResult(planTokenBudget({ totalBudget, allocations: parseAllocations(allocationsText) }));

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="token-budget-planner">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><ClipboardList size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="token-budget-total">{t("totalBudgetLabel")}<input className="input" id="token-budget-total" min={1} onChange={(event) => setTotalBudget(Number(event.target.value))} type="number" value={totalBudget} /></label>
          <label className="field-label" htmlFor="token-budget-allocations" style={{ marginTop: 16 }}>{t("allocationsLabel")}<textarea className="input" id="token-budget-allocations" onChange={(event) => setAllocationsText(event.target.value)} rows={7} value={allocationsText} /></label>
          <div className="button-row"><button className="button button-solid" onClick={runBudget} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="llm-metric-grid"><article className="llm-metric"><strong>{result?.remainingTokens.toLocaleString("en-US") ?? "0"}</strong><span>{t("remainingBudget")}</span></article><article className="llm-metric"><strong>{result?.totalAllocated.toLocaleString("en-US") ?? "0"}</strong><span>{t("allocatedBudget")}</span></article></div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("allocationRowsTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="detail-resource-list">{(result?.allocations ?? []).map((allocation) => <article className="detail-resource-row" key={allocation.label}><span className="icon-tile blue">{allocation.percent}%</span><span><strong>{allocation.label}</strong><small>{allocation.tokens.toLocaleString("en-US")} tokens</small></span></article>)}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function parseAllocations(value: string): TokenBudgetAllocationInput[] {
  return value.split(/\r?\n/).map((line) => {
    const [label = "", tokens = "0"] = line.split("|").map((part) => part.trim());
    return { label, tokens: Number(tokens) };
  }).filter((allocation) => allocation.label || allocation.tokens > 0);
}
