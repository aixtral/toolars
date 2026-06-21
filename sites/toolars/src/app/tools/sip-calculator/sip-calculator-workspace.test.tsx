import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SipCalculatorWorkspace } from "./sip-calculator-workspace";

describe("SipCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc SIP workspace sections", () => {
    render(<SipCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Fund SIP Calculator" })).toBeInTheDocument();
    expect(screen.getByText("SIP inputs")).toBeInTheDocument();
    expect(screen.getByText("SIP summary")).toBeInTheDocument();
    expect(screen.getByText("SIP notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly investment")).toHaveValue(500);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/sip-calculator/about");
  });

  it("calculates the default SIP projection and saves assumptions locally", () => {
    render(<SipCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate SIP returns" }));

    expect(screen.getByText("$36,738")).toBeInTheDocument();
    expect(screen.getByText("$30,000")).toBeInTheDocument();
    expect(screen.getByText("22.5%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save SIP plan" }));

    expect(window.localStorage.getItem("toolars.sip-calculator.plan")).toContain("500");
  });
});
