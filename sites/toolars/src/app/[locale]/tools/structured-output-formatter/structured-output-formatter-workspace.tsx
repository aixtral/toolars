"use client";

import { Braces, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { formatStructuredOutput, type StructuredOutputFormatterResult } from "@/lib/tools/structured-output-formatter";

export function StructuredOutputFormatterWorkspace() {
  const t = useTranslations("tools.structured-output-formatter.workspace");
  const [rawOutput, setRawOutput] = useState("{\"title\":\"Roadmap\",\"score\":0.82}");
  const [requiredFields, setRequiredFields] = useState("title, score, confidence");
  const [result, setResult] = useState(null as StructuredOutputFormatterResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="structured-output-formatter">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("trustCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Braces size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="structured-output">{t("rawOutputLabel")}<textarea className="input" id="structured-output" onChange={(event) => setRawOutput(event.target.value)} rows={7} value={rawOutput} /></label>
          <label className="field-label" htmlFor="structured-required" style={{ marginTop: 16 }}>{t("requiredFieldsLabel")}<input className="input" id="structured-required" onChange={(event) => setRequiredFields(event.target.value)} value={requiredFields} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(formatStructuredOutput({ rawOutput, requiredFields }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result?.warnings[0] ?? (result ? t("readyResult") : t("emptyResult"))}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.output || t("emptyOutput")}</pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div>
          <div className="remediation-list">
            {(result?.warnings.length ? result.warnings : [t("reviewItems.schema"), t("reviewItems.missing"), t("reviewItems.copy")]).map((item, index) => (
              <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
