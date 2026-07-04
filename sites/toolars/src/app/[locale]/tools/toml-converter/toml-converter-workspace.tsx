"use client";

import { ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { convertToml, type TomlConverterResult, type TomlDirection } from "@/lib/tools/toml-converter";

export function TomlConverterWorkspace() {
  const t = useTranslations("tools.toml-converter.workspace");
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("toml-to-json" as TomlDirection);
  const [result, setResult] = useState(null as TomlConverterResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="toml-converter">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="toml-direction">
            {t("directionLabel")}
            <select className="input" id="toml-direction" onChange={(event) => setDirection(event.target.value as TomlDirection)} value={direction}>
              <option value="toml-to-json">{t("directions.tomlToJson")}</option>
              <option value="json-to-toml">{t("directions.jsonToToml")}</option>
            </select>
          </label>
          <label className="field-label" htmlFor="toml-input">
            {t("inputLabel")}
            <textarea className="input" id="toml-input" onChange={(event) => setInput(event.target.value)} rows={9} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(convertToml({ input, direction }))} type="button">
            <ArrowLeftRight size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.error ?? (result ? t("readyResult") : t("emptyResult"))}</p>
          <pre className="input" style={{ whiteSpace: "pre-wrap" }}>{result?.output || t("emptyOutput")}</pre>
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
