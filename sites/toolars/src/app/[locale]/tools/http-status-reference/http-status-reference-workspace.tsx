"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { lookupHttpStatuses, type HttpStatusLookupResult } from "@/lib/tools/http-status-reference";

export function HttpStatusReferenceWorkspace() {
  const t = useTranslations("tools.http-status-reference.workspace");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null as HttpStatusLookupResult | null);

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="http-status-reference">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="http-status-search">
            {t("inputLabel")}
            <input className="input" id="http-status-search" onChange={(event) => setQuery(event.target.value)} value={query} />
          </label>
          <button className="button button-solid" onClick={() => setResult(lookupHttpStatuses({ query }))} type="button">
            <Search size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
          <div className="detail-row-list">
            {(result?.matches ?? []).map((status) => (
              <div className="detail-row" key={status.code}>
                <span className="badge">{status.category}</span>
                <span>{status.code} {status.phrase}</span>
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
