"use client";

import { FileKey2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { parseEnvDocument, type EnvParseResult } from "@/lib/tools/env-editor";

const initialEnvResult = null as EnvParseResult | null;

export function EnvEditorWorkspace() {
  const t = useTranslations("tools.env-editor.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(initialEnvResult);

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="env-editor"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="env-input">
            {t("inputLabel")}
            <textarea className="input" id="env-input" onChange={(event) => setInput(event.target.value)} rows={9} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(parseEnvDocument({ input }))} type="button">
            <FileKey2 size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
          <div className="detail-row-list">
            {(result?.entries ?? []).filter((entry) => entry.type === "pair").map((entry) => (
              <div className="detail-row" key={`${entry.line}-${entry.type}`}>
                <span className="badge">{entry.key}</span>
                <span>{entry.value || t("emptyValue")}</span>
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
