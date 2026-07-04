import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";
import { CONSENT_STORAGE_KEY } from "@/lib/consent/cookie-consent";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CookieConsentBanner } from "./cookie-consent-banner";

const cookieConsentBannerSourceFile = "src/components/consent/cookie-consent-banner.tsx";

function scanCookieConsentBannerSource() {
  return scanSourceText(readFileSync(cookieConsentBannerSourceFile, "utf8"), cookieConsentBannerSourceFile);
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("renders the banner when no consent choice exists", () => {
    renderWithIntl(<CookieConsentBanner />);
    expect(screen.getByRole("region", { name: /cookie consent/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy");
  });

  it("keeps the cookie banner source free of hardcoded UI scanner candidates", () => {
    const scan = scanCookieConsentBannerSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("does not render the banner after the user accepts", () => {
    renderWithIntl(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: /accept/i }));
    expect(screen.queryByRole("region", { name: /cookie consent/i })).not.toBeInTheDocument();
  });

  it("does not render the banner after the user rejects", () => {
    renderWithIntl(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: /reject/i }));
    expect(screen.queryByRole("region", { name: /cookie consent/i })).not.toBeInTheDocument();
  });

  it("persists the accepted choice to local storage", () => {
    renderWithIntl(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: /accept/i }));
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)!);
    expect(stored.status).toBe("accepted");
  });

  it("persists the rejected choice to local storage", () => {
    renderWithIntl(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: /reject/i }));
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)!);
    expect(stored.status).toBe("rejected");
  });

  it("stays hidden on mount when a prior choice already exists", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ status: "rejected", timestamp: Date.now() })
    );
    renderWithIntl(<CookieConsentBanner />);
    expect(screen.queryByRole("region", { name: /cookie consent/i })).not.toBeInTheDocument();
  });
});
