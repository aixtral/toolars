import { describe, expect, it } from "vitest";
import { lookupHttpStatuses } from "./http-status-reference";

describe("lookupHttpStatuses", () => {
  it("finds HTTP status codes by code and phrase", () => {
    const result = lookupHttpStatuses({ query: "404" });

    expect(result.matches[0]).toMatchObject({
      code: 404,
      phrase: "Not Found",
      category: "Client Error"
    });
    expect(result.summary).toContain("1 status");
  });

  it("filters by category", () => {
    const result = lookupHttpStatuses({ query: "created", category: "Success" });

    expect(result.matches.map((status) => status.code)).toContain(201);
    expect(result.matches.every((status) => status.category === "Success")).toBe(true);
  });
});
