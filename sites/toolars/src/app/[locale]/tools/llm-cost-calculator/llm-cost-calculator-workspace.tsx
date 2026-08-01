"use client";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import { Calculator, Save, TrendingUp } from "lucide-react";
import { AiLabWorkbenchShell } from "@/components/lab/ai-lab-workbench-shell";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import {
  calculateLlmCost,
  llmCostProfiles,
  type LlmCostInput,
  type LlmCostProfileKey,
  type LlmCostResult
} from "@/lib/tools/llm-cost-calculator";
import { useSaveFeedback } from "@/components/core/use-save-feedback";

const defaultScenario: LlmCostInput = {
  inputTokensPerRequest: 2400,
  outputTokensPerRequest: 700,
  requestsPerMonth: 180000,
  modelProfile: "balanced"
};

const costRows = [
  { key: "local", tone: "local" },
  { key: "byok", tone: "" },
  { key: "pro", tone: "local" }
] as const;

const checklistRows = ["context", "routing", "tracking"] as const;

function getRecommendationKey(totalCost: number) {
  if (totalCost >= 1000) return "approval";
  if (totalCost >= 250) return "review";
  return "safe";
}

function formatUsd(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function LlmCostCalculatorWorkspace() {
  const t = useTranslations("tools.llm-cost-calculator.workspace");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const localizedHref = (href: string) => localizePath(href, localeCode);
  const [scenario, setScenario] = useState((): LlmCostInput => ({ ...defaultScenario }));
  const [result, setResult] = useState(null as LlmCostResult | null);

  const calculate = () => {
    setResult(calculateLlmCost(scenario));
  };

  const { flashSaved, saved } = useSaveFeedback();
  const saveScenario = () => {
    window.localStorage.setItem("toolars.llm-cost-calculator.scenario", JSON.stringify(scenario));
    flashSaved();
  };

  const updateNumber = (key: keyof Pick<LlmCostInput, "inputTokensPerRequest" | "outputTokensPerRequest" | "requestsPerMonth">, value: string) => {
    setScenario((current) => ({
      ...current,
      [key]: Number(value)
    }));
    setResult(null);
  };

  const updateModel = (value: string) => {
    setScenario((current) => ({
      ...current,
      modelProfile: value as LlmCostProfileKey
    }));
    setResult(null);
  };

  const inputBar = result?.inputSharePercent ?? 77;
  const outputBar = result?.outputSharePercent ?? 23;
  const resultSummary = result
    ? t("resultSection.summary", {
        model: t(`modelProfiles.${scenario.modelProfile}`),
        input: formatUsd(result.inputCost),
        output: formatUsd(result.outputCost)
      })
    : t("resultSection.emptyDescription");
  const recommendation = result ? t(`recommendations.${getRecommendationKey(result.totalCost)}`) : t("callout.waitingTitle");

  return (
    <AiLabWorkbenchShell
      artifactState={result ? t("shell.artifactBudgetEstimate") : t("shell.artifactWaiting")}
      providerRoute={t("shell.providerRoute")}
      runMode={t("shell.runMode")}
      toolSlug="llm-cost-calculator"
    >
      <section className="workspace-panel llm-cost-overview">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>

        <h2 style={{ marginTop: 28 }}>{t("modelTitle")}</h2>
        <div className="profile-list">
          {costRows.map((row) => (
            <div className="profile-row" key={row.key}>
              <span className={`badge ${row.tone}`}>{t(`costRows.${row.key}.label`)}</span>
              <span>{t(`costRows.${row.key}.text`)}</span>
            </div>
          ))}
        </div>

        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <a className="button button-outline" href={localizedHref("/tools/llm-cost-calculator/about")}>{t("detailsLink")}</a>
        </div>
      </section>

      <div className="workspace-stack">
        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("inputSection.title")}</h2>
              <p className="tool-description">{t("inputSection.description")}</p>
            </div>
            <span className="badge local">{t("badges.estimator")}</span>
          </div>

          <div className="llm-input-grid">
            <label className="field-label" htmlFor="llm-input-tokens">
              {t("fields.inputTokens")}
              <input
                className="input"
                id="llm-input-tokens"
                min={0}
                onChange={(event) => updateNumber("inputTokensPerRequest", event.target.value)}
                type="number"
                value={scenario.inputTokensPerRequest}
              />
            </label>
            <label className="field-label" htmlFor="llm-output-tokens">
              {t("fields.outputTokens")}
              <input
                className="input"
                id="llm-output-tokens"
                min={0}
                onChange={(event) => updateNumber("outputTokensPerRequest", event.target.value)}
                type="number"
                value={scenario.outputTokensPerRequest}
              />
            </label>
            <label className="field-label" htmlFor="llm-requests">
              {t("fields.requests")}
              <input
                className="input"
                id="llm-requests"
                min={0}
                onChange={(event) => updateNumber("requestsPerMonth", event.target.value)}
                type="number"
                value={scenario.requestsPerMonth}
              />
            </label>
            <label className="field-label" htmlFor="llm-model-profile">
              {t("fields.modelProfile")}
              <select className="input" id="llm-model-profile" onChange={(event) => updateModel(event.target.value)} value={scenario.modelProfile}>
                {Object.values(llmCostProfiles).map((profile) => (
                  <option key={profile.key} value={profile.key}>{t(`modelProfiles.${profile.key}`)}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="button-row">
            <button className="button button-outline" type="button" onClick={saveScenario}>
              <Save size={16} aria-hidden="true" /> {t("actions.save")}
            </button>
            {saved ? <span className="save-feedback" role="status">{tCommon("saved")}</span> : null}
            <button className="button button-solid" type="button" onClick={calculate}>
              <Calculator size={16} aria-hidden="true" /> {t("actions.calculate")}
            </button>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>{t("resultSection.title")}</h2>
              <p className="tool-description">{resultSummary}</p>
            </div>
          </div>

          <div className="llm-metric-grid">
            <article className="llm-metric">
              <strong>{result?.formattedTotalCost ?? "$0"}</strong>
              <span>{t("metrics.monthlyCost")}</span>
            </article>
            <article className="llm-metric">
              <strong>{result?.formattedMonthlyTokens ?? "0M"}</strong>
              <span>{t("metrics.monthlyTokens")}</span>
            </article>
          </div>

          <div className="llm-bar-stack" aria-label={t("bars.costMixLabel")}>
            <span className="llm-bar input" style={{ width: `${inputBar}%` }}>{t("bars.inputTokens")}</span>
            <span className="llm-bar output" style={{ width: `${outputBar}%` }}>{t("bars.outputTokens")}</span>
          </div>

          <div className="llm-plan-callout">
            <TrendingUp size={18} aria-hidden="true" />
            <span>
              <strong>{recommendation}</strong>
              <small>{result ? t("callout.reviewBudget") : t("callout.waitingDescription")}</small>
            </span>
          </div>
        </section>
      </div>

      <aside className="workspace-panel">
        <span className="eyebrow">{t("review.eyebrow")}</span>
        <h2 style={{ marginTop: 12 }}>{t("review.title")}</h2>
        <div className="remediation-list">
          {checklistRows.map((item, index) => (
            <div className="remediation-row" key={item}>
              <span>{index + 1}</span>
              <p>{t(`review.notes.${item}`)}</p>
            </div>
          ))}
        </div>

        <div className="llm-recommended-plan">
          <strong>{t("recommendation.title")}</strong>
          <p>{t("recommendation.body")}</p>
        </div>
      </aside>
    </AiLabWorkbenchShell>
  );
}
