import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BillSplitCalculatorWorkspace } from "./bill-split-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio cuenta centinela",
  title: "Calculadora de cuenta centinela",
  subtitle: "División centinela de gastos.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    split: "División centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Cuenta centinela local."
    },
    agreement: {
      label: "Acuerdo centinela",
      text: "Confirmación centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Plan centinela local."
    }
  },
  inputSection: {
    title: "Entradas de cuenta centinela",
    description: "Subtotal y propina centinela."
  },
  fields: {
    subtotal: "Subtotal centinela",
    people: "Personas centinela",
    tipPercent: "Propina centinela",
    taxPercent: "Impuesto centinela",
    splitMode: "Modo centinela",
    equal: "Igual centinela",
    itemized: "Itemizado centinela"
  },
  actions: {
    save: "Guardar cuenta centinela",
    calculate: "Calcular división centinela"
  },
  resultSection: {
    title: "Resumen grupo centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    grandTotal: "Total centinela",
    equalShare: "Parte centinela",
    fees: "Cargos centinela",
    subtotal: "Subtotal resultado centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas división centinela",
    notes: {
      total: "Nota centinela total.",
      equal: "Nota centinela igual.",
      itemized: "Nota centinela itemizada."
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
    "bill-split-calculator": {
      ...en.tools["bill-split-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <BillSplitCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("BillSplitCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.subtotal)).toHaveValue(120);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc bill split workspace sections", () => {
    renderWithIntl(<BillSplitCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Bill Split Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Bill inputs")).toBeInTheDocument();
    expect(screen.getByText("Group split summary")).toBeInTheDocument();
    expect(screen.getByText("Split notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtotal")).toHaveValue(120);
    expect(screen.getByLabelText("People")).toHaveValue(4);
    expect(screen.getByLabelText("Tip percent")).toHaveValue(18);
    expect(screen.getByLabelText("Tax percent")).toHaveValue(8.25);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/bill-split-calculator/about"
    );
  });

  it("calculates the default split and saves assumptions locally", () => {
    renderWithIntl(<BillSplitCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate split" }));

    expect(screen.getByText("$151.50")).toBeInTheDocument();
    expect(screen.getByText("$37.88")).toBeInTheDocument();
    expect(screen.getByText("$31.50")).toBeInTheDocument();
    expect(screen.getAllByText("4 people, 18% tip, 8.25% tax").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save bill" }));

    expect(window.localStorage.getItem("toolars.bill-split-calculator.plan")).toContain("120");
  });
});
