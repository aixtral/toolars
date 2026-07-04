import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { LeanBodyMassWorkspace } from "./lean-body-mass-workspace";

const leanBodyMassSourceFile = "src/app/[locale]/tools/lean-body-mass/lean-body-mass-workspace.tsx";

function scanLeanBodyMassWorkspaceSource() {
  return scanSourceText(readFileSync(leanBodyMassSourceFile, "utf8"), leanBodyMassSourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("LeanBodyMassWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanLeanBodyMassWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc lean body mass workspace sections", () => {
    renderWithIntl(<LeanBodyMassWorkspace />);

    expect(screen.getByRole("heading", { name: "Lean Body Mass Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Composition inputs")).toBeInTheDocument();
    expect(screen.getByText("Lean mass result")).toBeInTheDocument();
    expect(screen.getByText("Composition notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/lean-body-mass/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<LeanBodyMassWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de masa corporal magra" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de composición")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute("href", "/es/tools/lean-body-mass/about");
    expect(screen.queryByText("Composition inputs")).not.toBeInTheDocument();
  });

  it("calculates lean mass and saves composition assumptions locally", () => {
    renderWithIntl(<LeanBodyMassWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate lean mass" }));

    expect(screen.getByText("56.0 kg")).toBeInTheDocument();
    expect(screen.getByText("14.0 kg")).toBeInTheDocument();
    expect(screen.getByText("80.0%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save composition" }));

    expect(window.localStorage.getItem("toolars.lean-body-mass.composition")).toContain("20");
  });
});
