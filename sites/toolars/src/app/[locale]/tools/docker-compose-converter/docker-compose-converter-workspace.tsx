"use client";

import { Container } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertDockerCompose, type DockerComposeDirection, type DockerComposeResult } from "@/lib/tools/docker-compose-converter";

export function DockerComposeConverterWorkspace() {
  const t = useTranslations("tools.docker-compose-converter.workspace");
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("run-to-compose" as DockerComposeDirection);
  const [result, setResult] = useState(null as DockerComposeResult | null);

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="docker-compose-converter"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="docker-direction">
            {t("directionLabel")}
            <select className="input" id="docker-direction" onChange={(event) => setDirection(event.target.value as DockerComposeDirection)} value={direction}>
              <option value="run-to-compose">{t("directions.runToCompose")}</option>
              <option value="compose-to-run">{t("directions.composeToRun")}</option>
            </select>
          </label>
          <label className="field-label" htmlFor="docker-input">
            {t("inputLabel")}
            <textarea className="input" id="docker-input" onChange={(event) => setInput(event.target.value)} rows={8} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(convertDockerCompose({ input, direction }))} type="button">
            <Container size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.error ?? result?.warnings[0]?.message ?? t("emptyResult")}</p>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>
            {result?.output || t("emptyOutput")}
          </pre>
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
