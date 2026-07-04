"use client";

import { Code2, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generateCodeImageSvg, type CodeImageResult } from "@/lib/tools/code-to-image";

export function CodeToImageWorkspace() {
  const t = useTranslations("tools.code-to-image.workspace");
  const [code, setCode] = useState("const ok = true;");
  const [result, setResult] = useState<CodeImageResult>(generateCodeImageSvg({ code, language: "ts", theme: "midnight", padding: 32, title: "snippet.ts" }));

  return (
    <AiLabWorkbenchShell artifactState={t("artifact.ready")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="code-to-image">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><Code2 size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="code-image-input">{t("codeLabel")}<textarea className="textarea prompt-textarea" id="code-image-input" onChange={(event) => setCode(event.target.value)} value={code} /></label><div className="button-row"><button className="button button-solid" onClick={() => setResult(generateCodeImageSvg({ code, language: "ts", theme: "midnight", padding: 32, title: "snippet.ts" }))} type="button"><ImageIcon size={16} aria-hidden="true" /> {t("generateButton")}</button></div></section>
        <section className="workspace-panel"><h2>{t("resultTitle")}</h2><p className="tool-description">{result.width} x {result.height} SVG</p><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.svg}</pre></section>
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
