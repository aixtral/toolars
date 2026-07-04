import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../scripts/audit-i18n.mjs";
import es from "../../../../messages/es.json";
import zhHans from "../../../../messages/zh-hans.json";
import zhHant from "../../../../messages/zh-hant.json";
import { PricingView } from "./pricing-view";

function renderWithSpanishIntl(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="es" messages={es}>{ui}</NextIntlClientProvider>);
}

const pricingSourceFile = "src/app/[locale]/pricing/pricing-view.tsx";

function scanPricingSource() {
  return scanSourceText(readFileSync(pricingSourceFile, "utf8"), pricingSourceFile);
}

describe("PricingView", () => {
  it("does not ship W31 pricing placeholders in Chinese launch locale copy", () => {
    expect(JSON.stringify(zhHans.pricing)).not.toContain("W31-E");
    expect(JSON.stringify(zhHant.pricing)).not.toContain("W31-E");
  });

  it("does not leave hardcoded UI audit candidates in the pricing source", () => {
    const scan = scanPricingSource();

    expect(scan.hardcodedText).toHaveLength(0);
    expect(scan.absoluteHrefs).toHaveLength(0);
  });

  it("renders the pricing modules from the design", () => {
    const { container } = renderWithIntl(<PricingView />);

    expect(container.querySelector('[data-pricing-page="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-pricing-mobile-layout="mixed-tools-v2"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start your free Toolars trial." })).toBeInTheDocument();
    expect(screen.getByText("Free trial for mixed tools")).toBeInTheDocument();
    expect(screen.getAllByText(/Traditional local tools stay free/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Free trial mode").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("button", { name: "Monthly" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Yearly/ })).not.toBeInTheDocument();
    expect(screen.getAllByText("Trial workspace").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("Team")).not.toBeInTheDocument();
    expect(screen.queryByText("Compare plans")).not.toBeInTheDocument();
    expect(screen.getByText("Estimate your trial usage")).toBeInTheDocument();
    expect(screen.getByText("Frequently asked questions")).toBeInTheDocument();
    expect(screen.getByText("Local-first tools remain free")).toBeInTheDocument();
    expect(screen.getByText("AI processing only after consent")).toBeInTheDocument();
    expect(screen.getByText("No hidden uploads")).toBeInTheDocument();
  });

  it("shows trial limits and Google sign-in instead of paid upgrade CTAs", () => {
    renderWithIntl(<PricingView />);

    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.queryByText("$6.99")).not.toBeInTheDocument();
    expect(screen.queryByText("$14.99")).not.toBeInTheDocument();
    expect(screen.getByText("All traditional tools")).toBeInTheDocument();
    expect(screen.getByText("Unlimited local traditional tools")).toBeInTheDocument();
    expect(screen.getByText("PDF uploads up to 200 MB")).toBeInTheDocument();
    expect(screen.getAllByText("14 day synced history").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Start free trial").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5,000 trial AI credits").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: "Start free trial" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Upgrade/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("AI credits")).toHaveValue("5000");
    expect(screen.getByLabelText("Workflow runs")).toHaveValue("300");
    expect(screen.getByLabelText("File storage")).toHaveValue("5");
    expect(screen.getByText("Recommended plan")).toBeInTheDocument();
    expect(screen.getByText("Are traditional tools really free?")).toBeInTheDocument();
  });

  it("localizes paid pricing copy and internal sales links for non-default locales", () => {
    const originalFreeTrialMode = process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "disabled";

    try {
      renderWithSpanishIntl(<PricingView />);

      expect(screen.getByText("Planes y créditos")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Empieza gratis. Mejora cuando Toolars se convierta en tu espacio de trabajo." })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Anual/ })).toBeInTheDocument();
      expect(screen.getByText("Ahorra 20%")).toBeInTheDocument();
      expect(screen.getByText("Los precios se muestran en USD.")).toBeInTheDocument();
      expect(screen.getByText("Gratis")).toBeInTheDocument();
      expect(screen.getAllByText("Empezar gratis").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Comparar planes")).toBeInTheDocument();
      expect(screen.getByText("Herramientas tradicionales")).toBeInTheDocument();
      expect(screen.getByText("Estima tu uso mensual")).toBeInTheDocument();
      expect(screen.getByText("$6.99 / mes · Facturado anualmente")).toBeInTheDocument();

      const salesLink = screen.getByRole("link", { name: "¿Necesitas más? Contacta con ventas" });
      expect(salesLink).toHaveAttribute("href", "/es/pricing#team");
    } finally {
      if (originalFreeTrialMode === undefined) {
        delete process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;
      } else {
        process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = originalFreeTrialMode;
      }
    }
  });
});
