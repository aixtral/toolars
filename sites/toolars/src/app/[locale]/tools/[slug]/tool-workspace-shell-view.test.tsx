import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { getToolDetailBySlug } from "@/data/tool-details";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { ToolWorkspaceShellView } from "./tool-workspace-shell-view";

const toolWorkspaceShellSourceFile = "src/app/[locale]/tools/[slug]/tool-workspace-shell-view.tsx";

function scanToolWorkspaceShellSource() {
  return scanSourceText(readFileSync(toolWorkspaceShellSourceFile, "utf8"), toolWorkspaceShellSourceFile);
}

function renderWithSpanishIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("ToolWorkspaceShellView", () => {
  it("keeps the workspace shell source clear of i18n audit candidates", () => {
    const sourceScan = scanToolWorkspaceShellSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders a source-backed VitalCalc workspace handoff", () => {
    const detail = getToolDetailBySlug("loan-calculator");
    if (!detail) throw new Error("missing loan detail");

    const { container } = renderWithIntl(<ToolWorkspaceShellView detail={detail} />);

    expect(container.querySelector('[data-tool-workspace-shell="loan-calculator"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loan Calculator workspace" })).toBeInTheDocument();
    expect(screen.getByText("Full calculator path")).toBeInTheDocument();
    expect(screen.getByText("Related tools")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/loan-calculator/about"
    );
  });

  it("does not show static migration metadata as workspace metrics", () => {
    const detail = getToolDetailBySlug("loan-calculator");
    if (!detail) throw new Error("missing loan detail");

    const { container } = renderWithIntl(<ToolWorkspaceShellView detail={detail} />);

    expect(container.querySelector(".tool-workspace-metric-grid")).not.toBeInTheDocument();
  });

  it("renders AI Lab handoff context and workflow links", () => {
    const detail = getToolDetailBySlug("prompt-injection-scanner");
    if (!detail) throw new Error("missing prompt scanner detail");

    renderWithIntl(<ToolWorkspaceShellView detail={detail} />);

    expect(screen.getByRole("heading", { name: "Prompt Injection Scanner workspace" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open recommended workflow/ })).toHaveAttribute(
      "href",
      "/workflows/ai-prompt-hardening"
    );
  });

  it("localizes generic shell labels and internal hrefs for Spanish", () => {
    const detail = getToolDetailBySlug("loan-calculator");
    if (!detail) throw new Error("missing loan detail");

    renderWithSpanishIntl(<ToolWorkspaceShellView detail={detail} />);

    expect(screen.getByText("Ruta completa de calculadora")).toBeInTheDocument();
    expect(screen.getByText("Herramientas relacionadas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/loan-calculator/about"
    );
    expect(screen.getByRole("link", { name: /Mortgage Calculator/ })).toHaveAttribute(
      "href",
      "/es/tools/mortgage-calculator/about"
    );
  });

  it("localizes the recommended workflow link for Spanish", () => {
    const detail = getToolDetailBySlug("prompt-injection-scanner");
    if (!detail) throw new Error("missing prompt scanner detail");

    renderWithSpanishIntl(<ToolWorkspaceShellView detail={detail} />);

    expect(screen.getByRole("link", { name: "Abrir flujo recomendado" })).toHaveAttribute(
      "href",
      "/es/workflows/ai-prompt-hardening"
    );
  });
});
