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

  it("keeps sign-in as a borderless ghost action and sign-up as the only solid action", () => {
    const signIn = cssBlockContaining(".topbar-account-actions .topbar-sign-in");
    const signUp = cssBlockContaining(".topbar-account-actions .topbar-sign-up");

    expect(signIn).not.toMatch(/background\s*:/);
    expect(signIn).toContain("border: 0");
    expect(signUp).toContain("background: var(--emerald)");
    expect(signUp).toContain("border: 0");
  });
});
