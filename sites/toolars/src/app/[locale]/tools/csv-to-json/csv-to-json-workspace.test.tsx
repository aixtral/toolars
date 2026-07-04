import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CsvToJsonWorkspace } from "./csv-to-json-workspace";

describe("CsvToJsonWorkspace", () => {
  it("renders the native Toolars CSV to JSON workspace controls", () => {
    renderWithIntl(<CsvToJsonWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "csv-to-json");
    expect(screen.getByRole("heading", { name: "CSV to JSON Converter" })).toBeInTheDocument();
    expect(screen.getByText("Data formatter workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("CSV input")).toBeInTheDocument();
    expect(screen.getByLabelText("Delimiter")).toHaveDisplayValue("Comma");
    expect(screen.getByLabelText("First row has headers")).toBeChecked();
    expect(screen.getByRole("button", { name: "Convert CSV" })).toBeDisabled();
  });

  it("converts CSV input locally and shows formatted JSON output", () => {
    renderWithIntl(<CsvToJsonWorkspace />);

    fireEvent.change(screen.getByLabelText("CSV input"), {
      target: { value: "name,city\nAlice,NYC\nBob,LA" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert CSV" }));

    expect(screen.getByLabelText("Converted JSON output")).toHaveTextContent('"name": "Alice"');
    expect(screen.getByText("2 CSV rows converted into JSON records.")).toBeInTheDocument();
    expect(screen.getAllByText("Conversion ready").length).toBeGreaterThan(0);
  });
});
