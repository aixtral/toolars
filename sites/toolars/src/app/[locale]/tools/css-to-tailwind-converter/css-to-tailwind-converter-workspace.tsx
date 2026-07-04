"use client";

import { Code2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertCssToTailwind } from "@/lib/tools/css-to-tailwind-converter";

const sampleCss = "display: flex;\nflex-direction: column;\njustify-content: center;\nalign-items: center;\ngap: 1rem;";
const sampleConversion = convertCssToTailwind(sampleCss);

export function CssToTailwindConverterWorkspace() {
  const t = useTranslations("tools.css-to-tailwind-converter.workspace");
  const [css, setCss] = useState(sampleCss);
  const [result, setResult] = useState(sampleConversion);

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="css-to-tailwind-converter">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Code2 size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="tailwind-css">{t("cssInputLabel")}<textarea className="textarea prompt-textarea" id="tailwind-css" onChange={(event) => setCss(event.target.value)} value={css} /></label><div className="button-row"><button className="button button-solid" onClick={() => setResult(convertCssToTailwind(css))} type="button"><Wand2 size={16} aria-hidden="true" /> {t("convertButton")}</button></div></section>
        <section className="workspace-panel"><h2>{t("resultTitle")}</h2><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.className || t("emptyResult")}</pre></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result.unmatchedDeclarations.length ? t("unmatchedCopy", { count: result.unmatchedDeclarations.length }) : t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
