"use client";

import { Braces } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildJsonSchema, type JsonSchemaBuilderResult, type JsonSchemaField, type JsonSchemaFieldType } from "@/lib/tools/json-schema-builder";

export function JsonSchemaBuilderWorkspace() {
  const t = useTranslations("tools.json-schema-builder.workspace");
  const [rows, setRows] = useState("");
  const [result, setResult] = useState<JsonSchemaBuilderResult | null>(null);

  function buildSchema() {
    setResult(buildJsonSchema({ title: "Toolars schema", fields: parseFieldRows(rows) }));
  }

  return (
    <AiLabWorkbenchShell artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="json-schema-builder">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="json-schema-rows">
            {t("inputLabel")}
            <textarea className="input" id="json-schema-rows" onChange={(event) => setRows(event.target.value)} rows={8} value={rows} />
          </label>
          <button className="button button-solid" disabled={!rows.trim()} onClick={buildSchema} type="button">
            <Braces size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.errors[0]?.message ?? (result ? t("readyResult") : t("emptyResult"))}</p>
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

function parseFieldRows(rows: string): JsonSchemaField[] {
  return rows
    .split(/\n+/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [name, type = "string", required, format] = row.split(":");
      return {
        name,
        type: (["string", "number", "integer", "boolean", "array", "object"].includes(type) ? type : "string") as JsonSchemaFieldType,
        required: required === "required",
        ...(format ? { format } : {})
      };
    });
}
