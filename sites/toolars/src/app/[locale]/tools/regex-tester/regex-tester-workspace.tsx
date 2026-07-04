"use client";

import { Braces, SearchCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { testRegex, type RegexTestResult } from "@/lib/tools/regex-tester";

export function RegexTesterWorkspace() {
  const t = useTranslations("tools.regex-tester.workspace");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [sample, setSample] = useState("");
  const [result, setResult] = useState<RegexTestResult | null>(null);

  const runTest = () => {
    setResult(testRegex(pattern, flags, sample));
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="regex-tester"
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
            <Braces size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="regex-pattern">
            {t("patternLabel")}
            <input className="input" id="regex-pattern" onChange={(event) => setPattern(event.target.value)} value={pattern} />
          </label>
          <label className="field-label" htmlFor="regex-flags">
            {t("flagsLabel")}
            <input className="input" id="regex-flags" onChange={(event) => setFlags(event.target.value)} value={flags} />
          </label>
          <label className="field-label" htmlFor="regex-sample">
            {t("sampleLabel")}
            <textarea className="input" id="regex-sample" onChange={(event) => setSample(event.target.value)} rows={7} value={sample} />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!pattern} onClick={runTest} type="button">
              {t("testButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? t("matchSummary", { count: result.matchCount }) : t("emptyResult")}</p>
            </div>
            <SearchCode size={18} aria-hidden="true" />
          </div>
          <div className="detail-row-list">
            {result?.matches.length ? (
              result.matches.map((match, index) => (
                <div className="detail-row" key={`${match.index}-${index}`}>
                  <span className="badge">{match.index}</span>
                  <code>{match.fullMatch}</code>
                </div>
              ))
            ) : (
              <p className="detail-aside-note">{result?.error?.message ?? t("emptyMatches")}</p>
            )}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
