import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { HomaIrWorkspace } from "./homa-ir-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Espacio laboratorio centinela",
  title: "Calculadora HOMA centinela",
  subtitle: "Referencia insulina centinela.",
  modelTitle: "Modelo local centinela",
  detailsLink: "Detalles centinela",
  badges: {
    local: "Local centinela",
    reference: "Referencia centinela"
  },
  trustRows: {
    local: {
      label: "Confianza local",
      text: "Valores laboratorio centinela local."
    },
    lab: {
      label: "Laboratorio centinela",
      text: "Bandas centinela variables."
    },
    private: {
      label: "Privado centinela",
      text: "Muestra centinela local."
    }
  },
  inputSection: {
    title: "Entradas laboratorio centinela",
    description: "Glucosa e insulina centinela."
  },
  fields: {
    fastingGlucose: "Glucosa ayunas centinela",
    glucoseUnit: "Unidad glucosa centinela",
    fastingInsulin: "Insulina ayunas centinela",
    insulinUnit: "Unidad insulina centinela"
  },
  actions: {
    save: "Guardar laboratorio centinela",
    calculate: "Calcular HOMA centinela"
  },
  resultSection: {
    title: "Resumen resistencia centinela",
    emptyDescription: "Ejecuta cálculo centinela.",
    summary: "{homaIr} HOMA-IR - {level}"
  },
  metrics: {
    homaIr: "HOMA centinela",
    pending: "Pendiente centinela",
    range: "Rango centinela",
    glucose: "Glucosa resultado centinela",
    insulin: "Insulina resultado centinela"
  },
  callout: {
    waitingTitle: "Esperando cálculo centinela",
    waitingDescription: "Calcula primero centinela."
  },
  levels: {
    normal: {
      label: "Normal centinela",
      interpretation: "Interpretación normal centinela."
    },
    borderline: {
      label: "Límite centinela",
      interpretation: "Interpretación límite centinela."
    },
    resistance: {
      label: "Resistencia centinela",
      interpretation: "Interpretación resistencia centinela."
    }
  },
  review: {
    eyebrow: "Lista centinela",
    title: "Notas HOMA centinela",
    notes: {
      formula: "Nota fórmula centinela.",
      bands: "Nota bandas centinela.",
      screening: "Nota screening centinela."
    }
  },
  caveat: {
    title: "Local primero centinela",
    body: "Interpretación clínica centinela."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "homa-ir": {
      ...en.tools["homa-ir"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <HomaIrWorkspace />
    </NextIntlClientProvider>
  );
}

function scanHomaIrWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/homa-ir/homa-ir-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("HomaIrWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanHomaIrWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.fastingGlucose)).toHaveValue(5.5);
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/homa-ir/about"
    );
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("2.93 HOMA-IR - Resistencia centinela")).toBeInTheDocument();
    expect(screen.getAllByText(localizedWorkspaceCopy.levels.resistance.label).length).toBeGreaterThan(0);
    expect(screen.getByText(localizedWorkspaceCopy.levels.resistance.interpretation)).toBeInTheDocument();
  });

  it("renders the local VitalCalc HOMA-IR workspace sections", () => {
    renderWithIntl(<HomaIrWorkspace />);

    expect(screen.getByRole("heading", { name: "HOMA-IR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lab inputs")).toBeInTheDocument();
    expect(screen.getByText("Insulin resistance summary")).toBeInTheDocument();
    expect(screen.getByText("HOMA-IR notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fasting glucose")).toHaveValue(5.5);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/homa-ir/about");
  });

  it("calculates the default HOMA-IR result and saves lab values locally", () => {
    renderWithIntl(<HomaIrWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate HOMA-IR" }));

    expect(screen.getByText("2.93")).toBeInTheDocument();
    expect(screen.getAllByText("Insulin Resistance").length).toBeGreaterThan(0);
    expect(screen.getByText("5.5 mmol/L")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lab values" }));

    expect(window.localStorage.getItem("toolars.homa-ir.labs:v1")).toContain("5.5");
  });
});
