import { getTranslations } from "next-intl/server";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

interface FooterLink {
  labelKey: string;
  href: string;
}

interface FooterColumn {
  headingKey: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    headingKey: "footer.columns.tools",
    links: [
      { labelKey: "footer.tools.pdfTools", href: "/explore/pdf" },
      { labelKey: "footer.tools.aiDeveloperLab", href: "/explore/ai-developer" },
      { labelKey: "footer.tools.workflows", href: "/workflows" },
      { labelKey: "footer.tools.collections", href: "/collections" },
      { labelKey: "footer.tools.submitTool", href: "/submit" }
    ]
  },
  {
    headingKey: "footer.columns.resources",
    links: [
      { labelKey: "footer.resources.blog", href: "/blog" },
      { labelKey: "footer.resources.pricing", href: "/pricing" },
      { labelKey: "footer.resources.myTools", href: "/my-tools" }
    ]
  },
  {
    headingKey: "footer.columns.legal",
    links: [
      { labelKey: "footer.legal.privacy", href: "/privacy" },
      { labelKey: "footer.legal.terms", href: "/terms" },
      { labelKey: "footer.legal.dataRights", href: "/data-rights" },
      { labelKey: "footer.legal.doNotSell", href: "mailto:privacy@toolars.app?subject=Do Not Sell My Personal Information" }
    ]
  }
];

/**
 * Global site footer. Rendered once in the locale layout so every page exposes
 * the legal links required for compliance and the content channels for SEO.
 * Server component — uses next-intl getTranslations for localized labels.
 */
export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();
  const baseUrl = getSiteBaseUrl();
  const freeTrialMode = isFreeTrialMode();

  return (
    <footer className="site-footer" aria-label={t("common.brandName")}>
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <a className="site-footer-logo" href="/" aria-label={`${t("common.brandName")} home`}>
            {t("common.brandName")}
          </a>
          <p>{t("common.tagline")}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.headingKey} className="site-footer-column">
              <h2>{t(column.headingKey)}</h2>
              <ul>
                {column.links
                  .filter((link) => !(freeTrialMode && link.href === "/pricing"))
                  .map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{t(link.labelKey)}</a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer-bottom">
        <p>
          &copy; {year} {t("common.brandName")}. {t("footer.rights")}
        </p>
        <p>
          <a href={baseUrl}>{baseUrl.replace(/^https?:\/\//, "")}</a>
        </p>
      </div>
    </footer>
  );
}
