import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { MetaTagGeneratorWorkspace } from "./meta-tag-generator-workspace";

describe("MetaTagGeneratorWorkspace", () => {
  it("renders native meta tag controls and HTML output", () => {
    renderWithIntl(<MetaTagGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "meta-tag-generator");
    fireEvent.change(screen.getByLabelText("Page title"), { target: { value: "Toolars Launch" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate meta tags" }));

    expect(screen.getByLabelText("Meta tag output")).toHaveTextContent("<title>Toolars Launch</title>");
  });
});
