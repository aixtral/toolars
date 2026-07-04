import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { BmiCalculatorWorkspace } from "./bmi-calculator-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function scanBmiCalculatorWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/bmi-calculator/bmi-calculator-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("BmiCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanBmiCalculatorWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc BMI workspace sections", () => {
    renderWithIntl(<BmiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "BMI Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Body metrics")).toBeInTheDocument();
    expect(screen.getByText("BMI result")).toBeInTheDocument();
    expect(screen.getByText("Health reference notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("175")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/bmi-calculator/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<BmiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de IMC" })).toBeInTheDocument();
    expect(screen.getByText("Métricas corporales")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/bmi-calculator/about"
    );
    expect(screen.queryByText("Body metrics")).not.toBeInTheDocument();
  });

  it("calculates the default BMI and reference summary", () => {
    renderWithIntl(<BmiCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate BMI" }));

    expect(screen.getByText("22.9")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("56.7-76.3 kg")).toBeInTheDocument();
    expect(screen.getByText("Healthy range")).toBeInTheDocument();
  });

  it("updates the profile and saves it locally", () => {
    renderWithIntl(<BmiCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Weight"), {
      target: { value: "82" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    expect(screen.getByLabelText("Weight")).toHaveValue(82);
    expect(window.localStorage.getItem("toolars.bmi-calculator.profile")).toContain("82");
  });
});
