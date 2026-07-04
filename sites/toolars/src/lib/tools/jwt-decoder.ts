export interface JwtDecodeError {
  type: "invalid-format" | "invalid-header" | "invalid-payload" | "decode-failed";
  message: string;
}

export interface JwtDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  valid: boolean;
  verified: false;
  error?: JwtDecodeError;
  claims: {
    standard: Record<string, unknown>;
    custom: Record<string, unknown>;
  };
  metadata: {
    algorithm: string;
    type: string;
    issuedAt?: Date;
    expiresAt?: Date;
    isExpired: boolean;
  };
  summary: string;
  privacyNote: string;
}

const standardClaimKeys = ["iss", "sub", "aud", "exp", "nbf", "iat", "jti"];
const privacyNote = "Local JWT decoding only; tokens are not verified or uploaded.";

export function decodeJwt(token: string): JwtDecoded {
  const parts = token.trim().split(".");

  if (parts.length !== 3) {
    return buildJwtError("invalid-format", "Invalid JWT format: expected 3 parts separated by dots.");
  }

  let header: Record<string, unknown>;
  try {
    header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
  } catch {
    return buildJwtError("invalid-header", "Failed to decode JWT header.");
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
  } catch {
    return {
      ...buildJwtError("invalid-payload", "Failed to decode JWT payload."),
      header,
      signature: parts[2],
      metadata: {
        algorithm: String(header.alg ?? ""),
        type: String(header.typ ?? ""),
        isExpired: false
      }
    };
  }

  const claims = splitClaims(payload);
  const issuedAt = typeof payload.iat === "number" ? new Date(payload.iat * 1000) : undefined;
  const expiresAt = typeof payload.exp === "number" ? new Date(payload.exp * 1000) : undefined;

  return {
    header,
    payload,
    signature: parts[2],
    valid: true,
    verified: false,
    claims,
    metadata: {
      algorithm: String(header.alg ?? ""),
      type: String(header.typ ?? ""),
      issuedAt,
      expiresAt,
      isExpired: expiresAt ? expiresAt.getTime() < Date.now() : false
    },
    summary: `Decoded JWT with ${Object.keys(payload).length.toLocaleString("en-US")} payload claims.`,
    privacyNote
  };
}

export function getJwtClaimDescription(key: string): string {
  const descriptions: Record<string, string> = {
    iss: "Issuer - identifies the principal that issued the JWT",
    sub: "Subject - identifies the principal that is the subject of the JWT",
    aud: "Audience - identifies the recipients that the JWT is intended for",
    exp: "Expiration Time - identifies when the JWT must no longer be accepted",
    nbf: "Not Before - identifies the time before which the JWT must not be accepted",
    iat: "Issued At - identifies the time at which the JWT was issued",
    jti: "JWT ID - provides a unique identifier for the JWT"
  };
  return descriptions[key] ?? "";
}

function splitClaims(payload: Record<string, unknown>) {
  const standard: Record<string, unknown> = {};
  const custom: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (standardClaimKeys.includes(key)) {
      standard[key] = value;
    } else {
      custom[key] = value;
    }
  }

  return { standard, custom };
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const binary = globalThis.atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function buildJwtError(type: JwtDecodeError["type"], message: string): JwtDecoded {
  return {
    header: {},
    payload: {},
    signature: "",
    valid: false,
    verified: false,
    error: { type, message },
    claims: {
      standard: {},
      custom: {}
    },
    metadata: {
      algorithm: "",
      type: "",
      isExpired: false
    },
    summary: "JWT decoding failed.",
    privacyNote
  };
}
