import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { AgentWorkflowBuilderWorkspace } from "./agent-workflow-builder-workspace";

describe("AgentWorkflowBuilderWorkspace", () => {
  it("renders the Toolars agent workflow workspace", () => {
    renderWithIntl(<AgentWorkflowBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "agent-workflow-builder");
    expect(screen.getByRole("heading", { name: "Agent Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Agent workflow planning")).toBeInTheDocument();
    expect(screen.getByLabelText("Workflow goal")).toBeInTheDocument();
    expect(screen.getByLabelText("Workflow stages")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Build workflow plan" })).toBeEnabled();
  });

  it("builds a local workflow plan with review gate status", () => {
    renderWithIntl(<AgentWorkflowBuilderWorkspace />);

    fireEvent.change(screen.getByLabelText("Workflow stages"), {
      target: { value: "Researcher | Search | search_docs | yes\nWriter | Draft | summarize | no" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Build workflow plan" }));

    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Review gates").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Local workflow planning only/)).toBeInTheDocument();
  });
});
