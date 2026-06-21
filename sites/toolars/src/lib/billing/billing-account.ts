import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";

export type ToolarsBillingPlanId = "free" | "pro" | "team";
export type ToolarsBillingStatus = "active" | "past_due" | "trialing";
export type ToolarsInvoiceStatus = "paid" | "open" | "void";
type MaybePromise<T> = T | Promise<T>;

export interface ToolarsBillingUsage {
  aiCreditsLimit: number;
  aiCreditsUsed: number;
  periodEnd: string;
  periodStart: string;
  storageBytesLimit: number;
  storageBytesUsed: number;
}

export interface ToolarsInvoiceSummary {
  amountCents: number;
  currency: "USD";
  invoiceId: string;
  issuedAt: string;
  status: ToolarsInvoiceStatus;
}

export interface ToolarsBillingAccount {
  accountId: string;
  billingEmail: string | null;
  customerPortalUrl: string | null;
  invoices: ToolarsInvoiceSummary[];
  planId: ToolarsBillingPlanId;
  planName: string;
  source: "billing-driver" | "billing-provider" | "local-preview";
  status: ToolarsBillingStatus;
  usage: ToolarsBillingUsage;
  version: 1;
}

export interface ToolarsBillingDriver {
  getAccount: (accountId: string, auth: ToolarsAuthContext) => MaybePromise<ToolarsBillingAccount | null>;
}

interface ToolarsBillingProviderPayload {
  customer?: {
    email?: string | null;
    id?: string;
  };
  invoices?: ToolarsBillingProviderInvoicePayload[];
  portal?: {
    url?: string | null;
  };
  subscription?: {
    currentPeriodEnd?: string;
    currentPeriodStart?: string;
    planId?: string;
    planName?: string;
    status?: string;
  };
  usage?: {
    aiCreditsLimit?: number;
    aiCreditsUsed?: number;
    storageBytesLimit?: number;
    storageBytesUsed?: number;
  };
}

interface ToolarsBillingProviderInvoicePayload {
  currency?: string;
  id?: string;
  issuedAt?: string;
  status?: string;
  totalCents?: number;
}

export class ToolarsBillingProviderError extends Error {
  constructor(message = "Billing provider unavailable") {
    super(message);
    this.name = "ToolarsBillingProviderError";
  }
}

let billingDriverForTest: ToolarsBillingDriver | null = null;

export async function getToolarsBillingAccount(auth: ToolarsAuthContext): Promise<ToolarsBillingAccount | null> {
  if (!auth.isAuthenticated || !auth.accountId) return null;

  const billingDriver = getToolarsBillingDriver();
  const billingAccount = await billingDriver?.getAccount(auth.accountId, auth);
  if (billingAccount) return cloneBillingAccount(billingAccount);

  const providerAccount = await getConfiguredBillingProviderAccount(auth.accountId, auth);
  if (providerAccount) return cloneBillingAccount(providerAccount);

  return buildLocalPreviewBillingAccount(auth);
}

export function setToolarsBillingDriverForTest(driver: ToolarsBillingDriver | null) {
  billingDriverForTest = driver;
}

function getToolarsBillingDriver() {
  return billingDriverForTest;
}

async function getConfiguredBillingProviderAccount(accountId: string, auth: ToolarsAuthContext) {
  const endpoint = process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT?.trim();
  if (!endpoint) return null;
  if (typeof fetch !== "function") throw new ToolarsBillingProviderError();

  const response = await fetch(`${endpoint.replace(/\/+$/g, "")}/accounts/${encodeURIComponent(accountId)}`, {
    headers: {
      Authorization: `Bearer ${process.env.TOOLARS_BILLING_PROVIDER_API_KEY ?? ""}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) throw new ToolarsBillingProviderError();

  const payload = (await response.json()) as ToolarsBillingProviderPayload;
  return buildBillingProviderAccount(accountId, auth, payload);
}

function buildBillingProviderAccount(
  accountId: string,
  auth: ToolarsAuthContext,
  payload: ToolarsBillingProviderPayload
): ToolarsBillingAccount {
  const periodStart = normalizeIsoDate(payload.subscription?.currentPeriodStart, "2026-06-01T00:00:00Z");
  const periodEnd = normalizeIsoDate(payload.subscription?.currentPeriodEnd, "2026-06-30T23:59:59Z");

  return {
    accountId,
    billingEmail: payload.customer?.email?.trim() || auth.accountEmail,
    customerPortalUrl: payload.portal?.url?.trim() || null,
    invoices: (payload.invoices ?? []).map(normalizeProviderInvoice).filter(isToolarsInvoiceSummary),
    planId: normalizePlanId(payload.subscription?.planId),
    planName: payload.subscription?.planName?.trim() || "Toolars Plan",
    source: "billing-provider",
    status: normalizeBillingStatus(payload.subscription?.status),
    usage: {
      aiCreditsLimit: normalizeUsageNumber(payload.usage?.aiCreditsLimit),
      aiCreditsUsed: normalizeUsageNumber(payload.usage?.aiCreditsUsed),
      periodEnd,
      periodStart,
      storageBytesLimit: normalizeUsageNumber(payload.usage?.storageBytesLimit),
      storageBytesUsed: normalizeUsageNumber(payload.usage?.storageBytesUsed)
    },
    version: 1
  };
}

function buildLocalPreviewBillingAccount(auth: ToolarsAuthContext): ToolarsBillingAccount {
  return {
    accountId: auth.accountId ?? "account-local",
    billingEmail: auth.accountEmail,
    customerPortalUrl: null,
    invoices: [],
    planId: "free",
    planName: "Toolars Free",
    source: "local-preview",
    status: "active",
    usage: {
      aiCreditsLimit: 250,
      aiCreditsUsed: 0,
      periodEnd: "2026-06-30T23:59:59Z",
      periodStart: "2026-06-01T00:00:00Z",
      storageBytesLimit: 1_073_741_824,
      storageBytesUsed: 0
    },
    version: 1
  };
}

function cloneBillingAccount(account: ToolarsBillingAccount): ToolarsBillingAccount {
  return {
    ...account,
    invoices: account.invoices.map((invoice) => ({ ...invoice })),
    usage: { ...account.usage },
    version: 1
  };
}

function normalizeProviderInvoice(invoice: ToolarsBillingProviderInvoicePayload) {
  if (!invoice.id || invoice.totalCents === undefined || !invoice.issuedAt) return null;

  return {
    amountCents: normalizeUsageNumber(invoice.totalCents),
    currency: "USD" as const,
    invoiceId: invoice.id,
    issuedAt: normalizeIsoDate(invoice.issuedAt, "2026-06-01T00:00:00Z"),
    status: normalizeInvoiceStatus(invoice.status)
  };
}

function normalizePlanId(planId?: string): ToolarsBillingPlanId {
  if (planId === "pro" || planId === "team") return planId;
  return "free";
}

function normalizeBillingStatus(status?: string): ToolarsBillingStatus {
  if (status === "past_due" || status === "trialing") return status;
  return "active";
}

function normalizeInvoiceStatus(status?: string): ToolarsInvoiceStatus {
  if (status === "open" || status === "void") return status;
  return "paid";
}

function normalizeUsageNumber(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

function normalizeIsoDate(value: string | undefined, fallback: string) {
  if (!value || Number.isNaN(Date.parse(value))) return fallback;
  return value;
}

function isToolarsInvoiceSummary(invoice: ToolarsInvoiceSummary | null): invoice is ToolarsInvoiceSummary {
  return invoice !== null;
}
