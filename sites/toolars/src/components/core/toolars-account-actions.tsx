"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CoreActionModalButton } from "@/components/core/core-action-modal";
import { getToolarsSupabaseBrowserUser, signOutToolarsSupabaseBrowserUser } from "@/lib/supabase/toolars-supabase-auth-client";

interface ToolarsAccountActionsProps {
  signInClassName?: string;
  signUpClassName?: string;
}

interface BrowserAccount {
  accountEmail: string | null;
  accountId: string;
}

export function ToolarsAccountActions({
  signInClassName = "button topbar-sign-in",
  signUpClassName = "button button-solid topbar-sign-up"
}: ToolarsAccountActionsProps) {
  const t = useTranslations();
  const [account, setAccount] = useState<BrowserAccount | null>(null);
  const [status, setStatus] = useState("");

  const refreshAccount = useCallback(async () => {
    setAccount(await getToolarsSupabaseBrowserUser());
  }, []);

  useEffect(() => {
    void refreshAccount();

    if (typeof window === "undefined") return undefined;
    window.addEventListener("toolars:auth-session-changed", refreshAccount);
    return () => window.removeEventListener("toolars:auth-session-changed", refreshAccount);
  }, [refreshAccount]);

  async function signOut() {
    const result = await signOutToolarsSupabaseBrowserUser();
    if (!result.ok) {
      setStatus(t("auth.status.failed"));
      return;
    }

    setAccount(null);
    setStatus(t("auth.signOut.signedOut"));
  }

  return (
    <span className="topbar-account-actions" aria-label={t("auth.signIn.eyebrow")}>
      {account ? (
        <>
          <span className="topbar-account-email">{account.accountEmail ?? account.accountId}</span>
          <button className={signInClassName} onClick={() => void signOut()} type="button">
            {t("auth.signOut.button")}
          </button>
          {status ? <span className="visually-hidden" role="status">{status}</span> : null}
        </>
      ) : (
        <>
          <CoreActionModalButton className={signInClassName} kind="sign-in">
            {t("nav.signIn")}
          </CoreActionModalButton>
          <CoreActionModalButton className={signUpClassName} kind="sign-up">
            {t("nav.signUp")}
          </CoreActionModalButton>
          {status ? <span className="visually-hidden" role="status">{status}</span> : null}
        </>
      )}
    </span>
  );
}
