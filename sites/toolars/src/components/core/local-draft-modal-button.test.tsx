import { fireEvent, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { LocalDraftModalButton, extractBookmarkUrls } from "./local-draft-modal-button";

describe("LocalDraftModalButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores a named local draft and leaves visible success evidence", () => {
    renderWithIntl(
      <LocalDraftModalButton className="button button-solid" draftKind="workflow" label="Create workflow" storageKey="toolars.local-workflows:v1" />
    );

    fireEvent.click(screen.getByRole("button", { name: "Create workflow" }));
    const dialog = screen.getByRole("dialog", { name: "Create workflow" });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Create workflow" }), { target: { value: "Quality gate" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Create workflow" }));

    expect(within(dialog).getByRole("status")).toHaveTextContent("Quality gate");
    expect(window.localStorage.getItem("toolars.local-workflows:v1")).toContain('\"name\":\"Quality gate\"');
  });

  it("extracts bookmark URLs from browser HTML and JSON exports", () => {
    expect(extractBookmarkUrls('<a href="https://toolars.example/tools/pdf-toolkit">PDF Toolkit</a>')).toEqual([
      "https://toolars.example/tools/pdf-toolkit"
    ]);
    expect(extractBookmarkUrls('[{\"url\":\"https://toolars.example/workflows/pdf-summary\"}]')).toEqual([
      "https://toolars.example/workflows/pdf-summary"
    ]);
  });
});
