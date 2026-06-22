import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CalorieDeficitWorkspace } from "./calorie-deficit-workspace";

describe("CalorieDeficitWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc calorie deficit workspace sections", () => {
    render(<CalorieDeficitWorkspace />);

    expect(screen.getByRole("heading", { name: "Calorie Deficit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Weight-loss inputs")).toBeInTheDocument();
    expect(screen.getByText("Calorie target result")).toBeInTheDocument();
    expect(screen.getByText("Deficit notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2200")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/calorie-deficit/about"
    );
  });

  it("calculates daily intake and saves the deficit plan locally", () => {
    render(<CalorieDeficitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate deficit" }));

    expect(screen.getByText("1,650 kcal")).toBeInTheDocument();
    expect(screen.getByText("550 kcal")).toBeInTheDocument();
    expect(screen.getByText("10 weeks")).toBeInTheDocument();
    expect(screen.getByText("5.0 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save deficit plan" }));

    expect(window.localStorage.getItem("toolars.calorie-deficit.plan")).toContain("2200");
  });
});
