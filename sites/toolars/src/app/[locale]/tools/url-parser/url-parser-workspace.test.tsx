import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { UrlParserWorkspace } from "./url-parser-workspace";

describe("UrlParserWorkspace", () => {
  it("renders native URL parser controls", () => {
    renderWithIntl(<UrlParserWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "url-parser");
    expect(screen.getByRole("heading", { name: "URL Parser" })).toBeInTheDocument();
    expect(screen.getByLabelText("URL input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Parse URL" })).toBeDisabled();
  });

  it("parses URL components locally", () => {
    renderWithIntl(<UrlParserWorkspace />);

    fireEvent.change(screen.getByLabelText("URL input"), {
      target: { value: "https://example.com/docs?q=hello#top" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Parse URL" }));

    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("/docs")).toBeInTheDocument();
    expect(screen.getByText("q = hello")).toBeInTheDocument();
    expect(screen.getByText("Parsed")).toBeInTheDocument();
  });
});
