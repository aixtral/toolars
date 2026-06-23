import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { LeanBodyMassWorkspace } from "./lean-body-mass-workspace";

describe("LeanBodyMassWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc lean body mass workspace sections", () => {
    renderWithIntl(<LeanBodyMassWorkspace />);

    expect(screen.getByRole("heading", { name: "Lean Body Mass Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Composition inputs")).toBeInTheDocument();
    expect(screen.getByText("Lean mass result")).toBeInTheDocument();
    expect(screen.getByText("Composition notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/lean-body-mass/about"
    );
  });

  it("calculates lean mass and saves composition assumptions locally", () => {
    renderWithIntl(<LeanBodyMassWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate lean mass" }));

    expect(screen.getByText("56.0 kg")).toBeInTheDocument();
    expect(screen.getByText("14.0 kg")).toBeInTheDocument();
    expect(screen.getByText("80.0%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save composition" }));

    expect(window.localStorage.getItem("toolars.lean-body-mass.composition")).toContain("20");
  });
});
