import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CreditCardAprWorkspace } from "./credit-card-apr-workspace";

describe("CreditCardAprWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc credit card APR workspace sections", () => {
    render(<CreditCardAprWorkspace />);

    expect(screen.getByRole("heading", { name: "Credit Card APR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Installment inputs")).toBeInTheDocument();
    expect(screen.getByText("True APR summary")).toBeInTheDocument();
    expect(screen.getByText("Credit cost notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Installment amount")).toHaveValue(10000);
    expect(screen.getByLabelText("Number of payments")).toHaveValue("12");
    expect(screen.getByLabelText("Monthly fee rate")).toHaveValue(0.6);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/credit-card-apr/about"
    );
  });

  it("calculates the default true APR and saves assumptions locally", () => {
    render(<CreditCardAprWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Reveal true APR" }));

    expect(screen.getByText("13.03%")).toBeInTheDocument();
    expect(screen.getByText("7.20%")).toBeInTheDocument();
    expect(screen.getByText("$720")).toBeInTheDocument();
    expect(screen.getByText("$10,720")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save APR plan" }));

    expect(window.localStorage.getItem("toolars.credit-card-apr.plan")).toContain("10000");
  });
});
