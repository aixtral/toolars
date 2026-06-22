import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { RentVsBuyWorkspace } from "./rent-vs-buy-workspace";

describe("RentVsBuyWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc rent vs buy workspace sections", () => {
    render(<RentVsBuyWorkspace />);

    expect(screen.getByRole("heading", { name: "Rent vs Buy Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Housing comparison inputs")).toBeInTheDocument();
    expect(screen.getByText("Decision summary")).toBeInTheDocument();
    expect(screen.getByText("Housing notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Home price")).toHaveValue(300000);
    expect(screen.getByLabelText("Monthly rent")).toHaveValue(1500);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/rent-vs-buy/about"
    );
  });

  it("calculates the default rent vs buy comparison and saves assumptions locally", () => {
    render(<RentVsBuyWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Compare rent vs buy" }));

    expect(screen.getByText("Renting is better")).toBeInTheDocument();
    expect(screen.getByText("$408,479")).toBeInTheDocument();
    expect(screen.getByText("$222,000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save housing case" }));

    expect(window.localStorage.getItem("toolars.rent-vs-buy.plan")).toContain("300000");
  });
});
