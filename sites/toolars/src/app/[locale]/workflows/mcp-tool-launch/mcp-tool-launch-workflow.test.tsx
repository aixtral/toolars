import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { McpToolLaunchWorkflow } from "./mcp-tool-launch-workflow";

describe("McpToolLaunchWorkflow", () => {
  it("renders the MCP launch workflow sections from the design", () => {
    render(<McpToolLaunchWorkflow />);

    expect(document.querySelector(".workflow-builder-layout")).toHaveAttribute("data-ai-lab-workflow", "mobile-edge-v3");
    expect(screen.getByRole("heading", { name: "MCP Tool Launch Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Launch canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Tool chain")).toBeInTheDocument();
    expect(screen.getByText("Review gate")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Internal agent" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /MCP Server Builder/ })).toHaveAttribute("href", "/tools/mcp-server-builder");
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("simulates the launch check when the user runs the workflow", () => {
    render(<McpToolLaunchWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run launch check" }));

    expect(screen.getByText("Launch checklist ready")).toBeInTheDocument();
    expect(screen.getByText(/Manifest generated/)).toBeInTheDocument();
    expect(screen.getAllByText(/auth policy notes/)).toHaveLength(2);
    expect(screen.getByLabelText("MCP launch progress")).toHaveAttribute("aria-valuenow", "88");
  });
});
