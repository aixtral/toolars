import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import ExploreCategoryPage from "./page";

function activeSidebarLink(label: string) {
  const link = screen.getAllByText(label).map((node) => node.closest("a")).find(Boolean);
  if (!link) throw new Error(`Missing active sidebar link for ${label}`);
  return link;
}

describe("ExploreCategoryPage", () => {
  it("renders a category directory for sidebar category links", async () => {
    const ui = await ExploreCategoryPage({ params: Promise.resolve({ category: "finance" }) });
    const { container } = renderWithIntl(ui);

    expect(container.querySelector('[data-explore-category="finance"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Finance tools" })).toBeInTheDocument();
    expect(activeSidebarLink("Finance")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Mortgage Calculator")).toBeInTheDocument();
  });

  it.each([
    ["ai-security", "AI Security", "JSON Repair"],
    ["llm-cost", "LLM Cost", "LLM Cost Calculator"],
    ["rag-mcp-agent", "RAG / MCP / Agent", "MCP Server Builder"],
    ["frontend-design", "Frontend & Design", null]
  ])("marks %s as the active category route", async (slug, label, expectedTool) => {
    const ui = await ExploreCategoryPage({ params: Promise.resolve({ category: slug }) });
    const { container } = renderWithIntl(ui);
    const link = activeSidebarLink(label);

    expect(container.querySelector(`[data-explore-category="${slug}"]`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: `${label} tools` })).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/explore/${slug}`);
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("is-active");
    expect(container.querySelector(".tool-grid")).toBeInTheDocument();
    if (expectedTool) {
      expect(screen.getByText(expectedTool)).toBeInTheDocument();
    }
  });
});
