import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { DiscountCalculatorWorkspace } from "./discount-calculator-workspace";

const discountCalculatorSourceFile =
  "src/app/[locale]/tools/discount-calculator/discount-calculator-workspace.tsx";

function scanDiscountCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(discountCalculatorSourceFile, "utf8"), discountCalculatorSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Espacio de descuento centinela",
  title: "Calculadora de descuento centinela",
  subtitle: "Calcula precio final centinela con descuento e impuesto.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    sale: "Oferta centinela",
    checkout: "Pago centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Precio, descuento e impuesto centinela quedan en este navegador."
    },
    context: {
      label: "Contexto centinela",
      text: "Las reglas de caja centinela pueden cambiar totales."
    },
    private: {
      label: "Privado centinela",
      text: "El escenario centinela solo se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas de pago centinela",
    description: "Usa precio, descuento e impuesto centinela."
  },
  fields: {
    originalPrice: "Precio original centinela",
    discountPercent: "Porcentaje de descuento centinela",
    taxPercent: "Impuesto centinela"
  },
  actions: {
    save: "Guardar descuento centinela",
    calculate: "Calcular descuento centinela"
  },
  resultSection: {
    title: "Resumen de precio centinela",
    emptyDescription: "Ejecuta el cálculo centinela.",
    beforeTax: "{amount} antes de impuestos centinela."
  },
  metrics: {
    finalPrice: "Precio final centinela",
    discountAmount: "Descuento centinela",
    taxAmount: "Impuesto calculado centinela",
    originalPrice: "Precio original centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero las reglas centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de caja centinela",
    notes: {
      discount: "La nota de descuento centinela queda localizada.",
      tax: "La nota de impuesto centinela queda localizada.",
      checkout: "La nota de caja centinela queda localizada."
    }
  },
  recommendation: {
    title: "Local primero centinela",
    body: "Las compras centinela permanecen locales."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "discount-calculator": {
      ...en.tools["discount-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("DiscountCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanDiscountCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages(<DiscountCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.originalPrice)).toHaveValue(100);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/discount-calculator/about"
    );
  });

  it("renders the local VitalCalc discount workspace sections", () => {
    renderWithIntl(<DiscountCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Discount Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Checkout inputs")).toBeInTheDocument();
    expect(screen.getByText("Final price summary")).toBeInTheDocument();
    expect(screen.getByText("Checkout notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Original price")).toHaveValue(100);
    expect(screen.getByLabelText("Discount percent")).toHaveValue(20);
    expect(screen.getByLabelText("Tax percent")).toHaveValue(8);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/discount-calculator/about"
    );
  });

  it("calculates the default checkout discount and saves assumptions locally", () => {
    renderWithIntl(<DiscountCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate discount" }));

    expect(screen.getByText("$86.40")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$6.40")).toBeInTheDocument();
    expect(screen.getAllByText("20% off $100.00").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save discount" }));

    expect(window.localStorage.getItem("toolars.discount-calculator.plan")).toContain("100");
  });
});
