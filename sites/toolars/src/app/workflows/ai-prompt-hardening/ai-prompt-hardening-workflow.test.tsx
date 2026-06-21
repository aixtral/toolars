import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiPromptHardeningWorkflow } from "./ai-prompt-hardening-workflow";

describe("AiPromptHardeningWorkflow", () => {
  it("renders the AI prompt hardening workflow sections from the design", () => {
    render(<AiPromptHardeningWorkflow />);

    expect(document.querySelector(".workflow-builder-layout")).toHaveAttribute("data-ai-lab-workflow", "mobile-edge-v3");
    expect(screen.getByRole("heading", { name: "AI Prompt Hardening Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Hardening canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Tool chain")).toBeInTheDocument();
    expect(screen.getByText("AI deep review")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System prompt" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /Prompt Injection Scanner/ })).toHaveAttribute(
      "href",
      "/tools/prompt-injection-scanner"
    );
    expect(screen.getAllByText("Scan")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Review consent" })).toBeInTheDocument();
  });

  it("simulates hardening when the user runs the workflow", () => {
    render(<AiPromptHardeningWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run hardening" }));

    expect(screen.getByText("Hardening report ready")).toBeInTheDocument();
    expect(screen.getByText(/3 injection patterns found/)).toBeInTheDocument();
    expect(screen.getByText(/Guardrails and red-team variants/)).toBeInTheDocument();
    expect(screen.getByLabelText("Prompt hardening progress")).toHaveAttribute("aria-valuenow", "82");
  });
});
