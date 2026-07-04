import { describe, expect, it } from "vitest";
import { calculateSubnet, getIPClass, isValidIPv4, prefixToMask } from "./ipv4-subnet-calculator";

describe("IPv4 helpers", () => {
  it("validates IPv4 addresses and converts prefixes to masks", () => {
    expect(isValidIPv4("192.168.1.1")).toBe(true);
    expect(isValidIPv4("256.168.1.1")).toBe(false);
    expect(prefixToMask(24)).toBe("255.255.255.0");
    expect(prefixToMask(32)).toBe("255.255.255.255");
    expect(getIPClass("10.0.0.1")).toBe("A");
  });
});

describe("calculateSubnet", () => {
  it("calculates /24 network details from a host address", () => {
    const result = calculateSubnet("192.168.1.100", 24);

    expect(result).toMatchObject({
      networkAddress: "192.168.1.0",
      broadcastAddress: "192.168.1.255",
      subnetMask: "255.255.255.0",
      wildcardMask: "0.0.0.255",
      firstHost: "192.168.1.1",
      lastHost: "192.168.1.254",
      usableHosts: 254,
      totalAddresses: 256,
      ipClass: "C"
    });
    expect(result?.binaryNetwork).toBe("11000000.10101000.00000001.00000000");
  });

  it("handles /31, /32, and /0 boundary calculations without signed overflow", () => {
    expect(calculateSubnet("192.168.1.0", 31)?.totalAddresses).toBe(2);
    expect(calculateSubnet("192.168.1.1", 32)).toMatchObject({
      firstHost: "192.168.1.1",
      lastHost: "192.168.1.1",
      usableHosts: 0
    });
    expect(calculateSubnet("10.0.0.1", 0)?.totalAddresses).toBe(4294967296);
  });

  it("returns null for invalid IP or prefix values", () => {
    expect(calculateSubnet("bad-ip", 24)).toBeNull();
    expect(calculateSubnet("192.168.1.1", 33)).toBeNull();
  });
});
