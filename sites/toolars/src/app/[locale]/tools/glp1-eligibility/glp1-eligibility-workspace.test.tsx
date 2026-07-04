import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { Glp1EligibilityWorkspace } from "./glp1-eligibility-workspace";

const glp1EligibilitySourceFile = "src/app/[locale]/tools/glp1-eligibility/glp1-eligibility-workspace.tsx";

function scanGlp1EligibilityWorkspaceSource() {
  return scanSourceText(readFileSync(glp1EligibilitySourceFile, "utf8"), glp1EligibilitySourceFile);
}

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("Glp1EligibilityWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanGlp1EligibilityWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc GLP-1 eligibility workspace sections", () => {
    renderWithIntl(<Glp1EligibilityWorkspace />);

    expect(screen.getByRole("heading", { name: "GLP-1 Eligibility Check" })).toBeInTheDocument();
    expect(screen.getByText("Eligibility inputs")).toBeInTheDocument();
    expect(screen.getByText("Criteria result")).toBeInTheDocument();
    expect(screen.getByText("Prescription notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Height (cm)")).toHaveValue(170);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/glp1-eligibility/about");
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<Glp1EligibilityWorkspace />);

    expect(screen.getByRole("heading", { name: "Verificación de elegibilidad GLP-1" })).toBeInTheDocument();
    expect(screen.getByText("Datos de elegibilidad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revisar criterios comunes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/glp1-eligibility/about"
    );
    expect(screen.queryByText("Eligibility inputs")).not.toBeInTheDocument();
  });

  it("calculates criteria status and saves the local eligibility snapshot", () => {
    renderWithIntl(<Glp1EligibilityWorkspace />);

    fireEvent.click(screen.getByLabelText("Hypertension"));
    fireEvent.click(screen.getByRole("button", { name: "Check common criteria" }));

    expect(screen.getByText("29.4")).toBeInTheDocument();
    expect(screen.getByText("Common criteria match")).toBeInTheDocument();
    expect(screen.getByText("1 selected")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save eligibility snapshot" }));

    expect(window.localStorage.getItem("toolars.glp1-eligibility.snapshot:v1")).toContain("\"heightCm\":170");
  });
});
