"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CreditCard, ExternalLink, FileText, Info, ReceiptText, ShieldCheck } from "lucide-react";
import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import type { ToolarsBillingAccount, ToolarsInvoiceStatus } from "@/lib/billing/billing-account";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";
import { buildWorkspaceAuditHeaders, subscribeWorkspaceIdentityChanges } from "@/lib/workspace/workspace-identity";

type BillingSummaryCard = [label: string, value: string, detail: string];
type BillingDetailRow = [label: string, value: string, action: string];
type BillingInvoiceRow = [date: string, plan: string, amount: string, status: string];
type BillingUsageRow = [label: string, value: string, percent: string, category: string];
type BillingInvoiceDetailRow = [label: string, detail: string, amount: string];

interface BillingApiPayload {
  auth?: ToolarsAuthContext;
  billing?: ToolarsBillingAccount;
}

const fallbackSummaryCards: BillingSummaryCard[] = [
  ["Plan", "Pro", "$12 monthly"],
  ["AI credits", "68%", "1,360 / 2,000"],
  ["Storage", "41%", "8.2 GB used"],
  ["Next invoice", "Jun 28", "$12.00"]
];

const trialSummaryCards: BillingSummaryCard[] = [
  ["Trial", "Free trial", "No card required"],
  ["AI credits", "68%", "1,360 / 2,000 trial credits"],
  ["Storage", "41%", "8.2 GB trial storage"],
  ["Trial window", "14 days", "Google account sync"]
];

const fallbackDetailRows: BillingDetailRow[] = [
  ["Payment method", "Visa ending 4242", "Update"],
  ["Billing email", "billing@example.com", "Edit"],
  ["Tax details", "Not configured", "Add"]
];

const fallbackInvoiceRows: BillingInvoiceRow[] = [
  ["May 28, 2026", "Pro monthly", "$12.00", "Paid"],
  ["Apr 28, 2026", "Pro monthly", "$12.00", "Paid"],
  ["Mar 28, 2026", "Pro trial", "$0.00", "Trial"]
];

const fallbackUsageRows: BillingUsageRow[] = [
  ["PDF Summary Workflow", "1,360 credits used", "68%", "AI usage"],
  ["PDF Toolkit uploads", "8.2 GB stored", "41%", "Storage usage"],
  ["Command Center launches", "284 actions", "57%", "Workspace activity"]
];

const fallbackInvoiceDetailRows: BillingInvoiceDetailRow[] = [
  ["Subscription", "Pro monthly workspace subscription", "$12.00"],
  ["Tax", "No tax profile configured", "$0.00"],
  ["Total", "Paid with Visa ending 4242", "$12.00"]
];

export function BillingSettingsView() {
  const t = useTranslations("settings.billing");
  const freeTrialMode = isFreeTrialMode();
  const [authContext, setAuthContext] = useState<ToolarsAuthContext | null>(null);
  const [billingAccount, setBillingAccount] = useState<ToolarsBillingAccount | null>(null);
  const summaryCards = freeTrialMode ? trialSummaryCards : buildSummaryCards(billingAccount);
  const detailRows = buildDetailRows(billingAccount, authContext);
  const invoiceRows = buildInvoiceRows(billingAccount);
  const usageRows = buildUsageRows(billingAccount);
  const invoiceDetailRows = buildInvoiceDetailRows(billingAccount);
  const latestInvoice = billingAccount?.invoices[0];
  const billingCycleClose = billingAccount ? `Cycle closes ${formatMonthDay(billingAccount.usage.periodEnd)}` : "Cycle closes Jun 28";
  const selectedInvoiceId = latestInvoice?.invoiceId ?? "inv_2026_05_pro";
  const receiptStatus = latestInvoice ? `${formatInvoiceStatus(latestInvoice.status)} ${formatDate(latestInvoice.issuedAt)}` : "Paid May 28, 2026";

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
        <span className="eyebrow">{freeTrialMode ? "Free trial mode" : "Billing settings"}</span>
        <div className="landing-section-head">
          <span>
            <h1 className="title">{t("hero.title")}</h1>
            <p className="subtitle">
              {freeTrialMode
                ? "Review beta trial credits, storage, workflow usage, and account sync. Invoices and paid plans are parked for Phase 2."
                : "Review current plan, usage, payment method, invoices, and customer portal handoff points."}
            </p>
          </span>
          {freeTrialMode ? <span className="badge local">Free beta trial</span> : <a className="button button-outline-neutral" href="/pricing">
            Compare plans
          </a>}
        </div>
      </section>

      <div className="billing-settings-layout">
        <div className="billing-settings-main">
          <section className="billing-summary-grid" aria-label="Billing summary">
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
                <h2>Usage analytics</h2>
                <p className="tool-description">Track AI credits, storage, and workspace activity before the next billing cycle closes.</p>
              </span>
              <span className="badge local">{freeTrialMode ? "Trial resets Jun 28" : billingCycleClose}</span>
            </div>
            <div className="billing-usage-list">
              {usageRows.map(([label, value, percent, category]) => (
                <article className="billing-usage-row" key={label}>
                  <span>
                    <strong>{label}</strong>
                    <small>{category}</small>
                  </span>
                  <span className="billing-usage-meter" aria-label={`${label} usage`}>
                    <span style={{ width: percent }} />
                  </span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
          </section>

          {freeTrialMode ? (
          <section className="panel billing-detail-card">
            <h2>Trial controls</h2>
            <div className="settings-row-list">
              <div className="settings-detail-row">
                <strong>Google sign-in</strong>
                <span>Required for synced trial history and account settings.</span>
                <span className="badge local">Enabled</span>
              </div>
              <div className="settings-detail-row">
                <strong>Paid plan access</strong>
                <span>Paid plans are parked during the beta trial.</span>
                <span className="badge">Phase 2</span>
              </div>
              <div className="settings-detail-row">
                <strong>Paid plans</strong>
                <span>Pro, Team, invoices, and customer portal are hidden for launch.</span>
                <span className="badge">Parked</span>
              </div>
            </div>
          </section>
          ) : (
          <section className="panel billing-detail-card">
            <h2>Billing details</h2>
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
            <h2>Invoices</h2>
            <div className="billing-invoice-table">
              <div className="billing-invoice-head">
                <strong>Date</strong>
                <strong>Subscription</strong>
                <strong>Amount</strong>
                <strong>Status</strong>
              </div>
              {invoiceRows.map(([date, plan, amount, status]) => (
                <div className="billing-invoice-row" key={`${date}-${plan}`}>
                  <span>{date}</span>
                  <span>{plan}</span>
                  <span>{amount}</span>
                  <span className={status === "Paid" ? "badge local" : "badge"}>{status}</span>
                </div>
              ))}
            </div>
          </section>
          )}

          {freeTrialMode ? null : (
          <section className="panel billing-invoice-detail-card">
            <div className="landing-section-head">
              <span>
                <h2>Invoice detail</h2>
                <p className="tool-description">Selected invoice handoff with line items, receipt metadata, and tax-ready export fields.</p>
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
                <strong>Receipt status</strong>
                <small>{receiptStatus}</small>
              </span>
              <button className="button button-outline-neutral" type="button">
                <ReceiptText size={15} aria-hidden="true" /> Download May invoice
              </button>
            </div>
          </section>
          )}
        </div>

        <aside className="billing-settings-side">
          {freeTrialMode ? (
          <section className="panel billing-portal-card">
            <h2>Trial status</h2>
            <p className="tool-description">Toolars is currently in free trial mode. Usage is tracked for product quality and future plan design.</p>
            <span className="badge local">Free trial mode</span>
          </section>
          ) : (
          <section className="panel billing-portal-card">
            <h2>Customer portal</h2>
            <p className="tool-description">Production can create a temporary portal session for subscription, payment method, invoice, and cancellation flows.</p>
            {billingAccount ? <span className="badge local">Billing account synced</span> : null}
            {billingAccount?.customerPortalUrl ? (
              <a className="button button-solid" href={billingAccount.customerPortalUrl}>
                Open portal <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : (
              <button className="button button-solid" type="button">
                Open portal <ExternalLink size={15} aria-hidden="true" />
              </button>
            )}
          </section>
          )}

          <section className="panel">
            <h2>Usage policy</h2>
            <div className="settings-row-list compact">
              <div className="settings-detail-row">
                <span className="badge local">AI</span>
                <span>{freeTrialMode ? "Trial credits reset during beta" : "Credits reset monthly"}</span>
                <Info size={15} aria-hidden="true" />
              </div>
              <div className="settings-detail-row">
                <span className="badge local">Local</span>
                <span>Traditional tools stay free</span>
                <ShieldCheck size={15} aria-hidden="true" />
              </div>
            </div>
          </section>

          {freeTrialMode ? null : (
          <section className="panel">
            <h2>Payment method</h2>
            <div className="settings-api-row">
              <CreditCard size={22} aria-hidden="true" />
              <span>
                <strong>Primary card</strong>
                <small>Primary payment method</small>
              </span>
            </div>
          </section>
          )}

          {freeTrialMode ? null : (
          <section className="panel">
            <h2>Invoice export</h2>
            <div className="settings-api-row">
              <ReceiptText size={22} aria-hidden="true" />
              <span>
                <strong>Download tax-ready invoices</strong>
                <small>Includes plan, payment, and receipt metadata.</small>
              </span>
            </div>
            <button className="button button-outline-neutral" type="button">
              <FileText size={15} aria-hidden="true" /> Export invoices
            </button>
          </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function buildSummaryCards(account: ToolarsBillingAccount | null): BillingSummaryCard[] {
  if (!account) return fallbackSummaryCards;

  const latestInvoice = account.invoices[0];
  return [
    ["Plan", account.planName, `${formatBillingStatus(account.status)} · ${account.planId}`],
    [
      "AI credits",
      formatPercent(account.usage.aiCreditsUsed, account.usage.aiCreditsLimit),
      `${formatNumber(account.usage.aiCreditsUsed)} / ${formatNumber(account.usage.aiCreditsLimit)}`
    ],
    [
      "Storage",
      formatPercent(account.usage.storageBytesUsed, account.usage.storageBytesLimit),
      `${formatStorage(account.usage.storageBytesUsed)} used`
    ],
    [
      "Next invoice",
      latestInvoice ? formatMonthDay(latestInvoice.issuedAt) : formatMonthDay(account.usage.periodEnd),
      latestInvoice ? formatCurrency(latestInvoice.amountCents, latestInvoice.currency) : "Pending"
    ]
  ];
}

function buildDetailRows(account: ToolarsBillingAccount | null, auth: ToolarsAuthContext | null): BillingDetailRow[] {
  if (!account) return fallbackDetailRows;

  return [
    ["Payment method", account.customerPortalUrl ? "Customer portal managed" : "Portal session required", "Update"],
    ["Billing email", account.billingEmail ?? auth?.accountEmail ?? "Not configured", "Edit"],
    ["Account ID", account.accountId, "View"],
    ["Tax details", "Not configured", "Add"]
  ];
}

function buildInvoiceRows(account: ToolarsBillingAccount | null): BillingInvoiceRow[] {
  if (!account?.invoices.length) return fallbackInvoiceRows;

  return account.invoices.map((invoice) => [
    formatDate(invoice.issuedAt),
    invoice.invoiceId,
    formatCurrency(invoice.amountCents, invoice.currency),
    formatInvoiceStatus(invoice.status)
  ]);
}

function buildUsageRows(account: ToolarsBillingAccount | null): BillingUsageRow[] {
  if (!account) return fallbackUsageRows;

  return [
    [
      "AI credit consumption",
      `${formatNumber(account.usage.aiCreditsUsed)} credits used`,
      formatPercent(account.usage.aiCreditsUsed, account.usage.aiCreditsLimit),
      "AI usage"
    ],
    [
      "Workspace storage",
      `${formatStorage(account.usage.storageBytesUsed)} stored`,
      formatPercent(account.usage.storageBytesUsed, account.usage.storageBytesLimit),
      "Storage usage"
    ],
    ["Billing account", account.source, "100%", account.planId]
  ];
}

function buildInvoiceDetailRows(account: ToolarsBillingAccount | null): BillingInvoiceDetailRow[] {
  if (!account?.invoices.length) return fallbackInvoiceDetailRows;

  const invoice = account.invoices[0];
  const invoiceAmount = formatCurrency(invoice.amountCents, invoice.currency);
  return [
    ["Subscription", `${account.planName} workspace subscription`, invoiceAmount],
    ["Billing email", account.billingEmail ?? "Not configured", account.accountId],
    ["Total", `${formatInvoiceStatus(invoice.status)} invoice`, invoiceAmount]
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

function formatBillingStatus(status: ToolarsBillingAccount["status"]) {
  if (status === "past_due") return "Past due";
  return capitalizeStatus(status);
}

function formatInvoiceStatus(status: ToolarsInvoiceStatus) {
  return capitalizeStatus(status);
}

function capitalizeStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
