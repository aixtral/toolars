export interface UUIDResult {
  success: boolean;
  uuid: string;
  metadata: {
    version: number;
    variant: string;
  };
  error?: string;
}

export type UUIDBatchErrorType = "invalid-count" | "generation-failed";

export interface UUIDBatchError {
  type: UUIDBatchErrorType;
}

export interface UUIDBatchResult {
  success: boolean;
  count: number;
  uuids: string[];
  output: string;
  summary: string;
  privacyNote: string;
  metadata: {
    version: number;
    variant: string;
  };
  error?: UUIDBatchError;
}

const uuidMetadata = {
  version: 4,
  variant: "RFC 4122"
} as const;

const privacyNote = "Local UUID generation only; identifiers stay in the browser.";

export function generateUUIDv4(): UUIDResult {
  try {
    return {
      success: true,
      uuid: createRandomUUID(),
      metadata: uuidMetadata
    };
  } catch (error) {
    return {
      success: false,
      uuid: "",
      metadata: uuidMetadata,
      error: error instanceof Error ? error.message : "Failed to generate UUID"
    };
  }
}

export function generateMultipleUUIDs(count: number, version: 4 = 4): string[] {
  if (version !== 4) {
    throw new Error("Only UUID v4 is supported");
  }

  const normalizedCount = Math.floor(count);
  if (!Number.isFinite(normalizedCount) || normalizedCount < 1 || normalizedCount > 1000) {
    throw new Error("Count must be between 1 and 1000");
  }

  return Array.from({ length: normalizedCount }, () => createRandomUUID());
}

export function generateUUIDBatch(count: number): UUIDBatchResult {
  try {
    const uuids = generateMultipleUUIDs(count);

    return {
      success: true,
      count: uuids.length,
      uuids,
      output: uuids.join("\n"),
      summary: buildUUIDSummary(uuids.length),
      privacyNote,
      metadata: uuidMetadata
    };
  } catch {
    return {
      success: false,
      count,
      uuids: [],
      output: "",
      summary: "Quantity must be between 1 and 1000.",
      privacyNote,
      metadata: uuidMetadata,
      error: { type: "invalid-count" }
    };
  }
}

export function validateUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

function createRandomUUID(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex
    .slice(8, 10)
    .join("")}-${hex.slice(10, 16).join("")}`;
}

function buildUUIDSummary(count: number): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? "UUID" : "UUIDs"} generated.`;
}
