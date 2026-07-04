import { describe, expect, it } from "vitest";
import {
  buildSlugHistory,
  generateSlug,
  generateSlugBatch,
  transliterateSlugText,
  type SlugHistoryEntry
} from "./slug-generator";

describe("generateSlug", () => {
  it("slugifies titles with transliteration, separator, lowercase, and max length options", () => {
    expect(generateSlug(" Café Résumé: Launch Notes! ")).toBe("cafe-resume-launch-notes");
    expect(generateSlug("Hello World", { separator: "_" })).toBe("hello_world");
    expect(generateSlug("Hello World", { lowercase: false })).toBe("Hello-World");
    expect(generateSlug("Hello World Foo Bar", { maxLength: 15 })).toBe("hello-world-foo");
    expect(transliterateSlugText("café–über")).toBe("cafeuber");
  });

  it("deduplicates repeated batch slugs while preserving source rows", () => {
    const result = generateSlugBatch("Hello World\nhello-world\nCafé World", {
      separator: "-",
      deduplicate: true
    });

    expect(result.rows.map((row) => row.slug)).toEqual(["hello-world", "hello-world-2", "cafe-world"]);
    expect(result.duplicateCount).toBe(1);
    expect(result.output).toBe("hello-world\nhello-world-2\ncafe-world");
    expect(result.summary).toBe("3 slugs generated; 1 duplicate resolved.");
  });

  it("keeps generated history unique and capped to the latest entries", () => {
    const existing: SlugHistoryEntry[] = Array.from({ length: 10 }, (_, index) => ({
      slug: `old-${index}`,
      source: `Old ${index}`
    }));

    const next = buildSlugHistory(existing, [
      { slug: "old-2", source: "Old duplicate" },
      { slug: "fresh-slug", source: "Fresh Slug" }
    ]);

    expect(next.map((entry) => entry.slug).slice(0, 3)).toEqual(["fresh-slug", "old-2", "old-0"]);
    expect(next).toHaveLength(10);
  });
});
