import { describe, expect, it } from "vitest";
import {
  DEFAULT_PERMISSIONS,
  parseOctal,
  parsePermissionInput,
  parseSymbolic,
  permissionsToDescription,
  permissionsToOctal,
  permissionsToSymbolic
} from "./chmod-calculator";

describe("chmod permission conversions", () => {
  it("converts permission bits between octal, symbolic, and descriptions", () => {
    const bits = parseOctal("755");

    expect(permissionsToOctal(bits)).toBe("755");
    expect(permissionsToSymbolic(bits)).toBe("rwxr-xr-x");
    expect(permissionsToDescription(bits)).toContain("Owner: read, write, execute");
  });

  it("parses symbolic notation and preserves no-permission groups", () => {
    const bits = parseSymbolic("rw-------");

    expect(bits.owner).toEqual({ read: true, write: true, execute: false });
    expect(bits.group).toEqual({ read: false, write: false, execute: false });
    expect(bits.others).toEqual({ read: false, write: false, execute: false });
  });

  it("returns default bits for low-level invalid parsers", () => {
    expect(parseOctal("999")).toEqual(DEFAULT_PERMISSIONS);
    expect(parseSymbolic("invalid")).toEqual(DEFAULT_PERMISSIONS);
  });
});

describe("parsePermissionInput", () => {
  it("returns a copy-ready chmod command for valid octal input", () => {
    const result = parsePermissionInput("644");

    expect(result.success).toBe(true);
    expect(result.octal).toBe("644");
    expect(result.symbolic).toBe("rw-r--r--");
    expect(result.command).toBe("chmod 644 <path>");
  });

  it("flags unsafe broad write permissions and invalid input", () => {
    expect(parsePermissionInput("777").warnings).toContain("World-writable permissions require careful review.");

    const invalid = parsePermissionInput("99");
    expect(invalid.success).toBe(false);
    expect(invalid.error?.type).toBe("invalid-permission");
  });
});
