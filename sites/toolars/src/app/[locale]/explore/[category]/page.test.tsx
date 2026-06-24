import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import ExploreCategoryPage from "./page";

describe("ExploreCategoryPage", () => {
  it("renders a category directory for sidebar category links", async () => {
    const ui = await ExploreCategoryPage({ params: Promise.resolve({ category: "finance" }) });
    const { container } = renderWithIntl(ui);

    expect(container.querySelector('[data-explore-category="finance"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Finance tools" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Finance/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Mortgage Calculator")).toBeInTheDocument();
  });
});
