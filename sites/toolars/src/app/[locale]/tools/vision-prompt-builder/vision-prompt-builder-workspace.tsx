"use client";

import { Eye, Gauge, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildVisionPrompt, type VisionPromptBuilderResult } from "@/lib/tools/vision-prompt-builder";

export function VisionPromptBuilderWorkspace() {
  const t = useTranslations("tools.vision-prompt-builder.workspace");
  const [subject, setSubject] = useState("Inspect a damaged shipping label");
  const [framing, setFraming] = useState("macro close-up");
  const [visualChecks, setVisualChecks] = useState("barcode legibility\nrecipient address visibility");
  const [outputFormat, setOutputFormat] = useState("Return JSON with risk and evidence");
  const [result, setResult] = useState(null as VisionPromptBuilderResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="vision-prompt-builder">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row"><span className="badge local">{t("badges.local")}</span><span>{t("localCopy")}</span></div>
          <div className="detail-row"><span className="badge">{t("badges.review")}</span><span>{t("trustCopy")}</span></div>
        </div>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Eye size={18} aria-hidden="true" /></div>
          <label className="field-label" htmlFor="vision-subject">{t("subjectLabel")}<input className="input" id="vision-subject" onChange={(event) => setSubject(event.target.value)} value={subject} /></label>
          <label className="field-label" htmlFor="vision-framing" style={{ marginTop: 16 }}>{t("framingLabel")}<input className="input" id="vision-framing" onChange={(event) => setFraming(event.target.value)} value={framing} /></label>
          <label className="field-label" htmlFor="vision-checks" style={{ marginTop: 16 }}>{t("visualChecksLabel")}<textarea className="input" id="vision-checks" onChange={(event) => setVisualChecks(event.target.value)} rows={5} value={visualChecks} /></label>
          <label className="field-label" htmlFor="vision-format" style={{ marginTop: 16 }}>{t("outputFormatLabel")}<input className="input" id="vision-format" onChange={(event) => setOutputFormat(event.target.value)} value={outputFormat} /></label>
          <div className="button-row"><button className="button button-solid" onClick={() => setResult(buildVisionPrompt({ subject, framing, visualChecks, outputFormat }))} type="button">{t("runButton")}</button></div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("resultsTitle")}</h2><p className="tool-description">{result ? t("readyResult") : t("emptyResult")}</p></div><Gauge size={18} aria-hidden="true" /></div>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.prompt || t("emptyOutput")}</pre>
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("reviewTitle")}</h2><ShieldCheck size={18} aria-hidden="true" /></div>
          <div className="remediation-list">
            {(result?.checks.length ? result.checks : [t("reviewItems.visible"), t("reviewItems.privacy"), t("reviewItems.format")]).map((item, index) => (
              <div className="remediation-row" key={item}><span>{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
          <p className="detail-aside-note">{result?.reviewNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
