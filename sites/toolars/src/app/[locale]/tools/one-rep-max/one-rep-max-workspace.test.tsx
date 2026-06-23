import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { OneRepMaxWorkspace } from "./one-rep-max-workspace";

describe("OneRepMaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc one rep max workspace sections", () => {
    renderWithIntl(<OneRepMaxWorkspace />);

    expect(screen.getByRole("heading", { name: "1RM Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lift inputs")).toBeInTheDocument();
    expect(screen.getByText("Strength result")).toBeInTheDocument();
    expect(screen.getByText("Strength notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Working weight (kg)")).toHaveValue(80);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/one-rep-max/about");
  });

  it("calculates the default Epley estimate and saves the lift locally", () => {
    renderWithIntl(<OneRepMaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate 1RM" }));

    expect(screen.getByText("93.3 kg")).toBeInTheDocument();
    expect(screen.getByText("88.7 kg")).toBeInTheDocument();
    expect(screen.getByText("95% x 2 reps")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lift" }));

    expect(window.localStorage.getItem("toolars.one-rep-max.lift:v1")).toContain("80");
  });
});
