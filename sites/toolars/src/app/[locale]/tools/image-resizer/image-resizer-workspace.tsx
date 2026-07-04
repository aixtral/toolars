"use client";

import { ImageDown, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { calculateResizePlan, type ResizePlanResult } from "@/lib/tools/image-resizer";

export function ImageResizerWorkspace() {
  const t = useTranslations("tools.image-resizer.workspace");
  const [targetWidth, setTargetWidth] = useState(600);
  const [result, setResult] = useState<ResizePlanResult>(calculateResizePlan({ sourceWidth: 1200, sourceHeight: 800, sourceBytes: 400000, targetWidth: 600, targetHeight: 600, lockAspectRatio: true, format: "webp", quality: 80 }));

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="image-resizer">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><SlidersHorizontal size={18} aria-hidden="true" /></div><div className="llm-input-grid"><label className="field-label" htmlFor="source-width">{t("sourceWidthLabel")}<input className="input" id="source-width" readOnly type="number" value={1200} /></label><label className="field-label" htmlFor="source-height">{t("sourceHeightLabel")}<input className="input" id="source-height" readOnly type="number" value={800} /></label><label className="field-label" htmlFor="target-width">{t("targetWidthLabel")}<input className="input" id="target-width" min={1} onChange={(event) => setTargetWidth(Number(event.target.value))} type="number" value={targetWidth} /></label></div><div className="button-row"><button className="button button-solid" onClick={() => setResult(calculateResizePlan({ sourceWidth: 1200, sourceHeight: 800, sourceBytes: 400000, targetWidth, targetHeight: 600, lockAspectRatio: true, format: "webp", quality: 80 }))} type="button"><ImageDown size={16} aria-hidden="true" /> {t("calculateButton")}</button></div></section>
        <section className="workspace-panel"><h2>{t("resultTitle")}</h2><strong aria-label={t("summaryLabel")} style={{ display: "block", fontSize: 28 }}>{result.summary}</strong><p className="tool-description">{t("estimatedSize", { bytes: result.estimatedBytes })}</p></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
