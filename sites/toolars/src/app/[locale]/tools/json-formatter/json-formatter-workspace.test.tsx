import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { JsonFormatterWorkspace } from "./json-formatter-workspace";

describe("JsonFormatterWorkspace", () => {
  it("renders native JSON Formatter controls", () => {
    renderWithIntl(<JsonFormatterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-formatter");
    expect(screen.getByRole("heading", { name: "JSON Formatter" })).toBeInTheDocument();
    expect(screen.getByLabelText("JSON input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Format JSON" })).toBeDisabled();
  });

  it("formats pasted JSON locally", () => {
    renderWithIntl(<JsonFormatterWorkspace />);

    fireEvent.change(screen.getByLabelText("JSON input"), { target: { value: "{\"name\":\"Toolars\"}" } });
    fireEvent.click(screen.getByRole("button", { name: "Format JSON" }));

    expect(screen.getByText(/\"name\": \"Toolars\"/)).toBeInTheDocument();
    expect(screen.getAllByText("Valid JSON").length).toBeGreaterThan(0);
  });
});
