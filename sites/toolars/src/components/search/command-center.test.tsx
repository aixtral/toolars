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

  it("opens from the shell trigger and focuses search", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));

    const dialog = screen.getByRole("dialog", { name: "Command Center" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search tools and workflows" })).toHaveFocus();
    expect(within(dialog).getByText("Suggested")).toBeInTheDocument();
  });

  it("opens with the keyboard shortcut and closes with Escape", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog", { name: "Command Center" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();
  });

  it("traps Tab focus inside the command dialog", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));

    const dialog = screen.getByRole("dialog", { name: "Command Center" });
    const searchbox = screen.getByRole("searchbox", { name: "Search tools and workflows" });
    const results = within(dialog).getAllByRole("link");

    expect(searchbox).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(results.at(-1)).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(searchbox).toHaveFocus();
  });

  it("restores focus to the command trigger after closing", () => {
    renderWithIntl(<CommandCenter />);

    const trigger = screen.getByRole("button", { name: "Open command search" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("searchbox", { name: "Search tools and workflows" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("routes JSON searches to the JSON Repair tool", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools and workflows" }), {
      target: { value: "json" }
    });

    const result = screen.getByRole("link", { name: /JSON Repair/ });
    expect(result).toHaveAttribute("href", "/tools/json-repair");
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("localizes command chrome and result hrefs for non-default locales", () => {
    renderWithSpanishIntl(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir búsqueda de comandos" }));

    const dialog = screen.getByRole("dialog", { name: "Centro de comandos" });
    expect(screen.getByRole("searchbox", { name: "Buscar herramientas y flujos" })).toHaveFocus();
    expect(screen.getByText("Comando K")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Cerrar centro de comandos" })).toHaveTextContent("Escape");
    expect(within(dialog).getByText("Sugeridos")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar herramientas y flujos" }), {
      target: { value: "json" }
    });

    const result = screen.getByRole("link", { name: /JSON Repair/ });
    expect(result).toHaveAttribute("href", "/es/tools/json-repair");
    expect(screen.getByText("Herramientas")).toBeInTheDocument();
    expect(within(dialog).getByText("Navegar")).toBeInTheDocument();
    expect(within(dialog).getByText("Seleccionar")).toBeInTheDocument();
    expect(within(dialog).getByText("Escape Cerrar")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar herramientas y flujos" }), {
      target: { value: "zzzz no matching task" }
    });

    expect(screen.getByText("No se encontraron herramientas ni flujos")).toBeInTheDocument();
    expect(screen.getByText("Prueba con el nombre de una herramienta, un tipo de archivo o una tarea como resumir PDF.")).toBeInTheDocument();
  });

  it("shows an empty state for unmatched tasks", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools and workflows" }), {
      target: { value: "zzzz no matching task" }
    });

    expect(screen.getByText("No matching tools or workflows")).toBeInTheDocument();
    expect(screen.getByText("Try a tool name, file type, or task like summarize pdf.")).toBeInTheDocument();
  });

  it("renders long search results in the scroll region while keeping the footer mounted", () => {
    renderWithIntl(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools and workflows" }), {
      target: { value: "calculator" }
    });

    const dialog = screen.getByRole("dialog", { name: "Command Center" });
    const resultsRegion = within(dialog).getByRole("listbox", { name: "Command results" });
    const resultLinks = within(resultsRegion).getAllByRole("link");

    expect(resultLinks.length).toBeGreaterThan(8);
    expect(within(dialog).getByText("Escape Close")).toBeInTheDocument();

    resultLinks.at(-1)?.focus();
    expect(resultLinks.at(-1)).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(screen.getByRole("searchbox", { name: "Search tools and workflows" })).toHaveFocus();
  });
});
