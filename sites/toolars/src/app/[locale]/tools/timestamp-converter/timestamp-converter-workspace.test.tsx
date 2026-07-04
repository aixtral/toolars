import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { TimestampConverterWorkspace } from "./timestamp-converter-workspace";

describe("TimestampConverterWorkspace", () => {
  it("renders native timestamp converter controls", () => {
    renderWithIntl(<TimestampConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "timestamp-converter");
    expect(screen.getByRole("heading", { name: "Timestamp Converter" })).toBeInTheDocument();
    expect(screen.getByLabelText("Timestamp or date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Convert timestamp" })).toBeDisabled();
  });

  it("converts Unix seconds into ISO and UTC outputs", () => {
    renderWithIntl(<TimestampConverterWorkspace />);

    fireEvent.change(screen.getByLabelText("Timestamp or date"), { target: { value: "1700000000" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert timestamp" }));

    expect(screen.getByText("2023-11-14T22:13:20.000Z")).toBeInTheDocument();
    expect(screen.getByText("1700000000")).toBeInTheDocument();
    expect(screen.getByText("Converted")).toBeInTheDocument();
  });
});
