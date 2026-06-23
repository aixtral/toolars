import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { RuleOf72Workspace } from "./rule-of-72-workspace";

describe("RuleOf72Workspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc Rule of 72 workspace sections", () => {
    renderWithIntl(<RuleOf72Workspace />);

    expect(screen.getByRole("heading", { name: "Rule of 72 Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Doubling inputs")).toBeInTheDocument();
    expect(screen.getByText("Doubling time summary")).toBeInTheDocument();
    expect(screen.getByText("Shortcut notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Annual return rate")).toHaveValue(7);
    expect(screen.getByLabelText("Initial investment")).toHaveValue(10000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/rule-of-72/about"
    );
  });

  it("calculates the default doubling time and saves assumptions locally", () => {
    renderWithIntl(<RuleOf72Workspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate doubling time" }));

    expect(screen.getByText("10.3 years")).toBeInTheDocument();
    expect(screen.getByText("10.24 years")).toBeInTheDocument();
    expect(screen.getByText("$20,000")).toBeInTheDocument();
    expect(screen.getByText("7.2%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save Rule of 72 case" }));

    expect(window.localStorage.getItem("toolars.rule-of-72.plan")).toContain("10000");
  });
});
