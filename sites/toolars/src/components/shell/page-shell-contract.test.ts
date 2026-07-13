import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const localeAppDirectory = "src/app/[locale]";
const pageFiles = readdirSync(localeAppDirectory, { recursive: true })
  .filter((file): file is string => typeof file === "string" && file.endsWith("page.tsx"))
  .map((file) => join(localeAppDirectory, file));

describe("public route shell contract", () => {
  it("routes every locale page through the shared ToolarsShell header", () => {
    const routesWithoutSharedShell = pageFiles.filter((file) => {
      const source = readFileSync(file, "utf8");
      return !source.includes('components/shell/toolars-shell') || !source.includes("<ToolarsShell");
    });

    expect(pageFiles.length).toBeGreaterThan(0);
    expect(routesWithoutSharedShell).toEqual([]);
  });
});
