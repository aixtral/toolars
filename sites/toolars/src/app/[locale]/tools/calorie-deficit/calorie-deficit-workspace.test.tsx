import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { CalorieDeficitWorkspace } from "./calorie-deficit-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function scanCalorieDeficitWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/calorie-deficit/calorie-deficit-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("CalorieDeficitWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanCalorieDeficitWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc calorie deficit workspace sections", () => {
    renderWithIntl(<CalorieDeficitWorkspace />);

    expect(screen.getByRole("heading", { name: "Calorie Deficit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Weight-loss inputs")).toBeInTheDocument();
    expect(screen.getByText("Calorie target result")).toBeInTheDocument();
    expect(screen.getByText("Deficit notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2200")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/calorie-deficit/about"
    );
  });

  it("renders Spanish workspace copy with a localized details link", () => {
    renderWithSpanish(<CalorieDeficitWorkspace />);

    expect(screen.getByRole("heading", { name: "Calculadora de déficit calórico" })).toBeInTheDocument();
    expect(screen.getByText("Entradas de pérdida de peso")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calcular déficit" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/calorie-deficit/about"
    );
    expect(screen.queryByText("Weight-loss inputs")).not.toBeInTheDocument();
  });

  it("calculates daily intake and saves the deficit plan locally", () => {
    renderWithIntl(<CalorieDeficitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate deficit" }));

    expect(screen.getByText("1,650 kcal")).toBeInTheDocument();
    expect(screen.getByText("550 kcal")).toBeInTheDocument();
    expect(screen.getByText("10 weeks")).toBeInTheDocument();
    expect(screen.getByText("5.0 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save deficit plan" }));

    expect(window.localStorage.getItem("toolars.calorie-deficit.plan")).toContain("2200");
  });
});
