import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "@/data/tool-details";
import { ToolWorkspaceShellView } from "./tool-workspace-shell-view";

describe("ToolWorkspaceShellView", () => {
  it("renders a source-backed VitalCalc workspace handoff", () => {
    const detail = getToolDetailBySlug("loan-calculator");
    if (!detail) throw new Error("missing loan detail");

    const { container } = render(<ToolWorkspaceShellView detail={detail} />);

    expect(container.querySelector('[data-tool-workspace-shell="loan-calculator"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loan Calculator workspace" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Full calculator path")).toBeInTheDocument();
    expect(screen.getByText("Related tools")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/loan-calculator/about"
    );
  });

  it("renders AI Lab handoff context and workflow links", () => {
    const detail = getToolDetailBySlug("prompt-injection-scanner");
    if (!detail) throw new Error("missing prompt scanner detail");

    render(<ToolWorkspaceShellView detail={detail} />);

    expect(screen.getByRole("heading", { name: "Prompt Injection Scanner workspace" })).toBeInTheDocument();
    expect(screen.getByText("Privacy and review model")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open recommended workflow/ })).toHaveAttribute(
      "href",
      "/workflows/ai-prompt-hardening"
    );
  });
});
