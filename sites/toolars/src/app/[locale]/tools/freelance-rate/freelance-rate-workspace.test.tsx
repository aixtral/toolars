import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { FreelanceRateWorkspace } from "./freelance-rate-workspace";

describe("FreelanceRateWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc freelance rate workspace sections", () => {
    renderWithIntl(<FreelanceRateWorkspace />);

    expect(screen.getByRole("heading", { name: "Freelance Rate Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Rate inputs")).toBeInTheDocument();
    expect(screen.getByText("Rate floor summary")).toBeInTheDocument();
    expect(screen.getByText("Pricing notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Target annual income")).toHaveValue(200000);
    expect(screen.getByLabelText("Non-billable time")).toHaveValue("0.3");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/freelance-rate/about"
    );
  });

  it("calculates the default rate floor and saves assumptions locally", () => {
    renderWithIntl(<FreelanceRateWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate rate floor" }));

    expect(screen.getByText("¥241")).toBeInTheDocument();
    expect(screen.getByText("¥1,928")).toBeInTheDocument();
    expect(screen.getByText("¥9,640")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save rate plan" }));

    expect(window.localStorage.getItem("toolars.freelance-rate.plan")).toContain("200000");
  });
});
