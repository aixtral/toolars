import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PregnancyDueDateWorkspace } from "./pregnancy-due-date-workspace";

describe("PregnancyDueDateWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-16T12:00:00Z"));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the local VitalCalc pregnancy due date workspace sections", () => {
    renderWithIntl(<PregnancyDueDateWorkspace />);

    expect(screen.getByRole("heading", { name: "Pregnancy Due Date Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Pregnancy timeline")).toBeInTheDocument();
    expect(screen.getByText("Due date result")).toBeInTheDocument();
    expect(screen.getByText("Medical reference notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-01-01")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/pregnancy-due-date/about"
    );
  });

  it("calculates the default due date and saves timeline locally", () => {
    renderWithIntl(<PregnancyDueDateWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate due date" }));

    expect(screen.getByText("October 10, 2026")).toBeInTheDocument();
    expect(screen.getByText("Week 23, Day 5")).toBeInTheDocument();
    expect(screen.getByText("2nd Trimester")).toBeInTheDocument();
    expect(screen.getByText("116 days")).toBeInTheDocument();
    expect(screen.getByText("Pregnancy timeline output is an estimate, not a diagnosis.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save timeline" }));

    expect(window.localStorage.getItem("toolars.pregnancy-due-date.timeline")).toContain("2026-01-01");
  });
});
