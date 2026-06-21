import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CompoundInterestWorkspace } from "./compound-interest-workspace";

describe("CompoundInterestWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc compound interest workspace sections", () => {
    render(<CompoundInterestWorkspace />);

    expect(screen.getByRole("heading", { name: "Compound Interest Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Investment inputs")).toBeInTheDocument();
    expect(screen.getByText("Growth summary")).toBeInTheDocument();
    expect(screen.getByText("Investment notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/compound-interest/about"
    );
  });

  it("calculates the default growth plan and saves it locally", () => {
    render(<CompoundInterestWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate growth" }));

    expect(screen.getByText("$300,851")).toBeInTheDocument();
    expect(screen.getByText("$120,000")).toBeInTheDocument();
    expect(screen.getByText("$170,851")).toBeInTheDocument();
    expect(screen.getByText("Year 1 balance $16,919 with $919 interest")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save plan" }));

    expect(window.localStorage.getItem("toolars.compound-interest.plan")).toContain("10000");
  });
});
