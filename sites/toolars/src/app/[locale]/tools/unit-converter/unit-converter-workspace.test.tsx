import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { UnitConverterWorkspace } from "./unit-converter-workspace";

describe("UnitConverterWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc unit converter workspace sections", () => {
    render(<UnitConverterWorkspace />);

    expect(screen.getByRole("heading", { name: "Unit Converter" })).toBeInTheDocument();
    expect(screen.getByText("Conversion inputs")).toBeInTheDocument();
    expect(screen.getAllByText("Converted value").length).toBeGreaterThan(0);
    expect(screen.getByText("Precision notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Value")).toHaveValue(5);
    expect(screen.getByLabelText("From unit")).toHaveValue("km");
    expect(screen.getByLabelText("To unit")).toHaveValue("mi");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/unit-converter/about"
    );
  });

  it("converts the default value and saves assumptions locally", () => {
    render(<UnitConverterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Convert units" }));

    expect(screen.getByText("3.106856")).toBeInTheDocument();
    expect(screen.getByText("Target unit mi")).toBeInTheDocument();
    expect(screen.getByText("1 mi = 1.60934 km")).toBeInTheDocument();
    expect(screen.getByText("5 km to mi")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save conversion" }));

    expect(window.localStorage.getItem("toolars.unit-converter.plan")).toContain("km");
  });
});
