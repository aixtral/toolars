"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FlaskConical, Network, Rocket, Save } from "lucide-react";
import { LocalDraftModalButton } from "@/components/core/local-draft-modal-button";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  runMcpToolLaunchWorkflow,
  type McpToolLaunchResult
} from "@/lib/workflows/mcp-tool-launch";

const launchTargets = ["internalAgent", "hostedServer", "marketplaceSubmission"] as const;
const workflowSteps = ["defineTools", "buildManifest", "runMcpTests", "exportDocs"] as const;

type LaunchTarget = (typeof launchTargets)[number];

const defaultLaunchTarget: LaunchTarget = "internalAgent";

function initialLaunchResult(): McpToolLaunchResult | null {
  return null;
}

export function McpToolLaunchWorkflow() {
  const t = useTranslations("workflows.mcp-tool-launch");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [target, setTarget] = useState(defaultLaunchTarget);
  const [result, setResult] = useState(initialLaunchResult);
  const progress = result?.progressPercent ?? 0;

  const runLaunchCheck = () => {
    setResult(runMcpToolLaunchWorkflow());
  };

  return (
    <div className="workflow-builder-layout" data-ai-lab-workflow="mobile-edge-v3">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge workflow">{t("badges.agentReady")}</span>
          <span className="badge local">{t("badges.localSteps")}</span>
          <span className="badge">{t("badges.duration")}</span>
        </div>

        <h2 style={{ marginTop: 26 }}>{t("launchTargetTitle")}</h2>
        <div className="workflow-mode-row" role="group" aria-label={t("launchTargetLabel")}>
          {launchTargets.map((item) => (
            <button
              aria-pressed={target === item}
              className={`button ${target === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setTarget(item)}
              type="button"
            >
              {t(`launchTargets.${item}`)}
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
            <LocalDraftModalButton
              className="button button-outline-neutral"
              defaultName={t("title")}
              draftKind="workflow"
              icon={<Save size={16} aria-hidden="true" />}
              label={t("canvas.save")}
              storageKey="toolars.local-workflows:v1"
            />
          </div>

          <div className="workflow-step-list">
            {workflowSteps.map((step, index) => (
              <article className="workflow-step-row" key={step}>
                <span className="mcp-stage-number">{index + 1}</span>
                <span>
                  <strong>{t(`steps.${step}.title`)}</strong>
                  <small>{t(`steps.${step}.description`)}</small>
                </span>
                <span className={`badge ${step === "runMcpTests" ? "warn" : "local"}`}>{t(`steps.${step}.badge`)}</span>
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
            <button className="button button-solid workflow-run-button" onClick={runLaunchCheck} type="button">
              <Rocket size={16} aria-hidden="true" /> {t("run.action")}
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
            <strong>{result ? t("run.result.statusTitle") : t("run.readyTitle")}</strong>
            <p>{result ? t("run.result.summary") : t("run.readyDescription")}</p>
            {result ? <small>{t("run.result.reviewGate")}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>{t("toolChain.title")}</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href={localizedHref("/tools/mcp-server-builder")}>
            <span className="icon-tile purple" data-workflow-resource-icon="mcp-server-builder">
              <Network size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("toolChain.serverBuilder.title")}</strong>
              <small>{t("toolChain.serverBuilder.description")}</small>
            </span>
            <span className="badge workflow">{t("toolChain.badges.build")}</span>
          </a>
          <div className="workflow-resource-row">
            <span className="icon-tile blue" data-workflow-resource-icon="mcp-tester">
              <FlaskConical size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("toolChain.tester.title")}</strong>
              <small>{t("toolChain.tester.description")}</small>
            </span>
            <span className="badge">{t("toolChain.badges.next")}</span>
          </div>
        </div>

        <div className="workflow-review-gate">
          <strong>{t("reviewGate.title")}</strong>
          <p>{t("reviewGate.description")}</p>
        </div>
      </aside>
    </div>
  );
}
