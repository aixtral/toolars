import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ChmodCalculatorWorkspace } from "./chmod-calculator-workspace";

describe("ChmodCalculatorWorkspace", () => {
  it("renders native chmod calculator controls", () => {
    renderWithIntl(<ChmodCalculatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "chmod-calculator");
    expect(screen.getByRole("heading", { name: "Chmod Calculator" })).toBeInTheDocument();
    expect(screen.getByLabelText("Permission input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calculate chmod" })).toBeEnabled();
  });

  it("calculates symbolic output and warnings from octal input", () => {
    renderWithIntl(<ChmodCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Permission input"), { target: { value: "777" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate chmod" }));

    expect(screen.getByText("rwxrwxrwx")).toBeInTheDocument();
    expect(screen.getByText("chmod 777 <path>")).toBeInTheDocument();
    expect(screen.getByText("World-writable permissions require careful review.")).toBeInTheDocument();
  });
});
