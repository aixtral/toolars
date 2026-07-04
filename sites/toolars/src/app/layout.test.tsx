import { describe, expect, it } from "vitest";
import * as rootLayout from "./layout";

describe("root layout metadata", () => {
  it("sets metadataBase for root-level generated social images", () => {
    const metadata = (rootLayout as { metadata?: { metadataBase?: URL } }).metadata;

    expect(metadata?.metadataBase?.toString()).toBe("http://localhost:9320/");
  });
});
