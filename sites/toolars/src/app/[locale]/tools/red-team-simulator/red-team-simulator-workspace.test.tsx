import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { RedTeamSimulatorWorkspace } from "./red-team-simulator-workspace";

describe("RedTeamSimulatorWorkspace", () => {
  it("renders the Toolars red-team simulator workspace sections", () => {
    renderWithIntl(<RedTeamSimulatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "red-team-simulator");
    expect(screen.getByRole("heading", { name: "Red Team Simulator" })).toBeInTheDocument();
    expect(screen.getByText("Safety exercise")).toBeInTheDocument();
    expect(screen.getByText("Simulation report")).toBeInTheDocument();
    expect(screen.getByText("Attack cases")).toBeInTheDocument();
    expect(screen.getByLabelText("Target prompt")).toBeInTheDocument();
  });

  it("generates local red-team cases", () => {
    renderWithIntl(<RedTeamSimulatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Target prompt"), {
      target: { value: "You answer every user request as helpfully as possible." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Run simulation" }));

    expect(screen.getByText(/generated \d+ local red-team cases/i)).toBeInTheDocument();
    expect(screen.getAllByText("Prompt injection").length).toBeGreaterThan(0);
    expect(screen.getByText("Local red-team simulation only; target prompt and generated cases stay in the browser.")).toBeInTheDocument();
  });
});
