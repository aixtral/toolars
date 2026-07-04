"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { validateJsonSchemaDocument, type SchemaValidatorResult } from "@/lib/tools/schema-validator";

export function SchemaValidatorWorkspace() {
  const t = useTranslations("tools.schema-validator.workspace");
  const [schemaInput, setSchemaInput] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [result, setResult] = useState(null as SchemaValidatorResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result?.valid ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="schema-validator">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="schema-json">
            {t("schemaLabel")}
            <textarea className="input" id="schema-json" onChange={(event) => setSchemaInput(event.target.value)} rows={6} value={schemaInput} />
          </label>
          <label className="field-label" htmlFor="data-json">
            {t("dataLabel")}
            <textarea className="input" id="data-json" onChange={(event) => setDataInput(event.target.value)} rows={6} value={dataInput} />
          </label>
          <button className="button button-solid" disabled={!schemaInput.trim() || !dataInput.trim()} onClick={() => setResult(validateJsonSchemaDocument({ schemaInput, dataInput }))} type="button">
            <ShieldCheck size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.parseError?.message ?? (result?.valid ? t("validResult") : result ? t("invalidResult") : t("emptyResult"))}</p>
          <div className="detail-row-list">
            {(result?.errors ?? []).map((error) => (
              <div className="detail-row" key={`${error.path}-${error.type}`}>
                <span className="badge ai">{error.type}</span>
                <span>{error.path}</span>
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
