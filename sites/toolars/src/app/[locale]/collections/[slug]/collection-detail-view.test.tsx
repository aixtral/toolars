import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { getCollectionDetailBySlug } from "@/data/collection-details";
import { CollectionDetailView } from "./collection-detail-view";

function renderWithSpanish(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="es" messages={es}>{ui}</NextIntlClientProvider>);
}

const collectionDetailSourceFile = "src/app/[locale]/collections/[slug]/collection-detail-view.tsx";

function scanCollectionDetailSource() {
  return scanSourceText(readFileSync(collectionDetailSourceFile, "utf8"), collectionDetailSourceFile);
}

function expectCollectionDetailIconsToUseArtwork(container: HTMLElement) {
  const iconTiles = Array.from(
    container.querySelectorAll(".collection-tool-card .icon-tile, .detail-resource-row .icon-tile")
  );

  expect(iconTiles.length).toBeGreaterThan(0);
  iconTiles.forEach((tile) => {
    expect(tile.querySelector("svg")).toBeInTheDocument();
    expect(tile.textContent?.trim()).not.toMatch(/^(?:[A-Z]{2}|\d+)$/);
  });
}

describe("CollectionDetailView", () => {
  it("does not contribute collection detail hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanCollectionDetailSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the PDF Ops Kit collection detail template", () => {
    const detail = getCollectionDetailBySlug("pdf-ops-kit");
    if (!detail) throw new Error("missing PDF collection detail");

    const { container } = renderWithIntl(<CollectionDetailView detail={detail} />);

    expect(container.querySelector('[data-collection-page="pdf-ops-kit"]')).toBeInTheDocument();
    expect(container.querySelector('[data-collection-page="pdf-ops-kit"]')).toHaveAttribute(
      "data-designed-collection-detail",
      "true"
    );
    expect(container.querySelector('[data-collection-page="pdf-ops-kit"]')).toHaveAttribute(
      "data-collection-density",
      "mobile-v2"
    );
    expect(screen.getByRole("heading", { name: "PDF Ops Kit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save collection" })).toBeInTheDocument();
    expect(screen.getByText("Recommended path")).toBeInTheDocument();
    expect(screen.getByText("Tools in this collection")).toBeInTheDocument();
    expect(screen.getByText("Workflows included")).toBeInTheDocument();
    expect(screen.getByText("Collection notes")).toBeInTheDocument();
    expect(container.querySelector(".collection-hero-summary")).toHaveTextContent(detail.summary);
    expect(container.querySelector(".collection-hero-summary")).not.toHaveTextContent(detail.collection.description);
    expect(container.querySelector(".collection-recommended-panel")).toBeInTheDocument();
    expect(container.querySelector(".collection-tools-panel")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workflow" })).toHaveAttribute("href", "/workflows/pdf-summary");
    expect(screen.getByRole("link", { name: "Open PDF Toolkit" })).toHaveAttribute("href", "/tools/pdf-toolkit");
  });

  it("opens share and save modals from collection detail actions", () => {
    const detail = getCollectionDetailBySlug("pdf-ops-kit");
    if (!detail) throw new Error("missing PDF collection detail");

    renderWithIntl(<CollectionDetailView detail={detail} />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(screen.getByRole("dialog", { name: "Share collection" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/collections/pdf-ops-kit")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Save collection" }));

    const saveDialog = screen.getByRole("dialog", { name: "Save collection" });
    expect(saveDialog).toBeInTheDocument();
    expect(within(saveDialog).getByText("PDF Ops Kit")).toBeInTheDocument();
    expect(within(saveDialog).getByText("Personal workspace")).toBeInTheDocument();
  });

  it("renders AI Developer Lab collection playbooks and workflow links", () => {
    const detail = getCollectionDetailBySlug("ai-developer-lab");
    if (!detail) throw new Error("missing AI collection detail");

    const { container } = renderWithIntl(<CollectionDetailView detail={detail} />);

    expect(container.querySelector('[data-collection-page="ai-developer-lab"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI Developer Lab" })).toBeInTheDocument();
    expect(screen.getByText("Playbooks")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse full Lab" })).toHaveAttribute("href", "/explore/ai-developer");
    expect(screen.getByRole("link", { name: /AI Prompt Hardening/ })).toHaveAttribute(
      "href",
      "/workflows/ai-prompt-hardening"
    );
    expect(screen.getByRole("link", { name: /MCP Tool Launch/ })).toHaveAttribute("href", "/workflows/mcp-tool-launch");
    expectCollectionDetailIconsToUseArtwork(container);
  });

  it("localizes collection detail chrome and internal hrefs for non-default locales", () => {
    const detail = getCollectionDetailBySlug("pdf-ops-kit");
    if (!detail) throw new Error("missing PDF collection detail");

    renderWithSpanish(<CollectionDetailView detail={detail} />);

    expect(screen.getByRole("button", { name: "Compartir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar colección" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ruta recomendada" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Herramientas de esta colección" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Flujos de trabajo incluidos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir flujo" })).toHaveAttribute("href", "/es/workflows/pdf-summary");
    expect(screen.getByRole("link", { name: "Abrir PDF Toolkit" })).toHaveAttribute("href", "/es/tools/pdf-toolkit");

    fireEvent.click(screen.getByRole("button", { name: "Compartir" }));

    expect(screen.getByRole("dialog", { name: "Compartir colección" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/es/collections/pdf-ops-kit")).toBeInTheDocument();
  });
});
