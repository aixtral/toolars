import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { JsonPathTesterWorkspace } from "./json-path-tester-workspace";

describe("JsonPathTesterWorkspace", () => {
  it("renders native JSON Path Tester controls", () => {
    renderWithIntl(<JsonPathTesterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-path-tester");
    expect(screen.getByRole("heading", { name: "JSON Path Tester" })).toBeInTheDocument();
    expect(screen.getByLabelText("JSON input")).toBeInTheDocument();
    expect(screen.getByLabelText("JSONPath expression")).toBeInTheDocument();
  });

  it("runs JSONPath queries locally", () => {
    renderWithIntl(<JsonPathTesterWorkspace />);

    fireEvent.change(screen.getByLabelText("JSON input"), {
      target: { value: "{\"store\":{\"book\":[{\"author\":\"Ada\"},{\"author\":\"Grace\"}]}}" }
    });
    fireEvent.change(screen.getByLabelText("JSONPath expression"), { target: { value: "$.store.book[*].author" } });
    fireEvent.click(screen.getByRole("button", { name: "Run JSONPath" }));

    expect(screen.getAllByText(/\"Ada\"/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\"Grace\"/).length).toBeGreaterThan(0);
    expect(screen.getByText("2 matches")).toBeInTheDocument();
  });
});
