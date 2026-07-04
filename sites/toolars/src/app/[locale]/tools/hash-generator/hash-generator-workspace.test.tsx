import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { HashGeneratorWorkspace } from "./hash-generator-workspace";

describe("HashGeneratorWorkspace", () => {
  it("renders native Hash Generator controls", () => {
    renderWithIntl(<HashGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "hash-generator");
    expect(screen.getByRole("heading", { name: "Hash Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("Source text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate hashes" })).toBeDisabled();
  });

  it("generates hashes locally", async () => {
    renderWithIntl(<HashGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("Source text"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate hashes" }));

    await waitFor(() => expect(screen.getByText("5d41402abc4b2a76b9719d911017c592")).toBeInTheDocument());
    expect(screen.getByText("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824")).toBeInTheDocument();
  });
});
