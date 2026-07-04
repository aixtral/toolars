import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SmokeFreeWorkspace } from "./smoke-free-workspace";

const smokeFreeSourceFile = "src/app/[locale]/tools/smoke-free/smoke-free-workspace.tsx";

function scanSmokeFreeWorkspaceSource() {
  return scanSourceText(readFileSync(smokeFreeSourceFile, "utf8"), smokeFreeSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "Rastreador de recuperacion centinela",
  title: "Seguimiento sin fumar centinela",
  subtitle: "Mide progreso sin fumar centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    progress: "Progreso centinela",
    tracker: "Rastreador centinela"
  },
  trustRows: {
    local: {
      label: "Local centinela",
      text: "La fecha y supuestos centinela quedan en este navegador."
    },
    health: {
      label: "Salud centinela",
      text: "Los plazos centinela varian por persona."
    },
    private: {
      label: "Privado centinela",
      text: "El guardado centinela queda local."
    }
  },
  inputSection: {
    title: "Entradas de abandono centinela",
    description: "Usa fecha y consumo centinela."
  },
  fields: {
    quitDate: "Fecha de abandono centinela",
    cigarettesPerDay: "Cigarrillos diarios centinela",
    pricePerPack: "Precio por paquete centinela",
    cigarettesPerPack: "Cigarrillos por paquete centinela"
  },
  actions: {
    save: "Guardar plan centinela",
    calculate: "Rastrear recuperacion centinela"
  },
  resultSection: {
    title: "Resumen de recuperacion centinela",
    emptyDescription: "Ejecuta el rastreador centinela.",
    summary: "{days} dias sin fumar centinela",
    startingToday: "Empieza hoy centinela"
  },
  metrics: {
    daysValue: "{days} dias",
    zeroDays: "0 dias",
    smokeFree: "Sin fumar centinela",
    moneySaved: "Dinero ahorrado centinela",
    cigarettesValue: "{count} cigarrillos centinela",
    zeroCigarettes: "0 cigarrillos centinela",
    notSmoked: "No fumados centinela",
    lifeDaysValue: "{days} dias",
    zeroLifeDays: "0.0 dias",
    lifeEstimate: "Vida estimada centinela"
  },
  callout: {
    nextTitle: "Siguiente centinela: {time}",
    waitingTitle: "Esperando linea de tiempo centinela",
    waitingDescription: "Rastrea la recuperacion centinela primero.",
    completeTitle: "Hitos completados centinela",
    completeDescription: "Sigue revisando el progreso centinela."
  },
  milestones: {
    d0: {
      time: "20 minutos centinela",
      message: "La presion empieza a bajar centinela."
    },
    d1: {
      time: "12 horas centinela",
      message: "El monoxido vuelve a normalidad centinela."
    },
    d3: {
      time: "3 dias centinela",
      message: "La nicotina sale del cuerpo centinela."
    },
    d14: {
      time: "2 semanas centinela",
      message: "Mejoran pulmones y circulacion centinela."
    },
    d90: {
      time: "1-3 meses centinela",
      message: "Disminuye la tos centinela."
    },
    d365: {
      time: "1 anio centinela",
      message: "El riesgo cardiaco baja centinela."
    },
    d1825: {
      time: "5 anios centinela",
      message: "El riesgo de derrame baja centinela."
    },
    d3650: {
      time: "10 anios centinela",
      message: "El riesgo de cancer baja centinela."
    },
    d5475: {
      time: "15 anios centinela",
      message: "El riesgo cardiaco se normaliza centinela."
    }
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas de recuperacion centinela",
    notes: {
      days: "Nota de dias centinela.",
      lifeExtension: "Nota de vida centinela.",
      support: "Nota de apoyo centinela."
    }
  },
  recommendation: {
    title: "Local primero centinela",
    body: "Los supuestos centinela quedan privados."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "smoke-free": {
      ...en.tools["smoke-free"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <SmokeFreeWorkspace />
    </NextIntlClientProvider>
  );
}

describe("SmokeFreeWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-19T12:00:00Z"));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSmokeFreeWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.quitDate)).toHaveValue("2026-01-01");
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/smoke-free/about"
    );

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("169 dias sin fumar centinela")).toBeInTheDocument();
    expect(screen.getByText("3,380 cigarrillos centinela")).toBeInTheDocument();
    expect(screen.getByText("Siguiente centinela: 1 anio centinela")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.milestones.d365.message)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc smoke-free workspace sections", () => {
    renderWithIntl(<SmokeFreeWorkspace />);

    expect(screen.getByRole("heading", { name: "Quit Smoking Tracker" })).toBeInTheDocument();
    expect(screen.getByText("Quit inputs")).toBeInTheDocument();
    expect(screen.getByText("Recovery summary")).toBeInTheDocument();
    expect(screen.getByText("Recovery notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Quit date")).toHaveValue("2026-01-01");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/smoke-free/about");
  });

  it("calculates smoke-free progress and saves the quit plan locally", () => {
    renderWithIntl(<SmokeFreeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Track recovery" }));

    expect(screen.getByText("169 days")).toBeInTheDocument();
    expect(screen.getByText("$1,690")).toBeInTheDocument();
    expect(screen.getByText("3,380 cigarettes")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save quit plan" }));

    expect(window.localStorage.getItem("toolars.smoke-free.plan:v1")).toContain("2026-01-01");
  });
});
