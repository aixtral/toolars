import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { SleepCalculatorWorkspace } from "./sleep-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio sueño centinela",
  title: "Calculadora de sueño centinela",
  subtitle: "Horario centinela de ciclos.",
  modelTitle: "Modelo horario centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    cycle: "Ciclo centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Horario centinela local."
    },
    gentle: {
      label: "Guía centinela",
      text: "Objetivo suave centinela."
    },
    private: {
      label: "Privado centinela",
      text: "Plan centinela local."
    }
  },
  inputSection: {
    title: "Entradas de sueño centinela",
    description: "Configura ciclos centinela."
  },
  fields: {
    mode: "Modo centinela",
    wakeup: "Acostarse centinela",
    bedtime: "Despertar centinela",
    mainTime: "Hora principal centinela",
    latency: "Latencia centinela",
    cycleLength: "Ciclo centinela",
    caffeineCutoff: "Cafeína centinela",
    screenCutoff: "Pantalla centinela"
  },
  actions: {
    save: "Guardar sueño centinela",
    calculate: "Calcular sueño centinela"
  },
  resultSection: {
    title: "Resultado sueño centinela",
    emptyDescription: "Ejecuta cálculo centinela."
  },
  metrics: {
    primaryTime: "Hora primaria centinela",
    caffeineCutoff: "Corte cafeína centinela",
    screenCutoff: "Corte pantalla centinela",
    morningLight: "Luz mañana centinela"
  },
  options: {
    cycles: "{cycles} ciclos centinela",
    asleep: "{hours}h dormido centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela.",
    dinnerCutoff: "Cena centinela: {time}"
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de sueño centinela",
    notes: {
      cycles: "Nota centinela de ciclos.",
      defaultModel: "Nota centinela de modelo.",
      cutoffs: "Nota centinela de cortes."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Guía suave centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "sleep-calculator": {
      ...en.tools["sleep-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <SleepCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("SleepCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.mainTime)).toHaveValue("07:00");
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc sleep workspace sections", () => {
    renderWithIntl(<SleepCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Sleep Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Sleep inputs")).toBeInTheDocument();
    expect(screen.getByText("Sleep result")).toBeInTheDocument();
    expect(screen.getByText("Sleep notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Main time")).toHaveValue("07:00");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/sleep-calculator/about");
  });

  it("calculates the default bedtime and saves the sleep plan locally", () => {
    renderWithIntl(<SleepCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate sleep time" }));

    expect(screen.getAllByText("21:45").length).toBeGreaterThan(0);
    expect(screen.getByText("11:45")).toBeInTheDocument();
    expect(screen.getByText("20:45")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save sleep plan" }));

    expect(window.localStorage.getItem("toolars.sleep-calculator.plan:v1")).toContain("\"mainTime\":\"07:00\"");
  });
});
