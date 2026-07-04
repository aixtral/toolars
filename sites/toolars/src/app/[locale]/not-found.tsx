import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";

/**
 * 404 page for the [locale] segment. Rendered when a tool/page slug is not
 * found within a locale. Styled to match the Toolars design system.
 */
export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  return (
    <main className="not-found-page" aria-label={t("aria.content")}>
      <div className="not-found-content">
        <span className="not-found-code" aria-label={t("aria.code")}>
          {t("code")}
        </span>
        <h1 className="title">{t("title")}</h1>
        <p className="subtitle">{t("description")}</p>
        <nav className="not-found-actions" aria-label={t("aria.actions")}>
          <Link aria-label={t("aria.home")} className="button button-solid" href={localizePath("/", localeCode)} title={t("titles.home")}>
            {t("actions.home")}
          </Link>
          <Link aria-label={t("aria.browse")} className="button button-outline-neutral" href={localizePath("/explore/pdf", localeCode)} title={t("titles.browse")}>
            {t("actions.browse")}
          </Link>
        </nav>
      </div>
    </main>
  );
}
