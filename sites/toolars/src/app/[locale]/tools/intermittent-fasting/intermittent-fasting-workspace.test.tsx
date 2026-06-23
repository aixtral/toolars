import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { IntermittentFastingWorkspace } from "./intermittent-fasting-workspace";

describe("IntermittentFastingWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc intermittent fasting workspace sections", () => {
    renderWithIntl(<IntermittentFastingWorkspace />);

    expect(screen.getByRole("heading", { name: "Intermittent Fasting Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Schedule inputs")).toBeInTheDocument();
    expect(screen.getByText("Fasting result")).toBeInTheDocument();
    expect(screen.getByText("Fasting notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Last meal time")).toHaveValue("20:00");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/intermittent-fasting/about");
  });

  it("calculates the default window and saves the fasting plan locally", () => {
    renderWithIntl(<IntermittentFastingWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate windows" }));

    expect(screen.getAllByText("12:00").length).toBeGreaterThan(0);
    expect(screen.getByText("12:00 - 20:00")).toBeInTheDocument();
    expect(screen.getByText("20:00 - 12:00 (next day)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fasting plan" }));

    expect(window.localStorage.getItem("toolars.intermittent-fasting.plan:v1")).toContain("16:8");
  });
});
