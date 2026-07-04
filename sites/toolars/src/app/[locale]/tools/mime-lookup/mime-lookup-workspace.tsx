"use client";

import { FileSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { lookupMimeTypes, type MimeLookupResult } from "@/lib/tools/mime-lookup";

export function MimeLookupWorkspace() {
  const t = useTranslations("tools.mime-lookup.workspace");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null as MimeLookupResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="mime-lookup">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="mime-search">
            {t("inputLabel")}
            <input className="input" id="mime-search" onChange={(event) => setQuery(event.target.value)} value={query} />
          </label>
          <button className="button button-solid" onClick={() => setResult(lookupMimeTypes({ query }))} type="button">
            <FileSearch size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
          <div className="detail-row-list">
            {(result?.matches ?? []).map((item) => (
              <div className="detail-row" key={`${item.extension}-${item.mime}`}>
                <span className="badge">{item.extension}</span>
                <span>{item.mime}</span>
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
