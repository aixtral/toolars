import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { EmergencyFundWorkspace } from "./emergency-fund-workspace";

describe("EmergencyFundWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc emergency fund workspace sections", () => {
    renderWithIntl(<EmergencyFundWorkspace />);

    expect(screen.getByRole("heading", { name: "Emergency Fund Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Emergency inputs")).toBeInTheDocument();
    expect(screen.getByText("Fund target")).toBeInTheDocument();
    expect(screen.getByText("Emergency notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/emergency-fund/about"
    );
  });

  it("calculates the default emergency target and saves assumptions locally", () => {
    renderWithIntl(<EmergencyFundWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate fund" }));

    expect(screen.getByText("$18,000")).toBeInTheDocument();
    expect(screen.getByText("$13,000")).toBeInTheDocument();
    expect(screen.getByText("$1,083")).toBeInTheDocument();
    expect(screen.getByText("Savings progress $5,000 / $18,000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fund plan" }));

    expect(window.localStorage.getItem("toolars.emergency-fund.plan")).toContain("3000");
  });
});
