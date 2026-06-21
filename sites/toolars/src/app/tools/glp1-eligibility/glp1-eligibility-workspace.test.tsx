import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Glp1EligibilityWorkspace } from "./glp1-eligibility-workspace";

describe("Glp1EligibilityWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc GLP-1 eligibility workspace sections", () => {
    render(<Glp1EligibilityWorkspace />);

    expect(screen.getByRole("heading", { name: "GLP-1 Eligibility Check" })).toBeInTheDocument();
    expect(screen.getByText("Eligibility inputs")).toBeInTheDocument();
    expect(screen.getByText("Criteria result")).toBeInTheDocument();
    expect(screen.getByText("Prescription notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Height (cm)")).toHaveValue(170);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/glp1-eligibility/about");
  });

  it("calculates criteria status and saves the local eligibility snapshot", () => {
    render(<Glp1EligibilityWorkspace />);

    fireEvent.click(screen.getByLabelText("Hypertension"));
    fireEvent.click(screen.getByRole("button", { name: "Check common criteria" }));

    expect(screen.getByText("29.4")).toBeInTheDocument();
    expect(screen.getByText("Common criteria match")).toBeInTheDocument();
    expect(screen.getByText("1 selected")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save eligibility snapshot" }));

    expect(window.localStorage.getItem("toolars.glp1-eligibility.snapshot:v1")).toContain("\"heightCm\":170");
  });
});
