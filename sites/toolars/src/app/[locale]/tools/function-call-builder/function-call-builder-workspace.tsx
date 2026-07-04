"use client";

import { Braces, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildFunctionCallSpec, type FunctionCallBuilderResult } from "@/lib/tools/function-call-builder";

const defaultRows = "email:string:required:Customer email\npriority:string:optional:Ticket priority";

export function FunctionCallBuilderWorkspace() {
  const t = useTranslations("tools.function-call-builder.workspace");
  const [name, setName] = useState("create_ticket");
  const [description, setDescription] = useState("Create a support ticket");
  const [parameterRows, setParameterRows] = useState(defaultRows);
  const [result, setResult] = useState<FunctionCallBuilderResult | null>(null);

  const runBuilder = () => {
    setResult(buildFunctionCallSpec({ name, description, parameterRows }));
  };

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="function-call-builder">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("trustCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div>
            <Braces size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="function-name">{t("nameLabel")}<input className="input" id="function-name" onChange={(event) => setName(event.target.value)} value={name} /></label>
          <label className="field-label" htmlFor="function-description" style={{ marginTop: 16 }}>{t("descriptionLabel")}<input className="input" id="function-description" onChange={(event) => setDescription(event.target.value)} value={description} /></label>
          <label className="field-label" htmlFor="function-parameter-rows" style={{ marginTop: 16 }}>{t("parameterRowsLabel")}<textarea className="input" id="function-parameter-rows" onChange={(event) => setParameterRows(event.target.value)} rows={7} value={parameterRows} /></label>
          <div className="button-row"><button className="button button-solid" onClick={runBuilder} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result ? t("readyResult") : t("emptyResult")}</p></div>
            <Gauge size={18} aria-hidden="true" />
          </div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.output || t("emptyOutput")}</pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div>
          <div className="remediation-list">
            {(result?.warnings.length ? result.warnings : [t("reviewItems.required"), t("reviewItems.names"), t("reviewItems.provider")]).map((item, index) => (
              <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
