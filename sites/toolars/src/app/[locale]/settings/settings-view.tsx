"use client";

import { useTranslations } from "next-intl";
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
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { buildWorkspaceAuditHeaders, subscribeWorkspaceIdentityChanges } from "@/lib/workspace/workspace-identity";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const usageMeters = [
  ["AI credits", "3,250 / 5,000", "65%"],
  ["Workflow runs", "120 / 500", "24%"],
  ["Storage", "4.2 GB / 10 GB", "42%"],
  ["Shared links", "35 / 100", "35%"]
] as const;

const trialUsageMeters = [
  ["AI trial credits", "1,360 / 2,000", "68%"],
  ["Workflow runs", "120 beta runs", "24%"],
  ["Storage", "4.2 GB / 10 GB", "42%"],
  ["Shared links", "35 active", "35%"]
] as const;

const billingRows = [
  ["Payment method", "Visa ·•••• 4242", "Update"],
  ["Billing email", "alex.chen@acme.com", "Update"],
  ["Status", "Active", "View subscriptions"],
  ["Invoices", "View and download past invoices", "View invoices"],
  ["Tax details", "No tax details added", "Add details"]
] as const;

const trialRows = [
  ["Trial state", "Free beta trial", "Review"],
  ["Google account", "Required for synced trial history", "Connect"],
  ["AI credits", "2,000 trial credits included", "View usage"],
  ["Paid plans", "Parked for Phase 2", "Learn more"]
] as const;

const trustDefaults = [
  ["Prefer local tools", "Prioritize tools that run on your device whenever possible."],
  ["Ask before AI processing", "Always ask for consent before sending content to AI models."],
  ["Auto-delete uploads after session", "Remove uploaded files automatically when the session ends."],
  ["Save output history", "Keep a history of your outputs in your workspace."]
] as const;

const connectedApps = [
  ["Google Drive", "Connected"],
  ["Browser extension", "Active"],
  ["Notion", "Connected"]
] as const;

const accountDataCoverage = [
  ["Saved outputs", "PDF, text, image, and workflow results"],
  ["Collections", "Private collections, shared links, and favorites"],
  ["Settings audit", "Trial usage, privacy, API key metadata, and security log"]
] as const;

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
    sessionId?: string;
    status?: string;
  } | null;
}

function EnabledSwitch({ label }: Readonly<{ label: string }>) {
  return <span aria-checked="true" aria-label={label} className="settings-switch" role="switch" tabIndex={0} />;
}

export function SettingsView() {
  const t = useTranslations("settings.main");
  const freeTrialMode = isFreeTrialMode();
  const [accountSession, setAccountSession] = useState<SettingsAuthSessionPayload | null>(null);
  const [accountSessionStatus, setAccountSessionStatus] = useState("Checking account session");
  const [dangerStatus, setDangerStatus] = useState("No account deletion request is active.");
  const [dangerDetail, setDangerDetail] = useState("Export your account archive before making destructive changes.");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const accountSessionRows = buildAccountSessionRows(accountSession);
  const currentUsageMeters = freeTrialMode ? trialUsageMeters : usageMeters;
  const currentBillingRows = freeTrialMode ? trialRows : billingRows;
  const isAccountSessionSynced = accountSessionStatus === "Account session synced";
  const {
    dialogRef: deleteDialogRef,
    restoreTriggerFocus: restoreDeleteTriggerFocus,
    triggerRef: deleteDialogTriggerRef
  } = useDialogFocus(isDeleteDialogOpen);

  useEffect(() => {
    let isActive = true;

    async function loadAccountSession() {
      if (typeof fetch !== "function") return;

      setAccountSessionStatus("Checking account session");

      try {
        const response = await fetch("/api/auth/session", {
          credentials: "same-origin",
          headers: buildWorkspaceAuditHeaders()
        });
        if (!response.ok) throw new Error("Auth session request failed");

        const payload = (await response.json()) as SettingsAuthSessionPayload;
        if (!isActive) return;

        setAccountSession(payload);
        setAccountSessionStatus(payload.auth?.isAuthenticated ? "Account session synced" : "No account session synced");
      } catch {
        if (!isActive) return;

        setAccountSession(null);
        setAccountSessionStatus("Account session unavailable");
      }
    }

    const unsubscribeFromIdentityChanges = subscribeWorkspaceIdentityChanges(() => {
      void loadAccountSession();
    });

    void loadAccountSession();

    return () => {
      isActive = false;
      unsubscribeFromIdentityChanges();
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
    setDangerStatus("Data export is being prepared.");
    setDangerDetail("Archive link will appear in your email.");
  }

  function queueAccountDeletion() {
    setDangerStatus("Account deletion request queued.");
    setDangerDetail("You can cancel from support within 7 days before permanent deletion.");
    closeDeleteDialog();
  }

  return (
    <div className="settings-page" data-settings-page="true" data-settings-mobile-layout="account-controls">
      <section className="section landing-hero">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1 className="title settings-title-desktop">{t("hero.titleDesktop")}</h1>
        <h1 className="title settings-title-mobile">{t("hero.titleMobile")}</h1>
        <p className="subtitle settings-copy-desktop">{t("hero.subtitleDesktop")}</p>
        <p className="subtitle settings-copy-mobile">Manage trial usage, privacy defaults, API access, and team handoffs from one focused mobile control surface.</p>
        <a className="button button-solid settings-mobile-plan-action" href="/settings/billing">
          View trial usage
        </a>
      </section>

      <section className="settings-mobile-stack" aria-label="Account settings preview">
        <article className="panel settings-mobile-privacy-card">
          <div className="landing-section-head">
            <h2>Privacy and AI defaults</h2>
            <span className="badge workflow">Trust defaults on</span>
          </div>
          <div className="settings-toggle-list" data-settings-mobile-list="trust-defaults">
            {[
              ["AI processing consent", "Ask before sending files or text to AI providers."],
              ["Session upload cleanup", "Remove temporary uploads automatically after each session."],
              ["Local-first preference", "Prefer browser and device-side tools when a workflow supports it."]
            ].map(([label, description]) => (
              <article className="settings-toggle-row settings-mobile-toggle-card" key={label}>
                <span className="icon-tile green">
                  <ShieldCheck size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                <EnabledSwitch label={label} />
              </article>
            ))}
          </div>
        </article>

        <article className="panel settings-mobile-api-card">
          <div className="landing-section-head">
            <h2>API keys preview</h2>
            <a className="text-link" href="/settings/api-keys">
              Manage
            </a>
          </div>
          <div className="settings-mobile-api-row">
            <span className="icon-tile purple">
              <KeyRound size={20} aria-hidden="true" />
            </span>
            <span>
              <strong>Production key</strong>
              <small>tk_live_••••••••••9f3a</small>
            </span>
            <button className="button button-outline-neutral" type="button">
              Copy
            </button>
          </div>
        </article>

        <article className="panel settings-mobile-team-card">
          <div className="landing-section-head">
            <h2>Team invite</h2>
            <span className="badge local">3 pending</span>
          </div>
          <p className="tool-description">Invite collaborators into shared collections, saved outputs, and workflow reviews.</p>
          <div className="settings-avatar-row">
            <span>AC</span>
            <span>ML</span>
            <span>RS</span>
            <span>+</span>
          </div>
          <a className="button button-outline-neutral" href="/settings/team">
            <UserPlus size={15} aria-hidden="true" /> Invite members
          </a>
        </article>
      </section>

      <div className="settings-layout">
        <div className="settings-main">
          <section className="panel settings-plan-card">
            <div className="landing-section-head">
              <h2>{freeTrialMode ? t("planCard.title") : "Your current plan"}</h2>
              <span className="pricing-note">{freeTrialMode ? t("planCard.note") : "Reset on Jun 1, 2026"}</span>
            </div>
            <div className="settings-plan-grid">
              <article className="settings-current-plan">
                <span className="icon-tile green">
                  <CreditCard size={22} aria-hidden="true" />
                </span>
                <h3>{freeTrialMode ? "Free trial" : "Pro"}</h3>
                <p>{freeTrialMode ? t("planCard.windowLabel") : "Your plan renews on"}</p>
                <strong>{freeTrialMode ? t("planCard.windowValue") : "Jun 20, 2026"}</strong>
                <div className="settings-button-row">
                  <a className="button button-solid" href="/settings/billing">
                    {freeTrialMode ? t("planCard.viewTrialUsage") : "Change plan"}
                  </a>
                  {freeTrialMode ? (
                    <a className="button button-outline-neutral" href="/settings/security">
                      Account security
                    </a>
                  ) : (
                    <a className="button button-outline-neutral" href="/settings/billing">
                      Manage billing
                    </a>
                  )}
                </div>
              </article>
              <article className="settings-usage-panel">
                <h3>{freeTrialMode ? "Trial usage" : "Monthly usage"}</h3>
                {currentUsageMeters.map(([label, value, width]) => (
                  <div className="settings-meter-row" key={label}>
                    <span>{label}</span>
                    <div className="workspace-meter" aria-label={label}>
                      <span style={{ width }} />
                    </div>
                    <strong>{value}</strong>
                  </div>
                ))}
              </article>
            </div>
            <p className="settings-trust-note">
              <CheckCircle2 size={15} aria-hidden="true" /> {t("planCard.trustNote")}
            </p>
          </section>

          <section className="panel settings-table-card">
            <h2>{freeTrialMode ? "Trial usage details" : "Billing details"}</h2>
            <div className="settings-row-list">
              {currentBillingRows.map(([label, value, action]) => (
                <div className="settings-detail-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                  <a className="text-link" href="/settings/billing">
                    {action}
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="panel settings-plan-compare">
            <div className="landing-section-head">
              <h2>{freeTrialMode ? "Phase 2 plan preview" : "Compare plans"}</h2>
              {freeTrialMode ? (
                <span className="badge local">Free trial mode</span>
              ) : (
                <a className="text-link" href="/pricing">
                  See full pricing
                </a>
              )}
            </div>
            <div className="settings-plan-strip">
              <article>
                <strong>{freeTrialMode ? "Traditional tools" : "Free plan"}</strong>
                <span>{freeTrialMode ? "Always free" : "$0 / month"}</span>
                <small>{freeTrialMode ? "Local calculators, converters, and utilities remain available." : "Essential tools for everyday tasks."}</small>
              </article>
              <article className="is-active">
                <strong>{freeTrialMode ? "Beta trial" : "Pro plan"}</strong>
                <span>{freeTrialMode ? "Google sign-in" : "$6.99 / month"}</span>
                <small>{freeTrialMode ? "Trial credits, synced history, and upload handoff testing." : "AI credits, storage, and automation."}</small>
              </article>
              <article>
                <strong>{freeTrialMode ? "Phase 2 plans" : "Team plan"}</strong>
                <span>{freeTrialMode ? "Parked" : "$14.99 / user"}</span>
                <small>{freeTrialMode ? "Team, invoices, and provider billing will return after beta." : "Shared workspace controls."}</small>
              </article>
            </div>
          </section>

          <div className="settings-card-grid">
            <section className="panel" id="api-keys">
              <h2>API keys</h2>
              <p className="tool-description">Use API keys to integrate Toolars into your apps and automation.</p>
              <a className="settings-api-row" href="/settings/api-keys">
                <KeyRound size={22} aria-hidden="true" />
                <span>
                  <strong>Production key</strong>
                  <small>tk_live_••••••••••••••••••9f3a · Active</small>
                </span>
              </a>
              <a className="button button-outline-neutral" href="/settings/api-keys">
                Create new API key
              </a>
            </section>
            <section className="panel" id="team">
              <h2>Team workspace</h2>
              <p className="tool-description">Invite your team and share collections, workflows, and outputs.</p>
              <div className="settings-avatar-row">
                <span>AC</span>
                <span>ML</span>
                <span>RS</span>
                <span>+8</span>
              </div>
              <a className="button button-outline-neutral" href="/settings/team">
                <UserPlus size={15} aria-hidden="true" /> Invite members
              </a>
            </section>
            <section className="panel" id="connected-apps">
              <h2>Connected apps</h2>
              <div className="settings-row-list compact">
                {connectedApps.map(([name, state]) => (
                  <div className="settings-detail-row" key={name}>
                    <strong>{name}</strong>
                    <span className="badge local">{state}</span>
                    <Plug size={15} aria-hidden="true" />
                  </div>
                ))}
              </div>
              <a className="button button-outline-neutral" href="/settings/connected-apps">
                <Plug size={15} aria-hidden="true" /> Manage connected apps
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
                    <strong>Account data coverage</strong>
                    <small>Outputs, collections, settings audit, and trial usage metadata.</small>
                  </span>
                  <span className="badge">Archive</span>
                </div>
                {accountDataCoverage.map(([label, value]) => (
                  <div className="settings-detail-row compact-row" key={label}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{label}</span>
                    <span className="badge local">{value}</span>
                  </div>
                ))}
              </div>
              <p className="settings-status-note" aria-live="polite">
                <CheckCircle2 size={15} aria-hidden="true" /> {dangerStatus}
              </p>
              <p className="tool-description">{dangerDetail}</p>
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
              {trustDefaults.map(([label, description]) => (
                <article className="settings-toggle-row" key={label}>
                  <span className="icon-tile green">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <EnabledSwitch label={label} />
                </article>
              ))}
            </div>
            <a className="text-link" href="/settings/privacy-ai">
              Manage privacy preferences
            </a>
          </section>

          <section className="panel landing-private-card">
            <span className="icon-tile green">
              <LockKeyhole size={18} aria-hidden="true" />
            </span>
            <h2>{t("side.aiResponsiblyTitle")}</h2>
            <p className="tool-description">Your data is protected. We never use your content to train AI models without consent.</p>
            <a className="text-link" href="/settings/privacy-ai">
              Learn more about privacy
            </a>
          </section>

          <section className="panel" id="storage">
            <h2>{t("side.storageTitle")}</h2>
            <div className="workspace-meter large" aria-label="Storage used">
              <span style={{ width: "42%" }} />
            </div>
            <p className="tool-description">4.2 GB of 10 GB used</p>
            <a className="text-link" href="/settings/storage">
              Review trial storage
            </a>
          </section>

          <section className="panel" id="notifications">
              <h2>{t("side.notificationsTitle")}</h2>
            <div className="settings-toggle-row compact">
              <Bell size={18} aria-hidden="true" />
              <span>
                <strong>Workflow completion alerts</strong>
                <small>Email me when long workflow runs finish.</small>
              </span>
              <EnabledSwitch label="Workflow completion alerts" />
            </div>
            <a className="text-link" href="/settings/notifications">
              Manage notifications
            </a>
          </section>

          <section className="panel" id="security">
            <div className="landing-section-head">
              <h2>{t("side.securityTitle")}</h2>
              <span className={isAccountSessionSynced ? "badge local" : "badge"}>{accountSessionStatus}</span>
            </div>
            <div className="settings-toggle-row compact">
              <Database size={18} aria-hidden="true" />
              <span>
                <strong>Upload deletion policy</strong>
                <small>Temporary uploaded files are cleared automatically.</small>
              </span>
              <EnabledSwitch label="Auto-delete uploads after session security" />
            </div>
            <div className="settings-row-list compact" aria-label="Account session">
              {accountSessionRows.map(([label, value, state]) => (
                <div className="settings-detail-row compact-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                  <span className={state === "Synced" ? "badge local" : "badge"}>{state}</span>
                </div>
              ))}
            </div>
            <a className="text-link" href="/settings/security">
              Manage security
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
            <h2 id="delete-account-title">Delete account?</h2>
            <p>This queues account deletion for this Toolars workspace. Export your data first if you need a copy of saved outputs and settings.</p>
            <div className="states-alert amber">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>This request starts a 7-day recovery window before permanent deletion.</span>
            </div>
            <div className="settings-button-row">
              <button className="button button-outline-neutral" onClick={closeDeleteDialog} type="button">
                Cancel
              </button>
              <button className="button button-danger" onClick={queueAccountDeletion} type="button">
                Delete account permanently
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function buildAccountSessionRows(payload: SettingsAuthSessionPayload | null) {
  const email = payload?.account?.accountEmail ?? payload?.auth?.accountEmail ?? "Not signed in";
  const accountId = payload?.account?.accountId ?? payload?.auth?.accountId ?? "Anonymous workspace";
  const sessionId = payload?.session?.sessionId ?? payload?.auth?.sessionId ?? "No active session";
  const source = payload?.auth?.source ?? payload?.account?.source ?? "anonymous";
  const isAuthenticated = Boolean(payload?.auth?.isAuthenticated);

  return [
    ["Email", email, isAuthenticated ? "Synced" : "Local"],
    ["Account ID", accountId, isAuthenticated ? "Synced" : "Local"],
    ["Session ID", sessionId, payload?.session?.status === "active" ? "Synced" : "Pending"],
    ["Source", source, isAuthenticated ? "Synced" : "Local"]
  ] as const;
}
