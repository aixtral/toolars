import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SubscriptionAuditWorkspace } from "./subscription-audit-workspace";

describe("SubscriptionAuditWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc subscription audit workspace sections", () => {
    render(<SubscriptionAuditWorkspace />);

    expect(screen.getByRole("heading", { name: "Subscription Audit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Subscription inputs")).toBeInTheDocument();
    expect(screen.getByText("Audit summary")).toBeInTheDocument();
    expect(screen.getByText("Subscription review notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Netflix")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/subscription-audit/about");
  });

  it("calculates the default subscription audit and saves assumptions locally", () => {
    render(<SubscriptionAuditWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate audit" }));

    expect(screen.getByText("$126.69")).toBeInTheDocument();
    expect(screen.getByText("$1,520.28")).toBeInTheDocument();
    expect(screen.getByText("$25.34")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save audit list" }));

    expect(window.localStorage.getItem("toolars.subscription-audit.entries")).toContain("Netflix");
  });
});
