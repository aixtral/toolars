import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Download, FileCheck2, FileText, MoreHorizontal, ShieldCheck, UploadCloud } from "lucide-react";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const kpis = [
  { key: "pendingReviews", value: "42" },
  { key: "securityFlags", value: "8" },
  { key: "aiConsentReviews", value: "16" },
  { key: "publishedThisMonth", value: "124" }
] as const;

const submissions = [
  { key: "aiResearchSummarizer", categoryKey: "writingResearch", typeKey: "ai", processingKey: "aiConsent", pricingKey: "freemium", statusKey: "new", riskKey: "medium", updatedKey: "tenMinAgo" },
  { key: "pdfCompressorPro", categoryKey: "pdf", typeKey: "traditional", processingKey: "local", pricingKey: "freemium", statusKey: "new", riskKey: "low", updatedKey: "twentyEightMinAgo" },
  { key: "csvChartMaker", categoryKey: "data", typeKey: "traditional", processingKey: "cloud", pricingKey: "free", statusKey: "securityReview", riskKey: "high", updatedKey: "oneHourAgo" },
  { key: "socialCaptionAi", categoryKey: "socialMedia", typeKey: "ai", processingKey: "aiConsent", pricingKey: "freemium", statusKey: "aiReview", riskKey: "medium", updatedKey: "twoHoursAgo" },
  { key: "mortgagePlanner", categoryKey: "finance", typeKey: "traditional", processingKey: "local", pricingKey: "freemium", statusKey: "new", riskKey: "low", updatedKey: "threeHoursAgo" }
] as const;

const selectedSubmissionKey = "aiResearchSummarizer";
const detailRowKeys = ["submittedBy", "submittedOn", "lastUpdated", "category", "toolType", "processing", "pricing"] as const;
const automatedCheckKeys = [
  { key: "urlReachable", tone: "ok" },
  { key: "duplicateScan", tone: "ok" },
  { key: "malwareScan", tone: "ok" },
  { key: "privacyPolicyFound", tone: "warn" },
  { key: "aiDisclosurePresent", tone: "ok" }
] as const;
const checklist = [
  { checked: true, key: "functionality" },
  { checked: true, key: "categoryTags" },
  { checked: true, key: "pricingClear" },
  { checked: false, key: "privacyPolicy" },
  { checked: true, key: "aiDisclosure" },
  { checked: false, key: "noMisleadingClaims" }
] as const;
const attachments = [
  { key: "screenshot", icon: "upload" },
  { key: "demoRecording", icon: "file" }
] as const;

export function AdminReviewView() {
  const t = useTranslations("adminReview");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  return (
    <div className="admin-review-page" data-admin-review-page="true">
      <section className="section admin-review-hero">
        <div>
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          <h1 className="title">{t("hero.title")}</h1>
          <p className="subtitle">{t("hero.subtitle")}</p>
        </div>
        <a className="button button-outline-neutral" href={localizedHref("/submit")}>
          {t("actions.openSubmitForm")}
        </a>
      </section>

      <section className="admin-kpi-grid" aria-label={t("summaryAriaLabel")}>
        {kpis.map((kpi) => (
          <article className="panel admin-kpi-card" key={kpi.key}>
            <span className="icon-tile green">
              <FileCheck2 size={20} aria-hidden="true" />
            </span>
            <div>
              <strong>{kpi.value}</strong>
              <span>{t(`kpis.${kpi.key}.label`)}</span>
              <small>{t(`kpis.${kpi.key}.detail`)}</small>
            </div>
          </article>
        ))}
      </section>

      <div className="admin-review-layout">
        <main className="admin-review-main">
          <section className="panel admin-queue-panel">
            <div className="admin-toolbar">
              <label className="input-like" htmlFor="admin-search">
                {t("toolbar.search")}
              </label>
              <button className="button button-outline-neutral" type="button">
                {t("toolbar.sortNewest")}
              </button>
              <button className="button button-outline-neutral" type="button">
                {t("toolbar.allStatuses")}
              </button>
              <button className="button button-outline-neutral" type="button">
                {t("toolbar.filters")}
              </button>
              <button className="button button-outline-neutral" type="button">
                <Download size={15} aria-hidden="true" /> {t("toolbar.exportCsv")}
              </button>
            </div>

            <div className="admin-submission-table" aria-label={t("table.ariaLabel")}>
              <div className="admin-submission-head">
                <strong>{t("table.headers.tool")}</strong>
                <strong>{t("table.headers.category")}</strong>
                <strong>{t("table.headers.type")}</strong>
                <strong>{t("table.headers.processing")}</strong>
                <strong>{t("table.headers.pricing")}</strong>
                <strong>{t("table.headers.status")}</strong>
                <strong>{t("table.headers.risk")}</strong>
                <strong>{t("table.headers.updated")}</strong>
                <strong>{t("table.headers.actions")}</strong>
              </div>
              {submissions.map((submission, index) => {
                const toolName = t(`submissions.${submission.key}.tool`);
                const submittedBy = t(`submissions.${submission.key}.submittedBy`);

                return (
                  <article className={`admin-submission-row ${index === 0 ? "is-selected" : ""}`} key={submission.key}>
                    <span>
                      <strong>{toolName}</strong>
                      <small>{t("table.submittedBy", { name: submittedBy })}</small>
                    </span>
                    <span>{t(`categories.${submission.categoryKey}`)}</span>
                    <span className="badge">{t(`types.${submission.typeKey}`)}</span>
                    <span className={submission.processingKey === "aiConsent" ? "badge warning" : "badge local"}>{t(`processing.${submission.processingKey}`)}</span>
                    <span>{t(`pricing.${submission.pricingKey}`)}</span>
                    <span className="badge local">{t(`statuses.${submission.statusKey}`)}</span>
                    <span className={`admin-risk ${submission.riskKey}`}>{t(`risks.${submission.riskKey}`)}</span>
                    <span>{t(`updated.${submission.updatedKey}`)}</span>
                    <button aria-label={t("table.reviewAction", { tool: toolName })} className="icon-button" type="button">
                      <MoreHorizontal size={16} aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="admin-bottom-grid">
            <article className="panel">
              <h2>{t("auditTrail.title")}</h2>
              <div className="admin-timeline">
                <span>{t("auditTrail.created")}</span>
                <span>{t("auditTrail.scanCompleted")}</span>
                <span>{t("auditTrail.assigned")}</span>
              </div>
            </article>
            <article className="panel">
              <h2>{t("comments.title")}</h2>
              <div className="admin-comment">
                <strong>{t("comments.author")}</strong>
                <p>{t("comments.sample")}</p>
              </div>
              <div className="input-like">{t("comments.addPlaceholder")}</div>
            </article>
            <article className="panel">
              <h2>{t("attachments.title")}</h2>
              {attachments.map((attachment) => (
                <div className="admin-attachment" key={attachment.key}>
                  {attachment.icon === "upload" ? <UploadCloud size={18} aria-hidden="true" /> : <FileText size={18} aria-hidden="true" />}
                  <span>{t(`attachments.items.${attachment.key}`)}</span>
                </div>
              ))}
            </article>
          </section>
        </main>

        <aside className="admin-detail-panel panel">
          <h2>{t("detail.title")}</h2>
          <div className="admin-submission-card">
            <span className="icon-tile green">
              <FileCheck2 size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>{t(`submissions.${selectedSubmissionKey}.tool`)}</h3>
              <p>{t("detail.description")}</p>
              <div className="tag-list">
                <span>{t("detail.tags.ai")}</span>
                <span>{t("detail.tags.research")}</span>
                <span>{t("detail.tags.summarization")}</span>
              </div>
            </div>
          </div>

          <div className="settings-row-list compact">
            {detailRowKeys.map((rowKey) => (
              <div className="settings-detail-row" key={rowKey}>
                <strong>{t(`detail.rows.${rowKey}.label`)}</strong>
                <span>{t(`detail.rows.${rowKey}.value`)}</span>
              </div>
            ))}
          </div>

          <section className="admin-check-section">
            <h2>{t("checks.title")}</h2>
            {automatedCheckKeys.map((check) => (
              <div className="admin-check-row" key={check.key}>
                {check.tone === "ok" ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                <strong>{t(`checks.items.${check.key}.label`)}</strong>
                <span className={check.tone === "ok" ? "admin-pass" : "admin-warn"}>{t(`checks.items.${check.key}.value`)}</span>
              </div>
            ))}
          </section>

          <section className="admin-check-section">
            <div className="landing-section-head">
              <h2>{t("checklist.title")}</h2>
              <span className="pricing-note">{t("checklist.complete")}</span>
            </div>
            {checklist.map((item) => (
              <label className="filter-check" key={item.key}>
                <input defaultChecked={item.checked} type="checkbox" />
                <span>{t(`checklist.items.${item.key}`)}</span>
              </label>
            ))}
          </section>

          <div className="admin-action-row">
            <button className="button button-solid" type="button">
              <ShieldCheck size={15} aria-hidden="true" /> {t("actions.approve")}
            </button>
            <button className="button button-outline-neutral" type="button">
              {t("actions.requestChanges")}
            </button>
            <button className="button button-danger" type="button">
              {t("actions.reject")}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
