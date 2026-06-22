import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  type CookieConsentChoice,
  getCookieConsent,
  setCookieConsent
} from "./cookie-consent";

describe("cookie-consent store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no choice has been recorded", () => {
    expect(getCookieConsent()).toBeNull();
  });

  it("persists and returns an accepted choice", () => {
    setCookieConsent("accepted");
    expect(getCookieConsent()).toEqual<CookieConsentChoice>({
      status: "accepted",
      timestamp: expect.any(Number)
    });
  });

  it("persists and returns a rejected choice", () => {
    setCookieConsent("rejected");
    expect(getCookieConsent()?.status).toBe("rejected");
  });

  it("stores the choice under a stable storage key", () => {
    setCookieConsent("accepted");
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).not.toBeNull();
    const parsed = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)!);
    expect(parsed.status).toBe("accepted");
  });

  it("survives a malformed storage value by returning null", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "{not valid json");
    expect(getCookieConsent()).toBeNull();
  });

  it("returns null when the stored value has an unknown status", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ status: "maybe", timestamp: 123 })
    );
    expect(getCookieConsent()).toBeNull();
  });
});
