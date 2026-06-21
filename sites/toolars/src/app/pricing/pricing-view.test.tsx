import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingView } from "./pricing-view";

describe("PricingView", () => {
  it("renders the pricing modules from the design", () => {
    const { container } = render(<PricingView />);

    expect(container.querySelector('[data-pricing-page="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-pricing-mobile-layout="mixed-tools-v2"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start your free Toolars trial." })).toBeInTheDocument();
    expect(screen.getByText("Free trial for mixed tools")).toBeInTheDocument();
    expect(screen.getAllByText(/Traditional local tools stay free/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Free trial mode").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("button", { name: "Monthly" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Yearly/ })).not.toBeInTheDocument();
    expect(screen.getAllByText("Trial workspace").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("Team")).not.toBeInTheDocument();
    expect(screen.queryByText("Compare plans")).not.toBeInTheDocument();
    expect(screen.getByText("Estimate your trial usage")).toBeInTheDocument();
    expect(screen.getByText("Frequently asked questions")).toBeInTheDocument();
    expect(screen.getByText("Local-first tools remain free")).toBeInTheDocument();
    expect(screen.getByText("AI processing only after consent")).toBeInTheDocument();
    expect(screen.getByText("No hidden uploads")).toBeInTheDocument();
  });

  it("shows trial limits and Google sign-in instead of paid upgrade CTAs", () => {
    render(<PricingView />);

    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.queryByText("$6.99")).not.toBeInTheDocument();
    expect(screen.queryByText("$14.99")).not.toBeInTheDocument();
    expect(screen.getByText("All traditional tools")).toBeInTheDocument();
    expect(screen.getByText("Unlimited local traditional tools")).toBeInTheDocument();
    expect(screen.getByText("PDF uploads up to 200 MB")).toBeInTheDocument();
    expect(screen.getAllByText("14 day synced history").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Start free trial").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5,000 trial AI credits").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: "Start free trial" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Upgrade/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("AI credits")).toHaveValue("5000");
    expect(screen.getByLabelText("Workflow runs")).toHaveValue("300");
    expect(screen.getByLabelText("File storage")).toHaveValue("5");
    expect(screen.getByText("Recommended plan")).toBeInTheDocument();
    expect(screen.getByText("Are traditional tools really free?")).toBeInTheDocument();
  });
});
