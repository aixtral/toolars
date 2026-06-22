"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getCookieConsent, setCookieConsent } from "@/lib/consent/cookie-consent";

/**
 * Bottom-anchored cookie consent banner. Shown once per visitor until they
 * accept or reject. The choice is persisted to local storage. Only non-essential
 * (analytics) cookies depend on this choice; strictly necessary cookies (the
 * signed session) always work.
 */
export function CookieConsentBanner() {
  const t = useTranslations("cookie");
  const tCommon = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookieConsent() === null) {
      setVisible(true);
    }
  }, []);

  function choose(status: "accepted" | "rejected") {
    setCookieConsent(status);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-consent-banner" role="region" aria-label="Cookie consent">
      <div className="cookie-consent-content">
        <p>
          {t.rich("message", {
            privacyLink: (chunks) => (
              <a href="/privacy">{chunks}</a>
            )
          })}
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="button button-outline" onClick={() => choose("rejected")}>
            {t("reject")}
          </button>
          <button type="button" className="button button-solid" onClick={() => choose("accepted")}>
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
