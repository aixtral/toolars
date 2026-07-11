import { describe, expect, it } from "vitest";
import { createProductionServerCommand, parseWithProductionServerArgs } from "./with-production-server.mjs";

describe("with-production-server", () => {
  it("parses the managed base URL and wrapped command", () => {
    expect(
      parseWithProductionServerArgs([
        "--base-url",
        "http://127.0.0.1:9199",
        "--startup-timeout-ms",
        "1234",
        "--",
        "node",
        "scripts/certified-tool-smoke.mjs",
        "--write",
        "/tmp/report.json"
      ])
    ).toEqual({
      baseUrl: "http://127.0.0.1:9199",
      startupTimeoutMs: 1234,
      command: "node",
      args: ["scripts/certified-tool-smoke.mjs", "--write", "/tmp/report.json"]
    });
  });

  it("starts Next production on the base URL port", () => {
    expect(createProductionServerCommand("http://127.0.0.1:9199")).toEqual({
      command: "pnpm",
      args: ["exec", "next", "start", "-p", "9199"]
    });
  });
});
