import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { WaterIntakeWorkspace } from "./water-intake-workspace";

describe("WaterIntakeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc water intake workspace sections", () => {
    renderWithIntl(<WaterIntakeWorkspace />);

    expect(screen.getByRole("heading", { name: "Water Intake Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Hydration inputs")).toBeInTheDocument();
    expect(screen.getByText("Hydration result")).toBeInTheDocument();
    expect(screen.getByText("Hydration notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/water-intake/about"
    );
  });

  it("calculates water intake and saves the hydration plan locally", () => {
    renderWithIntl(<WaterIntakeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate water intake" }));

    expect(screen.getByText("4,165 ml")).toBeInTheDocument();
    expect(screen.getByText("17 cups")).toBeInTheDocument();
    expect(screen.getByText("+490 ml")).toBeInTheDocument();
    expect(screen.getByText("+1,225 ml")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save hydration plan" }));

    expect(window.localStorage.getItem("toolars.water-intake.plan")).toContain("70");
  });
});
