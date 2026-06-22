import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AdhdScreenerWorkspace } from "./adhd-screener-workspace";

describe("AdhdScreenerWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc ADHD screener workspace sections", () => {
    render(<AdhdScreenerWorkspace />);

    expect(screen.getByRole("heading", { name: "ADHD Adult Screener" })).toBeInTheDocument();
    expect(screen.getByText("ASRS answers")).toBeInTheDocument();
    expect(screen.getByText("Screening result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Trouble wrapping up final details")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/adhd-screener/about");
  });

  it("scores answers and saves the local ADHD snapshot", () => {
    render(<AdhdScreenerWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score ASRS" }));

    expect(screen.getByText("10 / 24")).toBeInTheDocument();
    expect(screen.getByText("Screening positive")).toBeInTheDocument();
    expect(screen.getByText("4 / 6")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save screener snapshot" }));

    expect(window.localStorage.getItem("toolars.adhd-screener.snapshot:v1")).toContain("\"answers\":[2,2,2,2,1,1]");
  });
});
