import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonRepairWorkspace } from "./json-repair-workspace";

describe("JsonRepairWorkspace", () => {
  it("renders inside the AI Developer Lab workbench shell", () => {
    render(<JsonRepairWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-repair");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Local parser")).toBeInTheDocument();
  });

  it("repairs the sample JSON payload", () => {
    render(<JsonRepairWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Repair JSON" }));

    expect(screen.getByText("Repair complete. 3 fixes applied locally.")).toBeInTheDocument();
    expect(screen.getByText(/"user": "ada"/)).toBeInTheDocument();
  });
});
