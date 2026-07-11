"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FileJson, Save, ScanSearch, ShieldCheck } from "lucide-react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  runAiPromptHardeningWorkflow,
  type AiPromptHardeningResult
} from "@/lib/workflows/ai-prompt-hardening";

const inputSurfaces = ["systemPrompt", "toolInstruction", "retrievedText"] as const;
const workflowSteps = ["pastePrompt", "scanInjectionRisk", "addGuardrails", "redTeamVariants"] as const;
type InputSurface = (typeof inputSurfaces)[number];

export function AiPromptHardeningWorkflow() {
  const t = useTranslations("workflows.ai-prompt-hardening");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [surface, setSurface] = useState("systemPrompt" as InputSurface);
  const [result, setResult] = useState(null as AiPromptHardeningResult | null);
  const progress = result?.progressPercent ?? 0;

  const runHardening = () => {
    setResult(runAiPromptHardeningWorkflow());
  };

  return (
    <div className="workflow-builder-layout" data-ai-lab-workflow="mobile-edge-v3">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge local">{t("badges.aiReviewOptional")}</span>
          <span className="badge warn">{t("badges.injectionRisk")}</span>
          <span className="badge">{t("badges.duration")}</span>
        </div>

        <h2 style={{ marginTop: 26 }}>{t("inputSurfacesTitle")}</h2>
        <div className="workflow-mode-row" role="group" aria-label={t("inputSurfacesLabel")}>
          {inputSurfaces.map((item) => (
            <button
              aria-pressed={surface === item}
              className={`button ${surface === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setSurface(item)}
              type="button"
            >
              {t(`inputSurfaces.${item}`)}
            </button>
          ))}
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("canvas.title")}</h2>
              <p className="tool-description">{t("canvas.description")}</p>
            </div>
            <button disabled className="button button-outline-neutral" type="button">
              <Save size={16} aria-hidden="true" /> {t("canvas.save")}
            </button>
          </div>

          <div className="workflow-step-list">
            {workflowSteps.map((step, index) => (
              <article className="workflow-step-row" key={step}>
                <span className="mcp-stage-number">{index + 1}</span>
                <span>
                  <strong>{t(`steps.${step}.title`)}</strong>
                  <small>{t(`steps.${step}.description`)}</small>
                </span>
                <span className={`badge ${step === "scanInjectionRisk" ? "warn" : "local"}`}>{t(`steps.${step}.badge`)}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workflow-run-head">
            <div>
              <h2>{t("run.title")}</h2>
              <p className="tool-description">{t("run.description")}</p>
            </div>
            <button className="button button-solid workflow-run-button" onClick={runHardening} type="button">
              <ShieldCheck size={16} aria-hidden="true" /> {t("run.action")}
            </button>
          </div>

          <div
            aria-label={t("run.progressLabel")}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="workflow-progress"
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="workflow-output-box">
            <strong>{result?.statusTitle ?? t("run.readyTitle")}</strong>
            <p>{result?.summary ?? t("run.readyDescription")}</p>
            {result ? <small>{result.consentNote}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>{t("toolChain.title")}</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href={localizedHref("/tools/prompt-injection-scanner")}>
            <span className="icon-tile rose" data-workflow-resource-icon="prompt-injection-scanner">
              <ScanSearch size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("toolChain.promptScanner.title")}</strong>
              <small>{t("toolChain.promptScanner.description")}</small>
            </span>
            <span className="badge warn">{t("toolChain.badges.scan")}</span>
          </a>
          <a className="workflow-resource-row" href={localizedHref("/tools/json-repair")}>
            <span className="icon-tile amber" data-workflow-resource-icon="json-repair">
              <FileJson size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("toolChain.jsonRepair.title")}</strong>
              <small>{t("toolChain.jsonRepair.description")}</small>
            </span>
            <span className="badge local">{t("toolChain.badges.local")}</span>
          </a>
        </div>

        <div className="workflow-review-gate">
          <strong>{t("reviewGate.title")}</strong>
          <p>{t("reviewGate.description")}</p>
          <button disabled className="button button-outline-neutral" type="button">
            {t("reviewGate.action")}
          </button>
        </div>
      </aside>
    </div>
  );
}
