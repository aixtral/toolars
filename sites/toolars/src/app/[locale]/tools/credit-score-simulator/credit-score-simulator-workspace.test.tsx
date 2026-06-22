import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CreditScoreSimulatorWorkspace } from "./credit-score-simulator-workspace";

describe("CreditScoreSimulatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc credit score simulator workspace sections", () => {
    render(<CreditScoreSimulatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Credit Score Simulator" })).toBeInTheDocument();
    expect(screen.getByText("Credit scenario inputs")).toBeInTheDocument();
    expect(screen.getByText("Score simulation")).toBeInTheDocument();
    expect(screen.getByText("Credit model notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current credit score")).toHaveValue(680);
    expect(screen.getByLabelText("Simulated action")).toHaveValue("payoff");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/credit-score-simulator/about"
    );
  });

  it("simulates the default score change and saves assumptions locally", () => {
    render(<CreditScoreSimulatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Simulate score change" }));

    expect(screen.getByText("720")).toBeInTheDocument();
    expect(screen.getByText("+40")).toBeInTheDocument();
    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save score scenario" }));

    expect(window.localStorage.getItem("toolars.credit-score-simulator.plan")).toContain("680");
  });
});
