import { ArrowRight, Bookmark, CheckCircle2, Cloud, Eye, Image, Lock, Send, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

const submissionStepKeys = ["basics", "classification", "pricingProcessing", "reviewPreview"] as const;
const checklistKeys = ["toolName", "websiteUrl", "shortDescription", "longDescription", "category", "tags", "toolType", "processing", "screenshotOrLogo"] as const;
const timelineKeys = ["submitted", "qualityReview", "securityCheck", "published"] as const;
const pendingReviewState = "pending_review";
const sampleTool = {
  contactEmail: "hello@imageenhancer.ai",
  name: "Image Enhancer AI",
  websiteUrl: "https://imageenhancer.ai"
} as const;

export function SubmitToolView() {
  const t = useTranslations("submitTool");

  return (
    <div className="submit-tool-page" data-submit-tool-page="true">
      <section className="section landing-hero">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1 className="title">{t("hero.title")}</h1>
        <p className="subtitle">{t("hero.subtitle")}</p>
      </section>

      <div className="submit-layout">
        <form className="submit-form panel">
          <section className="submit-step-list" aria-label={t("steps.ariaLabel")}>
            {submissionStepKeys.map((stepKey, index) => (
              <article className="submit-step-row" key={stepKey}>
                <span className="mcp-stage-number">{index + 1}</span>
                <span>
                  <strong>{t(`steps.items.${stepKey}.title`)}</strong>
                  <small>{t(`steps.items.${stepKey}.description`)}</small>
                </span>
                <span className={index === 0 ? "badge local" : "badge"}>{index === 0 ? t("steps.states.active") : t("steps.states.next")}</span>
              </article>
            ))}
          </section>

          <section className="submit-form-section">
            <h2>{t("sections.basics")}</h2>
            <div className="submit-field-grid">
              <label className="field-label" htmlFor="tool-name">
                {t("fields.toolName")}
                <input id="tool-name" name="toolName" defaultValue={sampleTool.name} />
              </label>
              <label className="field-label" htmlFor="website-url">
                {t("fields.websiteUrl")}
                <input id="website-url" name="websiteUrl" defaultValue={sampleTool.websiteUrl} />
              </label>
              <label className="field-label submit-field-wide" htmlFor="short-description">
                {t("fields.shortDescription")}
                <input id="short-description" name="shortDescription" defaultValue={t("sample.shortDescription")} />
              </label>
              <label className="field-label submit-field-wide" htmlFor="long-description">
                {t("fields.longDescription")}
                <textarea
                  id="long-description"
                  name="longDescription"
                  defaultValue={t("sample.longDescription")}
                />
              </label>
              <label className="field-label submit-field-wide" htmlFor="contact-email">
                {t("fields.contactEmail")}
                <input id="contact-email" name="contactEmail" defaultValue={sampleTool.contactEmail} />
              </label>
            </div>
          </section>

          <section className="submit-form-section">
            <h2>{t("sections.classification")}</h2>
            <div className="submit-field-grid">
              <label className="field-label" htmlFor="category">
                {t("fields.category")}
                <select id="category" name="category" defaultValue="image">
                  <option value="image">{t("categoryOptions.image")}</option>
                  <option value="pdf">{t("categoryOptions.pdf")}</option>
                  <option value="developer">{t("categoryOptions.developer")}</option>
                </select>
              </label>
              <label className="field-label" htmlFor="tags">
                {t("fields.tags")}
                <input id="tags" name="tags" defaultValue={t("sample.tags")} />
              </label>
            </div>
            <p className="field-label">{t("fields.toolType")}</p>
            <div className="submit-segment-row" role="group" aria-label={t("fields.toolType")}>
              <button disabled className="button button-outline-neutral" type="button">
                {t("toolTypes.traditional")}
              </button>
              <button disabled aria-pressed="true" className="button button-soft" type="button">
                {t("toolTypes.aiPowered")}
              </button>
              <button disabled className="button button-outline-neutral" type="button">
                {t("toolTypes.workflow")}
              </button>
            </div>
          </section>

          <section className="submit-form-section">
            <h2>{t("sections.pricingProcessing")}</h2>
            <div className="submit-field-grid">
              <fieldset className="submit-fieldset">
                <legend>{t("fields.processing")}</legend>
                <label>
                  <input type="checkbox" name="processing" value="local" /> {t("processing.local")}
                </label>
                <label>
                  <input defaultChecked type="checkbox" name="processing" value="cloud" /> {t("processing.cloud")}
                </label>
                <label>
                  <input defaultChecked type="checkbox" name="processing" value="ai-consent" /> {t("processing.aiConsent")}
                </label>
              </fieldset>
              <fieldset className="submit-fieldset">
                <legend>{t("fields.pricingModel")}</legend>
                <div className="submit-segment-row">
                  <button disabled className="button button-outline-neutral" type="button">
                    {t("pricing.free")}
                  </button>
                  <button disabled aria-pressed="true" className="button button-soft" type="button">
                    {t("pricing.freemium")}
                  </button>
                  <button disabled className="button button-outline-neutral" type="button">
                    {t("pricing.paid")}
                  </button>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="submit-form-section">
            <h2>{t("sections.reviewPreview")}</h2>
            <p className="tool-description">
              {t("reviewPreview.before")} <code>{pendingReviewState}</code>
              {t("reviewPreview.after")}
            </p>
          </section>

          <div className="submit-action-row">
            <button disabled className="button button-outline-neutral" type="button">
              {t("actions.saveDraft")}
            </button>
            <button disabled className="button button-outline-neutral" type="button">
              <Eye size={16} aria-hidden="true" /> {t("actions.previewListing")}
            </button>
            <button disabled className="button button-solid" type="button">
              <Send size={16} aria-hidden="true" /> {t("actions.submitForReview")}
            </button>
          </div>
        </form>

        <aside className="submit-preview panel">
          <h2>{t("sections.preview")}</h2>
          <article className="submit-preview-card">
            <span className="icon-tile green">
              <Sparkles size={24} aria-hidden="true" />
            </span>
            <span>
              <strong>{sampleTool.name}</strong>
              <small>{t("sample.shortDescription")}</small>
            </span>
            <BookmarkPreview />
            <p>{t("sample.previewDescription")}</p>
            <div className="tag-list">
              <span className="badge ai">{t("toolTypes.aiPowered")}</span>
              <span className="badge">{t("pricing.freemium")}</span>
              <span className="badge">{t("categoryOptions.image")}</span>
            </div>
            <div className="submit-preview-footer">
              <span>
                <Image size={16} aria-hidden="true" /> {t("categoryOptions.image")}
              </span>
              <span>
                <Cloud size={16} aria-hidden="true" /> {t("processing.cloud")}
              </span>
              <button disabled className="button button-outline-neutral" type="button">
                {t("actions.open")} <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </article>
          <p className="submit-preview-note">{t("preview.note")}</p>
        </aside>

        <aside className="submit-review-rail">
          <section className="panel">
            <div className="landing-section-head">
              <h2>{t("sections.reviewChecklist")}</h2>
              <span className="badge local">{t("checklist.complete")}</span>
            </div>
            <div className="submit-check-list">
              {checklistKeys.map((itemKey, index) => (
                <div className="submit-check-row" key={itemKey}>
                  <CheckCircle2 size={16} color={index < 8 ? "#059669" : "#9ca3af"} aria-hidden="true" />
                  <span>{t(`checklist.items.${itemKey}`)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>{t("sections.guidelines")}</h2>
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge local">{t("guidelines.functional")}</span>
                <span>{t("guidelines.functionalDescription")}</span>
              </div>
              <div className="detail-row">
                <span className="badge warn">{t("guidelines.safety")}</span>
                <span>{t("guidelines.safetyDescription")}</span>
              </div>
              <div className="detail-row">
                <span className="badge ai">{t("guidelines.disclosure")}</span>
                <span>{t("guidelines.disclosureDescription")}</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>{t("sections.whatNext")}</h2>
            <div className="submit-timeline">
              {timelineKeys.map((itemKey, index) => (
                <article className="submit-timeline-row" key={itemKey}>
                  <span className={index === 0 ? "badge local" : "badge"}>{index + 1}</span>
                  <span>
                    <strong>{t(`timeline.items.${itemKey}.title`)}</strong>
                    <small>{t(`timeline.items.${itemKey}.description`)}</small>
                  </span>
                </article>
              ))}
            </div>
            <p className="submit-preview-note">
              {t("timeline.systemState")} <code>{pendingReviewState}</code>
            </p>
          </section>

          {isFreeTrialMode() ? null : (
            <section className="panel landing-private-card">
              <span className="icon-tile green">
                <Lock size={18} aria-hidden="true" />
              </span>
              <h2>{t("upsell.title")}</h2>
              <p className="tool-description">{t("upsell.description")}</p>
              <button disabled className="button button-solid" type="button">
                {t("actions.upgradeToPro")} <ArrowRight size={14} aria-hidden="true" />
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function BookmarkPreview() {
  return (
    <span className="submit-bookmark" aria-hidden="true">
      <Bookmark size={18} />
    </span>
  );
}
