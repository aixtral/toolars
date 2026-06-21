import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyToolsDashboardView } from "./my-tools-dashboard-view";

describe("MyToolsDashboardView", () => {
  it("renders the personal workspace dashboard modules from the design", () => {
    const { container } = render(<MyToolsDashboardView />);

    expect(container.querySelector('[data-my-tools-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome back, Alex" })).toBeInTheDocument();
    expect(screen.getByText("What do you want to do next?")).toBeInTheDocument();
    expect(screen.getByText("Recent outputs")).toBeInTheDocument();
    expect(screen.getByText("Favorite tools")).toBeInTheDocument();
    expect(screen.getByText("Saved workflows")).toBeInTheDocument();
    expect(screen.getByText("AI credits remaining")).toBeInTheDocument();
    expect(screen.getByText("Continue where you left off")).toBeInTheDocument();
    expect(screen.getByText("Saved collections")).toBeInTheDocument();
    expect(screen.getByText("Recommended next workflows")).toBeInTheDocument();
    expect(screen.getByText("Recent shared links")).toBeInTheDocument();
  });

  it("links workspace cards to existing tools, workflows, and collections", () => {
    const { container } = render(<MyToolsDashboardView />);

    expect(container.querySelector('a[href="/tools/pdf-toolkit"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/workflows/pdf-summary"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/collections/pdf-ops-kit"]')).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Install Toolars Extension")).toBeInTheDocument();
  });
});
