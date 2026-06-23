import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { SavingsChallengeWorkspace } from "./savings-challenge-workspace";

describe("SavingsChallengeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc savings challenge workspace sections", () => {
    renderWithIntl(<SavingsChallengeWorkspace />);

    expect(screen.getByRole("heading", { name: "Savings Challenge Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Challenge inputs")).toBeInTheDocument();
    expect(screen.getByText("Challenge summary")).toBeInTheDocument();
    expect(screen.getByText("Challenge notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Challenge mode")).toHaveValue("52week");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/savings-challenge/about");
  });

  it("calculates the default 52-week challenge and saves assumptions locally", () => {
    renderWithIntl(<SavingsChallengeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate savings challenge" }));

    expect(screen.getByText("¥1,378")).toBeInTheDocument();
    expect(screen.getByText("¥27")).toBeInTheDocument();
    expect(screen.getByText("52 weeks")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save challenge" }));

    expect(window.localStorage.getItem("toolars.savings-challenge.plan")).toContain("52week");
  });
});
