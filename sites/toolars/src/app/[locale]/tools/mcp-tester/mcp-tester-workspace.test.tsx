import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { McpTesterWorkspace } from "./mcp-tester-workspace";

describe("McpTesterWorkspace", () => {
  it("renders the Toolars MCP tester workspace", () => {
    renderWithIntl(<McpTesterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "mcp-tester");
    expect(screen.getByRole("heading", { name: "MCP Tester" })).toBeInTheDocument();
    expect(screen.getByText("MCP contract testing")).toBeInTheDocument();
    expect(screen.getByLabelText("Manifest JSON")).toBeInTheDocument();
    expect(screen.getByLabelText("Sample payload JSON")).toBeInTheDocument();
  });

  it("validates manifest and payload JSON locally", () => {
    renderWithIntl(<McpTesterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Validate MCP contract" }));

    expect(screen.getAllByText("Ready").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Required payload fields")).toBeInTheDocument();
    expect(screen.getByText(/Local MCP validation only/)).toBeInTheDocument();
  });
});
