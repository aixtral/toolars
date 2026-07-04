import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { CarLoanWorkspace } from "./car-loan-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio auto centinela",
  title: "Calculadora de auto centinela",
  subtitle: "Pago e interés centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    loan: "Préstamo centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "El precio y plazo centinela quedan en este navegador."
    },
    estimate: {
      label: "Estimación centinela",
      text: "El préstamo centinela excluye otros costes."
    },
    private: {
      label: "Privado centinela",
      text: "El préstamo centinela se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas de préstamo centinela",
    description: "Usa precio, enganche, tasa y plazo centinela."
  },
  fields: {
    vehiclePrice: "Precio del vehículo centinela",
    downPaymentPercent: "Enganche centinela",
    annualInterestRate: "Interés anual centinela",
    termMonths: "Plazo centinela"
  },
  options: {
    months: "meses centinela"
  },
  actions: {
    save: "Guardar auto centinela",
    calculate: "Calcular auto centinela"
  },
  resultSection: {
    title: "Resumen de coste centinela",
    emptyDescription: "Ejecuta el cálculo centinela."
  },
  metrics: {
    monthlyPayment: "Pago mensual centinela",
    loanAmount: "Monto financiado centinela",
    totalInterest: "Interés total centinela",
    trueCost: "Coste real centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero el coste centinela.",
    calculatedDescription: "{amount} de enganche centinela más pagos."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de propiedad centinela",
    notes: {
      formula: "Nota centinela de fórmula.",
      downPayment: "Nota centinela de enganche.",
      ownership: "Nota centinela de coste total."
    }
  },
  caveat: {
    title: "Advertencia auto centinela",
    body: "Compara divulgaciones centinela antes de elegir plazo."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "car-loan": {
      ...en.tools["car-loan"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <CarLoanWorkspace />
    </NextIntlClientProvider>
  );
}

describe("CarLoanWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.vehiclePrice)).toHaveValue(25000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/car-loan/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc car loan workspace sections", () => {
    renderWithIntl(<CarLoanWorkspace />);

    expect(screen.getByRole("heading", { name: "Car Loan Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Vehicle loan inputs")).toBeInTheDocument();
    expect(screen.getByText("Loan cost summary")).toBeInTheDocument();
    expect(screen.getByText("Ownership notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Vehicle price")).toHaveValue(25000);
    expect(screen.getByLabelText("Loan term")).toHaveValue("60");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/car-loan/about"
    );
  });

  it("calculates the default car loan estimate and saves assumptions locally", () => {
    renderWithIntl(<CarLoanWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate car loan" }));

    expect(screen.getByText("$377")).toBeInTheDocument();
    expect(screen.getByText("$20,000")).toBeInTheDocument();
    expect(screen.getByText("$2,645")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save car loan" }));

    expect(window.localStorage.getItem("toolars.car-loan.plan")).toContain("25000");
  });
});
