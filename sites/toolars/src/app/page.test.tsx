import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("exposes the high-fidelity desktop marketplace layout", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelector('[data-home-desktop-layout="marketplace-v2"]')).toBeInTheDocument();
    expect(container.querySelectorAll(".home-desktop-pick-card")).toHaveLength(3);
    expect(screen.getAllByText("AI Research Summarizer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PDF Toolkit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Image Cleaner").length).toBeGreaterThan(0);
    expect(screen.getByText("View all picks")).toBeInTheDocument();
  });

  it("exposes the high-fidelity mobile Explore home structure", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelector('[data-home-mobile-layout="explore-app"]')).toBeInTheDocument();
    expect(container.querySelector('[data-home-asset-parity="icon-font-v5"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Sign in" }).length).toBeGreaterThan(0);
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
});
