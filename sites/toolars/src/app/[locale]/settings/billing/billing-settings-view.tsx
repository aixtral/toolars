"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CreditCard, ExternalLink, FileText, Info, ReceiptText, ShieldCheck } from "lucide-react";
import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import type { ToolarsBillingAccount, ToolarsInvoiceStatus } from "@/lib/billing/billing-account";
import { DEFAULT_LOCALE, isValidLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { buildWorkspaceAuditHeaders, subscribeWorkspaceIdentityChanges } from "@/lib/workspace/workspace-identity";

type BillingSummaryCard = [label: string, value: string, detail: string];
type BillingDetailRow = [label: string, value: string, action: string];
type BillingInvoiceRow = [date: string, plan: string, amount: string, status: string];
type BillingUsageRow = [label: string, value: string, percent: string, category: string];
type BillingInvoiceDetailRow = [label: string, detail: string, amount: string];
type BillingT = (key: string, values?: Record<string, number | string>) => string;

interface BillingApiPayload {
  auth?: ToolarsAuthContext;
  billing?: ToolarsBillingAccount;
}

export function BillingSettingsView() {
  const t = useTranslations("settings.billing");
  const tx: BillingT = (key, values) => t(key, values);
  const locale = useLocale();
  const localeCode: LocaleCode = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const freeTrialMode = isFreeTrialMode();
  const [authContext, setAuthContext] = useState(null as ToolarsAuthContext | null);
  const [billingAccount, setBillingAccount] = useState(null as ToolarsBillingAccount | null);
  const summaryCards = freeTrialMode ? buildTrialSummaryCards(tx) : buildSummaryCards(billingAccount, tx);
  const detailRows = buildDetailRows(billingAccount, authContext, tx);
  const invoiceRows = buildInvoiceRows(billingAccount, tx);
  const usageRows = buildUsageRows(billingAccount, tx);
  const invoiceDetailRows = buildInvoiceDetailRows(billingAccount, tx);
  const latestInvoice = billingAccount?.invoices[0];
  const billingCycleClose = tx("badges.cycleCloses", {
    date: billingAccount ? formatMonthDay(billingAccount.usage.periodEnd) : tx("summary.fallbackNextInvoiceDate")
  });
  const selectedInvoiceId = latestInvoice?.invoiceId ?? "inv_2026_05_pro";
  const receiptStatus = latestInvoice
    ? tx("receipt.status", {
        date: formatDate(latestInvoice.issuedAt),
        status: formatInvoiceStatus(latestInvoice.status, tx)
      })
    : tx("receipt.paidMay28");

  function localizedHref(href: string) {
    return localizePath(href, localeCode);
  }

  useEffect(() => {
    let isActive = true;

    async function loadBillingAccount() {
      if (freeTrialMode) return;
      if (typeof fetch !== "function") return;

      try {
        const response = await fetch("/api/billing/account", {
          headers: buildWorkspaceAuditHeaders()
        });
        if (!response.ok) throw new Error("Billing account request failed");

        const payload = (await response.json()) as BillingApiPayload;
        if (!isActive) return;
        if (payload.auth) setAuthContext(payload.auth);
        if (payload.billing?.version === 1) setBillingAccount(payload.billing);
      } catch {
        if (isActive) {
          setAuthContext(null);
          setBillingAccount(null);
        }
      }
    }

    const unsubscribeFromIdentityChanges = subscribeWorkspaceIdentityChanges(() => {
      void loadBillingAccount();
    });

    void loadBillingAccount();

    return () => {
      isActive = false;
      unsubscribeFromIdentityChanges();
    };
  }, [freeTrialMode]);

  return (
    <div className="billing-settings-page" data-billing-settings-page="true">
      <section className="section landing-hero billing-settings-hero">
        <span className="eyebrow">{freeTrialMode ? tx("hero.freeTrialEyebrow") : tx("hero.paidEyebrow")}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">{freeTrialMode ? tx("hero.freeTrialSubtitle") : tx("hero.paidSubtitle")}</p>
          </span>
          {freeTrialMode ? <span className="badge local">{tx("hero.freeTrialBadge")}</span> : <a className="button button-outline-neutral" href={localizedHref("/pricing")}>
            {tx("hero.comparePlans")}
          </a>}
        </div>
      </section>

      <div className="billing-settings-layout">
        <div className="billing-settings-main">
          <section className="billing-summary-grid" aria-label={tx("aria.billingSummary")}>
            {summaryCards.map(([label, value, detail]) => (
              <article className="panel billing-summary-card" key={label}>
                <h2>{label}</h2>
                <div className="billing-summary-value">{value}</div>
                <p className="tool-description">{detail}</p>
              </article>
            ))}
          </section>

          <section className="panel billing-usage-card" id="usage">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.usageAnalytics")}</h2>
                <p className="tool-description">{tx("copy.usageAnalyticsDescription")}</p>
              </span>
              <span className="badge local">{freeTrialMode ? tx("badges.trialResets") : billingCycleClose}</span>
            </div>
            <div className="billing-usage-list">
              {usageRows.map(([label, value, percent, category]) => (
                <article className="billing-usage-row" key={label}>
                  <span>
                    <strong>{label}</strong>
                    <small>{category}</small>
                  </span>
                  <span className="billing-usage-meter" aria-label={tx("aria.usageMeter", { label })}>
                    <span style={{ width: percent }} />
                  </span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
          </section>

          {freeTrialMode ? (
          <section className="panel billing-detail-card">
            <h2>{t("sections.trialControls")}</h2>
            <div className="settings-row-list">
              <div className="settings-detail-row">
                <strong>{t("labels.Google sign-in")}</strong>
                <span>{tx("copy.trialGoogleSignIn")}</span>
                <span className="badge local">{tx("badges.enabled")}</span>
              </div>
              <div className="settings-detail-row">
                <strong>{t("labels.Paid plan access")}</strong>
                <span>{tx("copy.trialPaidPlanAccess")}</span>
                <span className="badge">{tx("badges.phase2")}</span>
              </div>
              <div className="settings-detail-row">
                <strong>{t("labels.Paid plans")}</strong>
                <span>{tx("copy.trialPaidPlans")}</span>
                <span className="badge">{tx("badges.parked")}</span>
              </div>
            </div>
          </section>
          ) : (
          <section className="panel billing-detail-card">
            <h2>{t("sections.billingDetails")}</h2>
            <div className="settings-row-list">
              {detailRows.map(([label, value, action]) => (
                <div className="settings-detail-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                  <button className="button button-outline-neutral" type="button">
                    {action}
                  </button>
                </div>
              ))}
            </div>
          </section>
          )}

          {freeTrialMode ? null : (
          <section className="panel billing-invoice-card">
            <h2>{t("sections.invoices")}</h2>
            <div className="billing-invoice-table">
              <div className="billing-invoice-head">
                <strong>{t("labels.Date")}</strong>
                <strong>{t("labels.Subscription")}</strong>
                <strong>{t("labels.Amount")}</strong>
                <strong>{t("labels.Status")}</strong>
              </div>
              {invoiceRows.map(([date, plan, amount, status]) => (
                <div className="billing-invoice-row" key={`${date}-${plan}`}>
                  <span>{date}</span>
                  <span>{plan}</span>
                  <span>{amount}</span>
                  <span className={status === tx("statuses.paid") ? "badge local" : "badge"}>{status}</span>
                </div>
              ))}
            </div>
          </section>
          )}

          {freeTrialMode ? null : (
          <section className="panel billing-invoice-detail-card">
            <div className="landing-section-head">
              <span>
                <h2>{t("sections.invoiceDetail")}</h2>
                <p className="tool-description">{tx("copy.invoiceDetailDescription")}</p>
              </span>
              <span className="badge local">{selectedInvoiceId}</span>
            </div>
            <div className="billing-invoice-detail-list">
              {invoiceDetailRows.map(([label, detail, amount]) => (
                <div className="billing-invoice-detail-row" key={`${label}-${amount}`}>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                  <span>{amount}</span>
                </div>
              ))}
            </div>
            <div className="billing-receipt-strip">
              <span>
                <strong>{t("labels.Receipt status")}</strong>
                <small>{receiptStatus}</small>
              </span>
              <button className="button button-outline-neutral" type="button">
                <ReceiptText size={15} aria-hidden="true" /> {tx("actions.downloadMayInvoice")}
              </button>
            </div>
          </section>
          )}
        </div>

        <aside className="billing-settings-side">
          {freeTrialMode ? (
          <section className="panel billing-portal-card">
            <h2>{t("sections.trialStatus")}</h2>
            <p className="tool-description">{tx("copy.trialStatusDescription")}</p>
            <span className="badge local">{tx("badges.freeTrialMode")}</span>
          </section>
          ) : (
          <section className="panel billing-portal-card">
            <h2>{t("sections.customerPortal")}</h2>
            <p className="tool-description">{tx("copy.customerPortalDescription")}</p>
            {billingAccount ? <span className="badge local">{tx("badges.billingAccountSynced")}</span> : null}
            {billingAccount?.customerPortalUrl ? (
              <a className="button button-solid" href={billingAccount.customerPortalUrl}>
                {tx("actions.openPortal")} <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : (
              <button className="button button-solid" type="button">
                {tx("actions.openPortal")} <ExternalLink size={15} aria-hidden="true" />
              </button>
            )}
          </section>
          )}

          <section className="panel">
            <h2>{t("sections.usagePolicy")}</h2>
            <div className="settings-row-list compact">
              <div className="settings-detail-row">
                <span className="badge local">{tx("badges.ai")}</span>
                <span>{freeTrialMode ? tx("copy.usagePolicyTrialCredits") : tx("copy.usagePolicyMonthlyCredits")}</span>
                <Info size={15} aria-hidden="true" />
              </div>
              <div className="settings-detail-row">
                <span className="badge local">{tx("badges.local")}</span>
                <span>{tx("copy.usagePolicyLocalTools")}</span>
                <ShieldCheck size={15} aria-hidden="true" />
              </div>
            </div>
          </section>

          {freeTrialMode ? null : (
          <section className="panel">
            <h2>{t("sections.paymentMethod")}</h2>
            <div className="settings-api-row">
              <CreditCard size={22} aria-hidden="true" />
              <span>
                <strong>{t("labels.Primary card")}</strong>
                <small>{tx("copy.primaryPaymentMethod")}</small>
              </span>
            </div>
          </section>
          )}

          {freeTrialMode ? null : (
          <section className="panel">
            <h2>{t("sections.invoiceExport")}</h2>
            <div className="settings-api-row">
              <ReceiptText size={22} aria-hidden="true" />
              <span>
                <strong>{t("labels.Download tax-ready invoices")}</strong>
                <small>{tx("copy.invoiceExportDescription")}</small>
              </span>
            </div>
            <button className="button button-outline-neutral" type="button">
              <FileText size={15} aria-hidden="true" /> {tx("actions.exportInvoices")}
            </button>
          </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function buildFallbackSummaryCards(t: BillingT): BillingSummaryCard[] {
  return [
    [t("summary.fallbackPlanLabel"), t("summary.fallbackPlanValue"), t("summary.fallbackPlanDetail")],
    [t("summary.aiCreditsLabel"), "68%", t("summary.fallbackAiCreditsDetail")],
    [t("summary.storageLabel"), "41%", t("summary.fallbackStorageDetail")],
    [t("summary.nextInvoiceLabel"), t("summary.fallbackNextInvoiceDate"), t("summary.fallbackNextInvoiceAmount")]
  ];
}

function buildTrialSummaryCards(t: BillingT): BillingSummaryCard[] {
  return [
    [t("summary.trialLabel"), t("summary.trialValue"), t("summary.trialDetail")],
    [t("summary.aiCreditsLabel"), "68%", t("summary.trialAiCreditsDetail")],
    [t("summary.storageLabel"), "41%", t("summary.trialStorageDetail")],
    [t("summary.trialWindowLabel"), t("summary.trialWindowValue"), t("summary.trialWindowDetail")]
  ];
}

function buildFallbackDetailRows(t: BillingT): BillingDetailRow[] {
  return [
    [t("detailRows.paymentMethod"), t("detailRows.fallbackCard"), t("actions.update")],
    [t("detailRows.billingEmail"), t("detailRows.fallbackEmail"), t("actions.edit")],
    [t("detailRows.taxDetails"), t("detailRows.notConfigured"), t("actions.add")]
  ];
}

function buildFallbackInvoiceRows(t: BillingT): BillingInvoiceRow[] {
  return [
    [t("invoiceRows.may28"), t("invoiceRows.proMonthly"), "$12.00", t("statuses.paid")],
    [t("invoiceRows.apr28"), t("invoiceRows.proMonthly"), "$12.00", t("statuses.paid")],
    [t("invoiceRows.mar28"), t("invoiceRows.proTrial"), "$0.00", t("statuses.trial")]
  ];
}

function buildFallbackUsageRows(t: BillingT): BillingUsageRow[] {
  return [
    [t("usageRows.pdfSummaryWorkflow"), t("usageRows.pdfSummaryValue"), "68%", t("usageRows.aiUsage")],
    [t("usageRows.pdfToolkitUploads"), t("usageRows.pdfToolkitValue"), "41%", t("usageRows.storageUsage")],
    [t("usageRows.commandCenterLaunches"), t("usageRows.commandCenterValue"), "57%", t("usageRows.workspaceActivity")]
  ];
}

function buildFallbackInvoiceDetailRows(t: BillingT): BillingInvoiceDetailRow[] {
  return [
    [t("invoiceDetailRows.subscription"), t("invoiceDetailRows.fallbackSubscriptionDetail"), "$12.00"],
    [t("invoiceDetailRows.tax"), t("invoiceDetailRows.noTaxProfile"), "$0.00"],
    [t("invoiceDetailRows.total"), t("invoiceDetailRows.fallbackTotalDetail"), "$12.00"]
  ];
}

function buildSummaryCards(account: ToolarsBillingAccount | null, t: BillingT): BillingSummaryCard[] {
  if (!account) return buildFallbackSummaryCards(t);

  const latestInvoice = account.invoices[0];
  return [
    [t("summary.fallbackPlanLabel"), account.planName, `${formatBillingStatus(account.status, t)} · ${account.planId}`],
    [
      t("summary.aiCreditsLabel"),
      formatPercent(account.usage.aiCreditsUsed, account.usage.aiCreditsLimit),
      `${formatNumber(account.usage.aiCreditsUsed)} / ${formatNumber(account.usage.aiCreditsLimit)}`
    ],
    [
      t("summary.storageLabel"),
      formatPercent(account.usage.storageBytesUsed, account.usage.storageBytesLimit),
      t("summary.usedStorage", { value: formatStorage(account.usage.storageBytesUsed) })
    ],
    [
      t("summary.nextInvoiceLabel"),
      latestInvoice ? formatMonthDay(latestInvoice.issuedAt) : formatMonthDay(account.usage.periodEnd),
      latestInvoice ? formatCurrency(latestInvoice.amountCents, latestInvoice.currency) : t("summary.pending")
    ]
  ];
}

function buildDetailRows(account: ToolarsBillingAccount | null, auth: ToolarsAuthContext | null, t: BillingT): BillingDetailRow[] {
  if (!account) return buildFallbackDetailRows(t);

  return [
    [
      t("detailRows.paymentMethod"),
      account.customerPortalUrl ? t("detailRows.customerPortalManaged") : t("detailRows.portalSessionRequired"),
      t("actions.update")
    ],
    [t("detailRows.billingEmail"), account.billingEmail ?? auth?.accountEmail ?? t("detailRows.notConfigured"), t("actions.edit")],
    [t("detailRows.accountId"), account.accountId, t("actions.view")],
    [t("detailRows.taxDetails"), t("detailRows.notConfigured"), t("actions.add")]
  ];
}

function buildInvoiceRows(account: ToolarsBillingAccount | null, t: BillingT): BillingInvoiceRow[] {
  if (!account?.invoices.length) return buildFallbackInvoiceRows(t);

  return account.invoices.map((invoice) => [
    formatDate(invoice.issuedAt),
    invoice.invoiceId,
    formatCurrency(invoice.amountCents, invoice.currency),
    formatInvoiceStatus(invoice.status, t)
  ]);
}

function buildUsageRows(account: ToolarsBillingAccount | null, t: BillingT): BillingUsageRow[] {
  if (!account) return buildFallbackUsageRows(t);

  return [
    [
      t("usageRows.aiCreditConsumption"),
      t("usageRows.creditsUsed", { value: formatNumber(account.usage.aiCreditsUsed) }),
      formatPercent(account.usage.aiCreditsUsed, account.usage.aiCreditsLimit),
      t("usageRows.aiUsage")
    ],
    [
      t("usageRows.workspaceStorage"),
      t("usageRows.storageStored", { value: formatStorage(account.usage.storageBytesUsed) }),
      formatPercent(account.usage.storageBytesUsed, account.usage.storageBytesLimit),
      t("usageRows.storageUsage")
    ],
    [t("usageRows.billingAccount"), account.source, "100%", account.planId]
  ];
}

function buildInvoiceDetailRows(account: ToolarsBillingAccount | null, t: BillingT): BillingInvoiceDetailRow[] {
  if (!account?.invoices.length) return buildFallbackInvoiceDetailRows(t);

  const invoice = account.invoices[0];
  const invoiceAmount = formatCurrency(invoice.amountCents, invoice.currency);
  return [
    [t("invoiceDetailRows.subscription"), t("invoiceDetailRows.workspaceSubscription", { plan: account.planName }), invoiceAmount],
    [t("invoiceDetailRows.billingEmail"), account.billingEmail ?? t("detailRows.notConfigured"), account.accountId],
    [t("invoiceDetailRows.total"), t("invoiceDetailRows.statusInvoice", { status: formatInvoiceStatus(invoice.status, t) }), invoiceAmount]
  ];
}

function formatPercent(used: number, limit: number) {
  if (limit <= 0) return "0%";
  return `${Math.round((used / limit) * 100)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(amountCents: number, currency: "USD") {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency"
  }).format(amountCents / 100);
}

function formatStorage(bytes: number) {
  const gigabytes = bytes / 1_073_741_824;
  return `${formatCompactDecimal(gigabytes)} GB`;
}

function formatCompactDecimal(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1
  }).format(value);
}

function formatMonthDay(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric"
  }).format(new Date(value));
}

function formatBillingStatus(status: ToolarsBillingAccount["status"], t: BillingT) {
  if (status === "past_due") return t("statuses.pastDue");
  if (status === "trialing") return t("statuses.trialing");
  return t("statuses.active");
}

function formatInvoiceStatus(status: ToolarsInvoiceStatus, t: BillingT) {
  if (status === "open") return t("statuses.open");
  if (status === "void") return t("statuses.void");
  return t("statuses.paid");
}
