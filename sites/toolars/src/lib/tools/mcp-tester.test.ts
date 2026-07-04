import { describe, expect, it } from "vitest";
import { testMcpContract } from "./mcp-tester";

describe("testMcpContract", () => {
  it("validates a manifest tool contract against a sample payload", () => {
    const result = testMcpContract({
      manifestJson: JSON.stringify({
        name: "toolars-research-kit",
        tools: [
          {
            name: "search_private_docs",
            description: "Search private docs.",
            inputSchema: {
              type: "object",
              properties: { query: { type: "string" }, max_results: { type: "number" } },
              required: ["query"]
            }
          }
        ]
      }),
      payloadJson: JSON.stringify({ query: "refund policy", max_results: 5 })
    });

    expect(result.status).toBe("ready");
    expect(result.toolName).toBe("search_private_docs");
    expect(result.requiredFields).toEqual(["query"]);
    expect(result.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Manifest JSON", tone: "ok" }),
      expect.objectContaining({ label: "Required payload fields", tone: "ok" })
    ]));
  });

  it("reports invalid JSON without throwing", () => {
    const result = testMcpContract({ manifestJson: "{ nope", payloadJson: "{}" });

    expect(result.status).toBe("error");
    expect(result.checks[0]).toMatchObject({ label: "Manifest JSON", tone: "warn" });
  });
});
