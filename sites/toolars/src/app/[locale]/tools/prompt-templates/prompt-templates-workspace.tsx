"use client";

import { ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildPromptTemplate, type PromptTemplateResult } from "@/lib/tools/prompt-templates";

export function PromptTemplatesWorkspace() {
  const t = useTranslations("tools.prompt-templates.workspace");
  const [task, setTask] = useState("Summarize customer research");
  const [audience, setAudience] = useState("Product team");
  const [tone, setTone] = useState("concise");
  const [variables, setVariables] = useState("research_notes, release_goal");
  const [constraints, setConstraints] = useState("Cite every claim\nFlag uncertainty");
  const [result, setResult] = useState(null as PromptTemplateResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="prompt-templates">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("trustCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><ClipboardList size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="prompt-task">{t("taskLabel")}<input className="input" id="prompt-task" onChange={(event) => setTask(event.target.value)} value={task} /></label>
          <label className="field-label" htmlFor="prompt-audience" style={{ marginTop: 16 }}>{t("audienceLabel")}<input className="input" id="prompt-audience" onChange={(event) => setAudience(event.target.value)} value={audience} /></label>
          <label className="field-label" htmlFor="prompt-tone" style={{ marginTop: 16 }}>{t("toneLabel")}<input className="input" id="prompt-tone" onChange={(event) => setTone(event.target.value)} value={tone} /></label>
          <label className="field-label" htmlFor="prompt-variables" style={{ marginTop: 16 }}>{t("variablesLabel")}<textarea className="input" id="prompt-variables" onChange={(event) => setVariables(event.target.value)} rows={3} value={variables} /></label>
          <label className="field-label" htmlFor="prompt-constraints" style={{ marginTop: 16 }}>{t("constraintsLabel")}<textarea className="input" id="prompt-constraints" onChange={(event) => setConstraints(event.target.value)} rows={4} value={constraints} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(buildPromptTemplate({ task, audience, tone, variables, constraints }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result ? t("readyResult") : t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.template || t("emptyOutput")}</pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div>
          <div className="remediation-list">
            {(result?.reviewChecklist ?? [t("reviewItems.variables"), t("reviewItems.constraints"), t("reviewItems.audit")]).map((item, index) => (
              <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
