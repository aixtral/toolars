import { describe, expect, it } from "vitest";
import { lookupMimeTypes } from "./mime-lookup";

describe("lookupMimeTypes", () => {
  it("finds MIME types by extension", () => {
    const result = lookupMimeTypes({ query: ".json" });

    expect(result.matches[0]).toMatchObject({
      extension: ".json",
      mime: "application/json",
      category: "Application"
    });
  });

  it("finds related image MIME rows by keyword", () => {
    const result = lookupMimeTypes({ query: "image" });

    expect(result.matches.map((item) => item.mime)).toEqual(expect.arrayContaining(["image/png", "image/jpeg"]));
  });
});
