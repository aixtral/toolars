import { describe, expect, it } from "vitest";
import { parseEnvDocument, serializeEnvEntries } from "./env-editor";

describe("parseEnvDocument", () => {
  it("parses .env rows and flags duplicates plus secret-like keys", () => {
    const result = parseEnvDocument({
      input: "# app\nAPI_KEY=abc123\nNODE_ENV=production\nAPI_KEY=override\nEMPTY=\n"
    });

    expect(result.entries.filter((entry) => entry.type === "pair")).toHaveLength(4);
    expect(result.duplicates).toContain("API_KEY");
    expect(result.secretKeys).toContain("API_KEY");
    expect(result.summary).toContain("4 variables");
  });

  it("serializes edited entries with quoted spaced values", () => {
    const parsed = parseEnvDocument({ input: "APP_NAME=Toolars Lab" });

    expect(serializeEnvEntries(parsed.entries)).toBe('APP_NAME="Toolars Lab"');
  });
});
