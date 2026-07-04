export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

export interface HashGeneratorError {
  type: "hash-failed" | "unsupported-algorithm";
  message: string;
}

export interface HashGeneratorResult {
  success: boolean;
  hashes: Partial<Record<HashAlgorithm, string>>;
  error?: HashGeneratorError;
  stats: {
    inputLength: number;
    algorithmCount: number;
  };
  summary: string;
  privacyNote: string;
}

const defaultAlgorithms: HashAlgorithm[] = ["md5", "sha1", "sha256", "sha512"];
const privacyNote = "Local hash generation only; source text stays in the browser.";

export async function generateHashes(input: string, algorithms: HashAlgorithm[] = defaultAlgorithms): Promise<HashGeneratorResult> {
  const hashes: Partial<Record<HashAlgorithm, string>> = {};

  try {
    for (const algorithm of algorithms) {
      hashes[algorithm] = await generateHash(input, algorithm);
    }

    return {
      success: true,
      hashes,
      stats: {
        inputLength: input.length,
        algorithmCount: algorithms.length
      },
      summary: `Generated ${algorithms.length.toLocaleString("en-US")} local digests.`,
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      hashes: {},
      error: {
        type: "hash-failed",
        message: error instanceof Error ? error.message : "Failed to generate hash output."
      },
      stats: {
        inputLength: input.length,
        algorithmCount: 0
      },
      summary: "Hash generation failed.",
      privacyNote
    };
  }
}

export async function generateHash(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === "md5") {
    return md5Hex(new TextEncoder().encode(input));
  }

  const cryptoName = algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : algorithm === "sha512" ? "SHA-512" : null;
  if (!cryptoName || !globalThis.crypto?.subtle) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }

  const digest = await globalThis.crypto.subtle.digest(cryptoName, new TextEncoder().encode(input));
  return bytesToHex(new Uint8Array(digest));
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function md5Hex(input: Uint8Array): string {
  const words = createMd5Words(input);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < words.length; i += 16) {
    const originalA = a;
    const originalB = b;
    const originalC = c;
    const originalD = d;

    for (let j = 0; j < 64; j++) {
      let f: number;
      let g: number;

      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }

      const nextD = d;
      d = c;
      c = b;
      b = add32(b, rotateLeft(add32(add32(a, f), add32(md5Constants[j], words[i + g])), md5Shifts[j]));
      a = nextD;
    }

    a = add32(a, originalA);
    b = add32(b, originalB);
    c = add32(c, originalC);
    d = add32(d, originalD);
  }

  return [a, b, c, d].map(wordToLittleEndianHex).join("");
}

function createMd5Words(input: Uint8Array): number[] {
  const bitLength = input.length * 8;
  const paddedLength = (((input.length + 8) >> 6) + 1) * 64;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[input.length] = 0x80;

  const lowBits = bitLength >>> 0;
  const highBits = Math.floor(bitLength / 2 ** 32);
  for (let i = 0; i < 4; i++) {
    bytes[paddedLength - 8 + i] = (lowBits >>> (8 * i)) & 0xff;
    bytes[paddedLength - 4 + i] = (highBits >>> (8 * i)) & 0xff;
  }

  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24));
  }
  return words;
}

function add32(a: number, b: number): number {
  return (a + b) >>> 0;
}

function rotateLeft(value: number, shift: number): number {
  return (value << shift) | (value >>> (32 - shift));
}

function wordToLittleEndianHex(word: number): string {
  return [word & 0xff, (word >>> 8) & 0xff, (word >>> 16) & 0xff, (word >>> 24) & 0xff]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const md5Shifts = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

const md5Constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 2 ** 32));
