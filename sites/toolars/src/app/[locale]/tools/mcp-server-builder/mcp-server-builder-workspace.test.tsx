import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { McpServerBuilderWorkspace } from "./mcp-server-builder-workspace";

describe("McpServerBuilderWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the Toolars MCP builder workspace sections", () => {
    render(<McpServerBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "mcp-server-builder");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Manifest draft")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "MCP Server Builder" })).toBeInTheDocument();
    expect(screen.getByText("Server draft")).toBeInTheDocument();
    expect(screen.getByText("Manifest preview")).toBeInTheDocument();
    expect(screen.getByText("What Toolars checks")).toBeInTheDocument();
    expect(screen.getByDisplayValue("toolars-research-kit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("search_private_docs")).toBeInTheDocument();
  });

  it("generates the default manifest preview", () => {
    render(<McpServerBuilderWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate manifest" }));

    expect(screen.getByText("Manifest generated - 1 tool - 1 resource - 1 test payload")).toBeInTheDocument();
    expect(screen.getByText(/"name": "toolars-research-kit"/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "search_private_docs"/)).toBeInTheDocument();
    expect(screen.getByText(/"docs:\/\/private-collection\/index"/)).toBeInTheDocument();
  });

  it("updates the manifest when the tool name changes", () => {
    render(<McpServerBuilderWorkspace />);

    fireEvent.change(screen.getByLabelText("Primary tool"), {
      target: { value: "lookup_customer_docs" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate manifest" }));

    expect(screen.getByText(/"name": "lookup_customer_docs"/)).toBeInTheDocument();
  });

  it("saves the draft locally without changing fields", () => {
    render(<McpServerBuilderWorkspace />);

    fireEvent.change(screen.getByLabelText("Server name"), {
      target: { value: "customer-support-kit" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    expect(screen.getByLabelText("Server name")).toHaveValue("customer-support-kit");
    expect(window.localStorage.getItem("toolars.mcp-server-builder.draft")).toContain("customer-support-kit");
  });
});
