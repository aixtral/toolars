import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import PdfDirectoryPage from "./page";

describe("PdfDirectoryPage", () => {
  it("renders the high-fidelity desktop PDF directory density", () => {
    const { container } = renderWithIntl(<PdfDirectoryPage />);

    expect(container.querySelector('[data-pdf-directory-layout="desktop-market-v2"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PDF tools and AI workflows" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "128 tools found" })).toBeInTheDocument();
    expect(container.querySelector(".pdf-directory-tool-grid")).toBeInTheDocument();
    expect(screen.getByText("Featured workflows")).toBeInTheDocument();
  });
});
