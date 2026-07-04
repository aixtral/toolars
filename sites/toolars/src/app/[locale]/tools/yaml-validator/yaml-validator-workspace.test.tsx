import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { YamlValidatorWorkspace } from "./yaml-validator-workspace";

describe("YamlValidatorWorkspace", () => {
  it("renders the native Toolars YAML validator workspace controls", () => {
    renderWithIntl(<YamlValidatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "yaml-validator");
    expect(screen.getByRole("heading", { name: "YAML Validator" })).toBeInTheDocument();
    expect(screen.getByText("Config review workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("YAML input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Validate YAML" })).toBeDisabled();
  });

  it("validates YAML locally and displays syntax findings", () => {
    renderWithIntl(<YamlValidatorWorkspace />);

    fireEvent.change(screen.getByLabelText("YAML input"), {
      target: { value: "app:\n\tname: Toolars\n  owner: ops   " }
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate YAML" }));

    expect(screen.getAllByText("Review input").length).toBeGreaterThan(0);
    expect(screen.getByText("Line 2")).toBeInTheDocument();
    expect(screen.getByText("Tabs are not valid YAML indentation. Use spaces instead.")).toBeInTheDocument();
    expect(screen.getByText("Trailing whitespace can create noisy config diffs.")).toBeInTheDocument();
  });
});
