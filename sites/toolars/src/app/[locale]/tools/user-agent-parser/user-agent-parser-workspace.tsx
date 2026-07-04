"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { parseUserAgent, type UAResult } from "@/lib/tools/user-agent-parser";

export function UserAgentParserWorkspace() {
  const t = useTranslations("tools.user-agent-parser.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<UAResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runParse = () => {
    setCopied(false);
    setResult(parseUserAgent(input));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!result || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(
      [
        `browser: ${formatVersioned(result.browser)}`,
        `os: ${formatVersioned(result.os)}`,
        `device: ${result.device}`,
        `engine: ${result.engine}`
      ].join("\n")
    );
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="user-agent-parser"
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
            <span className="badge">{t("badges.regex")}</span>
            <span>{t("parserCopy")}</span>
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
          <label className="field-label" htmlFor="user-agent-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="user-agent-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={7}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" disabled={!input.trim()} onClick={runParse} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("parseButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? t("parsedSummary") : t("emptyResult")}</p>
            </div>
            <span className={result ? "badge local" : "badge"}>{result ? t("badges.parsed") : t("badges.waiting")}</span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result ? formatVersioned(result.browser) : "-"}</strong>
              <span>{t("browserLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? formatVersioned(result.os) : "-"}</strong>
              <span>{t("osLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.engine ?? "-"}</strong>
              <span>{t("engineLabel")}</span>
            </article>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("detailsTitle")}</h2>
              <p className="tool-description">{t("detailsDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result} onClick={copyOutput} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <div className="detail-row-list">
            {result ? (
              [
                [t("fields.device"), result.device],
                [t("fields.engine"), result.engine],
                [t("fields.browser"), formatVersioned(result.browser)],
                [t("fields.os"), formatVersioned(result.os)]
              ].map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <span className="badge">{label}</span>
                  <span>{value}</span>
                </div>
              ))
            ) : (
              <p className="detail-aside-note">{t("emptyDetails")}</p>
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
            {[t("reviewItems.spoofing"), t("reviewItems.coverage"), t("reviewItems.privacy")].map((item, index) => (
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
          <p className="detail-aside-note">{result ? result.privacyNote : t("waitingValidation")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function formatVersioned(value: { name: string; version: string }): string {
  return value.version ? `${value.name} ${value.version}` : value.name;
}
