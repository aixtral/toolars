import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { UnitConverterWorkspace } from "./unit-converter-workspace";

const unitConverterSourceFile = "src/app/[locale]/tools/unit-converter/unit-converter-workspace.tsx";

function scanUnitConverterWorkspaceSource() {
  return scanSourceText(readFileSync(unitConverterSourceFile, "utf8"), unitConverterSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("UnitConverterWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanUnitConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc unit converter workspace sections", () => {
    renderWithIntl(<UnitConverterWorkspace />);

    expect(screen.getByRole("heading", { name: "Unit Converter" })).toBeInTheDocument();
    expect(screen.getByText("Conversion inputs")).toBeInTheDocument();
    expect(screen.getAllByText("Converted value").length).toBeGreaterThan(0);
    expect(screen.getByText("Precision notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Value")).toHaveValue(5);
    expect(screen.getByLabelText("From unit")).toHaveValue("km");
    expect(screen.getByLabelText("To unit")).toHaveValue("mi");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/unit-converter/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<UnitConverterWorkspace />);

    expect(screen.getByRole("heading", { name: "Conversor de unidades" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de conversión")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toHaveValue(5);
    expect(screen.getByRole("button", { name: "Convertir unidades" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/unit-converter/about"
    );
    expect(screen.queryByText("Conversion inputs")).not.toBeInTheDocument();
  });

  it("converts the default value and saves assumptions locally", () => {
    renderWithIntl(<UnitConverterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Convert units" }));

    expect(screen.getByText("3.106856")).toBeInTheDocument();
    expect(screen.getByText("Target unit mi")).toBeInTheDocument();
    expect(screen.getByText("1 mi = 1.60934 km")).toBeInTheDocument();
    expect(screen.getByText("5 km to mi")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save conversion" }));

    expect(window.localStorage.getItem("toolars.unit-converter.plan")).toContain("km");
  });
});
