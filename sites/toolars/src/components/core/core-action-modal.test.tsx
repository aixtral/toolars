import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";
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
    renderWithIntl(
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
    renderWithIntl(
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
    renderWithIntl(
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
    renderWithIntl(
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

  it("renders the sign-up modal with the Google account creation entry", () => {
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" kind="sign-up">
        Sign up
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    const dialog = screen.getByRole("dialog", { name: "Create your Toolars account" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue with Google" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/api\/auth\/google\/start\?workspaceId=toolars_ws_/)
    );
    expect(screen.getByText("Create a free trial workspace with your Google account.")).toBeInTheDocument();
    expect(screen.queryByText("Start a free trial workspace with your Google account.")).not.toBeInTheDocument();
  });

  it("keeps shared core modal and focus helpers clean for the i18n source scanner", () => {
    const sourceFiles = ["src/components/core/core-action-modal.tsx", "src/components/core/use-dialog-focus.ts"];

    for (const sourceFile of sourceFiles) {
      const scan = scanSourceText(readFileSync(resolve(process.cwd(), sourceFile), "utf8"), sourceFile);

      expect(scan.hardcodedText).toEqual([]);
      expect(scan.absoluteHrefs).toEqual([]);
    }
  });
});
