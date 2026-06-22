import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import { CONSENT_STORAGE_KEY } from "@/lib/consent/cookie-consent";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CookieConsentBanner } from "./cookie-consent-banner";

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
