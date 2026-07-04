export type TimestampPrecision = "seconds" | "milliseconds" | "date";

export interface TimestampResult {
  success: boolean;
  timestamp: number;
  precision: TimestampPrecision;
  iso: string;
  utc: string;
  local: string;
  relative: string;
  error?: {
    type: "invalid-timestamp";
    message: string;
  };
  privacyNote: string;
}

const privacyNote = "Local timestamp conversion only; values stay in the browser.";

export function convertTimestamp(input: string | number): TimestampResult {
  try {
    const parsed = parseTimestampInput(input);
    const date = parsed.date;

    if (Number.isNaN(date.getTime())) {
      return invalidTimestampResult(parsed.precision);
    }

    return {
      success: true,
      timestamp: Math.floor(date.getTime() / 1000),
      precision: parsed.precision,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: getRelativeTime(date),
      privacyNote
    };
  } catch (error) {
    return invalidTimestampResult("date", error instanceof Error ? error.message : "Failed to convert timestamp");
  }
}

export function getCurrentTimestamp(): TimestampResult {
  return convertTimestamp(Date.now());
}

function parseTimestampInput(input: string | number): { date: Date; precision: TimestampPrecision } {
  const raw = String(input).trim();

  if (typeof input === "number" || /^\d+$/.test(raw)) {
    const numeric = typeof input === "number" ? input : Number.parseInt(raw, 10);
    const precision: TimestampPrecision = numeric < 1e12 ? "seconds" : "milliseconds";
    return {
      date: new Date(precision === "seconds" ? numeric * 1000 : numeric),
      precision
    };
  }

  return {
    date: new Date(raw),
    precision: "date"
  };
}

function invalidTimestampResult(precision: TimestampPrecision, message = "Invalid date or timestamp"): TimestampResult {
  return {
    success: false,
    timestamp: 0,
    precision,
    iso: "",
    utc: "",
    local: "",
    relative: "",
    error: {
      type: "invalid-timestamp",
      message
    },
    privacyNote
  };
}

function getRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const suffix = diffMs >= 0 ? "ago" : "from now";

  if (diffSeconds < 60) return `${diffSeconds} ${diffSeconds === 1 ? "second" : "seconds"} ${suffix}`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ${suffix}`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ${suffix}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ${suffix}`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffDays < 365) return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ${suffix}`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} ${diffYears === 1 ? "year" : "years"} ${suffix}`;
}
