"use client";

import { CheckCircle2, ChevronDown, CircleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { getToolarsSupabaseBrowserSessionUser, signOutToolarsSupabaseBrowserUser, subscribeToolarsAuthStateChange } from "@/lib/supabase/toolars-supabase-auth-client";

interface ToolarsAccountActionsProps {
  signInClassName?: string;
  signUpClassName?: string;
}

interface BrowserAccount {
  accountEmail: string | null;
  accountId: string;
}

interface AccountToast {
  message: string;
  tone: "error" | "success";
}

const ACCOUNT_HINT_KEY = "toolars.account.hint";

/**
 * The shell is statically rendered, so the server always emits the signed-out
 * chrome. Reading a cached account hint synchronously on the first client
 * render lets a signed-in user see the account menu immediately instead of a
 * "Sign in / Sign up" flash on every navigation; the hint is rewritten on
 * every real session refresh and cleared on sign-out (or when the refresh
 * finds no session), so stale state self-heals.
 */
function readAccountHint(): BrowserAccount | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ACCOUNT_HINT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BrowserAccount> | null;
    return typeof parsed?.accountId === "string" ? { accountEmail: parsed.accountEmail ?? null, accountId: parsed.accountId } : null;
  } catch {
    return null;
  }
}

function writeAccountHint(account: BrowserAccount | null) {
  try {
    if (account) {
      window.localStorage.setItem(ACCOUNT_HINT_KEY, JSON.stringify(account));
    } else {
      window.localStorage.removeItem(ACCOUNT_HINT_KEY);
    }
  } catch {
    // Storage unavailable (private mode); the hint is a progressive enhancement.
  }
}

export function ToolarsAccountActions({
  signInClassName = "button topbar-sign-in",
  signUpClassName = "button button-solid topbar-sign-up"
}: ToolarsAccountActionsProps) {
  const t = useTranslations();
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [account, setAccount] = useState<BrowserAccount | null>(() => readAccountHint());
  const [toast, setToast] = useState<AccountToast | null>(null);

  const refreshAccount = useCallback(async () => {
    const nextAccount = await getToolarsSupabaseBrowserSessionUser();
    setAccount(nextAccount);
    writeAccountHint(nextAccount);
  }, []);

  useEffect(() => {
    void refreshAccount();

    if (typeof window === "undefined") return undefined;
    window.addEventListener("toolars:auth-session-changed", refreshAccount);
    return () => window.removeEventListener("toolars:auth-session-changed", refreshAccount);
  }, [refreshAccount]);

  // Track the real session lifecycle: explicit sign-out clears the account
  // immediately; any other auth event (sign-in, token refresh) re-resolves it.
  useEffect(() => {
    return subscribeToolarsAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAccount(null);
        writeAccountHint(null);
        return;
      }
      void refreshAccount();
    });
  }, [refreshAccount]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function signOut() {
    const result = await signOutToolarsSupabaseBrowserUser();
    if (!result.ok) {
      setToast({ message: t("auth.status.failed"), tone: "error" });
      return;
    }

    setAccount(null);
    writeAccountHint(null);
    setToast({ message: t("auth.signOut.signedOut"), tone: "success" });
  }

  const accountLabel = account?.accountEmail ?? account?.accountId ?? "";
  const accountInitial = accountLabel.trim().charAt(0).toUpperCase() || "T";
  const localizedHref = (href: string) => localizePath(href, localeCode);

  return (
    <div className="topbar-account-actions" aria-label={t("auth.eyebrow")} suppressHydrationWarning>
      {account ? (
        <details className="topbar-account-menu">
          <summary className="topbar-account-trigger" aria-label={t("auth.menu.open")} title={t("auth.menu.open")}>
            <span aria-hidden="true" className="topbar-account-avatar">{accountInitial}</span>
            <ChevronDown aria-hidden="true" size={15} />
          </summary>
          <div className="topbar-account-menu-panel" role="menu">
            <div className="topbar-account-menu-identity">
              <span aria-hidden="true" className="topbar-account-avatar topbar-account-avatar-large">{accountInitial}</span>
              <span>
                <strong>{t("auth.menu.account")}</strong>
                <small>{accountLabel}</small>
              </span>
            </div>
            <a className="topbar-account-menu-link" href={localizedHref("/my-tools")}>
              {t("nav.myTools")}
            </a>
            <a className="topbar-account-menu-link" href={localizedHref("/settings")}>
              {t("auth.menu.settings")}
            </a>
            <button className="topbar-account-menu-sign-out" onClick={() => void signOut()} type="button">
              {t("auth.signOut.button")}
            </button>
          </div>
        </details>
      ) : (
        <>
          <CoreActionModalButton className={signInClassName} kind="sign-in">
            {t("nav.signIn")}
          </CoreActionModalButton>
          <CoreActionModalButton className={signUpClassName} kind="sign-up">
            {t("nav.signUp")}
          </CoreActionModalButton>
        </>
      )}
      {toast ? (
        <div className={`topbar-account-toast ${toast.tone}`} role="status">
          {toast.tone === "success" ? <CheckCircle2 aria-hidden="true" size={17} /> : <CircleAlert aria-hidden="true" size={17} />}
          <span>{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}
