import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { GlycemicLoadWorkspace } from "./glycemic-load-workspace";

describe("GlycemicLoadWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc glycemic load workspace sections", () => {
    render(<GlycemicLoadWorkspace />);

    expect(screen.getByRole("heading", { name: "Glycemic Load Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Food inputs")).toBeInTheDocument();
    expect(screen.getByText("Glycemic summary")).toBeInTheDocument();
    expect(screen.getByText("Glycemic load notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Glycemic Index (GI)")).toHaveValue(73);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/glycemic-load/about");
  });

  it("calculates the default GL result and saves the food sample locally", () => {
    render(<GlycemicLoadWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate glycemic load" }));

    expect(screen.getByText("30.7")).toBeInTheDocument();
    expect(screen.getByText("42.0 g")).toBeInTheDocument();
    expect(screen.getAllByText("High GL (Limit)").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save food sample" }));

    expect(window.localStorage.getItem("toolars.glycemic-load.sample:v1")).toContain("white-rice");
  });
});
