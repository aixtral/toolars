export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous?: boolean;
}

export interface PasswordGeneratorError {
  type: "invalid-length" | "empty-character-set" | "generation-failed";
  message: string;
}

export interface PasswordResult {
  success: boolean;
  password: string;
  strength: "weak" | "fair" | "good" | "strong";
  strengthScore: number;
  error?: PasswordGeneratorError;
  stats: {
    length: number;
    charsetSize: number;
    entropyBits: number;
  };
  privacyNote: string;
}

const charsets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  ambiguous: "Il1O0"
};

export function generatePassword(options: PasswordOptions): PasswordResult {
  if (options.length < 4 || options.length > 128) {
    return buildPasswordError("invalid-length", "Length must be between 4 and 128.", options.length);
  }

  let charset = "";
  if (options.uppercase) charset += charsets.uppercase;
  if (options.lowercase) charset += charsets.lowercase;
  if (options.numbers) charset += charsets.numbers;
  if (options.symbols) charset += charsets.symbols;
  if (options.excludeAmbiguous) {
    charset = [...charset].filter((char) => !charsets.ambiguous.includes(char)).join("");
  }

  if (!charset) {
    return buildPasswordError("empty-character-set", "Select at least one character type.", options.length);
  }

  try {
    const password = Array.from({ length: options.length }, () => charset[randomInt(charset.length)]).join("");
    const entropyBits = options.length * Math.log2(charset.length);
    const { level, score } = calculatePasswordStrength(password, charset.length);

    return {
      success: true,
      password,
      strength: level,
      strengthScore: score,
      stats: {
        length: options.length,
        charsetSize: charset.length,
        entropyBits
      },
      privacyNote: "Local password generation only; generated values are not stored or uploaded."
    };
  } catch (error) {
    return buildPasswordError(
      "generation-failed",
      error instanceof Error ? error.message : "Failed to generate password.",
      options.length
    );
  }
}

function randomInt(max: number): number {
  const bytes = new Uint32Array(1);
  globalThis.crypto.getRandomValues(bytes);
  return bytes[0] % max;
}

function calculatePasswordStrength(password: string, charsetSize: number) {
  let score = password.length * Math.log2(charsetSize);
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (/[A-Z]/.test(password)) score += 5;
  if (/[a-z]/.test(password)) score += 5;
  if (/[0-9]/.test(password)) score += 5;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  const boundedScore = Math.min(100, score);
  const level = boundedScore >= 80 ? "strong" : boundedScore >= 60 ? "good" : boundedScore >= 40 ? "fair" : "weak";
  return { level, score: boundedScore } as const;
}

function buildPasswordError(type: PasswordGeneratorError["type"], message: string, length: number): PasswordResult {
  return {
    success: false,
    password: "",
    strength: "weak",
    strengthScore: 0,
    error: { type, message },
    stats: {
      length,
      charsetSize: 0,
      entropyBits: 0
    },
    privacyNote: "Local password generation only; generated values are not stored or uploaded."
  };
}
