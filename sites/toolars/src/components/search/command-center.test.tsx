import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import es from "../../../messages/es.json";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CommandCenter } from "./command-center";

function renderWithSpanishIntl(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="es" messages={es}>{ui}</NextIntlClientProvider>);
}

function scanCommandCenterI18nCandidates() {
  const source = readFileSync("src/components/search/command-center.tsx", "utf8");
  const candidates: string[] = [];
  const attributePattern = /\b(aria-label|placeholder|title|alt)=["']([^"']+)["']/g;
  const textNodePattern = />\s*([^<>{}][^<>{}]*?)\s*</g;
  const hrefPattern = /\bhref=["'](\/(?!\/|#)[^"']*)["']/g;

  for (const match of source.matchAll(attributePattern)) {
    const text = normalizeAuditText(match[2]);
    if (isLikelyHardcodedEnglish(text)) candidates.push(`${match[1]}:${text}`);
  }

  for (const match of source.matchAll(textNodePattern)) {
    const text = normalizeAuditText(match[1]);
    if (isLikelyHardcodedEnglish(text)) candidates.push(`text-node:${text}`);
  }

  for (const match of source.matchAll(hrefPattern)) {
    candidates.push(`href:${match[1]}`);
  }

  return candidates;
}

function normalizeAuditText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isLikelyHardcodedEnglish(text: string) {
  if (!text || text.length < 3) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[A-Z0-9 /&+-]{2,8}$/.test(text)) return false;
  if (/^[{}()[\].,:;'"`]+$/.test(text)) return false;

  return true;
}

describe("CommandCenter", () => {
  it("keeps command-center source clean for i18n audit candidates", () => {
    expect(scanCommandCenterI18nCandidates()).toEqual([]);
  });

  it("opens the dropdown below the inline field on focus", () => {
    renderWithIntl(<CommandCenter />);

    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();

    fireEvent.focus(searchbox);

    const panel = screen.getByRole("dialog", { name: "Command Center" });
    expect(panel).toBeInTheDocument();
    expect(within(panel).getByText("Suggested")).toBeInTheDocument();
    expect(searchbox).toHaveAttribute("aria-expanded", "true");
  });

  it("focuses the inline field with the keyboard shortcut and closes with Escape", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    expect(searchbox).toHaveFocus();
    expect(screen.getByRole("dialog", { name: "Command Center" })).toBeInTheDocument();

    fireEvent.keyDown(searchbox, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();
    expect(searchbox).toHaveFocus();
  });

  it("closes the dropdown on outside pointer down without trapping focus", () => {
    renderWithIntl(
      <div>
        <CommandCenter />
        <button type="button">Outside target</button>
      </div>
    );

    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    fireEvent.focus(searchbox);
    expect(screen.getByRole("dialog", { name: "Command Center" })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside target" }));
    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();

    fireEvent.focus(searchbox);
    fireEvent.keyDown(searchbox, { key: "Tab" });
    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();
  });

  it("routes JSON searches to the JSON Repair tool", () => {
    renderWithIntl(<CommandCenter />);

    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    fireEvent.focus(searchbox);
    fireEvent.change(searchbox, { target: { value: "json" } });

    const result = screen.getByRole("link", { name: /JSON Repair/ });
    expect(result).toHaveAttribute("href", "/tools/json-repair");
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("clears the query from the inline clear button", () => {
    renderWithIntl(<CommandCenter />);

    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    fireEvent.change(searchbox, { target: { value: "json" } });
    expect(searchbox).toHaveValue("json");

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(searchbox).toHaveValue("");
    expect(searchbox).toHaveFocus();
  });

  it("localizes command chrome and result hrefs for non-default locales", () => {
    renderWithSpanishIntl(<CommandCenter />);

    const searchbox = screen.getByRole("combobox", { name: "Buscar herramientas y flujos" });
    fireEvent.focus(searchbox);

    const panel = screen.getByRole("dialog", { name: "Centro de comandos" });
    expect(within(panel).getByText("Sugeridos")).toBeInTheDocument();
    expect(screen.getByText("Comando K")).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "json" } });

    const result = screen.getByRole("link", { name: /JSON Repair/ });
    expect(result).toHaveAttribute("href", "/es/tools/json-repair");
    expect(screen.getByText("Herramientas")).toBeInTheDocument();
    expect(within(panel).getByText("Navegar")).toBeInTheDocument();
    expect(within(panel).getByText("Seleccionar")).toBeInTheDocument();
    expect(within(panel).getByText("Escape Cerrar")).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "zzzz no matching task" } });

    expect(screen.getByText("No se encontraron herramientas ni flujos")).toBeInTheDocument();
    expect(screen.getByText("Prueba con el nombre de una herramienta, un tipo de archivo o una tarea como resumir PDF.")).toBeInTheDocument();
  });

  it("shows an empty state for unmatched tasks", () => {
    renderWithIntl(<CommandCenter />);

    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    fireEvent.change(searchbox, { target: { value: "zzzz no matching task" } });

    expect(screen.getByText("No matching tools or workflows")).toBeInTheDocument();
    expect(screen.getByText("Try a tool name, file type, or task like summarize pdf.")).toBeInTheDocument();
  });

  it("renders certified search results in the scroll region while keeping the footer mounted", () => {
    renderWithIntl(<CommandCenter />);

    const searchbox = screen.getByRole("combobox", { name: "Search tools and workflows" });
    fireEvent.change(searchbox, { target: { value: "calculator" } });

    const panel = screen.getByRole("dialog", { name: "Command Center" });
    const resultsRegion = within(panel).getByRole("listbox", { name: "Command results" });
    const resultLinks = within(resultsRegion).getAllByRole("link");

    expect(resultLinks.length).toBeGreaterThan(3);
    expect(within(panel).getByText("Escape Close")).toBeInTheDocument();
  });
});
