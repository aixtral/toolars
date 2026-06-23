import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { HomaIrWorkspace } from "./homa-ir-workspace";

describe("HomaIrWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc HOMA-IR workspace sections", () => {
    renderWithIntl(<HomaIrWorkspace />);

    expect(screen.getByRole("heading", { name: "HOMA-IR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lab inputs")).toBeInTheDocument();
    expect(screen.getByText("Insulin resistance summary")).toBeInTheDocument();
    expect(screen.getByText("HOMA-IR notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fasting glucose")).toHaveValue(5.5);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/homa-ir/about");
  });

  it("calculates the default HOMA-IR result and saves lab values locally", () => {
    renderWithIntl(<HomaIrWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate HOMA-IR" }));

    expect(screen.getByText("2.93")).toBeInTheDocument();
    expect(screen.getAllByText("Insulin Resistance").length).toBeGreaterThan(0);
    expect(screen.getByText("5.5 mmol/L")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lab values" }));

    expect(window.localStorage.getItem("toolars.homa-ir.labs:v1")).toContain("5.5");
  });
});
