export const CONSENT_STORAGE_KEY = "toolars:cookie-consent";

export type CookieConsentStatus = "accepted" | "rejected";

export interface CookieConsentChoice {
  status: CookieConsentStatus;
  timestamp: number;
}

/**
 * Read the persisted cookie consent choice. Returns null when the user has not
 * yet decided, or when the stored value is malformed/unrecognized — in both
 * cases the consent banner should be shown.
 */
export function getCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentChoice>;
    if (parsed.status === "accepted" || parsed.status === "rejected") {
      return { status: parsed.status, timestamp: Number(parsed.timestamp) ?? Date.now() };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persist the user's cookie consent choice so the banner does not reappear.
 */
export function setCookieConsent(status: CookieConsentStatus): CookieConsentChoice {
  const choice: CookieConsentChoice = { status, timestamp: Date.now() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  }
  return choice;
}
