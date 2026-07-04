import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publicTools } from "@/data/registry";
import { getToolIconSignature } from "./tool-icon";

describe("ToolIcon audit sentinels", () => {
  it("keeps non-visible routing tokens out of inline string includes checks", () => {
    const source = readFileSync(join(process.cwd(), "src/components/tools/tool-icon.tsx"), "utf8");

    expect(source).not.toMatch(/\.includes\(\s*["'][^"']+["']\s*\)/);
  });

  it("gives every public tool card a distinct icon signature", () => {
    const signatures = publicTools.map((tool) => [tool.slug, getToolIconSignature(tool)] as const);
    const duplicates = signatures.filter(([, signature], index) => signatures.findIndex(([, other]) => other === signature) !== index);

    expect(duplicates).toEqual([]);
  });
});
