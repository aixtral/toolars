import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { WaistHipRatioWorkspace } from "./waist-hip-ratio-workspace";

describe("WaistHipRatioWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc waist-hip ratio workspace sections", () => {
    renderWithIntl(<WaistHipRatioWorkspace />);

    expect(screen.getByRole("heading", { name: "Waist-to-Hip Ratio Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Measurement inputs")).toBeInTheDocument();
    expect(screen.getByText("WHR summary")).toBeInTheDocument();
    expect(screen.getByText("WHR notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Waist (cm)")).toHaveValue(80);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/waist-hip-ratio/about");
  });

  it("calculates the default WHR and saves assumptions locally", () => {
    renderWithIntl(<WaistHipRatioWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate WHR" }));

    expect(screen.getByText("0.84")).toBeInTheDocument();
    expect(screen.getByText("Low Risk")).toBeInTheDocument();
    expect(screen.getByText("80 cm")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save measurements" }));

    expect(window.localStorage.getItem("toolars.waist-hip-ratio.measurements")).toContain("80");
  });
});
