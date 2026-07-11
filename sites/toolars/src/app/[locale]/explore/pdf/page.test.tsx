import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import en from "../../../../../messages/en.json";
import es from "../../../../../messages/es.json";
import PdfDirectoryPage from "./page";

function activeSidebarLink(label: string) {
  const link = screen.getAllByText(label).map((node) => node.closest("a")).find(Boolean);
  if (!link) throw new Error(`Missing active sidebar link for ${label}`);
  return link;
}

describe("PdfDirectoryPage", () => {
  it("renders the high-fidelity desktop PDF directory density", () => {
    const { container } = renderWithIntl(<PdfDirectoryPage />);
    const pdfLink = activeSidebarLink("PDF");

    expect(container.querySelector('[data-pdf-directory-layout="desktop-market-v2"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PDF tools and AI workflows" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1 tools found" })).toBeInTheDocument();
    expect(container.querySelector(".pdf-directory-tool-grid")).toBeInTheDocument();
    expect(screen.getByText("Featured workflows")).toBeInTheDocument();
    expect(pdfLink).toHaveAttribute("href", "/explore/pdf");
    expect(pdfLink).toHaveAttribute("aria-current", "page");
    expect(pdfLink).toHaveClass("is-active");
  });

  it("prefixes featured PDF resource links for routed non-default locales", () => {
    const { container } = render(
      <NextIntlClientProvider locale="zh-hans" messages={en}>
        <PdfDirectoryPage />
      </NextIntlClientProvider>
    );

    expect(container.querySelector('a[href="/zh-hans/workflows/pdf-summary"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/tools/pdf-toolkit"]')).toBeInTheDocument();
  });

  it("localizes PDF directory chrome for Spanish locale", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <PdfDirectoryPage />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Flujos PDF destacados")).toBeInTheDocument();
    expect(screen.queryByText("Featured workflows")).not.toBeInTheDocument();
  });
});
