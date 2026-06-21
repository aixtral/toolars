import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { workflows } from "@/data/registry";
import { WorkflowsIndexView } from "./workflows-index-view";

describe("WorkflowsIndexView", () => {
  it("renders the workflows landing modules from the design", () => {
    const { container } = render(<WorkflowsIndexView />);

    expect(container.querySelector('[data-workflows-index="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-workflows-index="true"]')).toHaveAttribute(
      "data-workflows-desktop-layout",
      "workflow-market-v2"
    );
    expect(container.querySelector(".workflow-example-row")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Workflows that finish the job" })).toBeInTheDocument();
    expect(screen.getByText("What are you trying to automate?")).toBeInTheDocument();
    expect(screen.getByText("Featured workflows")).toBeInTheDocument();
    expect(screen.getByText("Popular workflow templates")).toBeInTheDocument();
    expect(screen.getByText("Trending this week")).toBeInTheDocument();
    expect(screen.getAllByText("Build from scratch").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Create workflow" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse collections" })).toHaveAttribute("href", "/collections");
  });

  it("exposes the high-fidelity mobile workflow template directory structure", () => {
    const { container } = render(<WorkflowsIndexView />);

    expect(container.querySelector('[data-workflows-index="true"]')).toHaveAttribute(
      "data-workflows-mobile-layout",
      "template-directory"
    );
    expect(container.querySelector('[data-workflows-index="true"]')).toHaveAttribute(
      "data-workflows-density",
      "mobile-v2"
    );
    expect(screen.getByRole("button", { name: "Build from scratch" })).toBeInTheDocument();
    expect(screen.getByText("WF")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/workflows/pdf-summary");
    expect(screen.getByRole("button", { name: "All workflows" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Includes AI" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Local first" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Team ready" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("heading", { name: "Featured workflow templates" })).toBeInTheDocument();
    expect(screen.getAllByText("PDF Summary Workflow Builder").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+1.2K runs").length).toBeGreaterThan(0);
  });

  it("uses registry workflows with start links and trust metadata", () => {
    const { container } = render(<WorkflowsIndexView />);

    for (const workflow of workflows) {
      expect(screen.getAllByText(workflow.title).length).toBeGreaterThan(0);
      expect(container.querySelector(`a[href="${workflow.href}"]`)).toBeInTheDocument();
    }

    expect(screen.getAllByText("AI step").length).toBeGreaterThan(0);
    expect(screen.getByText("Local-first steps")).toBeInTheDocument();
    expect(screen.getByText("Files removed after session")).toBeInTheDocument();
  });
});
