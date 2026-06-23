import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { ChildGrowthWorkspace } from "./child-growth-workspace";

describe("ChildGrowthWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc child growth workspace sections", () => {
    renderWithIntl(<ChildGrowthWorkspace />);

    expect(screen.getByRole("heading", { name: "Child BMI Growth Chart" })).toBeInTheDocument();
    expect(screen.getByText("Growth inputs")).toBeInTheDocument();
    expect(screen.getByText("Growth summary")).toBeInTheDocument();
    expect(screen.getByText("Growth notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Age years")).toHaveValue(8);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/child-growth/about");
  });

  it("assesses the default growth profile and saves it locally", () => {
    renderWithIntl(<ChildGrowthWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Assess growth curve" }));

    expect(screen.getByText("12.8th")).toBeInTheDocument();
    expect(screen.getByText("16.6")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("28.9-37.5 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save growth profile" }));

    expect(window.localStorage.getItem("toolars.child-growth.profile")).toContain("125");
  });
});
