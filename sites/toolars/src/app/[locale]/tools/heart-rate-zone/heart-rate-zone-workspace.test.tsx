import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { HeartRateZoneWorkspace } from "./heart-rate-zone-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function scanHeartRateZoneWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/heart-rate-zone/heart-rate-zone-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("HeartRateZoneWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanHeartRateZoneWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc heart rate zone workspace sections", () => {
    renderWithIntl(<HeartRateZoneWorkspace />);

    expect(screen.getByRole("heading", { name: "Heart Rate Zone Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Training inputs")).toBeInTheDocument();
    expect(screen.getByText("Zone result")).toBeInTheDocument();
    expect(screen.getByText("Measurement notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Age")).toHaveValue(30);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/heart-rate-zone/about");
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<HeartRateZoneWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de zonas de frecuencia cardíaca" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de entrenamiento")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/heart-rate-zone/about");
    expect(screen.queryByText("Training inputs")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Calcular zonas" }));

    expect(screen.getByText("190 lpm")).toBeInTheDocument();
    expect(screen.getAllByText("Quema de grasa").length).toBeGreaterThan(0);
    expect(screen.queryByText("Fat Burn")).not.toBeInTheDocument();
  });

  it("calculates zones and saves the training profile locally", () => {
    renderWithIntl(<HeartRateZoneWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate zones" }));

    expect(screen.getByText("190 bpm")).toBeInTheDocument();
    expect(screen.getByText(/125 - 138 bpm/)).toBeInTheDocument();
    expect(screen.getAllByText(/177 - 190 bpm/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save zone profile" }));

    expect(window.localStorage.getItem("toolars.heart-rate-zone.profile:v1")).toContain("\"age\":30");
  });
});
