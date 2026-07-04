export interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  totalAddresses: number;
  prefixLength: number;
  ipClass: string;
  binaryNetwork: string;
  binaryMask: string;
  privacyNote: string;
}

const privacyNote = "Local subnet calculation only; IP values stay in the browser.";

export function isValidIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const value = Number(part);
    return /^\d+$/.test(part) && value >= 0 && value <= 255;
  });
}

export function prefixToMask(prefix: number): string {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return "0.0.0.0";
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return longToIp(mask);
}

export function getIPClass(ip: string): string {
  const firstOctet = Number.parseInt(ip.split(".")[0], 10);
  if (firstOctet >= 1 && firstOctet <= 127) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D";
  return "E";
}

export function calculateSubnet(ip: string, prefix: number): SubnetResult | null {
  if (!isValidIPv4(ip)) return null;
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;

  const ipLong = ipToLong(ip);
  const maskLong = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcardLong = (~maskLong) >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);
  const usableHosts = totalAddresses > 2 ? totalAddresses - 2 : 0;

  return {
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    subnetMask: longToIp(maskLong),
    wildcardMask: longToIp(wildcardLong),
    firstHost: longToIp(totalAddresses > 2 ? networkLong + 1 : networkLong),
    lastHost: longToIp(totalAddresses > 2 ? broadcastLong - 1 : broadcastLong),
    usableHosts,
    totalAddresses,
    prefixLength: prefix,
    ipClass: getIPClass(ip),
    binaryNetwork: ipToBinary(longToIp(networkLong)),
    binaryMask: ipToBinary(longToIp(maskLong)),
    privacyNote
  };
}

function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function longToIp(value: number): string {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff].join(".");
}

function ipToBinary(ip: string): string {
  return ip
    .split(".")
    .map((octet) => Number(octet).toString(2).padStart(8, "0"))
    .join(".");
}
