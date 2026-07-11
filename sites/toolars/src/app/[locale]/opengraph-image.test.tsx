import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/og", () => ({
  ImageResponse: class MockImageResponse {
    element: unknown;
    options: unknown;

    constructor(element: unknown, options: unknown) {
      this.element = element;
      this.options = options;
    }
  }
}));

import { resolveOpenGraphImageText } from "./opengraph-image";

describe("locale OpenGraph image text", () => {
  it("keeps the edge image route from bundling full locale message files", () => {
    const source = readFileSync("src/app/[locale]/opengraph-image.tsx", "utf8");

    expect(source).not.toMatch(/from\s+["']\.\.\/\.\.\/\.\.\/messages\/.*\.json["']/);
  });

  it("resolves social image copy from locale messages", () => {
    expect(resolveOpenGraphImageText("en")).toMatchObject({
      alt: "Toolars - All tools. One workspace.",
      tagline: "All tools. One workspace.",
      headline: {
        primary: "All tools.",
        secondary: "One workspace."
      },
      subtitle: "Calculators, AI tools, PDF utilities, and workflows - local-first, free to start."
    });

    expect(resolveOpenGraphImageText("zh-hans")).toMatchObject({
      alt: "Toolars - 全部工具，一个工作台。",
      tagline: "全部工具，一个工作台。",
      headline: {
        primary: "全部工具。",
        secondary: "一个工作台。"
      }
    });

    expect(resolveOpenGraphImageText("es")).toMatchObject({
      alt: "Toolars - Todas las herramientas. Un solo espacio de trabajo.",
      tagline: "Todas las herramientas. Un solo espacio de trabajo.",
      headline: {
        primary: "Todas las herramientas.",
        secondary: "Un solo espacio de trabajo."
      }
    });
  });
});
