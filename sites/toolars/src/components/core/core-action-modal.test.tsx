import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CoreActionModalButton } from "./core-action-modal";

describe("CoreActionModalButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("moves focus into the dialog and restores the trigger after Close", () => {
    render(
      <CoreActionModalButton
        className="button button-outline-neutral"
        itemName="PDF Toolkit"
        kind="share"
        sharePath="/tools/pdf-toolkit/about"
      >
        Share
      </CoreActionModalButton>
    );

    const trigger = screen.getByRole("button", { name: "Share" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Share this tool" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog", { name: "Share this tool" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape and restores focus to the opener", () => {
    render(
      <CoreActionModalButton className="button button-solid" itemName="PDF Ops Kit" kind="save-collection">
        Save collection
      </CoreActionModalButton>
    );

    const trigger = screen.getByRole("button", { name: "Save collection" });

    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Save collection" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Save collection" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps only one core modal mounted when another action opens", () => {
    render(
      <>
        <CoreActionModalButton
          className="button button-outline-neutral"
          kind="share"
          sharePath="/tools/pdf-toolkit/about"
        >
          Share
        </CoreActionModalButton>
        <CoreActionModalButton className="button button-solid" kind="sign-in">
          Sign in
        </CoreActionModalButton>
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("dialog", { name: "Share this tool" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.queryByRole("dialog", { name: "Share this tool" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Sign in to Toolars" })).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("keeps sign-in Google-only for free trial accounts", () => {
    render(
      <CoreActionModalButton className="button button-solid" kind="sign-in">
        Sign in
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.queryByLabelText("Work email")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continue with email" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue with Google" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/api\/auth\/google\/start\?workspaceId=toolars_ws_/)
    );
    expect(screen.getByText("Start a free trial workspace with your Google account.")).toBeInTheDocument();
  });
});
