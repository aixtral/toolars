"use client";

import { FileImage, ScanSearch } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { inspectImageDataUrl, type ImageDataUrlInspection } from "@/lib/tools/base64-image-encoder";

export function Base64ImageEncoderWorkspace() {
  const t = useTranslations("tools.base64-image-encoder.workspace");
  const rootT = useTranslations();
  const locale = useLocale();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null as ImageDataUrlInspection | null);

  return (
    <AiLabWorkbenchShell artifactState={result?.isValid ? t("artifact.ready") : t("artifact.blocked")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="base64-image-encoder">
      <section className="workspace-panel llm-cost-overview"><span className="eyebrow">{t("eyebrow")}</span><h1>{t("title")}</h1><p className="subtitle">{t("subtitle")}</p></section>
      <main className="workspace-stack">
        <section className="workspace-panel"><div className="workspace-section-title" style={{ marginTop: 0 }}><div><h2>{t("inputTitle")}</h2><p className="tool-description">{t("inputDescription")}</p></div><FileImage size={18} aria-hidden="true" /></div><label className="field-label" htmlFor="base64-image-input">{t("inputLabel")}<textarea className="textarea prompt-textarea" id="base64-image-input" onChange={(event) => setInput(event.target.value)} value={input} /></label><div className="button-row"><button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(inspectImageDataUrl(input))} type="button"><ScanSearch size={16} aria-hidden="true" /> {t("inspectButton")}</button></div></section>
        {result ? <section className="workspace-panel"><h2>{t("resultTitle")}</h2><p className="tool-description">{result.mimeType} | {result.byteSize.toLocaleString(locale)} {rootT("tools.file-size-converter.workspace.bytesLabel")}</p><pre aria-label={t("outputLabel")} className="textarea prompt-textarea">{result.dataUrl}</pre></section> : null}
      </main>
      <aside className="workspace-stack"><section className="workspace-panel"><h2>{t("reviewTitle")}</h2><p className="tool-description">{result?.warnings[0] ?? t("reviewCopy")}</p></section></aside>
    </AiLabWorkbenchShell>
  );
}
