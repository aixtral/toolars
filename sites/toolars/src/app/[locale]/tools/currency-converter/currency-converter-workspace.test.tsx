import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CurrencyConverterWorkspace } from "./currency-converter-workspace";

const currencyConverterSourceFile = "src/app/[locale]/tools/currency-converter/currency-converter-workspace.tsx";

function scanCurrencyConverterWorkspaceSource() {
  return scanSourceText(readFileSync(currencyConverterSourceFile, "utf8"), currencyConverterSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Espacio cambiario centinela",
  title: "Conversor de divisas centinela",
  subtitle: "Convierte divisas centinela con una tasa local.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    fx: "FX centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Los importes y tasas centinela quedan en este navegador."
    },
    rates: {
      label: "Tasas centinela",
      text: "La tasa centinela se introduce manualmente."
    },
    private: {
      label: "Privado centinela",
      text: "El escenario centinela solo se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas cambiarias centinela",
    description: "Usa importe, divisas y tasa centinela."
  },
  fields: {
    amount: "Importe centinela",
    exchangeRate: "Tasa centinela",
    fromCurrency: "Divisa origen centinela",
    toCurrency: "Divisa destino centinela"
  },
  actions: {
    save: "Guardar conversión centinela",
    convert: "Convertir divisa centinela"
  },
  resultSection: {
    title: "Resumen convertido centinela",
    emptyDescription: "Ejecuta la conversión centinela.",
    pair: "{fromCurrency} a {toCurrency}"
  },
  metrics: {
    convertedAmount: "Importe convertido centinela",
    sourceAmount: "Importe origen centinela",
    from: "Desde centinela",
    to: "Hacia centinela"
  },
  callout: {
    waitingTitle: "Esperando conversión centinela",
    waitingDescription: "Convierte primero el par centinela.",
    currentRateDescription: "Usa tasas bancarias centinela actualizadas."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de tasas centinela",
    notes: {
      formula: "La nota de fórmula centinela queda localizada.",
      costs: "La nota de costes centinela queda localizada.",
      freshness: "La nota de vigencia centinela queda localizada."
    }
  },
  recommendation: {
    title: "Local primero centinela",
    body: "La conversión centinela permanece local."
  },
  currencyOptionLabel: "{code}: {name}",
  currencyNames: {
    USD: "dólar estadounidense",
    EUR: "euro",
    GBP: "libra esterlina",
    JPY: "yen japonés",
    CNY: "yuan chino",
    CAD: "dólar canadiense",
    AUD: "dólar australiano",
    CHF: "franco suizo",
    HKD: "dólar de Hong Kong",
    SGD: "dólar singapurense",
    INR: "rupia india",
    KRW: "won surcoreano"
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "currency-converter": {
      ...en.tools["currency-converter"],
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

describe("CurrencyConverterWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCurrencyConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages(<CurrencyConverterWorkspace />);

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.amount)).toHaveValue(1000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.convert })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/currency-converter/about"
    );
  });

  it("renders the local VitalCalc currency converter workspace sections", () => {
    renderWithIntl(<CurrencyConverterWorkspace />);

    expect(screen.getByRole("heading", { name: "Currency Converter" })).toBeInTheDocument();
    expect(screen.getByText("Exchange inputs")).toBeInTheDocument();
    expect(screen.getByText("Converted amount summary")).toBeInTheDocument();
    expect(screen.getByText("Rate freshness notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toHaveValue(1000);
    expect(screen.getByLabelText("Exchange rate")).toHaveValue(0.85);
    expect(screen.getByLabelText("From currency")).toHaveValue("USD");
    expect(screen.getByLabelText("To currency")).toHaveValue("EUR");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/currency-converter/about"
    );
  });

  it("converts the default currency amount and saves assumptions locally", () => {
    renderWithIntl(<CurrencyConverterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Convert currency" }));

    expect(screen.getByText("€850.00 EUR")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00 USD")).toBeInTheDocument();
    expect(screen.getAllByText("1 USD = 0.85 EUR").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save conversion" }));

    expect(window.localStorage.getItem("toolars.currency-converter.plan")).toContain("USD");
  });
});
