import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { AiGuardrailConfigWorkspace } from "./ai-guardrail-config-workspace";

describe("AiGuardrailConfigWorkspace", () => {
  it("renders the Toolars guardrail config workspace sections", () => {
    renderWithIntl(<AiGuardrailConfigWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "ai-guardrail-config");
    expect(screen.getByRole("heading", { name: "AI Guardrail Config" })).toBeInTheDocument();
    expect(screen.getByText("Guardrail builder")).toBeInTheDocument();
    expect(screen.getByText("Export preview")).toBeInTheDocument();
    expect(screen.getByText("Review checklist")).toBeInTheDocument();
    expect(screen.getByLabelText("Config name")).toBeInTheDocument();
  });

  it("builds a local guardrail export preview", () => {
    renderWithIntl(<AiGuardrailConfigWorkspace />);

    fireEvent.change(screen.getByLabelText("Config name"), {
      target: { value: "Checkout assistant" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Build config" }));

    expect(screen.getByText("checkout-assistant-guardrails")).toBeInTheDocument();
    expect(screen.getByText("Local guardrail config builder only; policy drafts stay in the browser.")).toBeInTheDocument();
  });
});
