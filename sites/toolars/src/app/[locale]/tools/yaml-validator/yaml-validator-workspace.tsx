"use client";

import { CheckCircle2, Code2, FileCode2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { validateYamlDocument, type YamlValidationIssue, type YamlValidatorResult } from "@/lib/tools/yaml-validator";

export function YamlValidatorWorkspace() {
  const t = useTranslations("tools.yaml-validator.workspace");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<YamlValidatorResult | null>(null);
  const hasInput = input.trim().length > 0;

  const runValidation = () => {
    setResult(validateYamlDocument({ input }));
  };

  const updateInput = (value: string) => {
    setInput(value);
    setResult(null);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="yaml-validator"
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
            <span className="badge">{t("badges.config")}</span>
            <span>{t("configCopy")}</span>
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
            <Code2 size={18} aria-hidden="true" />
          </div>

          <label className="field-label" htmlFor="yaml-validator-input">
            {t("inputLabel")}
            <textarea
              className="input"
              id="yaml-validator-input"
              onChange={(event) => updateInput(event.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={10}
              value={input}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasInput} onClick={runValidation} type="button">
              <ShieldCheck size={16} aria-hidden="true" /> {t("validateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result ? getYamlSummary(result, t) : t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : result ? "badge ai" : "badge"}>
              {result?.success ? t("badges.ready") : result ? t("badges.error") : t("badges.waiting")}
            </span>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.stats.lines.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("linesLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.keys.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("keysLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.stats.depth.toLocaleString("en-US") ?? "0"}</strong>
              <span>{t("depthLabel")}</span>
            </article>
          </div>

          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              {result.errors.concat(result.warnings).length > 0 ? (
                result.errors.concat(result.warnings).map((issue) => (
                  <div className="detail-row" key={`${issue.severity}-${issue.type}-${issue.line}-${issue.column}`}>
                    <span className={issue.severity === "error" ? "badge ai" : "badge"}>{t("lineLabel", { line: issue.line })}</span>
                    <span>{getYamlIssueMessage(issue, t)}</span>
                  </div>
                ))
              ) : (
                <div className="detail-row">
                  <span className="badge local">{t("badges.ready")}</span>
                  <span>{t("validCopy")}</span>
                </div>
              )}
            </div>
          ) : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reviewTitle")}</h2>
              <p className="tool-description">{t("reviewDescription")}</p>
            </div>
            <FileCode2 size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.tabs"), t("reviewItems.indent"), t("reviewItems.diff")].map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("handoffTitle")}</h2>
            {result && !result.success ? <TriangleAlert size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
          </div>
          <p className="detail-aside-note">{result?.success ? result.privacyNote : result ? t("invalidCopy") : t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function getYamlSummary(result: YamlValidatorResult, t: ReturnType<typeof useTranslations>): string {
  if (result.errors.length > 0) return t("errorSummary", { count: result.errors.length });
  if (result.warnings.length > 0) return t("warningSummary", { count: result.warnings.length });
  return t("validSummary");
}

function getYamlIssueMessage(issue: YamlValidationIssue, t: ReturnType<typeof useTranslations>): string {
  return t(`issues.${issue.type}`);
}
