import { describe, expect, it } from "vitest";
import { runJsonPathQuery } from "./json-path-tester";

const sampleJson = JSON.stringify({
  store: {
    book: [
      { category: "reference", author: "Nigel Rees", title: "Sayings of the Century", price: 8.95 },
      { category: "fiction", author: "Evelyn Waugh", title: "Sword of Honour", price: 12.99 },
      { category: "fiction", author: "Herman Melville", title: "Moby Dick", isbn: "0-553-21311-3", price: 8.99 }
    ],
    bicycle: { color: "red", price: 19.95 }
  }
});

describe("json-path-tester core logic", () => {
  it("queries nested JSON arrays with source-compatible JSONPath syntax", () => {
    const result = runJsonPathQuery({ jsonInput: sampleJson, path: "$.store.book[*].author" });

    expect(result.success).toBe(true);
    expect(result.matches).toEqual(["Nigel Rees", "Evelyn Waugh", "Herman Melville"]);
    expect(result.stats.matchCount).toBe(3);
  });

  it("supports simple predicates and invalid JSON errors", () => {
    const filtered = runJsonPathQuery({ jsonInput: sampleJson, path: "$.store.book[?(@.price < 10)].title" });
    const invalid = runJsonPathQuery({ jsonInput: "{bad", path: "$" });

    expect(filtered.matches).toEqual(["Sayings of the Century", "Moby Dick"]);
    expect(invalid.success).toBe(false);
    expect(invalid.error?.type).toBe("invalid-json");
  });
});
