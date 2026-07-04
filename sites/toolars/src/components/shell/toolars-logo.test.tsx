import { existsSync, readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { TOOLARS_FAVICON_URL } from "@/lib/seo/brand-icons";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ToolarsShell } from "./toolars-shell";
import { ToolarsLogoMark } from "./toolars-logo";

function logoCssSource() {
  const source = readFileSync("src/app/globals.css", "utf8");
  const start = source.indexOf(".toolars-logo-mark {");
  const end = source.indexOf(".brand-name {", start);

  return source.slice(start, end);
}

describe("ToolarsLogoMark", () => {
  it("renders the selected Stack Monolith logo asset instead of rejected prior marks", () => {
    render(<ToolarsLogoMark label="Toolars" />);

    const mark = screen.getByTestId("toolars-logo-mark");
    const asset = mark.querySelector("img[data-logo-symbol='toolars-stack-monolith-asset']");

    expect(mark).toHaveAttribute("data-logo-mark", "toolars-stack-monolith-v9");
    expect(mark).toHaveTextContent("Toolars");
    expect(asset).toBeInTheDocument();
    expect(asset).toHaveAttribute("src", "/brand/toolars-stack-monolith-mark-v9.svg");
    expect(mark.querySelector("svg")).not.toBeInTheDocument();
    expect(mark.querySelector("[class*='lucide']")).not.toBeInTheDocument();
  });

  it("ships standalone SVG and PNG brand assets with refined Stack Monolith cues", () => {
    const svg = readFileSync("public/brand/toolars-stack-monolith-mark-v9.svg", "utf8");
    const png = readFileSync("public/brand/toolars-stack-monolith-mark-v9.png");

    expect(svg).toContain('data-brand-asset="toolars-stack-monolith-mark"');
    expect(svg).toContain('data-brand-concept="stack-monolith-refined"');
    expect(svg).toContain("Toolars Stack Monolith refined mark");
    expect(svg).toContain("interlocking modular plates");
    expect(svg).toContain("negative-space T core");
    expect(svg).toContain("emerald technical notch");
    expect(svg).not.toMatch(/cursor|spark|tool-os-kernel|stack-protocol|badge|shield|toolars-command-router|toolars-toolchain|toolars-circuit|drop-shadow|filter=|linearGradient|radialGradient/);
    expect(existsSync("public/brand/toolars-stack-monolith-mark-v9.png")).toBe(true);
    expect([...png.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });

  it("uses the redesigned Stack Monolith mark for browser and install icons", () => {
    const favicon = readFileSync("public/favicon.svg", "utf8");
    const appManifest = manifest();

    expect(favicon).toContain('data-brand-asset="toolars-stack-monolith-mark"');
    expect(favicon).toContain('data-brand-concept="stack-monolith-refined"');
    expect(favicon).toContain("negative-space T core");
    expect(favicon).not.toContain('rx="14"');
    expect(favicon).not.toContain('fill="#fff"');
    expect(appManifest.icons).toEqual([
      {
        src: TOOLARS_FAVICON_URL,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]);
  });

  it("keeps the brand mark free of boxes, borders, and shadow treatments", () => {
    const css = logoCssSource();

    expect(css).not.toMatch(/background:|border:|border-radius|box-shadow|drop-shadow|filter:/);
  });

  it("uses the redesigned mark in the topbar brand instead of the old terminal glyph", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    const brand = container.querySelector(".brand");

    expect(brand?.querySelector("[data-logo-mark='toolars-stack-monolith-v9']")).toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-mark='toolars-stack-protocol-v8']")).not.toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-mark='toolars-os-kernel-v7']")).not.toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-mark='toolars-ai-forge-v6']")).not.toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-symbol='toolars-command-router']")).not.toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-symbol='toolars-toolchain-network']")).not.toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-mark='toolars-wordmark-v3']")).not.toBeInTheDocument();
    expect(brand?.querySelector("[data-logo-mark='toolars-circuit-v2']")).not.toBeInTheDocument();
    expect(brand?.querySelector(".lucide-square-terminal")).not.toBeInTheDocument();
  });
});
