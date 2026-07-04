"use client";

import { ClipboardList, FileJson, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { buildAiGuardrailConfig, type AiGuardrailConfigResult } from "@/lib/tools/ai-guardrail-config";

export function AiGuardrailConfigWorkspace() {
  const t = useTranslations("tools.ai-guardrail-config.workspace");
  const [name, setName] = useState("");
  const [result, setResult] = useState<AiGuardrailConfigResult | null>(null);

  const buildConfig = () => setResult(buildAiGuardrailConfig({ name }));

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("artifact.ready") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="ai-guardrail-config"
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
            <span className="badge">{t("badges.policy")}</span>
            <span>{t("policyCopy")}</span>
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
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="ai-guardrail-config-name">
            {t("nameLabel")}
            <input
              className="input"
              id="ai-guardrail-config-name"
              onChange={(event) => {
                setName(event.target.value);
                setResult(null);
              }}
              placeholder={t("namePlaceholder")}
              value={name}
            />
          </label>
          <div className="button-row">
            <button className="button button-solid" onClick={buildConfig} type="button">
              <FileJson size={16} aria-hidden="true" /> {t("buildButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.summary ?? t("emptyResult")}</p>
            </div>
            <span className={result ? "badge local" : "badge"}>{result ? t("badges.ready") : t("badges.waiting")}</span>
          </div>
          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.enabledProtectionCount ?? 0}</strong>
              <span>{t("protectionsLabel")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.exportConfig.name ?? "-"}</strong>
              <span>{t("configNameLabel")}</span>
            </article>
          </div>
          <pre className="input" style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
            {result ? JSON.stringify(result.exportConfig, null, 2) : t("emptyPreview")}
          </pre>
          {result ? (
            <div className="detail-row-list" style={{ marginTop: 20 }}>
              <div className="detail-row">
                <span className="badge local">{t("badges.local")}</span>
                <span>{result.privacyNote}</span>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("checklistTitle")}</h2>
            <ClipboardList size={18} aria-hidden="true" />
          </div>
          <div className="remediation-list">
            {(result?.reviewChecklist ?? [t("waitingChecklist")]).map((item, index) => (
              <div className="remediation-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
