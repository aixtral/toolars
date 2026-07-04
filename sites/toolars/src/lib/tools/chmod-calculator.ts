export interface PermissionTriplet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface PermissionBits {
  owner: PermissionTriplet;
  group: PermissionTriplet;
  others: PermissionTriplet;
}

export interface ChmodResult {
  success: boolean;
  input: string;
  bits: PermissionBits;
  octal: string;
  symbolic: string;
  description: string;
  command: string;
  warnings: string[];
  error?: {
    type: "invalid-permission";
    message: string;
  };
  privacyNote: string;
}

export const DEFAULT_PERMISSIONS: PermissionBits = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  others: { read: true, write: false, execute: true }
};

const privacyNote = "Local permission calculation only; values stay in the browser.";

export function permissionsToOctal(bits: PermissionBits): string {
  const toDigit = (triplet: PermissionTriplet): number =>
    (triplet.read ? 4 : 0) | (triplet.write ? 2 : 0) | (triplet.execute ? 1 : 0);

  return `${toDigit(bits.owner)}${toDigit(bits.group)}${toDigit(bits.others)}`;
}

export function permissionsToSymbolic(bits: PermissionBits): string {
  const toSymbol = (triplet: PermissionTriplet): string =>
    `${triplet.read ? "r" : "-"}${triplet.write ? "w" : "-"}${triplet.execute ? "x" : "-"}`;

  return `${toSymbol(bits.owner)}${toSymbol(bits.group)}${toSymbol(bits.others)}`;
}

export function permissionsToDescription(bits: PermissionBits): string {
  const describeTriplet = (name: string, triplet: PermissionTriplet): string => {
    const permissions: string[] = [];
    if (triplet.read) permissions.push("read");
    if (triplet.write) permissions.push("write");
    if (triplet.execute) permissions.push("execute");
    return `${name}: ${permissions.length > 0 ? permissions.join(", ") : "no permissions"}`;
  };

  return [
    describeTriplet("Owner", bits.owner),
    describeTriplet("Group", bits.group),
    describeTriplet("Others", bits.others)
  ].join(" / ");
}

export function parseOctal(octal: string): PermissionBits {
  if (!/^[0-7]{3}$/.test(octal)) return DEFAULT_PERMISSIONS;

  const [owner, group, others] = octal.split("").map(Number);
  return {
    owner: parseDigit(owner),
    group: parseDigit(group),
    others: parseDigit(others)
  };
}

export function parseSymbolic(symbolic: string): PermissionBits {
  if (!/^[rwxsStT-]{9}$/.test(symbolic)) return DEFAULT_PERMISSIONS;

  return {
    owner: parseTriplet(symbolic.slice(0, 3)),
    group: parseTriplet(symbolic.slice(3, 6)),
    others: parseTriplet(symbolic.slice(6, 9))
  };
}

export function parsePermissionInput(input: string): ChmodResult {
  const normalized = input.trim();
  const isOctal = /^[0-7]{3}$/.test(normalized);
  const isSymbolic = /^[rwxsStT-]{9}$/.test(normalized);

  if (!isOctal && !isSymbolic) {
    return {
      success: false,
      input,
      bits: DEFAULT_PERMISSIONS,
      octal: "",
      symbolic: "",
      description: "",
      command: "",
      warnings: [],
      error: {
        type: "invalid-permission",
        message: "Enter a 3-digit octal mode or 9-character symbolic mode."
      },
      privacyNote
    };
  }

  const bits = isOctal ? parseOctal(normalized) : parseSymbolic(normalized);
  const octal = permissionsToOctal(bits);
  const symbolic = permissionsToSymbolic(bits);

  return {
    success: true,
    input,
    bits,
    octal,
    symbolic,
    description: permissionsToDescription(bits),
    command: `chmod ${octal} <path>`,
    warnings: buildWarnings(bits),
    privacyNote
  };
}

function parseDigit(digit: number): PermissionTriplet {
  return {
    read: (digit & 4) !== 0,
    write: (digit & 2) !== 0,
    execute: (digit & 1) !== 0
  };
}

function parseTriplet(chars: string): PermissionTriplet {
  return {
    read: chars[0] === "r",
    write: chars[1] === "w",
    execute: ["x", "s", "S", "t", "T"].includes(chars[2])
  };
}

function buildWarnings(bits: PermissionBits): string[] {
  const warnings: string[] = [];

  if (bits.others.write) warnings.push("World-writable permissions require careful review.");
  if (bits.others.execute && bits.group.execute && bits.owner.execute) warnings.push("Executable access is enabled for every permission group.");
  if (!bits.owner.read && !bits.owner.write) warnings.push("Owner cannot read or write this path.");

  return warnings;
}
