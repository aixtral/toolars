"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { BadgeDollarSign, Gauge, Save, Workflow } from "lucide-react";
import { LocalDraftModalButton } from "@/components/core/local-draft-modal-button";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { runLlmCostReviewWorkflow, type LlmCostReviewResult } from "@/lib/workflows/llm-cost-review";

const reviewModes = ["mvpLaunch", "teamBudget", "apiPricing"] as const;
const workflowSteps = ["countTokens", "compareModels", "planContext", "exportBudget"] as const;
type ReviewMode = (typeof reviewModes)[number];

function stripMonthlyCostPeriod(monthlyCost: string) {
  return monthlyCost.endsWith("/month") ? monthlyCost.slice(0, -"/month".length) : monthlyCost;
}

function stripTokenUnit(monthlyTokens: string) {
  return monthlyTokens.endsWith(" tokens") ? monthlyTokens.slice(0, -" tokens".length) : monthlyTokens;
}

export function LlmCostReviewWorkflow() {
  const t = useTranslations("workflows.llm-cost-review");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [mode, setMode] = useState("mvpLaunch" as ReviewMode);
  const [result, setResult] = useState(null as LlmCostReviewResult | null);

  const runReview = () => {
    setResult(runLlmCostReviewWorkflow());
  };

  const progress = result?.progressPercent ?? 0;
  const monthlyCost = result ? stripMonthlyCostPeriod(result.monthlyCost) : "";
  const monthlyTokens = result ? stripTokenUnit(result.monthlyTokens) : "";

  return (
    <div className="workflow-builder-layout" data-ai-lab-workflow="mobile-edge-v3">
      <section className="workspace-panel workflow-overview-panel">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <div className="badge-row workflow-badge-row">
          <span className="badge local">{t("badges.localSteps")}</span>
          <span className="badge">{t("badges.duration")}</span>
          <span className="badge workflow">{t("badges.launchReview")}</span>
        </div>

        <h2 style={{ marginTop: 26 }}>{t("reviewModeTitle")}</h2>
        <div className="workflow-mode-row" role="group" aria-label={t("reviewModeLabel")}>
          {reviewModes.map((item) => (
            <button
              aria-pressed={mode === item}
              className={`button ${mode === item ? "button-soft" : "button-outline-neutral"}`}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {t(`reviewModes.${item}`)}
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
                <span className="badge local">{t(`steps.${step}.badge`)}</span>
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
            <button className="button button-solid workflow-run-button" onClick={runReview} type="button">
              <Workflow size={16} aria-hidden="true" /> {t("run.action")}
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
            <strong>{result ? t("run.resultTitle") : t("run.readyTitle")}</strong>
            <p>{result ? t("run.resultMemo", { monthlyCost }) : t("run.readyDescription")}</p>
            {result ? <small>{t("run.monthlyTokens", { monthlyTokens })}</small> : null}
          </div>
        </section>
      </div>

      <aside className="workspace-panel workflow-tool-chain">
        <h2>{t("toolChain.title")}</h2>
        <div className="workflow-resource-list">
          <a className="workflow-resource-row" href={localizedHref("/tools/llm-cost-calculator")}>
            <span className="icon-tile green" data-workflow-resource-icon="llm-cost-calculator">
              <BadgeDollarSign size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("toolChain.llmCostCalculator.title")}</strong>
              <small>{t("toolChain.llmCostCalculator.description")}</small>
            </span>
            <span className="badge local">{t("toolChain.badges.estimate")}</span>
          </a>
          <div className="workflow-resource-row">
            <span className="icon-tile blue" data-workflow-resource-icon="model-comparator">
              <Gauge size={18} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("toolChain.modelComparator.title")}</strong>
              <small>{t("toolChain.modelComparator.description")}</small>
            </span>
            <span className="badge">{t("toolChain.badges.next")}</span>
          </div>
        </div>

        <div className="llm-recommended-plan">
          <strong>{t("budgetPolicy.title")}</strong>
          <p>{t("budgetPolicy.description")}</p>
        </div>
      </aside>
    </div>
  );
}
