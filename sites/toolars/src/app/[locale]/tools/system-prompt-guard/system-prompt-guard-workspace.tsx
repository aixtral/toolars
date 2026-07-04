"use client";

import { AlertTriangle, ClipboardList, Gauge, Scan, ShieldCheck, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import {
  scanSystemPromptGuard,
  type SystemPromptGuardResult,
  type SystemPromptGuardVulnerability
} from "@/lib/tools/system-prompt-guard";

export function SystemPromptGuardWorkspace() {
  const t = useTranslations("tools.system-prompt-guard.workspace");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<SystemPromptGuardResult | null>(null);
  const hasPrompt = prompt.trim().length > 0;

  const scanPrompt = () => {
    setResult(scanSystemPromptGuard(prompt));
  };

  const updatePrompt = (value: string) => {
    setPrompt(value);
    setResult(null);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="system-prompt-guard"
    >
      <section className="workspace-panel prompt-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="detail-row-list" style={{ marginTop: 28 }}>
          <div className="detail-row">
            <span className="badge local">{t("badges.local")}</span>
            <span>{t("localCopy")}</span>
          </div>
          <div className="detail-row">
            <span className="badge ai">{t("badges.guard")}</span>
            <span>{t("guardCopy")}</span>
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
            <span className="badge local">{t("badges.local")}</span>
          </div>

          <label className="field-label" htmlFor="system-prompt-guard-input">
            {t("promptLabel")}
            <textarea
              className="input"
              id="system-prompt-guard-input"
              onChange={(event) => updatePrompt(event.target.value)}
              placeholder={t("promptPlaceholder")}
              rows={10}
              value={prompt}
            />
          </label>

          <div className="button-row">
            <button className="button button-solid" disabled={!hasPrompt} onClick={scanPrompt} type="button">
              <Scan size={16} aria-hidden="true" /> {t("scanButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("reportTitle")}</h2>
              <p className="tool-description">
                {result
                  ? t("reportSummary", {
                      count: result.vulnerabilities.length,
                      risk: t(`riskLevels.${result.riskLevel}`)
                    })
                  : t("emptyReport")}
              </p>
            </div>
            <Gauge size={18} aria-hidden="true" />
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.securityScore ?? 100}</strong>
              <span>{t("securityScore")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result ? t(`riskLevels.${result.riskLevel}`) : t("riskLevels.safe")}</strong>
              <span>{t("riskLevel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.vulnerabilities.length ?? 0}</strong>
              <span>{t("findingsCount")}</span>
            </article>
          </div>

          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge local">{t("badges.local")}</span>
                <span>{result.privacyNote}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("findingsTitle")}</h2>
              <p className="tool-description">{t("findingsDescription")}</p>
            </div>
            <AlertTriangle size={18} aria-hidden="true" />
          </div>

          <div className="detail-resource-list">
            {result?.vulnerabilities.length ? (
              result.vulnerabilities.map((finding) => <FindingRow finding={finding} key={`${finding.categoryKey}-${finding.issueKey}`} />)
            ) : (
              <p className="detail-aside-note">{result ? t("noFindings") : t("waitingFindings")}</p>
            )}
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("mitigationsTitle")}</h2>
              <p className="tool-description">{t("mitigationsDescription")}</p>
            </div>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>

          <div className="remediation-list">
            {(result?.recommendations ?? [t("mitigations.waiting")]).map((recommendation, index) => (
              <div className="remediation-row" key={recommendation}>
                <span>{index + 1}</span>
                <p>{formatRecommendation(recommendation, t)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldOff size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {[t("reviewItems.secrets"), t("reviewItems.injection"), t("reviewItems.roles")].map((item, index) => (
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
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{t("handoffCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}

function formatRecommendation(recommendation: string, t: ReturnType<typeof useTranslations>): string {
  if (recommendation.startsWith("mitigation")) return t(`mitigations.${recommendation}`);
  if (recommendation.startsWith("No guard issues detected")) return t("mitigations.safe");
  return recommendation;
}

function FindingRow({ finding }: { finding: SystemPromptGuardVulnerability }) {
  const t = useTranslations("tools.system-prompt-guard.workspace");

  return (
    <article className="detail-resource-row">
      <span className={`icon-tile ${finding.severity === "high" ? "rose" : "amber"}`}>
        <AlertTriangle size={16} aria-hidden="true" />
      </span>
      <span>
        <strong>{t(`categories.${finding.categoryKey}`)}</strong>
        <small>
          {t(`issues.${finding.issueKey}`)}
          {finding.line ? ` ${t("line", { line: finding.line })}` : ""}
        </small>
      </span>
      <span className={`badge ${finding.severity === "high" ? "ai" : ""}`}>{t(`severity.${finding.severity}`)}</span>
    </article>
  );
}
