"use client";

import { ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { runRagEvalBench, type RagEvalBenchResult, type RagEvalCaseInput } from "@/lib/tools/rag-eval-bench";

const defaultCases = "What is the refund window? | Annual subscribers can request a refund within 14 days. [policy-1] | refund, 14 days, annual | policy-1\nWhich plan has SSO? | The enterprise plan includes SSO. | enterprise, SSO | security-2";

export function RagEvalBenchWorkspace() {
  const t = useTranslations("tools.rag-eval-bench.workspace");
  const [casesText, setCasesText] = useState(defaultCases);
  const [result, setResult] = useState<RagEvalBenchResult | null>(null);
  const runEval = () => setResult(runRagEvalBench({ cases: parseCases(casesText) }));

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="rag-eval-bench">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><ClipboardList size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="rag-eval-cases">{t("casesLabel")}<textarea className="input" id="rag-eval-cases" onChange={(event) => setCasesText(event.target.value)} rows={9} value={casesText} /></label>
          <div className="button-row"><button className="button button-solid" onClick={runEval} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.summary ?? t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <div className="llm-metric-grid"><article className="llm-metric"><strong>{result?.averageGroundedness ?? 0}%</strong><span>{t("averageGroundedness")}</span></article><article className="llm-metric"><strong>{result?.caseCount ?? 0}</strong><span>{t("caseCount")}</span></article></div>
          {result ? <p className="detail-aside-note" style={{ marginTop: 16 }}>{result.privacyNote}</p> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("caseResultsTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div><div className="detail-resource-list">{(result?.rows ?? []).map((row) => <article className="detail-resource-row" key={row.index}><span className="icon-tile blue">{row.groundedness}</span><span><strong>{row.question}</strong><small>{row.missingSourceIds.length ? t("missingSources", { count: row.missingSourceIds.length }) : t("sourcesCovered")}</small></span><span className="badge">{t(`statuses.${row.status}`)}</span></article>)}</div></section>
        <section className="workspace-panel"><h2>{t("handoffTitle")}</h2><p className="tool-description">{t("handoffCopy")}</p></section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function parseCases(value: string): RagEvalCaseInput[] {
  return value.split(/\r?\n/).map((line) => {
    const [question = "", answer = "", expected = "", sources = ""] = line.split("|").map((part) => part.trim());
    return { question, answer, expectedTerms: splitCsv(expected), sourceIds: splitCsv(sources) };
  }).filter((testCase) => testCase.question || testCase.answer);
}

function splitCsv(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
