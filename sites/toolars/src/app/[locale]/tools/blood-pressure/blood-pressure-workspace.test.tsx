import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { BloodPressureWorkspace } from "./blood-pressure-workspace";

describe("BloodPressureWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc blood pressure workspace sections", () => {
    renderWithIntl(<BloodPressureWorkspace />);

    expect(screen.getByRole("heading", { name: "Blood Pressure Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Reading inputs")).toBeInTheDocument();
    expect(screen.getByText("Blood pressure summary")).toBeInTheDocument();
    expect(screen.getByText("Blood pressure notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Systolic")).toHaveValue(120);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/blood-pressure/about");
  });

  it("classifies the default reading and saves it locally", () => {
    renderWithIntl(<BloodPressureWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Classify blood pressure" }));

    expect(screen.getByText("Stage 1")).toBeInTheDocument();
    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("Systolic 130-139 or diastolic 80-89.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save reading" }));

    expect(window.localStorage.getItem("toolars.blood-pressure.reading")).toContain("120");
  });
});
