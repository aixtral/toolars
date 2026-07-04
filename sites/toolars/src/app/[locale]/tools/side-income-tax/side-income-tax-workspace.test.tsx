import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { SideIncomeTaxWorkspace } from "./side-income-tax-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio fiscal centinela",
  title: "Calculadora fiscal secundaria centinela",
  subtitle: "Estimación fiscal centinela para ingresos extra.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    tax: "Impuesto centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Los ingresos centinela permanecen en este navegador."
    },
    taxEstimate: {
      label: "Estimación centinela",
      text: "La salida centinela no es asesoría fiscal."
    },
    private: {
      label: "Privado centinela",
      text: "El cálculo centinela se guarda localmente."
    }
  },
  inputSection: {
    title: "Entradas fiscales centinela",
    description: "Usa salario, gastos y estado centinela."
  },
  fields: {
    salary: "Salario W-2 centinela",
    sideIncome: "Ingreso secundario centinela",
    businessExpenses: "Gastos centinela",
    retirementContribution: "Retiro centinela",
    filingStatus: "Estado fiscal centinela",
    stateTaxRate: "Tasa estatal centinela"
  },
  filingStatuses: {
    single: "Soltero centinela",
    mfj: "Conjunto centinela",
    mfs: "Separado centinela",
    hoh: "Jefe hogar centinela"
  },
  actions: {
    save: "Guardar impuesto centinela",
    calculate: "Calcular impuesto centinela"
  },
  resultSection: {
    title: "Resumen fiscal centinela",
    emptyDescription: "Ejecuta el cálculo fiscal centinela."
  },
  metrics: {
    selfEmploymentTax: "Autoempleo centinela",
    federalAndStateTax: "Federal y estatal centinela",
    effectiveTaxRate: "Tasa efectiva centinela",
    quarterlyPayment: "Pago trimestral centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero el ingreso imponible centinela.",
    calculatedDescription: "{amount} ingreso neto centinela tras gastos."
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas fiscales centinela",
    notes: {
      selfEmployment: "Nota centinela de autoempleo.",
      deductions: "Nota centinela de deducciones.",
      filing: "Nota centinela de declaración."
    }
  },
  caveat: {
    title: "Advertencia fiscal centinela",
    body: "Usa formularios oficiales centinela antes de presentar."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "side-income-tax": {
      ...en.tools["side-income-tax"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <SideIncomeTaxWorkspace />
    </NextIntlClientProvider>
  );
}

describe("SideIncomeTaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.salary)).toHaveValue(80000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/side-income-tax/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc side-income tax workspace sections", () => {
    renderWithIntl(<SideIncomeTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Side Income Tax Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Side income inputs")).toBeInTheDocument();
    expect(screen.getByText("Tax estimate summary")).toBeInTheDocument();
    expect(screen.getByText("Tax planning notes")).toBeInTheDocument();
    expect(screen.getByLabelText("W-2 salary")).toHaveValue(80000);
    expect(screen.getByLabelText("Side income")).toHaveValue(30000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/side-income-tax/about"
    );
  });

  it("calculates the default side-income estimate and saves assumptions locally", () => {
    renderWithIntl(<SideIncomeTaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate side tax" }));

    expect(screen.getByText("$3,532")).toBeInTheDocument();
    expect(screen.getByText("$17,264")).toBeInTheDocument();
    expect(screen.getByText("19.8%")).toBeInTheDocument();
    expect(screen.getByText("$5,199")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save tax estimate" }));

    expect(window.localStorage.getItem("toolars.side-income-tax.plan")).toContain("30000");
  });
});
