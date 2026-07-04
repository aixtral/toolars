import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { JsonDiffWorkspace } from "./json-diff-workspace";

describe("JsonDiffWorkspace", () => {
  it("renders the native Toolars JSON diff workspace controls", () => {
    renderWithIntl(<JsonDiffWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-diff");
    expect(screen.getByRole("heading", { name: "JSON Diff Checker" })).toBeInTheDocument();
    expect(screen.getByText("Payload diff workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("Original JSON")).toBeInTheDocument();
    expect(screen.getByLabelText("Modified JSON")).toBeInTheDocument();
    expect(screen.getByLabelText("Original JSON")).toHaveAttribute("placeholder", "Paste original JSON payload...");
    expect(screen.getByLabelText("Modified JSON")).toHaveAttribute("placeholder", "Paste modified JSON payload...");
    expect(screen.getByRole("button", { name: "Compare JSON" })).toBeDisabled();
  });

  it("compares JSON payloads locally and shows changed paths", () => {
    renderWithIntl(<JsonDiffWorkspace />);

    fireEvent.change(screen.getByLabelText("Original JSON"), {
      target: { value: "{\"name\":\"Alice\",\"role\":\"admin\"}" }
    });
    fireEvent.change(screen.getByLabelText("Modified JSON"), {
      target: { value: "{\"name\":\"Bob\",\"plan\":\"pro\"}" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Compare JSON" }));

    expect(screen.getByLabelText("JSON diff output")).toHaveTextContent("$.name");
    expect(screen.getByText("3 JSON paths changed.")).toBeInTheDocument();
    expect(screen.getByText("Diff ready")).toBeInTheDocument();
  });
});
