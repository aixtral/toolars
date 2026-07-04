"use client";

import { ClipboardCheck, ClipboardCopy, Link2, Repeat2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { parsePermissionInput, type ChmodResult } from "@/lib/tools/chmod-calculator";

export function ChmodCalculatorWorkspace() {
  const t = useTranslations("tools.chmod-calculator.workspace");
  const [input, setInput] = useState("755");
  const [result, setResult] = useState<ChmodResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runCalculation = () => {
    setCopied(false);
    setResult(parsePermissionInput(input));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
    setCopied(false);
  };

  const copyCommand = async () => {
    if (!result?.command || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(result.command);
    setCopied(true);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="chmod-calculator"
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
            <span className="badge">{t("badges.permissions")}</span>
            <span>{t("permissionCopy")}</span>
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
          <label className="field-label" htmlFor="chmod-input">
            {t("inputLabel")}
            <input
              className="input"
              id="chmod-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              value={input}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={runCalculation} type="button">
              <Repeat2 size={16} aria-hidden="true" /> {t("calculateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getChmodSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.calculated") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.octal || "-"}</strong>
              <span>{t("octalLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.symbolic || "-"}</strong>
              <span>{t("symbolicLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.warnings.length ?? 0}</strong>
              <span>{t("warningsLabel")}</span>
            </article>
          </div>
          {result && !result.success ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge ai">{t("badges.error")}</span>
                <span>{t("errors.invalid-permission")}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("commandTitle")}</h2>
              <p className="tool-description">{result?.description || t("commandDescription")}</p>
            </div>
            <button className="button button-secondary" disabled={!result?.command} onClick={copyCommand} type="button">
              {copied ? <ClipboardCheck size={16} aria-hidden="true" /> : <ClipboardCopy size={16} aria-hidden="true" />}
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <pre aria-label={t("commandLabel")} className="textarea prompt-textarea">
            {result?.command || t("emptyCommand")}
          </pre>
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
            {(result?.warnings.length ? result.warnings : [t("reviewItems.world"), t("reviewItems.execute"), t("reviewItems.owner")]).map(
              (item, index) => (
                <div className="remediation-row" key={item}>
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </div>
              )
            )}
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

function getChmodSummary(result: ChmodResult, t: ReturnType<typeof useTranslations>): string {
  if (!result.success) return t("failedSummary");
  return t("calculatedSummary", {
    octal: result.octal,
    symbolic: result.symbolic
  });
}
