"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { parseUrl, type UrlParseResult } from "@/lib/tools/url-parser";

export function UrlParserWorkspace() {
  const t = useTranslations("tools.url-parser.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<UrlParseResult | null>(null);
  const [copied, setCopied] = useState(false);

  const parseInput = () => {
    setCopied(false);
    setResult(parseUrl(input));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const copySummary = async () => {
    if (!result?.output || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(buildUrlSummary(result));
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="url-parser"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row">
            <span className="badge local">{t("badges.local")}</span>
            <span>{t("localCopy")}</span>
          </div>
          <div className="detail-row">
            <span className="badge">{t("badges.query")}</span>
            <span>{t("queryCopy")}</span>
          </div>
        </div>
      </section>

      <main className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputTitle")}</h2>
              <p className="tool-description">{t("inputDescription")}</p>
            </div>
            <Link2 size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="url-parser-input">
            {t("inputLabel")}
            <input
              className="input"
              id="url-parser-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input.trim()} onClick={parseInput} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("parseButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getUrlResultSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.parsed") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.inputLength.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("inputLengthLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.queryCount.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("queryCountLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.output?.protocol || "-"}</strong>
              <span>{t("protocolLabel")}</span>
            </article>
          </div>

          {result?.success && result.output ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              {[
                [t("fields.origin"), result.output.origin],
                [t("fields.hostname"), result.output.hostname],
                [t("fields.pathname"), result.output.pathname],
                [t("fields.hash"), result.output.hash || "-"]
              ].map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <span className="badge">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t(`errors.${result.error?.type ?? "invalid-url"}`)}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("queryTitle")}</h2>
              <p className="tool-description">{t("queryDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.output} onClick={copySummary} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <div className="detail-row-list">
            {result?.output?.queryPairs.length ? (
              result.output.queryPairs.map((pair, index) => (
                <div className="detail-row" key={`${pair.key}-${index}`}>
                  <span className="badge">{index + 1}</span>
                  <span>{pair.key} = {pair.value}</span>
                </div>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyQuery")}</p>
            )}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.protocol"), t("reviewItems.query"), t("reviewItems.secrets")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("validationTitle")}</h2>
            <TriangleAlert size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("waitingValidation")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getUrlResultSummary(result: UrlParseResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("parsedSummary", {
    inputLength: result.stats.inputLength,
    queryCount: result.stats.queryCount
  });
}

function buildUrlSummary(result: UrlParseResult): string {
  if (!result.output) return "";
  return [
    `origin: ${result.output.origin}`,
    `hostname: ${result.output.hostname}`,
    `pathname: ${result.output.pathname}`,
    `query: ${result.output.queryPairs.map((pair) => `${pair.key}=${pair.value}`).join("&")}`
  ].join("\n");
}
