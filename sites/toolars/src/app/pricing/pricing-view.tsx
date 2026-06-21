import { CheckCircle2, CloudOff, Info, LockKeyhole, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

const trialPlans = [
  {
    name: "Trial workspace",
    badge: "Free trial mode",
    mobileBadge: "Free trial",
    description: "Google sign-in unlocks beta AI credits, synced history, and upload handoff testing during the free trial.",
    price: "$0",
    unit: "/ beta",
    mobileUnit: "/ beta",
    note: "No card required while Toolars is in beta.",
    cta: "Start free trial",
    mobileCta: "Start free trial",
    tone: "highlight",
    features: ["All traditional tools", "5,000 trial AI credits", "PDF uploads up to 200 MB", "14 day synced history", "Beta workflow runs"],
    mobileFeatures: ["Unlimited local traditional tools", "5,000 trial AI credits", "14 day synced history"],
    tags: ["Google sign-in", "Free trial", "No card required", "Beta usage"]
  }
] as const;

const paidPlans = [
  {
    name: "Free",
    badge: "Always free",
    mobileBadge: "Always free",
    description: "Local-first traditional tools for everyday work.",
    price: "$0",
    unit: "/ month",
    mobileUnit: "/ user / month",
    note: "",
    cta: "Get started free",
    mobileCta: "Start free",
    tone: "neutral",
    features: ["All traditional tools", "Local processing on-device", "Up to 20 tool uses/day", "Limited history (7 days)", "No sign-in required"],
    mobileFeatures: ["Unlimited local traditional tools", "Basic collections", "7 day local history"],
    tags: ["PDF merge and compress", "Finance and health calculators", "Developer utilities", "Community collections"]
  },
  {
    name: "Pro",
    badge: "Most popular",
    mobileBadge: "Most useful",
    description: "AI credits, saved history, and workflow runs for power users.",
    price: "$6.99",
    unit: "/ month",
    mobileUnit: "/ month",
    note: "Billed yearly at $69.90",
    cta: "Upgrade to Pro",
    mobileCta: "Upgrade to Pro",
    tone: "highlight",
    features: [
      "Everything in Free",
      "5,000 AI credits/month",
      "Upload files up to 200 MB",
      "Saved outputs & history",
      "Workflow runs up to 500/month",
      "Browser extension sync"
    ],
    mobileFeatures: ["Everything in Free", "5,000 AI credits/month", "Upload files up to 200 MB"],
    tags: ["Private collections", "AI consent controls", "Unlimited history", "Priority workflows"]
  },
  {
    name: "Team",
    badge: "For teams",
    mobileBadge: "For teams",
    description: "Shared workflow, collections, and billing controls for teams.",
    price: "$14.99",
    unit: "/ user / month",
    mobileUnit: "/ user / month",
    note: "Billed yearly",
    cta: "Upgrade to Team",
    mobileCta: "Upgrade to Team",
    tone: "neutral",
    features: ["Everything in Pro", "Shared collections", "Shared workflow & automation", "Admin controls & roles", "Centralized billing", "Priority support"],
    mobileFeatures: ["Everything in Pro", "Shared collections", "Shared workflow & automation"],
    tags: ["Team audit", "Advanced API", "1 GB files", "Custom billing"]
  }
] as const;

const comparisonRows = [
  ["Traditional tools", "Always free", "Always free", "Always free"],
  ["AI tools", "Limited credits/day", "5,000 credits/month", "5,000 credits/user/month"],
  ["Workflow runs", "10 runs/month", "500 runs/month", "Unlimited"],
  ["Max file size", "50 MB", "200 MB", "1 GB"],
  ["Saved history", "7 days", "Unlimited", "Unlimited"],
  ["Collections", "2 public collections", "Unlimited private", "Shared & private"],
  ["Team sharing", "-", "-", "Included"],
  ["API access", "-", "Basic", "Advanced"],
  ["Support", "Community", "Email support", "Priority support"]
] as const;

const faqs = [
  ["Are traditional tools really free?", "Yes. Traditional and local tools stay free, including calculators, converters, and utilities."],
  ["How does trial AI credit usage work?", "Trial credits are used when you run AI tools or workflow steps that require AI processing."],
  ["Do I need a card?", "No. The beta trial uses Google sign-in and paid plans are parked for Phase 2."],
  ["Do you process my files?", "Local tools run on your device. AI tools only process content after your consent."],
  ["What happens to my data?", "We remove temporary files after processing and keep saved outputs only when you choose to save them."]
] as const;

export function PricingView() {
  const freeTrialMode = isFreeTrialMode();
  const visiblePlans = freeTrialMode ? trialPlans : paidPlans;

  return (
    <div className="pricing-page" data-pricing-page="true" data-pricing-mobile-layout="mixed-tools-v2">
      <section className="section landing-hero pricing-hero">
        <span className="eyebrow">{freeTrialMode ? "Free trial mode" : "Plans and credits"}</span>
        <h1 className="title pricing-title-desktop">{freeTrialMode ? "Start your free Toolars trial." : "Start free. Upgrade when Toolars becomes your workspace."}</h1>
        <h1 aria-hidden="true" className="title pricing-title-mobile">{freeTrialMode ? "Free trial for mixed tools" : "Pricing built for mixed tools"}</h1>
        <p className="subtitle pricing-copy-desktop">
          {freeTrialMode
            ? "Traditional local tools stay free. Google sign-in unlocks trial AI credits, synced history, and PDF workflow handoff during beta."
            : "All traditional tools are free. Upgrade for AI credits, more storage, workflow automation, and team collaboration."}
        </p>
        <p aria-hidden="true" className="subtitle pricing-copy-mobile">
          {freeTrialMode
            ? "Traditional local tools stay free. Start a Google-backed trial for AI credits, workflow history, and PDF handoff testing."
            : "Traditional local tools stay free. Pro and Team plans add AI credits, workflow history, shared collections, and billing controls for repeat work."}
        </p>
        {freeTrialMode ? null : (
          <div className="pricing-toggle" role="group" aria-label="Billing interval">
            <button type="button">Monthly</button>
            <button aria-pressed="true" type="button">
              Yearly <span>Save 20%</span>
            </button>
          </div>
        )}
        <p className="pricing-note">{freeTrialMode ? "No card required during the beta trial." : "Prices shown in USD."}</p>
      </section>

      <div className="pricing-layout">
        <div className="pricing-main">
          <section className="pricing-card-grid" aria-label="Pricing plans">
            {visiblePlans.map((plan) => (
              <article className={`pricing-plan-card ${plan.tone === "highlight" ? "is-highlighted" : ""}`} key={plan.name}>
                <span className={plan.tone === "highlight" ? "badge local pricing-plan-badge" : "badge pricing-plan-badge"}>
                  <span className="pricing-badge-desktop">{plan.badge}</span>
                  <span aria-hidden="true" className="pricing-badge-mobile">{plan.mobileBadge}</span>
                </span>
                <h2>{plan.name}</h2>
                <p className="tool-description">{plan.description}</p>
                <div className="pricing-amount">
                  <strong>{plan.price}</strong>
                  <span>
                    <span className="pricing-unit-desktop">{plan.unit}</span>
                    <span aria-hidden="true" className="pricing-unit-mobile">{plan.mobileUnit}</span>
                  </span>
                </div>
                {plan.note ? <p className="pricing-note">{plan.note}</p> : null}
                <ul className="pricing-feature-list">
                  {plan.features.map((feature, index) => (
                    <li key={feature}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>
                        <span className="pricing-feature-desktop-label">{feature}</span>
                        {plan.mobileFeatures[index] ? (
                          <span aria-hidden="true" className="pricing-feature-mobile-label">{plan.mobileFeatures[index]}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="tag-list">
                  {plan.tags.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {freeTrialMode || plan.name === "Free" ? (
                  <CoreActionModalButton className="button button-outline-neutral" kind="sign-in">
                    <span className="pricing-cta-desktop">{plan.cta}</span>
                    <span aria-hidden="true" className="pricing-cta-mobile">{plan.mobileCta}</span>
                  </CoreActionModalButton>
                ) : (
                  <CoreActionModalButton
                    className={plan.tone === "highlight" ? "button button-solid" : "button button-outline-neutral"}
                    kind="upgrade"
                    planFeatures={plan.features}
                    planName={plan.name}
                    planPrice={`${plan.price}${plan.unit}`}
                  >
                    <span className="pricing-cta-desktop">{plan.cta}</span>
                    <span aria-hidden="true" className="pricing-cta-mobile">{plan.mobileCta}</span>
                  </CoreActionModalButton>
                )}
              </article>
            ))}
          </section>

          {freeTrialMode ? null : (
          <section className="pricing-comparison panel" aria-label="Feature comparison">
            <h2>Compare plans</h2>
            <div className="pricing-comparison-grid">
              <div className="pricing-comparison-header">
                <strong>Feature</strong>
                <strong>Free plan</strong>
                <strong>Pro plan</strong>
                <strong>Team plan</strong>
              </div>
              {comparisonRows.map(([feature, free, pro, team]) => (
                <div className="pricing-comparison-row" key={feature}>
                  <span>{feature}</span>
                  <span>{free}</span>
                  <span className="is-pro">{pro}</span>
                  <span>{team}</span>
                </div>
              ))}
            </div>
          </section>
          )}

          <section className="pricing-trust-strip">
            <article>
              <ShieldCheck size={26} aria-hidden="true" />
              <span>
                <strong>Local-first tools remain free</strong>
                <small>Your files stay on your device whenever possible.</small>
              </span>
            </article>
            <article>
              <LockKeyhole size={26} aria-hidden="true" />
              <span>
                <strong>AI processing only after consent</strong>
                <small>You control what goes to AI models.</small>
              </span>
            </article>
            <article>
              <CloudOff size={26} aria-hidden="true" />
              <span>
                <strong>No hidden uploads</strong>
                <small>We do not store your files after processing.</small>
              </span>
            </article>
          </section>
        </div>

        <aside className="pricing-side">
          <section className="panel pricing-usage-card">
            <h2>{freeTrialMode ? "Estimate your trial usage" : "Estimate your monthly usage"}</h2>
            <div className="pricing-slider-field">
              <label htmlFor="pricing-ai-credits">
                AI credits <Info size={13} aria-hidden="true" />
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
                Workflow runs <Workflow size={13} aria-hidden="true" />
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
                File storage <Info size={13} aria-hidden="true" />
              </label>
              <output htmlFor="pricing-file-storage">5 GB</output>
              <input id="pricing-file-storage" type="range" min="1" max="100" defaultValue="5" />
              <div className="pricing-range-labels">
                <span>1 GB</span>
                <span>100+ GB</span>
              </div>
            </div>
            <article className="pricing-recommendation">
              <span>Recommended plan</span>
              <strong>{freeTrialMode ? "Trial workspace" : "Pro"}</strong>
              <small>{freeTrialMode ? "$0 beta · Google sign-in required" : "$6.99 / month · Billed yearly"}</small>
              <Sparkles size={22} aria-hidden="true" />
            </article>
            {freeTrialMode ? (
              <span className="text-link">Paid plans are parked for Phase 2</span>
            ) : (
              <a className="text-link" href="/pricing#team">
                Need more? Contact sales
              </a>
            )}
          </section>

          <section className="panel pricing-faq" id="faq">
            <h2>Frequently asked questions</h2>
            {faqs.map(([question, answer]) => (
              <details key={question} open={question === "Are traditional tools really free?"}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
