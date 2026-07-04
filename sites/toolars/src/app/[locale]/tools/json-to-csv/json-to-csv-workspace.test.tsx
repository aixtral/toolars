import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { JsonToCsvWorkspace } from "./json-to-csv-workspace";

describe("JsonToCsvWorkspace", () => {
  it("renders the native Toolars JSON to CSV workspace controls", () => {
    renderWithIntl(<JsonToCsvWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-to-csv");
    expect(screen.getByRole("heading", { name: "JSON to CSV Converter" })).toBeInTheDocument();
    expect(screen.getByText("Export formatter workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("JSON array input")).toBeInTheDocument();
    expect(screen.getByLabelText("Delimiter")).toHaveDisplayValue("Comma");
    expect(screen.getByRole("button", { name: "Convert JSON" })).toBeDisabled();
  });

  it("converts JSON arrays locally and reports row statistics", () => {
    renderWithIntl(<JsonToCsvWorkspace />);

    fireEvent.change(screen.getByLabelText("JSON array input"), {
      target: { value: '[{"name":"Alice","city":"NYC"},{"name":"Bob","city":"LA"}]' }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert JSON" }));

    expect(screen.getByLabelText("Converted CSV output")).toHaveTextContent("name,city");
    expect(screen.getByLabelText("Converted CSV output")).toHaveTextContent("Alice,NYC");
    expect(screen.getByText("2 JSON records converted into CSV rows.")).toBeInTheDocument();
  });
});
