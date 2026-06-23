import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmokeFreeWorkspace } from "./smoke-free-workspace";

describe("SmokeFreeWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-19T12:00:00Z"));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the local VitalCalc smoke-free workspace sections", () => {
    renderWithIntl(<SmokeFreeWorkspace />);

    expect(screen.getByRole("heading", { name: "Quit Smoking Tracker" })).toBeInTheDocument();
    expect(screen.getByText("Quit inputs")).toBeInTheDocument();
    expect(screen.getByText("Recovery summary")).toBeInTheDocument();
    expect(screen.getByText("Recovery notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Quit date")).toHaveValue("2026-01-01");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/smoke-free/about");
  });

  it("calculates smoke-free progress and saves the quit plan locally", () => {
    renderWithIntl(<SmokeFreeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Track recovery" }));

    expect(screen.getByText("169 days")).toBeInTheDocument();
    expect(screen.getByText("$1,690")).toBeInTheDocument();
    expect(screen.getByText("3,380 cigarettes")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save quit plan" }));

    expect(window.localStorage.getItem("toolars.smoke-free.plan:v1")).toContain("2026-01-01");
  });
});
