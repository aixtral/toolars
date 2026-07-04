import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { HourlyToSalaryWorkspace } from "./hourly-to-salary-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio salario centinela",
  title: "Calculadora salario centinela",
  subtitle: "Conversión salario centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    pay: "Pago centinela",
    grossPay: "Pago bruto centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Supuestos salario centinela local."
    },
    gross: {
      label: "Bruto centinela",
      text: "Resultado bruto centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Guardado salario centinela."
    }
  },
  inputSection: {
    title: "Entradas salario centinela",
    description: "Ajusta tarifa centinela."
  },
  fields: {
    hourlyRate: "Tarifa hora centinela",
    hoursPerWeek: "Horas semana centinela",
    weeksPerYear: "Semanas año centinela",
    overtimeHours: "Horas extra centinela",
    overtimeMultiplier: "Multiplicador centinela"
  },
  options: {
    none: "Ninguno centinela"
  },
  actions: {
    save: "Guardar salario centinela",
    calculate: "Calcular salario centinela"
  },
  resultSection: {
    title: "Estimación salario centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    annualSalary: "Salario anual centinela",
    monthlySalary: "Salario mensual centinela",
    weeklySalary: "Salario semanal centinela",
    overtimePay: "Pago extra centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    grossPayCaveat: "Pago bruto centinela tras cálculo."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas salario centinela",
    notes: {
      formula: "Nota fórmula centinela.",
      overtime: "Nota extra centinela.",
      compare: "Nota comparación centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Supuestos salario centinela local."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "hourly-to-salary": {
      ...en.tools["hourly-to-salary"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <HourlyToSalaryWorkspace />
    </NextIntlClientProvider>
  );
}

describe("HourlyToSalaryWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.hourlyRate)).toHaveValue(25);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getAllByText(localizedWorkspaceCopy.caveat.body).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/hourly-to-salary/about"
    );
  });

  it("renders the local VitalCalc hourly to salary workspace sections", () => {
    renderWithIntl(<HourlyToSalaryWorkspace />);

    expect(screen.getByRole("heading", { name: "Hourly to Salary Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Wage inputs")).toBeInTheDocument();
    expect(screen.getByText("Salary estimate")).toBeInTheDocument();
    expect(screen.getByText("Gross pay notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Hourly rate")).toHaveValue(25);
    expect(screen.getByLabelText("Hours per week")).toHaveValue(40);
    expect(screen.getByLabelText("Weeks per year")).toHaveValue(52);
    expect(screen.getByLabelText("Overtime multiplier")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/hourly-to-salary/about"
    );
  });

  it("calculates the default salary estimate and saves assumptions locally", () => {
    renderWithIntl(<HourlyToSalaryWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate salary" }));

    expect(screen.getByText("$52,000")).toBeInTheDocument();
    expect(screen.getByText("$4,333")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getAllByText("$25.00 x 40 hours/week x 52 weeks").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save salary" }));

    expect(window.localStorage.getItem("toolars.hourly-to-salary.plan")).toContain("25");
  });
});
