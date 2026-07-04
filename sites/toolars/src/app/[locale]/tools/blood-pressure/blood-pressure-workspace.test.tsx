import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import es from "../../../../../messages/es.json";
import { BloodPressureWorkspace } from "./blood-pressure-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function scanBloodPressureWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/blood-pressure/blood-pressure-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("BloodPressureWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanBloodPressureWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc blood pressure workspace sections", () => {
    renderWithIntl(<BloodPressureWorkspace />);

    expect(screen.getByRole("heading", { name: "Blood Pressure Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Reading inputs")).toBeInTheDocument();
    expect(screen.getByText("Blood pressure summary")).toBeInTheDocument();
    expect(screen.getByText("Blood pressure notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Systolic")).toHaveValue(120);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/blood-pressure/about");
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<BloodPressureWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de presión arterial" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de lectura")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/blood-pressure/about");
    expect(screen.queryByText("Reading inputs")).not.toBeInTheDocument();
  });

  it("classifies the default reading and saves it locally", () => {
    renderWithIntl(<BloodPressureWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Classify blood pressure" }));

    expect(screen.getByText("Stage 1")).toBeInTheDocument();
    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("Systolic 130-139 or diastolic 80-89.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save reading" }));

    expect(window.localStorage.getItem("toolars.blood-pressure.reading")).toContain("120");
  });
});
