import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { HallucinationCheckerWorkspace } from "./hallucination-checker-workspace";

describe("HallucinationCheckerWorkspace", () => {
  it("renders the Toolars hallucination checker workspace sections", () => {
    renderWithIntl(<HallucinationCheckerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "hallucination-checker");
    expect(screen.getByRole("heading", { name: "Hallucination Checker" })).toBeInTheDocument();
    expect(screen.getByText("Evidence review")).toBeInTheDocument();
    expect(screen.getByText("Claim report")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Unsupported claims" })).toBeInTheDocument();
    expect(screen.getByLabelText("Answer text")).toBeInTheDocument();
    expect(screen.getByLabelText("Source text")).toBeInTheDocument();
  });

  it("flags unsupported claims locally", () => {
    renderWithIntl(<HallucinationCheckerWorkspace />);

    fireEvent.change(screen.getByLabelText("Answer text"), {
      target: { value: "Studies indicate 87% of teams will definitely replace search in 2027." }
    });
    fireEvent.change(screen.getByLabelText("Source text"), {
      target: { value: "The source only says teams are evaluating search improvements." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Check claims" }));

    expect(screen.getByText(/unsupported claim signals need review/i)).toBeInTheDocument();
    expect(screen.getByText("Local hallucination heuristic only; answer and source text stay in the browser.")).toBeInTheDocument();
  });
});
