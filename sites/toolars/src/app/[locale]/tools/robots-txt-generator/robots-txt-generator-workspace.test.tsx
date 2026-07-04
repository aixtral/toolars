import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { RobotsTxtGeneratorWorkspace } from "./robots-txt-generator-workspace";

describe("RobotsTxtGeneratorWorkspace", () => {
  it("renders native robots.txt controls and crawler output", () => {
    renderWithIntl(<RobotsTxtGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "robots-txt-generator");
    fireEvent.change(screen.getByLabelText("Disallow paths"), { target: { value: "/admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate robots.txt" }));

    expect(screen.getByLabelText("robots.txt output")).toHaveTextContent("Disallow: /admin");
  });
});
