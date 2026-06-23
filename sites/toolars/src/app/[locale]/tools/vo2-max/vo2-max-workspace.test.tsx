import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { Vo2MaxWorkspace } from "./vo2-max-workspace";

describe("Vo2MaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc VO2 Max workspace sections", () => {
    renderWithIntl(<Vo2MaxWorkspace />);

    expect(screen.getByRole("heading", { name: "VO2 Max Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Fitness inputs")).toBeInTheDocument();
    expect(screen.getByText("VO2 result")).toBeInTheDocument();
    expect(screen.getByText("Training notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Distance (meters)")).toHaveValue(2400);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/vo2-max/about");
  });

  it("calculates the Cooper estimate and saves the scenario locally", () => {
    renderWithIntl(<Vo2MaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate VO2 Max" }));

    expect(screen.getByText("42.4")).toBeInTheDocument();
    expect(screen.getAllByText("Good").length).toBeGreaterThan(0);
    expect(screen.getByText("42-49 ml/kg/min")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fitness test" }));

    expect(window.localStorage.getItem("toolars.vo2-max.test:v1")).toContain("cooper");
  });
});
