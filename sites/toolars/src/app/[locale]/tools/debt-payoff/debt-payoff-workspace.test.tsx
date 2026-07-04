import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { DebtPayoffWorkspace } from "./debt-payoff-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio deuda centinela",
  title: "Calculadora deuda centinela",
  subtitle: "Plan de pago centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    debtPlan: "Plan deuda centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Supuestos deuda centinela local."
    },
    reference: {
      label: "Referencia centinela",
      text: "Plan centinela de una deuda."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado centinela local."
    }
  },
  inputSection: {
    title: "Entradas deuda centinela",
    description: "Ajusta saldo centinela."
  },
  fields: {
    totalDebt: "Deuda total centinela",
    annualInterestRate: "Interés anual centinela",
    monthlyPayment: "Pago mensual centinela",
    strategy: "Estrategia centinela",
    avalanche: "Avalancha centinela",
    snowball: "Bola de nieve centinela"
  },
  actions: {
    save: "Guardar plan centinela",
    calculate: "Calcular pago centinela"
  },
  resultSection: {
    title: "Resumen pago centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    monthsToPayoff: "Meses centinela",
    zeroMonths: "0 meses centinela",
    totalInterest: "Interés centinela",
    totalPaid: "Pagado centinela",
    strategy: "Estrategia resultado centinela",
    avalanche: "Avalancha resultado centinela",
    snowball: "Bola de nieve resultado centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    firstMonthPrincipal: "Principal centinela {principal} e interés {interest}"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas deuda centinela",
    notes: {
      loop: "Nota centinela de bucle.",
      principal: "Nota centinela de principal.",
      strategy: "Nota centinela de estrategia."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Sin datos prestamista centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "debt-payoff": {
      ...en.tools["debt-payoff"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <DebtPayoffWorkspace />
    </NextIntlClientProvider>
  );
}

describe("DebtPayoffWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.totalDebt)).toHaveValue(10000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc debt payoff workspace sections", () => {
    renderWithIntl(<DebtPayoffWorkspace />);

    expect(screen.getByRole("heading", { name: "Debt Payoff Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Debt inputs")).toBeInTheDocument();
    expect(screen.getByText("Payoff summary")).toBeInTheDocument();
    expect(screen.getByText("Debt payoff notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("18")).toBeInTheDocument();
    expect(screen.getByDisplayValue("300")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/debt-payoff/about"
    );
  });

  it("calculates the default payoff schedule and saves assumptions locally", () => {
    renderWithIntl(<DebtPayoffWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate payoff" }));

    expect(screen.getByText("47 months")).toBeInTheDocument();
    expect(screen.getByText("$3,967")).toBeInTheDocument();
    expect(screen.getByText("$13,967")).toBeInTheDocument();
    expect(screen.getByText("Month 1 principal $150 + interest $150")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save payoff plan" }));

    expect(window.localStorage.getItem("toolars.debt-payoff.plan")).toContain("10000");
  });
});
