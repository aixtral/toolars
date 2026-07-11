import { CheckCircle2, CloudOff, Info, LockKeyhole, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

type PricingPlanKey = "trial" | "free" | "pro" | "team";

interface PricingPlanDefinition {
  actionKind: "sign-in" | "upgrade";
  key: PricingPlanKey;
  tone: "highlight" | "neutral";
}

interface ComparisonRow {
  feature: string;
  free: string;
  pro: string;
  team: string;
}

interface FaqItem {
  answer: string;
  question: string;
}

const trialPlans: PricingPlanDefinition[] = [
  {
    actionKind: "sign-in",
    key: "trial",
    tone: "highlight"
  }
];

const paidPlans: PricingPlanDefinition[] = [
  {
    actionKind: "sign-in",
    key: "free",
    tone: "neutral"
  },
  {
    actionKind: "upgrade",
    key: "pro",
    tone: "highlight"
  },
  {
    actionKind: "upgrade",
    key: "team",
    tone: "neutral"
  }
];

export function PricingView() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const freeTrialMode = isFreeTrialMode();
  const visiblePlans = freeTrialMode ? trialPlans : paidPlans;
  const comparisonRows = t.raw("comparison.rows") as ComparisonRow[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  return (
    <div className="pricing-page" data-pricing-page="true" data-pricing-mobile-layout="mixed-tools-v2">
      <section className="section landing-hero pricing-hero">
        <span className="eyebrow">{freeTrialMode ? t("hero.trialEyebrow") : t("hero.paidEyebrow")}</span>
        <h1 className="title pricing-title-desktop">{freeTrialMode ? t("hero.trialTitleDesktop") : t("hero.paidTitleDesktop")}</h1>
        <h1 aria-hidden="true" className="title pricing-title-mobile">{freeTrialMode ? t("hero.trialTitleMobile") : t("hero.paidTitleMobile")}</h1>
        <p className="subtitle pricing-copy-desktop">
          {freeTrialMode ? t("hero.trialCopyDesktop") : t("hero.paidCopyDesktop")}
        </p>
        <p aria-hidden="true" className="subtitle pricing-copy-mobile">
          {freeTrialMode ? t("hero.trialCopyMobile") : t("hero.paidCopyMobile")}
        </p>
        {freeTrialMode ? null : (
          <div className="pricing-toggle" role="group" aria-label={t("billingToggle.ariaLabel")}>
            <button disabled type="button">{t("billingToggle.monthly")}</button>
            <button disabled aria-pressed="true" type="button">
              {t("billingToggle.yearly")} <span>{t("billingToggle.savings")}</span>
            </button>
          </div>
        )}
        <p className="pricing-note">{freeTrialMode ? t("hero.trialNote") : t("hero.paidNote")}</p>
      </section>

      <div className="pricing-layout">
        <div className="pricing-main">
          <section className="pricing-card-grid" aria-label={t("aria.plans")}>
            {visiblePlans.map((plan) => {
              const planPath = `plans.${plan.key}`;
              const badge = t(`${planPath}.badge`);
              const mobileBadge = t(`${planPath}.mobileBadge`);
              const name = t(`${planPath}.name`);
              const description = t(`${planPath}.description`);
              const price = t(`${planPath}.price`);
              const unit = t(`${planPath}.unit`);
              const mobileUnit = t(`${planPath}.mobileUnit`);
              const note = t(`${planPath}.note`);
              const features = t.raw(`${planPath}.features`) as string[];
              const mobileFeatures = t.raw(`${planPath}.mobileFeatures`) as string[];
              const tags = t.raw(`${planPath}.tags`) as string[];
              const cta = t(`${planPath}.cta`);
              const mobileCta = t(`${planPath}.mobileCta`);
              return (
              <article className={`pricing-plan-card ${plan.tone === "highlight" ? "is-highlighted" : ""}`} key={plan.key}>
                <span className={plan.tone === "highlight" ? "badge local pricing-plan-badge" : "badge pricing-plan-badge"}>
                  <span className="pricing-badge-desktop">{badge}</span>
                  <span aria-hidden="true" className="pricing-badge-mobile">{mobileBadge}</span>
                </span>
                <h2>{name}</h2>
                <p className="tool-description">{description}</p>
                <div className="pricing-amount">
                  <strong>{price}</strong>
                  <span>
                    <span className="pricing-unit-desktop">{unit}</span>
                    <span aria-hidden="true" className="pricing-unit-mobile">{mobileUnit}</span>
                  </span>
                </div>
                {note ? <p className="pricing-note">{note}</p> : null}
                <ul className="pricing-feature-list">
                  {features.map((feature, index) => (
                    <li key={index}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>
                        <span className="pricing-feature-desktop-label">{feature}</span>
                        {mobileFeatures[index] ? (
                          <span aria-hidden="true" className="pricing-feature-mobile-label">{mobileFeatures[index]}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="tag-list">
                  {tags.map((tag) => (
                    <span className="chip" key={`${plan.key}-${tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                {plan.actionKind === "sign-in" ? (
                  <CoreActionModalButton className="button button-outline-neutral" kind="sign-in">
                    <span className="pricing-cta-desktop">{cta}</span>
                    <span aria-hidden="true" className="pricing-cta-mobile">{mobileCta}</span>
                  </CoreActionModalButton>
                ) : (
                  <CoreActionModalButton
                    className={plan.tone === "highlight" ? "button button-solid" : "button button-outline-neutral"}
                    kind="upgrade"
                    planFeatures={features}
                    planName={name}
                    planPrice={`${price}${unit}`}
                  >
                    <span className="pricing-cta-desktop">{cta}</span>
                    <span aria-hidden="true" className="pricing-cta-mobile">{mobileCta}</span>
                  </CoreActionModalButton>
                )}
              </article>
              );
            })}
          </section>

          {freeTrialMode ? null : (
          <section className="pricing-comparison panel" aria-label={t("aria.comparison")}>
            <h2>{t("comparison.title")}</h2>
            <div className="pricing-comparison-grid">
              <div className="pricing-comparison-header">
                <strong>{t("comparison.headers.feature")}</strong>
                <strong>{t("comparison.headers.free")}</strong>
                <strong>{t("comparison.headers.pro")}</strong>
                <strong>{t("comparison.headers.team")}</strong>
              </div>
              {comparisonRows.map((row) => (
                <div className="pricing-comparison-row" key={row.feature}>
                  <span>{row.feature}</span>
                  <span>{row.free}</span>
                  <span className="is-pro">{row.pro}</span>
                  <span>{row.team}</span>
                </div>
              ))}
            </div>
          </section>
          )}

          <section className="pricing-trust-strip">
            <article>
              <ShieldCheck size={26} aria-hidden="true" />
              <span>
                <strong>{t("trust.localFirst.title")}</strong>
                <small>{t("trust.localFirst.description")}</small>
              </span>
            </article>
            <article>
              <LockKeyhole size={26} aria-hidden="true" />
              <span>
                <strong>{t("trust.aiConsent.title")}</strong>
                <small>{t("trust.aiConsent.description")}</small>
              </span>
            </article>
            <article>
              <CloudOff size={26} aria-hidden="true" />
              <span>
                <strong>{t("trust.noUploads.title")}</strong>
                <small>{t("trust.noUploads.description")}</small>
              </span>
            </article>
          </section>
        </div>

        <aside className="pricing-side">
          <section className="panel pricing-usage-card">
            <h2>{freeTrialMode ? t("usage.trialTitle") : t("usage.paidTitle")}</h2>
            <div className="pricing-slider-field">
              <label htmlFor="pricing-ai-credits">
                {t("usage.aiCredits")} <Info size={13} aria-hidden="true" />
              </label>
              <output htmlFor="pricing-ai-credits">5,000</output>
              <input id="pricing-ai-credits" type="range" min="1000" max="20000" defaultValue="5000" />
              <div className="pricing-range-labels">
                <span>1,000</span>
                <span>20,000+</span>
              </div>
            </div>
            <div className="pricing-slider-field">
              <label htmlFor="pricing-workflow-runs">
                {t("usage.workflowRuns")} <Workflow size={13} aria-hidden="true" />
              </label>
              <output htmlFor="pricing-workflow-runs">300</output>
              <input id="pricing-workflow-runs" type="range" min="0" max="2000" defaultValue="300" />
              <div className="pricing-range-labels">
                <span>0</span>
                <span>2,000+</span>
              </div>
            </div>
            <div className="pricing-slider-field">
              <label htmlFor="pricing-file-storage">
                {t("usage.fileStorage")} <Info size={13} aria-hidden="true" />
              </label>
              <output htmlFor="pricing-file-storage">5 GB</output>
              <input id="pricing-file-storage" type="range" min="1" max="100" defaultValue="5" />
              <div className="pricing-range-labels">
                <span>1 GB</span>
                <span>100+ GB</span>
              </div>
            </div>
            <article className="pricing-recommendation">
              <span>{t("usage.recommended")}</span>
              <strong>{freeTrialMode ? t("plans.trial.name") : t("plans.pro.name")}</strong>
              <small>{freeTrialMode ? t("usage.trialRecommendation") : t("usage.paidRecommendation")}</small>
              <Sparkles size={22} aria-hidden="true" />
            </article>
            {freeTrialMode ? (
              <span className="text-link">{t("usage.parkedPhase2")}</span>
            ) : (
              <a className="text-link" href={localizedHref("/pricing#team")}>
                {t("usage.contactSales")}
              </a>
            )}
          </section>

          <section className="panel pricing-faq" id="faq">
            <h2>{t("faq.title")}</h2>
            {faqItems.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
