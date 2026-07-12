import { readFileSync } from "node:fs";
import { render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { BillingSettingsView } from "./billing-settings-view";

const localizedBillingCopy = {
  ...en.settings.billing,
  hero: {
    title: "Uso centinela de facturación",
    freeTrialEyebrow: "Modo centinela de prueba gratuita",
    paidEyebrow: "Ajustes centinela de facturación",
    freeTrialSubtitle: "Créditos, almacenamiento y sincronización centinela para la prueba.",
    paidSubtitle: "Plan, método de pago y portal centinela localizados.",
    freeTrialBadge: "Prueba beta centinela",
    comparePlans: "Comparar planes centinela"
  },
  sections: {
    ...en.settings.billing.sections,
    customerPortal: "Portal centinela de cliente"
  },
  copy: {
    usageAnalyticsDescription: "Analítica centinela antes del cierre.",
    trialGoogleSignIn: "Historial centinela sincronizado con Google.",
    trialPaidPlanAccess: "Planes de pago centinela aparcados durante la beta.",
    trialPaidPlans: "Pro, Team, facturas y portal centinela ocultos.",
    invoiceDetailDescription: "Factura centinela con líneas y recibo.",
    trialStatusDescription: "Toolars está en modo centinela de prueba gratuita.",
    customerPortalDescription: "Sesión centinela para suscripción y cancelación.",
    usagePolicyTrialCredits: "Créditos centinela se reinician durante la beta",
    usagePolicyMonthlyCredits: "Créditos centinela se reinician cada mes",
    usagePolicyLocalTools: "Herramientas tradicionales centinela siguen gratis",
    primaryPaymentMethod: "Método de pago centinela principal",
    invoiceExportDescription: "Incluye metadatos centinela de plan y recibo."
  },
  badges: {
    freeTrialMode: "Modo centinela de prueba gratuita",
    billingAccountSynced: "Cuenta centinela sincronizada",
    enabled: "Activado centinela",
    phase2: "Fase 2 centinela",
    parked: "Aparcado centinela",
    trialResets: "Prueba centinela se reinicia el 28 jun",
    cycleCloses: "Ciclo centinela cierra {date}",
    ai: "IA centinela",
    local: "Local centinela"
  },
  actions: {
    update: "Actualizar centinela",
    edit: "Editar centinela",
    add: "Añadir centinela",
    view: "Ver centinela",
    openPortal: "Abrir portal centinela",
    downloadMayInvoice: "Descargar factura centinela de mayo",
    exportInvoices: "Exportar facturas centinela"
  },
  summary: {
    fallbackPlanLabel: "Plan centinela",
    fallbackPlanValue: "Pro centinela",
    fallbackPlanDetail: "12 USD centinela mensuales",
    aiCreditsLabel: "Créditos IA centinela",
    fallbackAiCreditsDetail: "1.360 / 2.000 centinela",
    storageLabel: "Almacenamiento centinela",
    fallbackStorageDetail: "8,2 GB usados centinela",
    nextInvoiceLabel: "Próxima factura centinela",
    fallbackNextInvoiceDate: "28 jun centinela",
    fallbackNextInvoiceAmount: "12 USD centinela",
    trialLabel: "Prueba centinela",
    trialValue: "Prueba gratuita centinela",
    trialDetail: "Sin tarjeta centinela",
    trialAiCreditsDetail: "1.360 / 2.000 créditos centinela",
    trialStorageDetail: "8,2 GB de prueba centinela",
    trialWindowLabel: "Ventana centinela de prueba",
    trialWindowValue: "14 días centinela",
    trialWindowDetail: "Sincronización Google centinela",
    pending: "Pendiente centinela",
    usedStorage: "{value} usados centinela"
  },
  detailRows: {
    paymentMethod: "Método de pago centinela",
    fallbackCard: "Visa centinela terminada en 4242",
    billingEmail: "Correo de facturación centinela",
    fallbackEmail: "facturacion-centinela@example.com",
    taxDetails: "Datos fiscales centinela",
    notConfigured: "Sin configurar centinela",
    customerPortalManaged: "Portal centinela gestionado",
    portalSessionRequired: "Sesión de portal centinela requerida",
    accountId: "ID de cuenta centinela"
  },
  invoiceRows: {
    proMonthly: "Pro mensual centinela",
    proTrial: "Prueba Pro centinela",
    may28: "28 may 2026 centinela",
    apr28: "28 abr 2026 centinela",
    mar28: "28 mar 2026 centinela"
  },
  usageRows: {
    pdfSummaryWorkflow: "Flujo resumen PDF centinela",
    pdfSummaryValue: "1.360 créditos usados centinela",
    aiUsage: "Uso IA centinela",
    pdfToolkitUploads: "Cargas PDF Toolkit centinela",
    pdfToolkitValue: "8,2 GB almacenados centinela",
    storageUsage: "Uso de almacenamiento centinela",
    commandCenterLaunches: "Lanzamientos Command Center centinela",
    commandCenterValue: "284 acciones centinela",
    workspaceActivity: "Actividad de espacio centinela",
    aiCreditConsumption: "Consumo de créditos IA centinela",
    creditsUsed: "{value} créditos usados centinela",
    workspaceStorage: "Almacenamiento de espacio centinela",
    storageStored: "{value} almacenados centinela",
    billingAccount: "Cuenta de facturación centinela"
  },
  invoiceDetailRows: {
    subscription: "Suscripción centinela",
    fallbackSubscriptionDetail: "Suscripción Pro mensual centinela",
    tax: "Impuesto centinela",
    noTaxProfile: "Sin perfil fiscal centinela",
    total: "Total centinela",
    fallbackTotalDetail: "Pagado con Visa centinela terminada en 4242",
    workspaceSubscription: "Suscripción centinela de espacio {plan}",
    billingEmail: "Correo de facturación centinela",
    statusInvoice: "Factura centinela {status}"
  },
  labels: {
    ...en.settings.billing.labels,
    "Google sign-in": "Inicio Google centinela",
    "Paid plan access": "Acceso centinela a plan de pago",
    "Paid plans": "Planes de pago centinela"
  },
  receipt: {
    status: "{status} centinela {date}",
    paidMay28: "Pagado centinela el 28 may 2026"
  },
  statuses: {
    paid: "Pagado centinela",
    open: "Abierto centinela",
    void: "Anulado centinela",
    trial: "Prueba centinela",
    active: "Activo centinela",
    pastDue: "Vencido centinela",
    trialing: "En prueba centinela"
  },
  aria: {
    billingSummary: "Resumen centinela de facturación",
    usageMeter: "Uso centinela de {label}"
  }
};

const localizedMessages = {
  ...en,
  settings: {
    ...en.settings,
    billing: localizedBillingCopy
  }
};

function renderBillingViewInLocale(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <BillingSettingsView />
    </NextIntlClientProvider>
  );
}

const billingSourceFile = "src/app/[locale]/settings/billing/billing-settings-view.tsx";

function scanBillingSource() {
  return scanSourceText(readFileSync(billingSourceFile, "utf8"), billingSourceFile);
}

describe("BillingSettingsView", () => {
  const originalFreeTrialMode = process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "enabled";
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Billing API not mocked")));
  });

  afterEach(() => {
    if (originalFreeTrialMode === undefined) {
      delete process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;
    } else {
      process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = originalFreeTrialMode;
    }
    vi.unstubAllGlobals();
  });

  it("does not contribute billing hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanBillingSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders free trial and paid fallback copy from non-English billing messages", () => {
    const { unmount } = renderBillingViewInLocale("es", localizedMessages);

    expect(screen.getByText(localizedBillingCopy.hero.freeTrialBadge)).toBeInTheDocument();
    expect(screen.getByText(localizedBillingCopy.copy.trialPaidPlanAccess)).toBeInTheDocument();
    expect(screen.getByText(localizedBillingCopy.usageRows.pdfSummaryWorkflow)).toBeInTheDocument();
    expect(screen.queryByText("Free beta trial")).not.toBeInTheDocument();
    expect(screen.queryByText("Paid plans are parked during the beta trial.")).not.toBeInTheDocument();

    unmount();
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "disabled";
    renderBillingViewInLocale("es", localizedMessages);

    expect(screen.getByRole("link", { name: localizedBillingCopy.hero.comparePlans })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: localizedBillingCopy.sections.customerPortal })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedBillingCopy.actions.openPortal })).toBeInTheDocument();
    expect(screen.getByText(localizedBillingCopy.detailRows.fallbackCard)).toBeInTheDocument();
    expect(screen.queryByText("Customer portal")).not.toBeInTheDocument();
  });

  it("renders billing settings modules from the design", () => {
    const { container } = renderWithIntl(<BillingSettingsView />);

    expect(container.querySelector('[data-billing-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trial usage" })).toBeInTheDocument();
    expect(screen.getByText("Trial")).toBeInTheDocument();
    expect(screen.getByText("AI credits")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Trial window")).toBeInTheDocument();
    expect(screen.getByText("Trial controls")).toBeInTheDocument();
    expect(screen.queryByText("Customer portal")).not.toBeInTheDocument();
    expect(screen.queryByText("Billing details")).not.toBeInTheDocument();
    expect(screen.queryByText("Invoices")).not.toBeInTheDocument();
    expect(screen.getByText("Usage analytics")).toBeInTheDocument();
    expect(screen.queryByText("Invoice detail")).not.toBeInTheDocument();
    expect(screen.getByText("Usage policy")).toBeInTheDocument();
  });

  it("shows free trial values without paid portal or invoice handoffs", () => {
    renderWithIntl(<BillingSettingsView />);

    expect(screen.getByText("Free trial")).toBeInTheDocument();
    expect(screen.getByText("68%")).toBeInTheDocument();
    expect(screen.getByText("41%")).toBeInTheDocument();
    expect(screen.getByText("14 days")).toBeInTheDocument();
    expect(screen.queryByText("$12.00")).not.toBeInTheDocument();
    expect(screen.queryByText("Visa ending 4242")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open portal" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Compare plans" })).not.toBeInTheDocument();
    expect(screen.queryByText("Paid")).not.toBeInTheDocument();
    expect(screen.getByText("PDF Summary Workflow")).toBeInTheDocument();
    expect(screen.getByText("1,360 credits used")).toBeInTheDocument();
    expect(screen.getByText("Paid plans are parked during the beta trial.")).toBeInTheDocument();
  });

  it("hydrates authenticated billing account data from the production API contract", async () => {
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "disabled";
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        auth: {
          accountEmail: "finance@example.com",
          accountId: "acct-team-001",
          isAuthenticated: true,
          source: "preview-header",
          workspaceId: "toolars_ws_billing_test"
        },
        billing: {
          accountId: "acct-team-001",
          billingEmail: "finance@example.com",
          customerPortalUrl: "https://billing.example.com/session/team-001",
          invoices: [
            {
              amountCents: 7900,
              currency: "USD",
              invoiceId: "inv_team_2026_06",
              issuedAt: "2026-06-28T00:00:00Z",
              status: "open"
            }
          ],
          planId: "team",
          planName: "Toolars Team",
          source: "billing-driver",
          status: "active",
          usage: {
            aiCreditsLimit: 5000,
            aiCreditsUsed: 4200,
            periodEnd: "2026-06-28T00:00:00Z",
            periodStart: "2026-05-28T00:00:00Z",
            storageBytesLimit: 10737418240,
            storageBytesUsed: 2684354560
          },
          version: 1
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<BillingSettingsView />);

    expect(await screen.findByText("Billing account synced")).toBeInTheDocument();
    expect(screen.getByText("Toolars Team")).toBeInTheDocument();
    expect(screen.getAllByText("acct-team-001").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("finance@example.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("4,200 / 5,000")).toBeInTheDocument();
    expect(screen.getByText("2.5 GB used")).toBeInTheDocument();
    expect(screen.getAllByText("inv_team_2026_06").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Open portal" })).toHaveAttribute(
      "href",
      "https://billing.example.com/session/team-001"
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/billing/account");
  });
});
