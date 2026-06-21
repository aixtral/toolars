import { describe, expect, it } from "vitest";
import { buildMcpManifest, buildMcpServerDraft, validateMcpServerDraft } from "./mcp-server-builder";

describe("buildMcpManifest", () => {
  it("builds the design sample manifest with tool, resource, and test payload", () => {
    const manifest = buildMcpManifest(
      buildMcpServerDraft({
        serverName: "toolars-research-kit",
        primaryTool: "search_private_docs",
        toolDescription: "Search a private document collection and return cited passages with source IDs."
      })
    );

    expect(manifest.name).toBe("toolars-research-kit");
    expect(manifest.tools).toHaveLength(1);
    expect(manifest.tools[0]).toMatchObject({
      name: "search_private_docs",
      description: "Search a private document collection and return cited passages with source IDs."
    });
    expect(manifest.tools[0].inputSchema.properties.query.type).toBe("string");
    expect(manifest.tools[0].inputSchema.required).toEqual(["query"]);
    expect(manifest.resources).toEqual(["docs://private-collection/index"]);
    expect(manifest.testPayload).toEqual({
      query: "Summarize refund policy changes",
      max_results: 5
    });
  });

  it("omits optional sections when they are disabled", () => {
    const manifest = buildMcpManifest(
      buildMcpServerDraft({
        includeResourceIndex: false,
        includeTestPayload: false
      })
    );

    expect(manifest.resources).toBeUndefined();
    expect(manifest.testPayload).toBeUndefined();
  });

  it("returns launch review checks and warnings", () => {
    const review = validateMcpServerDraft(
      buildMcpServerDraft({
        includeOAuthNotes: false
      })
    );

    expect(review).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Tool name is action-oriented.", tone: "ok" }),
        expect.objectContaining({ label: "Schema fields are explicit.", tone: "ok" }),
        expect.objectContaining({ label: "Auth and rate-limit policy still needed.", tone: "warn" })
      ])
    );
  });
});
