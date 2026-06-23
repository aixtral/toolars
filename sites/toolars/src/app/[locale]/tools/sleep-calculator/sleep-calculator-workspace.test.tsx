import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { SleepCalculatorWorkspace } from "./sleep-calculator-workspace";

describe("SleepCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc sleep workspace sections", () => {
    renderWithIntl(<SleepCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Sleep Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Sleep inputs")).toBeInTheDocument();
    expect(screen.getByText("Sleep result")).toBeInTheDocument();
    expect(screen.getByText("Sleep notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Main time")).toHaveValue("07:00");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/sleep-calculator/about");
  });

  it("calculates the default bedtime and saves the sleep plan locally", () => {
    renderWithIntl(<SleepCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate sleep time" }));

    expect(screen.getAllByText("21:45").length).toBeGreaterThan(0);
    expect(screen.getByText("11:45")).toBeInTheDocument();
    expect(screen.getByText("20:45")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save sleep plan" }));

    expect(window.localStorage.getItem("toolars.sleep-calculator.plan:v1")).toContain("\"mainTime\":\"07:00\"");
  });
});
