import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { HeartRateZoneWorkspace } from "./heart-rate-zone-workspace";

describe("HeartRateZoneWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc heart rate zone workspace sections", () => {
    render(<HeartRateZoneWorkspace />);

    expect(screen.getByRole("heading", { name: "Heart Rate Zone Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Training inputs")).toBeInTheDocument();
    expect(screen.getByText("Zone result")).toBeInTheDocument();
    expect(screen.getByText("Measurement notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Age")).toHaveValue(30);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/heart-rate-zone/about");
  });

  it("calculates zones and saves the training profile locally", () => {
    render(<HeartRateZoneWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate zones" }));

    expect(screen.getByText("190 bpm")).toBeInTheDocument();
    expect(screen.getByText(/125 - 138 bpm/)).toBeInTheDocument();
    expect(screen.getAllByText(/177 - 190 bpm/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save zone profile" }));

    expect(window.localStorage.getItem("toolars.heart-rate-zone.profile:v1")).toContain("\"age\":30");
  });
});
