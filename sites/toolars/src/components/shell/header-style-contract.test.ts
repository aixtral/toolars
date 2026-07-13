import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");

function cssBlockContaining(selector: string): string {
  const index = css.indexOf(selector);
  if (index < 0) throw new Error(`Missing CSS selector: ${selector}`);
  const open = css.indexOf("{", index);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

describe("topbar visual style contract", () => {
  it("keeps the active nav item as an underline-only state", () => {
    const block = cssBlockContaining(".topbar-nav-link.is-active");

    expect(block).toContain("color: var(--emerald)");
    expect(block).toContain("box-shadow: inset 0 -2px 0 var(--emerald)");
    expect(block).toContain("border-radius: 0");
    expect(block).not.toMatch(/background\s*:/);
    expect(block).not.toMatch(/border(?:-color)?\s*:/);
  });

  it("keeps account actions free of an outer framed capsule", () => {
    const block = cssBlockContaining(".topbar-account-actions");

    expect(block).not.toMatch(/background\s*:/);
    expect(block).not.toMatch(/border(?:-color|-radius)?\s*:/);
  });

  it("reserves a language-independent desktop width for the command search", () => {
    const block = cssBlockContaining(".topbar");

    expect(block).toContain("--topbar-command-width: 400px");
    expect(block).toContain("grid-template-columns: minmax(188px, 220px) var(--topbar-command-width) minmax(0, 1fr)");
  });

  it("keeps sign-in as a borderless ghost action and sign-up as the only solid action", () => {
    const signIn = cssBlockContaining(".topbar-account-actions .topbar-sign-in");
    const signUp = cssBlockContaining(".topbar-account-actions .topbar-sign-up");

    expect(signIn).not.toMatch(/background\s*:/);
    expect(signIn).toContain("border: 0");
    expect(signUp).toContain("background: var(--emerald)");
    expect(signUp).toContain("border: 0");
  });

  it("keeps core auth modal forms constrained inside the dialog", () => {
    const form = cssBlockContaining(".core-modal-auth-form");
    const input = cssBlockContaining(".core-modal-field input");

    expect(form).toContain("display: grid");
    expect(form).toContain("min-width: 0");
    expect(input).toContain("max-width: 100%");
  });

  it("does not show the browser focus outline around the auth dialog", () => {
    const dialog = cssBlockContaining(".core-modal-dialog:focus");
    const closeButton = cssBlockContaining(".core-modal-icon-button:focus-visible");

    expect(dialog).toContain("outline: none");
    expect(closeButton).toContain("outline: none");
  });
});
