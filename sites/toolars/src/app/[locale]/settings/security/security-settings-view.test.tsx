import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ar from "../../../../../messages/ar.json";
import en from "../../../../../messages/en.json";
import es from "../../../../../messages/es.json";
import fr from "../../../../../messages/fr.json";
import hi from "../../../../../messages/hi.json";
import ja from "../../../../../messages/ja.json";
import pt from "../../../../../messages/pt.json";
import ru from "../../../../../messages/ru.json";
import zhHans from "../../../../../messages/zh-hans.json";
import zhHant from "../../../../../messages/zh-hant.json";
import { SecuritySettingsView } from "./security-settings-view";

const securityViewSourcePath = "src/app/[locale]/settings/security/security-settings-view.tsx";
const copiedValueAllowlist = new Set(["AI", "API", "Beta", "CSV", "Free", "Google", "JSON", "LLM", "MCP", "PDF", "Pro", "Team", "Toolars", "URL"]);

function renderWithLocale(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isLikelyHardcodedEnglish(text: string) {
  if (!text || text.length < 3) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[A-Z0-9 /&+-]{2,8}$/.test(text)) return false;
  if (/^[{}()[\].,:;'"`]+$/.test(text)) return false;
  if (copiedValueAllowlist.has(text)) return false;

  return true;
}

function collectSecurityAuditCandidates() {
  const source = readFileSync(securityViewSourcePath, "utf8");
  const candidates: Array<{ kind: string; text: string }> = [];
  const attributePattern = /\b(aria-label|placeholder|title|alt)=["']([^"']+)["']/g;
  const textNodePattern = />\s*([^<>{}][^<>{}]*?)\s*</g;

  for (const match of source.matchAll(attributePattern)) {
    const text = normalizeText(match[2] ?? "");
    if (isLikelyHardcodedEnglish(text)) candidates.push({ kind: match[1] ?? "attribute", text });
  }

  for (const match of source.matchAll(textNodePattern)) {
    const text = normalizeText(match[1] ?? "");
    if (isLikelyHardcodedEnglish(text)) candidates.push({ kind: "text-node", text });
  }

  return {
    absoluteHrefs: [...source.matchAll(/\bhref=["'](\/(?!\/|#)[^"']*)["']/g)].map((match) => match[1]),
    hardcodedText: candidates
  };
}

function flattenMessageValues(value: unknown, prefix = "", output: Record<string, string> = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return output;

  for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
      flattenMessageValues(nestedValue, nextKey, output);
      continue;
    }
    output[nextKey] = String(nestedValue ?? "");
  }

  return output;
}

function isCopiedEnglishCandidate(key: string, value: string) {
  const text = normalizeText(value);
  if (!text || copiedValueAllowlist.has(text)) return false;
  if (/(^|\.)(href|id|key|path|slug|url)$/.test(key)) return false;
  if (!/[a-z]/.test(text)) return false;
  if (text.length < 8) return false;
  if (text.split(/\s+/).length < 2) return false;

  return true;
}

function collectCopiedEnglishSecurityValues(locale: string, localizedSecurityMessages: unknown) {
  const english = flattenMessageValues(en.settings.security);
  const localized = flattenMessageValues(localizedSecurityMessages);

  return Object.entries(english)
    .filter(([key, englishValue]) => localized[key] === englishValue && isCopiedEnglishCandidate(key, englishValue))
    .map(([key, value]) => ({ key: `settings.security.${key}`, locale, value }));
}

describe("SecuritySettingsView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          revokedSession: {
            sessionId: "sess_security_001",
            status: "revoked"
          }
        }),
        ok: true
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders security modules from the settings design", () => {
    const { container } = renderWithIntl(<SecuritySettingsView />);

    expect(container.querySelector('[data-security-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByText("Security overview")).toBeInTheDocument();
    expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
    expect(screen.getByText("Active sessions")).toBeInTheDocument();
    expect(screen.getByText("Login activity")).toBeInTheDocument();
    expect(screen.getByText("Recovery methods")).toBeInTheDocument();
    expect(screen.getByText("Upload deletion policy")).toBeInTheDocument();
    expect(screen.getByText("Security checklist")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out all sessions" })).toBeInTheDocument();
  });

  it("updates two-factor state", () => {
    renderWithIntl(<SecuritySettingsView />);

    const twoFactor = screen.getByRole("button", { name: "Two-factor authentication" });
    expect(twoFactor).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(twoFactor);

    expect(twoFactor).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Two-factor authentication paused.")).toBeInTheDocument();
  });

  it("confirms before revoking the active auth session", async () => {
    renderWithIntl(<SecuritySettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out all sessions" }));

    expect(screen.getByRole("dialog", { name: "Sign out all sessions?" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("3 active sessions are currently trusted for this account.")).toBeInTheDocument();
    expect(screen.queryByText("Session revoked. Sign in again to continue syncing account settings.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog", { name: "Sign out all sessions?" })).not.toBeInTheDocument();
    expect(screen.getByText("3 active sessions are currently trusted for this account.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign out all sessions" }));
    fireEvent.click(screen.getByRole("button", { name: "Sign out other sessions" }));

    expect(await screen.findByText("Session revoked. Sign in again to continue syncing account settings.")).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Sign out all sessions?" })).not.toBeInTheDocument();
    expect(screen.getByText("0 active sessions are currently trusted for this account.")).toBeInTheDocument();
  });

  it("calls the auth session revoke API with workspace audit headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        revokedSession: {
          sessionId: "sess_security_002",
          status: "revoked"
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithIntl(<SecuritySettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out all sessions" }));
    fireEvent.click(screen.getByRole("button", { name: "Sign out other sessions" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/session",
        expect.objectContaining({
          credentials: "same-origin",
          headers: expect.objectContaining({
            "x-toolars-workspace-id": expect.stringMatching(/^toolars_ws_/)
          }),
          method: "DELETE"
        })
      );
    });
    expect(await screen.findByText("sess_security_002")).toBeInTheDocument();
  });

  it("focuses the sign-out confirmation dialog and restores the opener with Escape", () => {
    renderWithIntl(<SecuritySettingsView />);

    const trigger = screen.getByRole("button", { name: "Sign out all sessions" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Sign out all sessions?" });
    expect(dialog).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Sign out all sessions?" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("localizes security controls and sign-out confirmation for a launch locale", () => {
    renderWithLocale(<SecuritySettingsView />);

    expect(screen.getByText("Los controles de seguridad están activos.")).toBeInTheDocument();

    const twoFactor = screen.getByRole("button", { name: "Autenticación de dos factores" });
    fireEvent.click(twoFactor);

    expect(screen.getByText("Autenticación de dos factores en pausa.")).toBeInTheDocument();
    expect(screen.getByText("3 sesiones activas son de confianza actualmente para esta cuenta.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar todas las sesiones" }));

    expect(screen.getByRole("dialog", { name: "¿Cerrar todas las sesiones?" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Tendrás que iniciar sesión de nuevo antes de que se reanude la sincronización de la cuenta.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar otras sesiones" })).toBeInTheDocument();
  });

  it("keeps the security view clear of i18n audit candidates", () => {
    const scan = collectSecurityAuditCandidates();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("keeps security messages localized with the same key set across shipped locales", () => {
    const baseKeys = Object.keys(flattenMessageValues(en.settings.security)).sort();
    const localizedMessages = {
      ar: ar.settings.security,
      es: es.settings.security,
      fr: fr.settings.security,
      hi: hi.settings.security,
      ja: ja.settings.security,
      pt: pt.settings.security,
      ru: ru.settings.security,
      "zh-hans": zhHans.settings.security,
      "zh-hant": zhHant.settings.security
    };

    const keySetDiffs = Object.entries(localizedMessages).flatMap(([locale, messages]) => {
      const localeKeys = Object.keys(flattenMessageValues(messages)).sort();

      return [
        ...baseKeys.filter((key) => !localeKeys.includes(key)).map((key) => ({ key, locale, type: "missing" })),
        ...localeKeys.filter((key) => !baseKeys.includes(key)).map((key) => ({ key, locale, type: "extra" }))
      ];
    });
    const copiedEnglish = Object.entries(localizedMessages).flatMap(([locale, messages]) => collectCopiedEnglishSecurityValues(locale, messages));

    expect(keySetDiffs).toEqual([]);
    expect(copiedEnglish).toEqual([]);
  });
});
