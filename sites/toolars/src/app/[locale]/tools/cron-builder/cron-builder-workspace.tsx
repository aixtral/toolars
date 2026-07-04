"use client";

import { CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildCronExpression, type CronBuildResult } from "@/lib/tools/cron-builder";

export function CronBuilderWorkspace() {
  const t = useTranslations("tools.cron-builder.workspace");
  const [result, setResult] = useState<CronBuildResult | null>(null);

  const run = () =>
    setResult(buildCronExpression({ minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" }));

  return (
    <AiLabWorkbenchShell
      artifactState={result?.valid ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="cron-builder"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <CalendarClock size={18} aria-hidden="true" />
          </div>
          <div className="detail-row-list">
            {[t("preset.weekdays"), t("preset.nine"), t("preset.local")].map((item) => (
              <div className="detail-row" key={item}>
                <span className="badge local">{t("badges.local")}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <button className="button button-solid" onClick={run} type="button">
            {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.description ?? t("emptyResult")}</p>
          <pre className="input">{result?.expression ?? t("emptyOutput")}</pre>
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
