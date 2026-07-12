"use client";

import { BriefcaseBusiness, CheckCircle2, ChevronDown, CircleAlert, LogOut, Settings } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { getToolarsSupabaseBrowserUser, signOutToolarsSupabaseBrowserUser } from "@/lib/supabase/toolars-supabase-auth-client";

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

export function ToolarsAccountActions({
  signInClassName = "button topbar-sign-in",
  signUpClassName = "button button-solid topbar-sign-up"
}: ToolarsAccountActionsProps) {
  const t = useTranslations();
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const [account, setAccount] = useState<BrowserAccount | null>(null);
  const [toast, setToast] = useState<AccountToast | null>(null);

  const refreshAccount = useCallback(async () => {
    setAccount(await getToolarsSupabaseBrowserUser());
  }, []);

  useEffect(() => {
    void refreshAccount();

    if (typeof window === "undefined") return undefined;
    window.addEventListener("toolars:auth-session-changed", refreshAccount);
    return () => window.removeEventListener("toolars:auth-session-changed", refreshAccount);
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
    setToast({ message: t("auth.signOut.signedOut"), tone: "success" });
  }

  const accountLabel = account?.accountEmail ?? account?.accountId ?? "";
  const accountInitial = accountLabel.trim().charAt(0).toUpperCase() || "T";
  const localizedHref = (href: string) => localizePath(href, localeCode);

  return (
    <div className="topbar-account-actions" aria-label={t("auth.eyebrow")}>
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
              <BriefcaseBusiness aria-hidden="true" size={16} />
              {t("nav.myTools")}
            </a>
            <a className="topbar-account-menu-link" href={localizedHref("/settings")}>
              <Settings aria-hidden="true" size={16} />
              {t("auth.menu.settings")}
            </a>
            <button className="topbar-account-menu-sign-out" onClick={() => void signOut()} type="button">
              <LogOut aria-hidden="true" size={16} />
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
