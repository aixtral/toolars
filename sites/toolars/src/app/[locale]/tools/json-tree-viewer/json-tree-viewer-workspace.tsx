"use client";

import { ListTree } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildJsonTree, type JsonTreeResult } from "@/lib/tools/json-tree-viewer";

export function JsonTreeViewerWorkspace() {
  const t = useTranslations("tools.json-tree-viewer.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null as JsonTreeResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="json-tree-viewer">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="json-tree-input">
            {t("inputLabel")}
            <textarea className="input" id="json-tree-input" onChange={(event) => setInput(event.target.value)} rows={9} value={input} />
          </label>
          <button className="button button-solid" disabled={!input.trim()} onClick={() => setResult(buildJsonTree({ input }))} type="button">
            <ListTree size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.error?.message ?? (result ? t("readyResult", { count: result.nodes.length }) : t("emptyResult"))}</p>
          <div className="detail-row-list">
            {(result?.nodes ?? []).slice(0, 12).map((node) => (
              <div className="detail-row" key={node.path}>
                <span className="badge">{node.type}</span>
                <span>{node.path}</span>
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
