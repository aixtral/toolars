import { AlertTriangle, LoaderCircle, Search, Trash2, WifiOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

const toastRowKeys = ["saved", "consent", "failed", "shared"] as const;
const drawerItemKeys = ["explore", "workflows", "collections", "myTools", "submitTool", "settings"] as const;
const commandSuggestionKeys = ["aiPdfSummarizer", "pdfToolkit", "turnPdfIntoSummary", "q2ReportSummary"] as const;

export function StatesBoardView() {
  const t = useTranslations("statesBoard");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  return (
    <div className="states-board-page" data-states-board-page="true" data-states-density="mobile-v2" data-states-mobile-layout="state-gallery">
      <section className="section states-board-hero">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1 className="title">{t("hero.title")}</h1>
        <p className="subtitle">{t("hero.subtitle")}</p>
        <button className="button button-outline-neutral" type="button">
          {t("hero.showToast")}
        </button>
      </section>

      <section className="states-grid" aria-label={t("boardAriaLabel")}>
        <article className="panel states-card">
          <span className="states-label">{t("labels.empty")}</span>
          <span className="icon-tile green">+</span>
          <h2>{t("empty.title")}</h2>
          <p className="tool-description">{t("empty.description")}</p>
          <div className="settings-button-row">
            <a className="button button-solid" href={localizedHref("/tools/pdf-toolkit")}>
              {t("empty.openPdfToolkit")}
            </a>
            <button className="button button-outline-neutral" type="button">
              {t("empty.importBookmarks")}
            </button>
          </div>
        </article>

        <article className="panel states-card">
          <span className="states-label">{t("labels.loading")}</span>
          <LoaderCircle size={22} aria-hidden="true" />
          <div className="states-skeleton wide" />
          <div className="states-skeleton" />
          <div className="states-skeleton medium" />
          <div className="states-skeleton short" />
        </article>

        <article className="panel states-card">
          <span className="states-label">{t("labels.uploadError")}</span>
          <div className="states-alert red">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              <strong>{t("uploadError.title")}</strong>
              <small>{t("uploadError.description")}</small>
            </span>
          </div>
          <div className="settings-button-row">
            <button className="button button-solid" type="button">
              {t("uploadError.retryUpload")}
            </button>
            <button className="button button-outline-neutral" type="button">
              {t("uploadError.viewRequirements")}
            </button>
          </div>
        </article>

        <article className="panel states-card">
          <span className="states-label">{t("labels.offlineMode")}</span>
          <div className="states-alert blue">
            <WifiOff size={18} aria-hidden="true" />
            <span>
              <strong>{t("offline.title")}</strong>
              <small>{t("offline.description")}</small>
            </span>
          </div>
          <a className="button button-outline-neutral" href={localizedHref("/")}>
            {t("offline.openLocalTools")}
          </a>
        </article>

        <article className="panel states-card states-card-wide">
          <span className="states-label">{t("labels.toastStack")}</span>
          <div className="states-toast-stack">
            {toastRowKeys.map((toastKey) => (
              <div className={`states-toast ${toastKey}`} key={toastKey}>
                <span className="states-dot" />
                <strong>{t(`toasts.${toastKey}.text`)}</strong>
                <button type="button">{t(`toasts.${toastKey}.action`)}</button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel states-card states-card-wide">
          <span className="states-label">{t("labels.formValidation")}</span>
          <label className="states-field">
            <span>{t("validation.websiteUrl.label")} <strong>{t("validation.websiteUrl.state")}</strong></span>
            <input readOnly value="https://exampletool.com" />
          </label>
          <label className="states-field warn">
            <span>{t("validation.screenshot.label")} <strong>{t("validation.screenshot.state")}</strong></span>
            <input readOnly value={t("validation.screenshot.value")} />
          </label>
          <label className="states-field error">
            <span>{t("validation.description.label")} <strong>{t("validation.description.state")}</strong></span>
            <input readOnly value={t("validation.description.value")} />
          </label>
        </article>

        <article className="panel states-card">
          <span className="states-label">{t("labels.mobileDrawer")}</span>
          <div className="states-mobile-drawer">
            <div>
              <strong>Toolars</strong>
              <span>{t("drawer.close")}</span>
            </div>
            {drawerItemKeys.map((itemKey, index) => (
              <span className={index === 0 ? "is-active" : ""} key={itemKey}>{t(`drawer.items.${itemKey}`)}</span>
            ))}
          </div>
        </article>

        <article className="panel states-card">
          <span className="states-label">{t("labels.deleteConfirmation")}</span>
          <div className="states-modal">
            <Trash2 size={20} aria-hidden="true" />
            <h2>{t("delete.title")}</h2>
            <p>{t("delete.description")}</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>{t("delete.warning")}</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" type="button">
                {t("delete.cancel")}
              </button>
              <button className="button button-danger" type="button">
                {t("delete.deleteOutput")}
              </button>
            </div>
          </div>
        </article>

        <article className="panel states-card states-card-wide">
          <span className="states-label">{t("labels.mobileCommandOverlay")}</span>
          <div className="states-command-overlay">
            <div className="states-command-input">
              <Search size={16} aria-hidden="true" />
              <span>{t("command.query")}</span>
              <button type="button">{t("command.close")}</button>
            </div>
            <strong>{t("command.suggested")}</strong>
            {commandSuggestionKeys.map((suggestionKey, index) => (
              <span className={index === 0 ? "is-active" : ""} key={suggestionKey}>{t(`command.suggestions.${suggestionKey}`)}</span>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
