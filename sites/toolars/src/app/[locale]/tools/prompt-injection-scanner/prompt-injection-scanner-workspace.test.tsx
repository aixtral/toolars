import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { PromptInjectionScannerWorkspace } from "./prompt-injection-scanner-workspace";

describe("PromptInjectionScannerWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the Toolars AI security workspace sections", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "prompt-injection-scanner");
    expect(document.querySelector(".prompt-overview-panel")).toHaveAttribute("data-prompt-mobile-density", "title-single-line-v2");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Heuristic scan")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prompt Injection Scanner" })).toBeInTheDocument();
    expect(screen.getByText("Prompt surface")).toBeInTheDocument();
    expect(screen.getByText("Risk report")).toBeInTheDocument();
    expect(screen.getByText("Recommended remediation")).toBeInTheDocument();
    expect(screen.getByText("Heuristic rules run in-browser")).toBeInTheDocument();
  });

  it("scans the sample prompt and shows a critical risk report", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Scan prompt" }));

    expect(screen.getByText("Critical risk")).toBeInTheDocument();
    expect(screen.getByText("ignore instructions")).toBeInTheDocument();
    expect(screen.getByText("system prompt leak")).toBeInTheDocument();
    expect(screen.getByText("Create checklist")).toBeInTheDocument();
  });

  it("shows a safe local result for ordinary prompts", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    fireEvent.change(screen.getByLabelText("Prompt content"), {
      target: { value: "Summarize this product changelog into three customer-friendly bullets." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Scan prompt" }));

    expect(screen.getByText("Low risk")).toBeInTheDocument();
    expect(screen.getByText("No injection patterns detected")).toBeInTheDocument();
  });

  it("saves a draft without replacing the current prompt", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    const textarea = screen.getByLabelText("Prompt content");
    fireEvent.change(textarea, {
      target: { value: "Custom policy prompt for review." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    expect(textarea).toHaveValue("Custom policy prompt for review.");
    expect(window.localStorage.getItem("toolars.prompt-injection-scanner.draft")).toBe("Custom policy prompt for review.");
  });
});
