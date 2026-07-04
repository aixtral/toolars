"use client";

import { MonitorPlay } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildHtmlPreview, type HtmlPreviewResult } from "@/lib/tools/html-preview";

export function HtmlPreviewWorkspace() {
  const t = useTranslations("tools.html-preview.workspace");
  const [html, setHtml] = useState("");
  const [result, setResult] = useState(null as HtmlPreviewResult | null);

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="html-preview"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="html-preview-input">
            {t("inputLabel")}
            <textarea className="input" id="html-preview-input" onChange={(event) => setHtml(event.target.value)} rows={9} value={html} />
          </label>
          <button className="button button-solid" disabled={!html.trim()} onClick={() => setResult(buildHtmlPreview({ html }))} type="button">
            <MonitorPlay size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.success ? t("readyResult") : t("emptyResult")}</p>
          {result ? <iframe className="input" srcDoc={result.srcDoc} sandbox="" title={t("previewTitle")} /> : null}
        </section>
      </main>
      <aside className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("reviewTitle")}</h2>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
