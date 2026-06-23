import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { CityCostComparisonWorkspace } from "./city-cost-comparison-workspace";

describe("CityCostComparisonWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc city cost workspace sections", () => {
    renderWithIntl(<CityCostComparisonWorkspace />);

    expect(screen.getByRole("heading", { name: "City Cost Comparison" })).toBeInTheDocument();
    expect(screen.getByText("City assumptions")).toBeInTheDocument();
    expect(screen.getByText("Relocation summary")).toBeInTheDocument();
    expect(screen.getByText("Relocation notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly pre-tax income")).toHaveValue(8000);
    expect(screen.getByLabelText("City A rent")).toHaveValue(2500);
    expect(screen.getByLabelText("City B rent")).toHaveValue(1200);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/city-cost-comparison/about"
    );
  });

  it("calculates the default relocation comparison and saves assumptions locally", () => {
    renderWithIntl(<CityCostComparisonWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Compare cities" }));

    expect(screen.getByText("$2,461")).toBeInTheDocument();
    expect(screen.getByText("$4,261")).toBeInTheDocument();
    expect(screen.getByText("$21,600")).toBeInTheDocument();
    expect(screen.getByText("City B saves more")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save city comparison" }));

    expect(window.localStorage.getItem("toolars.city-cost-comparison.plan")).toContain("2500");
  });
});
