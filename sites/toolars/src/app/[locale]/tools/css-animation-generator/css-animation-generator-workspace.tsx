"use client";

import { Code2, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateCssAnimation, type CssAnimationResult } from "@/lib/tools/css-animation-generator";

export function CssAnimationGeneratorWorkspace() {
  const t = useTranslations("tools.css-animation-generator.workspace");
  const [name, setName] = useState("fade-in");
  const [result, setResult] = useState<CssAnimationResult>(generateCssAnimation({ name, preset: "fade", durationMs: 600, easing: "ease-out", delayMs: 0, iterationCount: "1", direction: "normal" }));

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="css-animation-generator">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Play size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="animation-name">{t("nameLabel")}<input className="input" id="animation-name" onChange={(event) => setName(event.target.value)} value={name} /></label><div className="button-row"><button className="button button-solid" onClick={() => setResult(generateCssAnimation({ name, preset: "fade", durationMs: 600, easing: "ease-out", delayMs: 0, iterationCount: "1", direction: "normal" }))} type="button"><Play size={16} aria-hidden="true" /> {t("generateButton")}</button></div></section>
        <section className="workspace-panel"><h2>{t("previewTitle")}</h2><div data-testid="css-animation-preview" style={{ animation: result.declaration.replace("animation: ", "").replace(/;$/, ""), background: "var(--surface-muted)", border: "1px solid var(--border)", borderRadius: 8, minHeight: 96 }} /></section>
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><h2>{t("cssTitle")}</h2><Code2 size={18} aria-hidden="true" /></div><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.css}</pre></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
