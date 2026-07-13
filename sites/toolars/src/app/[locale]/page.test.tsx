import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import HomePage from "./page";

describe("HomePage", () => {
  it("does not contribute hardcoded UI candidates to the i18n audit", async () => {
    const auditI18nUrl = pathToFileURL(join(process.cwd(), "scripts/audit-i18n.mjs")).href;
    const { scanSourceText } = (await import(auditI18nUrl)) as {
      scanSourceText: (
        source: string,
        file: string
      ) => {
        hardcodedText: Array<{ file: string; kind: string; text: string }>;
      };
    };
    const source = readFileSync(join(process.cwd(), "src/app/[locale]/page.tsx"), "utf8");

    expect(scanSourceText(source, "src/app/[locale]/page.tsx").hardcodedText).toEqual([]);
  });

  it("exposes the high-fidelity desktop marketplace layout", () => {
    const { container } = renderWithIntl(<HomePage />);

    expect(container.querySelector('[data-home-desktop-layout="marketplace-v2"]')).toBeInTheDocument();
    expect(container.querySelectorAll(".home-desktop-pick-card")).toHaveLength(3);
    expect(screen.getAllByText("AI Research Summarizer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PDF Toolkit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Image Cleaner").length).toBeGreaterThan(0);
    expect(screen.getByText("View all picks")).toBeInTheDocument();
  });

  it("shows each semantic label only once in a desktop pick card", () => {
    const { container } = renderWithIntl(<HomePage />);

    for (const card of container.querySelectorAll(".home-desktop-pick-card")) {
      const labels = Array.from(card.querySelectorAll(".home-desktop-pick-footer .chip, .home-desktop-pick-footer .badge"))
        .map((element) => element.textContent?.trim().toLowerCase())
        .filter((label): label is string => Boolean(label));

      expect(new Set(labels).size).toBe(labels.length);
    }
  });

  it("exposes the high-fidelity mobile Explore home structure", () => {
    const { container } = renderWithIntl(<HomePage />);

    expect(container.querySelector('[data-home-mobile-layout="explore-app"]')).toBeInTheDocument();
    expect(container.querySelector('[data-home-asset-parity="icon-font-v5"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Sign in" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(container.querySelector(".home-mobile-topbar")).not.toBeInTheDocument();
    expect(container.querySelector(".topbar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What do you want to do?" })).toBeInTheDocument();
    expect(screen.getByText("Search or describe your task...")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Compress image" })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByRole("button", { name: "Traditional" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "AI" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Workflow" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("heading", { name: "Continue" })).toBeInTheDocument();
    expect(screen.getByText("Image Compressor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Toolars Picks" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /AI Research Summarizer/ })[0]).toHaveAttribute("href", "/tools/prompt-injection-scanner");
    expect(screen.getByRole("link", { name: "PDF" })).toHaveAttribute("href", "/explore/pdf");
    expect(screen.getAllByRole("heading", { name: "Popular workflows" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Turn PDF into summary/ })[0]).toHaveAttribute(
      "href",
      "/workflows/pdf-summary"
    );
    expect(container.querySelectorAll(".home-mobile-workflow-row em svg")).toHaveLength(3);
    expect(screen.getByRole("navigation", { name: "Mobile home tabs" })).toBeInTheDocument();
  });

  it("keeps home page internal links inside the active locale", () => {
    const { container } = render(
      <NextIntlClientProvider locale="es" messages={es}>
        <HomePage />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("link", { name: "Comprimir imagen" })).toHaveAttribute("href", "/es/tools/pdf-toolkit");
    expect(container.querySelector(".hero-input .open-link")).toHaveAttribute("href", "/es/explore/pdf");
    expect(container.querySelector(".home-section-head .text-link")).toHaveAttribute("href", "/es/collections");
    expect(screen.getAllByRole("link", { name: /Convertir PDF en resumen/ })[0]).toHaveAttribute(
      "href",
      "/es/workflows/pdf-summary"
    );
  });

  it("localizes remaining home page hotspot copy for Spanish", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <HomePage />
      </NextIntlClientProvider>
    );

    expect(screen.queryByText("Compress image")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Comprimir imagen" })).toHaveAttribute(
      "href",
      "/es/tools/pdf-toolkit"
    );
    expect(screen.getByText("Compresor de imágenes")).toBeInTheDocument();
    expect(screen.getByText("Herramientas PDF")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pestañas de inicio móvil" })).toBeInTheDocument();
  });

  it("uses simplified Chinese workflow and blog previews instead of English registry fallbacks", () => {
    render(
      <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
        <HomePage />
      </NextIntlClientProvider>
    );

    expect(screen.getAllByText("将 PDF 转成摘要").length).toBeGreaterThan(0);
    expect(screen.getByText("如何在几秒内修复损坏的 JSON")).toBeInTheDocument();
    expect(screen.queryByText("Turn PDF into summary")).not.toBeInTheDocument();
    expect(screen.queryByText("How to Repair Broken JSON in Seconds")).not.toBeInTheDocument();
  });
});
