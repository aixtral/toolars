import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { TipCalculatorWorkspace } from "./tip-calculator-workspace";

const tipCalculatorSourceFile = "src/app/[locale]/tools/tip-calculator/tip-calculator-workspace.tsx";

function scanTipCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(tipCalculatorSourceFile, "utf8"), tipCalculatorSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Espacio propina centinela",
  title: "Calculadora de propina centinela",
  subtitle: "Propina y reparto centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    tip: "Propina centinela",
    people: "{people} personas centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "Cuenta y grupo centinela locales."
    },
    reference: {
      label: "Referencia centinela",
      text: "Normas de propina centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Reparto guardado centinela."
    }
  },
  inputSection: {
    title: "Entradas de propina centinela",
    description: "Usa una cuenta centinela."
  },
  fields: {
    billAmount: "Cuenta centinela",
    tipPercent: "Porcentaje centinela",
    people: "Personas centinela"
  },
  actions: {
    save: "Guardar reparto centinela",
    calculate: "Calcular propina centinela"
  },
  resultSection: {
    title: "Resumen de propina centinela",
    emptyDescription: "Ejecuta cálculo centinela.",
    summary: "{percent} propina centinela para {people} personas"
  },
  metrics: {
    totalBill: "Total centinela",
    tipAmount: "Propina centinela",
    originalBill: "Cuenta original centinela",
    perPerson: "Por persona centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    calculatedDescription: "Comparte el total centinela con el grupo."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de propina centinela",
    notes: {
      formula: "Fórmula centinela.",
      split: "Reparto centinela.",
      tax: "Impuesto centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Sin recibo centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "tip-calculator": {
      ...en.tools["tip-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <TipCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("TipCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanTipCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.billAmount)).toHaveValue(85.5);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/tip-calculator/about"
    );

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getAllByText("18% propina centinela para 2 personas").length).toBeGreaterThan(0);
    expect(screen.getByText(localizedWorkspaceCopy.callout.calculatedDescription)).toBeInTheDocument();
    expect(screen.getByText("2 personas centinela")).toBeInTheDocument();
  });

  it("renders the local VitalCalc tip workspace sections", () => {
    renderWithIntl(<TipCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Tip Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Tip inputs")).toBeInTheDocument();
    expect(screen.getByText("Tip and split summary")).toBeInTheDocument();
    expect(screen.getByText("Tipping notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Bill amount")).toHaveValue(85.5);
    expect(screen.getByLabelText("Tip percent")).toHaveValue(18);
    expect(screen.getByLabelText("People")).toHaveValue(2);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/tip-calculator/about"
    );
  });

  it("calculates the default tip split and saves assumptions locally", () => {
    renderWithIntl(<TipCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate tip" }));

    expect(screen.getByText("$100.89")).toBeInTheDocument();
    expect(screen.getByText("$15.39")).toBeInTheDocument();
    expect(screen.getByText("$50.45")).toBeInTheDocument();
    expect(screen.getAllByText("18% tip across 2 people").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save split" }));

    expect(window.localStorage.getItem("toolars.tip-calculator.plan")).toContain("85.5");
  });
});
