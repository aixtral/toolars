"use client";

import { SearchCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { explainCronExpression, type CronExplainResult } from "@/lib/tools/cron-explainer";

export function CronExplainerWorkspace() {
  const t = useTranslations("tools.cron-explainer.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null as CronExplainResult | null);

  return (
    <AiLabWorkbenchShell
      artifactState={result?.valid ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="cron-explainer"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="cron-explainer-input">
            {t("inputLabel")}
            <input className="input" id="cron-explainer-input" onChange={(event) => setInput(event.target.value)} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(explainCronExpression({ expression: input }))} type="button">
            <SearchCode size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
          <div className="detail-row-list">
            {(result?.fields ?? []).map((field) => (
              <div className="detail-row" key={field.name}>
                <span className="badge">{field.name}</span>
                <span>{field.value}</span>
              </div>
            ))}
          </div>
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
