"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { generatePassword, type PasswordOptions, type PasswordResult } from "@/lib/tools/password-generator";

const defaultOptions: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true
};

export function PasswordGeneratorWorkspace() {
  const t = useTranslations("tools.password-generator.workspace");
  const [options, setOptions] = useState(defaultOptions);
  const [result, setResult] = useState(null as PasswordResult | null);

  const updateOption = (patch: Partial<PasswordOptions>) => {
    setOptions((current) => ({ ...current, ...patch }));
    setResult(null);
  };

  return (
    <AiLabWorkbenchShell
      artifactState={result?.success ? t("artifact.ready") : result ? t("artifact.error") : t("artifact.waiting")}
      providerRoute={t("providerRoute")}
      runMode={t("runMode")}
      toolSlug="password-generator"
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
              <h2>{t("settingsTitle")}</h2>
              <p className="tool-description">{t("settingsDescription")}</p>
            </div>
            <LockKeyhole size={18} aria-hidden="true" />
          </div>
          <label className="field-label" htmlFor="password-generator-length">
            {t("lengthLabel")}
            <input
              className="input"
              id="password-generator-length"
              max={128}
              min={4}
              onChange={(event) => updateOption({ length: Number(event.target.value) || 20 })}
              type="number"
              value={options.length}
            />
          </label>
          <div className="detail-row-list" style={{ marginTop: 20 }}>
            {(["uppercase", "lowercase", "numbers", "symbols", "excludeAmbiguous"] as const).map((key) => (
              <label className="detail-row" key={key}>
                <span>{t(`options.${key}`)}</span>
                <input checked={Boolean(options[key])} onChange={(event) => updateOption({ [key]: event.target.checked })} type="checkbox" />
              </label>
            ))}
          </div>
          <div className="button-row">
            <button className="button button-solid" onClick={() => setResult(generatePassword(options))} type="button">
              {t("generateButton")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultsTitle")}</h2>
              <p className="tool-description">{result?.success ? t("generatedSummary") : result?.error?.message ?? t("emptyResult")}</p>
            </div>
            <span className={result?.success ? "badge local" : "badge"}>{result?.success ? result.strength : t("badges.waiting")}</span>
          </div>
          <div className="detail-row-list">
            <div className="detail-row">
              <span className="badge">{t("passwordLabel")}</span>
              <code data-testid="password-output">{result?.password ?? ""}</code>
            </div>
            <div className="detail-row">
              <span className="badge">{t("strengthLabel")}</span>
              <span>{result ? `${Math.round(result.strengthScore)} / 100` : "-"}</span>
            </div>
          </div>
        </section>
      </main>

      <aside className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <h2>{t("reviewTitle")}</h2>
            <ShieldCheck size={18} aria-hidden="true" />
          </div>
          <p className="detail-aside-note">{result?.privacyNote ?? t("reviewCopy")}</p>
        </section>
      </aside>
    </AiLabWorkbenchShell>
  );
}
