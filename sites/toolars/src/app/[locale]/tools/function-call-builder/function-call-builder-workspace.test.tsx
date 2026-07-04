import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { FunctionCallBuilderWorkspace } from "./function-call-builder-workspace";

describe("FunctionCallBuilderWorkspace", () => {
  it("renders and builds a local function schema", () => {
    renderWithIntl(<FunctionCallBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "function-call-builder");
    expect(screen.getByRole("heading", { name: "Function Call Builder" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Parameter rows"), {
      target: { value: "email:string:required:Customer email" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Build function schema" }));

    expect(screen.getByText(/"email"/)).toBeInTheDocument();
    expect(screen.getAllByText(/Function schema ready/).length).toBeGreaterThan(0);
  });
});
