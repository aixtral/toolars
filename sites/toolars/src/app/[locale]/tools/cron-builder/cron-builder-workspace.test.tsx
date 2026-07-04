import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CronBuilderWorkspace } from "./cron-builder-workspace";

describe("CronBuilderWorkspace", () => {
  it("renders and builds a cron expression", () => {
    renderWithIntl(<CronBuilderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "cron-builder");
    expect(screen.getByRole("heading", { name: "Cron Expression Builder" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Build cron" }));

    expect(screen.getByText("0 9 * * 1-5")).toBeInTheDocument();
    expect(screen.getByText(/Monday through Friday/)).toBeInTheDocument();
  });
});
