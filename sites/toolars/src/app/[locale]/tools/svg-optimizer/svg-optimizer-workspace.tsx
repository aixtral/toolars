"use client";

import { Code2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { optimizeSvg, type SvgOptimizerResult } from "@/lib/tools/svg-optimizer";

export function SvgOptimizerWorkspace() {
  const t = useTranslations("tools.svg-optimizer.workspace");
  const [svg, setSvg] = useState("");
  const [result, setResult] = useState<SvgOptimizerResult | null>(null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("inputDescription")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="svg-optimizer">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Code2 size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="svg-input">{t("svgLabel")}<textarea className="textarea prompt-textarea" id="svg-input" onChange={(event) => setSvg(event.target.value)} value={svg} /></label><div className="button-row"><button className="button button-solid" disabled={!svg.trim()} onClick={() => setResult(optimizeSvg(svg, { removeComments: true, removeMetadata: true, collapseWhitespace: true }))} type="button"><Sparkles size={16} aria-hidden="true" /> {t("optimizeButton")}</button></div></section>
        <section className="workspace-panel"><h2>{t("resultTitle")}</h2>{result ? <><p className="tool-description">{t("savings", { percent: result.savingsPercent })}</p><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.optimized}</pre></> : null}</section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result?.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
