"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { searchUnicodeCharacters, type UnicodeSearchResult } from "@/lib/tools/unicode-search";

export function UnicodeSearchWorkspace() {
  const t = useTranslations("tools.unicode-search.workspace");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<UnicodeSearchResult | null>(null);

  const runSearch = () => {
    setResult(searchUnicodeCharacters({ query }));
  };

  return (
    <AiLabWorkbenchShell artifactState={result ? t("artifact.ready") : t("artifact.waiting")} providerRoute={t("providerRoute")} runMode={t("runMode")} toolSlug="unicode-search">
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </section>
      <main className="workspace-stack">
        <section className="workspace-panel">
          <h2>{t("inputTitle")}</h2>
          <label className="field-label" htmlFor="unicode-search">
            {t("inputLabel")}
            <input className="input" id="unicode-search" onChange={(event) => setQuery(event.target.value)} value={query} />
          </label>
          <button className="button button-solid" onClick={runSearch} type="button">
            <Search size={16} aria-hidden="true" /> {t("actionButton")}
          </button>
        </section>
        <section className="workspace-panel">
          <h2>{t("resultsTitle")}</h2>
          <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
          <div className="detail-row-list">
            {(result?.matches ?? []).map((item) => (
              <div className="detail-row" key={item.codePoint}>
                <span className="badge">{item.codePoint}</span>
                <span>{item.char} {item.name}</span>
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
