import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { UserAgentParserWorkspace } from "./user-agent-parser-workspace";

const chromeWindows =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

describe("UserAgentParserWorkspace", () => {
  it("renders native User-Agent parser controls", () => {
    renderWithIntl(<UserAgentParserWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "user-agent-parser");
    expect(screen.getByRole("heading", { name: "User Agent Parser" })).toBeInTheDocument();
    expect(screen.getByLabelText("User-Agent string")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Parse User-Agent" })).toBeDisabled();
  });

  it("parses browser and operating system signals locally", () => {
    renderWithIntl(<UserAgentParserWorkspace />);

    fireEvent.change(screen.getByLabelText("User-Agent string"), { target: { value: chromeWindows } });
    fireEvent.click(screen.getByRole("button", { name: "Parse User-Agent" }));

    expect(screen.getAllByText("Chrome 125.0.0.0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Windows 10.0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Blink").length).toBeGreaterThan(0);
    expect(screen.getByText("Parsed")).toBeInTheDocument();
  });
});
