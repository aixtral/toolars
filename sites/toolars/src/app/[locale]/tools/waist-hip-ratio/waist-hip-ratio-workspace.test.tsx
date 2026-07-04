import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { WaistHipRatioWorkspace } from "./waist-hip-ratio-workspace";

const waistHipRatioSourceFile = "src/app/[locale]/tools/waist-hip-ratio/waist-hip-ratio-workspace.tsx";

function scanWaistHipRatioWorkspaceSource() {
  return scanSourceText(readFileSync(waistHipRatioSourceFile, "utf8"), waistHipRatioSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("WaistHipRatioWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanWaistHipRatioWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc waist-hip ratio workspace sections", () => {
    renderWithIntl(<WaistHipRatioWorkspace />);

    expect(screen.getByRole("heading", { name: "Waist-to-Hip Ratio Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Measurement inputs")).toBeInTheDocument();
    expect(screen.getByText("WHR summary")).toBeInTheDocument();
    expect(screen.getByText("WHR notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Waist (cm)")).toHaveValue(80);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/waist-hip-ratio/about");
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<WaistHipRatioWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de relación cintura-cadera" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de medidas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/waist-hip-ratio/about");
    expect(screen.queryByText("Measurement inputs")).not.toBeInTheDocument();
  });

  it("calculates the default WHR and saves assumptions locally", () => {
    renderWithIntl(<WaistHipRatioWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate WHR" }));

    expect(screen.getByText("0.84")).toBeInTheDocument();
    expect(screen.getByText("Low Risk")).toBeInTheDocument();
    expect(screen.getByText("80 cm")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save measurements" }));

    expect(window.localStorage.getItem("toolars.waist-hip-ratio.measurements")).toContain("80");
  });
});
