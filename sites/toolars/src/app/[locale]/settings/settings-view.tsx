"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle2,
  CreditCard,
  Database,
  Download,
  KeyRound,
  LockKeyhole,
  Plug,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users
} from "lucide-react";
import { useDialogFocus } from "@/components/core/use-dialog-focus";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const usageMeters = [
  { key: "aiCredits", value: "3,250 / 5,000", width: "65%" },
  { key: "workflowRuns", value: "120 / 500", width: "24%" },
  { key: "storage", value: "4.2 GB / 10 GB", width: "42%" },
  { key: "sharedLinks", value: "35 / 100", width: "35%" }
] as const;

const trialUsageMeters = [
  { key: "aiTrialCredits", value: "1,360 / 2,000", width: "68%" },
  { key: "workflowRuns", value: "120 beta runs", width: "24%" },
  { key: "storage", value: "4.2 GB / 10 GB", width: "42%" },
  { key: "sharedLinks", value: "35 active", width: "35%" }
] as const;

const billingRowKeys = ["paymentMethod", "billingEmail", "status", "invoices", "taxDetails"] as const;
const trialRowKeys = ["trialState", "googleAccount", "aiCredits", "paidPlans"] as const;
const trustDefaultKeys = ["local", "consent", "autoDelete", "saveHistory"] as const;
const mobileTrustDefaultKeys = ["aiConsent", "sessionCleanup", "localFirst"] as const;
const connectedAppKeys = ["googleDrive", "browserExtension", "notion"] as const;
const accountDataCoverageKeys = ["savedOutputs", "collections", "settingsAudit"] as const;
const mobileProductionKeyPreview = "tk_live_••••••••••9f3a";
const productionKeyPreview = "tk_live_••••••••••••••••••9f3a";

type AccountSessionStatus = "checking" | "synced" | "noSession" | "unavailable";
type AccountSessionState = "synced" | "local" | "pending";
type AccountSessionFallback = "notSignedIn" | "anonymousWorkspace" | "noActiveSession" | "anonymous";
type DangerState = "idle" | "exporting" | "queued";
type AccountSessionRow = {
  fallbackKey: AccountSessionFallback;
  labelKey: "email" | "accountId" | "sessionId" | "source";
  stateKey: AccountSessionState;
  value?: string;
};

interface SettingsAuthSessionPayload {
  account?: {
    accountEmail?: string;
    accountId?: string;
    source?: string;
  } | null;
  auth?: {
    accountEmail?: string | null;
    accountId?: string | null;
    isAuthenticated?: boolean;
    sessionId?: string;
    source?: string;
    workspaceId?: string;
  } | null;
  session?: {
    provider?: string;
    sessionId?: string;
    status?: string;
  } | null;
}

const initialAccountSession = null as SettingsAuthSessionPayload | null;
const initialAccountSessionStatus: AccountSessionStatus = "checking";
const initialDangerState: DangerState = "idle";

function EnabledSwitch({ label }: Readonly<{ label: string }>) {
  return <span aria-checked="true" aria-label={label} className="settings-switch" role="switch" tabIndex={0} />;
}

export function SettingsView() {
  const t = useTranslations("settings.main");
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const freeTrialMode = isFreeTrialMode();
  const [accountSession, setAccountSession] = useState(initialAccountSession);
  const [accountSessionStatus, setAccountSessionStatus] = useState(initialAccountSessionStatus);
  const [dangerState, setDangerState] = useState(initialDangerState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const accountSessionRows = buildAccountSessionRows(accountSession);
  const currentUsageMeters = freeTrialMode ? trialUsageMeters : usageMeters;
  const currentBillingRowKeys = freeTrialMode ? trialRowKeys : billingRowKeys;
  const accountSessionStatusLabel = t(`accountSession.status.${accountSessionStatus}`);
  const isAccountSessionSynced = accountSessionStatus === "synced";
  const {
    dialogRef: deleteDialogRef,
    restoreTriggerFocus: restoreDeleteTriggerFocus,
    triggerRef: deleteDialogTriggerRef
  } = useDialogFocus(isDeleteDialogOpen);

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  useEffect(() => {
    let isActive = true;

    async function loadAccountSession() {
      if (typeof fetch !== "function") return;

      setAccountSessionStatus("checking");

      try {
        const response = await fetch("/api/auth/session", {
          credentials: "same-origin"
        });
        if (!response.ok) throw new Error("Auth session request failed");

        const payload = (await response.json()) as SettingsAuthSessionPayload;
        if (!isActive) return;

        setAccountSession(payload);
        setAccountSessionStatus(payload.auth?.isAuthenticated ? "synced" : "noSession");
      } catch {
        if (!isActive) return;

        setAccountSession(null);
        setAccountSessionStatus("unavailable");
      }
    }

    void loadAccountSession();

    return () => {
      isActive = false;
    };
  }, []);

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
    restoreDeleteTriggerFocus();
  }

  function handleDeleteDialogKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeDeleteDialog();
    }
  }

  function prepareExport() {
    setDangerState("exporting");
  }

  function queueAccountDeletion() {
    setDangerState("queued");
    closeDeleteDialog();
  }

  return (
    <div className="settings-page" data-settings-page="true" data-settings-mobile-layout="account-controls">
      <section className="section landing-hero">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1 className="title settings-title-desktop">{t("hero.titleDesktop")}</h1>
        <h1 className="title settings-title-mobile">{t("hero.titleMobile")}</h1>
        <p className="subtitle settings-copy-desktop">{t("hero.subtitleDesktop")}</p>
        <p className="subtitle settings-copy-mobile">{t("hero.subtitleMobile")}</p>
        <a className="button button-solid settings-mobile-plan-action" href={localizedHref("/settings/billing")}>
          {t("planCard.viewTrialUsage")}
        </a>
      </section>

      <section className="settings-mobile-stack" aria-label={t("mobilePreview.ariaLabel")}>
        <article className="panel settings-mobile-privacy-card">
          <div className="landing-section-head">
            <h2>{t("mobilePreview.privacyTitle")}</h2>
            <span className="badge workflow">{t("mobilePreview.trustDefaultsOn")}</span>
          </div>
          <div className="settings-toggle-list" data-settings-mobile-list="trust-defaults">
            {mobileTrustDefaultKeys.map((itemKey) => (
              <article className="settings-toggle-row settings-mobile-toggle-card" key={itemKey}>
                <span className="icon-tile green">
                  <ShieldCheck size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{t(`mobilePreview.trustDefaults.${itemKey}.label`)}</strong>
                  <small>{t(`mobilePreview.trustDefaults.${itemKey}.description`)}</small>
                </span>
                <EnabledSwitch label={t(`mobilePreview.trustDefaults.${itemKey}.label`)} />
              </article>
            ))}
          </div>
        </article>

        <article className="panel settings-mobile-api-card">
          <div className="landing-section-head">
            <h2>{t("mobilePreview.apiKeysTitle")}</h2>
            <a className="text-link" href={localizedHref("/settings/api-keys")}>
              {t("mobilePreview.manage")}
            </a>
          </div>
          <div className="settings-mobile-api-row">
            <span className="icon-tile purple">
              <KeyRound size={20} aria-hidden="true" />
            </span>
            <span>
              <strong>{t("cards.productionKey")}</strong>
              <small>{mobileProductionKeyPreview}</small>
            </span>
            <button disabled className="button button-outline-neutral" type="button">
              {t("mobilePreview.copy")}
            </button>
          </div>
        </article>

        <article className="panel settings-mobile-team-card">
          <div className="landing-section-head">
            <h2>{t("mobilePreview.teamInviteTitle")}</h2>
            <span className="badge local">{t("mobilePreview.pendingInvites")}</span>
          </div>
          <p className="tool-description">{t("mobilePreview.teamInviteDesc")}</p>
          <div className="settings-avatar-row">
            <span>AC</span>
            <span>ML</span>
            <span>RS</span>
            <span>+</span>
          </div>
          <a className="button button-outline-neutral" href={localizedHref("/settings/team")}>
            <UserPlus size={15} aria-hidden="true" /> {t("cards.inviteMembers")}
          </a>
        </article>
      </section>

      <div className="settings-layout">
        <div className="settings-main">
          <section className="panel settings-plan-card">
            <div className="landing-section-head">
              <h2>{freeTrialMode ? t("planCard.title") : t("planCard.currentPlanTitle")}</h2>
              <span className="pricing-note">{freeTrialMode ? t("planCard.note") : t("planCard.resetNote")}</span>
            </div>
            <div className="settings-plan-grid">
              <article className="settings-current-plan">
                <span className="icon-tile green">
                  <CreditCard size={22} aria-hidden="true" />
                </span>
                <h3>{freeTrialMode ? t("planCard.planName") : t("planCard.proPlanName")}</h3>
                <p>{freeTrialMode ? t("planCard.windowLabel") : t("planCard.renewalLabel")}</p>
                <strong>{freeTrialMode ? t("planCard.windowValue") : t("planCard.renewalDate")}</strong>
                <div className="settings-button-row">
                  <a className="button button-solid" href={localizedHref("/settings/billing")}>
                    {freeTrialMode ? t("planCard.viewTrialUsage") : t("planCard.changePlan")}
                  </a>
                  {freeTrialMode ? (
                    <a className="button button-outline-neutral" href={localizedHref("/settings/security")}>
                      {t("planCard.accountSecurity")}
                    </a>
                  ) : (
                    <a className="button button-outline-neutral" href={localizedHref("/settings/billing")}>
                      {t("planCard.manageBilling")}
                    </a>
                  )}
                </div>
              </article>
              <article className="settings-usage-panel">
                <h3>{freeTrialMode ? t("planCard.trialUsageTitle") : t("planCard.monthlyUsageTitle")}</h3>
                {currentUsageMeters.map((meter) => (
                  <div className="settings-meter-row" key={meter.key}>
                    <span>{t(`usageMeters.${meter.key}.label`)}</span>
                    <div className="workspace-meter" aria-label={t(`usageMeters.${meter.key}.label`)}>
                      <span style={{ width: meter.width }} />
                    </div>
                    <strong>{meter.value}</strong>
                  </div>
                ))}
              </article>
            </div>
            <p className="settings-trust-note">
              <CheckCircle2 size={15} aria-hidden="true" /> {t("planCard.trustNote")}
            </p>
          </section>

          <section className="panel settings-table-card">
            <h2>{freeTrialMode ? t("usageDetails.title") : t("billingDetails.title")}</h2>
            <div className="settings-row-list">
              {currentBillingRowKeys.map((rowKey) => (
                <div className="settings-detail-row" key={rowKey}>
                  <strong>{t(`${freeTrialMode ? "usageDetails" : "billingDetails"}.rows.${rowKey}.label`)}</strong>
                  <span>{t(`${freeTrialMode ? "usageDetails" : "billingDetails"}.rows.${rowKey}.value`)}</span>
                  <a className="text-link" href={localizedHref("/settings/billing")}>
                    {t(`${freeTrialMode ? "usageDetails" : "billingDetails"}.rows.${rowKey}.action`)}
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-plan-compare">
            <div className="landing-section-head">
              <h2>{freeTrialMode ? t("planCompare.title") : t("planCompare.compareTitle")}</h2>
              {freeTrialMode ? (
                <span className="badge local">{t("planCompare.badge")}</span>
              ) : (
                <a className="text-link" href={localizedHref("/pricing")}>
                  {t("planCompare.seeFullPricing")}
                </a>
              )}
            </div>
            <div className="settings-plan-strip">
              <article>
                <strong>{freeTrialMode ? t("planCompare.traditionalName") : t("planCompare.freeName")}</strong>
                <span>{freeTrialMode ? t("planCompare.traditionalPrice") : t("planCompare.freePrice")}</span>
                <small>{freeTrialMode ? t("planCompare.traditionalDesc") : t("planCompare.freeDesc")}</small>
              </article>
              <article className="is-active">
                <strong>{freeTrialMode ? t("planCompare.betaName") : t("planCompare.proName")}</strong>
                <span>{freeTrialMode ? t("planCompare.betaPrice") : t("planCompare.proPrice")}</span>
                <small>{freeTrialMode ? t("planCompare.betaDesc") : t("planCompare.proDesc")}</small>
              </article>
              <article>
                <strong>{freeTrialMode ? t("planCompare.phase2Name") : t("planCompare.teamName")}</strong>
                <span>{freeTrialMode ? t("planCompare.phase2Price") : t("planCompare.teamPrice")}</span>
                <small>{freeTrialMode ? t("planCompare.phase2Desc") : t("planCompare.teamDesc")}</small>
              </article>
            </div>
          </section>

          <div className="settings-card-grid">
            <section className="panel" id="api-keys">
              <h2>{t("cards.apiKeys")}</h2>
              <p className="tool-description">{t("cards.apiKeysDesc")}</p>
              <a className="settings-api-row" href={localizedHref("/settings/api-keys")}>
                <KeyRound size={22} aria-hidden="true" />
                <span>
                  <strong>{t("cards.productionKey")}</strong>
                  <small>{productionKeyPreview} · {t("cards.activeStatus")}</small>
                </span>
              </a>
              <a className="button button-outline-neutral" href={localizedHref("/settings/api-keys")}>
                {t("cards.createNewKey")}
              </a>
            </section>
            <section className="panel" id="team">
              <h2>{t("cards.teamWorkspace")}</h2>
              <p className="tool-description">{t("cards.teamWorkspaceDesc")}</p>
              <div className="settings-avatar-row">
                <span>AC</span>
                <span>ML</span>
                <span>RS</span>
                <span>+8</span>
              </div>
              <a className="button button-outline-neutral" href={localizedHref("/settings/team")}>
                <UserPlus size={15} aria-hidden="true" /> {t("cards.inviteMembers")}
              </a>
            </section>
            <section className="panel" id="connected-apps">
              <h2>{t("cards.connectedApps")}</h2>
              <div className="settings-row-list compact">
                {connectedAppKeys.map((appKey) => (
                  <div className="settings-detail-row" key={appKey}>
                    <strong>{t(`cards.connectedAppRows.${appKey}.name`)}</strong>
                    <span className="badge local">{t(`cards.connectedAppRows.${appKey}.state`)}</span>
                    <Plug size={15} aria-hidden="true" />
                  </div>
                ))}
              </div>
              <a className="button button-outline-neutral" href={localizedHref("/settings/connected-apps")}>
                <Plug size={15} aria-hidden="true" /> {t("cards.manageConnectedApps")}
              </a>
            </section>
          </div>

          <section className="panel settings-danger-zone">
            <div className="settings-danger-content">
              <h2>{t("dangerZone.title")}</h2>
              <p className="tool-description">{t("dangerZone.description")}</p>
              <div className="settings-row-list compact">
                <div className="settings-detail-row compact-row">
                  <Download size={15} aria-hidden="true" />
                  <span>
                    <strong>{t("dangerZone.coverageLabel")}</strong>
                    <small>{t("dangerZone.coverageDescription")}</small>
                  </span>
                  <span className="badge">{t("dangerZone.archiveBadge")}</span>
                </div>
                {accountDataCoverageKeys.map((itemKey) => (
                  <div className="settings-detail-row compact-row" key={itemKey}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{t(`dangerZone.coverage.${itemKey}.label`)}</span>
                    <span className="badge local">{t(`dangerZone.coverage.${itemKey}.value`)}</span>
                  </div>
                ))}
              </div>
              <p className="settings-status-note" aria-live="polite">
                <CheckCircle2 size={15} aria-hidden="true" /> {t(`dangerZone.status.${dangerState}`)}
              </p>
              <p className="tool-description">{t(`dangerZone.detail.${dangerState}`)}</p>
            </div>
            <div className="settings-danger-actions">
              <button className="button button-outline-neutral" onClick={prepareExport} type="button">
                <Download size={15} aria-hidden="true" /> {t("dangerZone.exportData")}
              </button>
              <button
                ref={deleteDialogTriggerRef}
                className="button button-danger"
                onClick={() => setIsDeleteDialogOpen(true)}
                type="button"
              >
                <Trash2 size={15} aria-hidden="true" /> {t("dangerZone.deleteAccount")}
              </button>
            </div>
          </section>
        </div>

        <aside className="settings-side">
          <section className="panel" id="privacy-ai">
            <h2>{t("privacyDefaults.title")}</h2>
            <div className="settings-toggle-list">
              {trustDefaultKeys.map((itemKey) => (
                <article className="settings-toggle-row" key={itemKey}>
                  <span className="icon-tile green">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{t(`privacyDefaults.toggles.${itemKey}.label`)}</strong>
                    <small>{t(`privacyDefaults.toggles.${itemKey}.description`)}</small>
                  </span>
                  <EnabledSwitch label={t(`privacyDefaults.toggles.${itemKey}.label`)} />
                </article>
              ))}
            </div>
            <a className="text-link" href={localizedHref("/settings/privacy-ai")}>
              {t("privacyDefaults.managePrivacy")}
            </a>
          </section>

          <section className="panel landing-private-card">
            <span className="icon-tile green">
              <LockKeyhole size={18} aria-hidden="true" />
            </span>
            <h2>{t("side.aiResponsiblyTitle")}</h2>
            <p className="tool-description">{t("side.aiResponsiblyDesc")}</p>
            <a className="text-link" href={localizedHref("/settings/privacy-ai")}>
              {t("side.learnMorePrivacy")}
            </a>
          </section>

          <section className="panel" id="storage">
            <h2>{t("side.storageTitle")}</h2>
            <div className="workspace-meter large" aria-label={t("side.storageUsedLabel")}>
              <span style={{ width: "42%" }} />
            </div>
            <p className="tool-description">{t("side.storageUsed")}</p>
            <a className="text-link" href={localizedHref("/settings/storage")}>
              {t("side.reviewTrialStorage")}
            </a>
          </section>

          <section className="panel" id="notifications">
              <h2>{t("side.notificationsTitle")}</h2>
            <div className="settings-toggle-row compact">
              <Bell size={18} aria-hidden="true" />
              <span>
                <strong>{t("side.workflowAlerts")}</strong>
                <small>{t("side.workflowAlertsDesc")}</small>
              </span>
              <EnabledSwitch label={t("side.workflowAlerts")} />
            </div>
            <a className="text-link" href={localizedHref("/settings/notifications")}>
              {t("side.manageNotifications")}
            </a>
          </section>

          <section className="panel" id="security">
            <div className="landing-section-head">
              <h2>{t("side.securityTitle")}</h2>
              <span className={isAccountSessionSynced ? "badge local" : "badge"}>{accountSessionStatusLabel}</span>
            </div>
            <div className="settings-toggle-row compact">
              <Database size={18} aria-hidden="true" />
              <span>
                <strong>{t("side.uploadDeletion")}</strong>
                <small>{t("side.uploadDeletionDesc")}</small>
              </span>
              <EnabledSwitch label={t("side.uploadDeletionSwitchLabel")} />
            </div>
            <div className="settings-row-list compact" aria-label={t("accountSession.ariaLabel")}>
              {accountSessionRows.map((row) => (
                <div className="settings-detail-row compact-row" key={row.labelKey}>
                  <strong>{t(`accountSession.rows.${row.labelKey}`)}</strong>
                  <span>{row.value ?? t(`accountSession.fallbacks.${row.fallbackKey}`)}</span>
                  <span className={row.stateKey === "synced" ? "badge local" : "badge"}>{t(`accountSession.states.${row.stateKey}`)}</span>
                </div>
              ))}
            </div>
            <a className="text-link" href={localizedHref("/settings/security")}>
              {t("side.manageSecurity")}
            </a>
          </section>
        </aside>
      </div>
      {isDeleteDialogOpen ? (
        <div className="settings-confirmation-overlay" role="presentation">
          <section
            ref={deleteDialogRef}
            aria-labelledby="delete-account-title"
            aria-modal="true"
            className="settings-confirmation-dialog"
            onKeyDown={handleDeleteDialogKeyDown}
            role="dialog"
            tabIndex={-1}
          >
            <span className="icon-tile amber">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <h2 id="delete-account-title">{t("deleteDialog.title")}</h2>
            <p>{t("deleteDialog.description")}</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>{t("deleteDialog.warning")}</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" onClick={closeDeleteDialog} type="button">
                {t("deleteDialog.cancel")}
              </button>
              <button className="button button-danger" onClick={queueAccountDeletion} type="button">
                {t("deleteDialog.confirm")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function buildAccountSessionRows(payload: SettingsAuthSessionPayload | null): AccountSessionRow[] {
  const email = payload?.account?.accountEmail ?? payload?.auth?.accountEmail ?? undefined;
  const accountId = payload?.account?.accountId ?? payload?.auth?.accountId ?? undefined;
  const sessionIdentity = payload?.session?.sessionId ?? payload?.auth?.sessionId ?? payload?.session?.provider ?? undefined;
  const source = payload?.auth?.source ?? payload?.account?.source ?? undefined;
  const isAuthenticated = Boolean(payload?.auth?.isAuthenticated);

  return [
    { fallbackKey: "notSignedIn", labelKey: "email", stateKey: isAuthenticated ? "synced" : "local", value: email },
    { fallbackKey: "anonymousWorkspace", labelKey: "accountId", stateKey: isAuthenticated ? "synced" : "local", value: accountId },
    { fallbackKey: "noActiveSession", labelKey: "sessionId", stateKey: payload?.session?.status === "active" ? "synced" : "pending", value: sessionIdentity },
    { fallbackKey: "anonymous", labelKey: "source", stateKey: isAuthenticated ? "synced" : "local", value: source }
  ];
}
