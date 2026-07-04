export type FileSizeMode = "decimal" | "binary";
export type DecimalFileSizeUnit = "B" | "KB" | "MB" | "GB" | "TB" | "PB";
export type BinaryFileSizeUnit = "B" | "KiB" | "MiB" | "GiB" | "TiB" | "PiB";
export type FileSizeUnit = DecimalFileSizeUnit | BinaryFileSizeUnit;

export interface FileSizeRow {
  unit: FileSizeUnit;
  value: number;
  formatted: string;
}

export interface FileSizeConversionInput {
  value: number;
  fromUnit: FileSizeUnit;
  mode: FileSizeMode;
}

export interface FileSizeConversionResult {
  success: boolean;
  input: FileSizeConversionInput;
  rows: FileSizeRow[];
  bytes: number;
  error?: {
    type: "invalid-size";
    message: string;
  };
  summary: string;
  privacyNote: string;
}

const decimalUnits: DecimalFileSizeUnit[] = ["B", "KB", "MB", "GB", "TB", "PB"];
const binaryUnits: BinaryFileSizeUnit[] = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];

const decimalMultipliers: Record<DecimalFileSizeUnit, number> = {
  B: 1,
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,
  PB: 1e15
};

const binaryMultipliers: Record<BinaryFileSizeUnit, number> = {
  B: 1,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
  PiB: 1024 ** 5
};

const privacyNote = "Local file size conversion only; values stay in the browser.";

export function getFileSizeUnitSet(mode: FileSizeMode): FileSizeUnit[] {
  return mode === "binary" ? [...binaryUnits] : [...decimalUnits];
}

export function convertFileSize(
  value: number,
  fromUnit: FileSizeUnit,
  targetUnits: FileSizeUnit[],
  mode: FileSizeMode | boolean
): Record<string, number> | null {
  if (!Number.isFinite(value) || value < 0) return null;

  const normalizedMode: FileSizeMode = mode === true ? "binary" : mode === false ? "decimal" : mode;
  const multipliers = normalizedMode === "binary" ? binaryMultipliers : decimalMultipliers;
  const fromMultiplier = (multipliers as Record<string, number>)[fromUnit];
  if (!fromMultiplier) return null;

  const bytes = value * fromMultiplier;
  const results: Record<string, number> = {};

  for (const unit of targetUnits) {
    const multiplier = (multipliers as Record<string, number>)[unit];
    if (multiplier !== undefined) {
      results[unit] = bytes / multiplier;
    }
  }

  return results;
}

export function summarizeFileSizeConversion(input: FileSizeConversionInput): FileSizeConversionResult {
  const units = getFileSizeUnitSet(input.mode);
  const converted = convertFileSize(input.value, input.fromUnit, units, input.mode);

  if (!converted) {
    return {
      success: false,
      input,
      rows: [],
      bytes: 0,
      error: {
        type: "invalid-size",
        message: "Enter a non-negative finite value and a unit from the selected mode."
      },
      summary: "File size conversion failed.",
      privacyNote
    };
  }

  const rows = units.map((unit) => ({
    unit,
    value: converted[unit],
    formatted: formatFileSize(converted[unit])
  }));

  return {
    success: true,
    input,
    rows,
    bytes: converted.B,
    summary: `Converted ${formatFileSize(input.value)} ${input.fromUnit} using ${input.mode} units.`,
    privacyNote
  };
}

export function formatFileSize(value: number): string {
  if (value === 0) return "0";

  const absVal = Math.abs(value);
  if (absVal > 0 && (absVal < 0.000001 || absVal >= 1e15)) {
    return value.toExponential(6);
  }

  if (absVal < 1) {
    return value.toLocaleString("en-US", { maximumSignificantDigits: 6 });
  }

  if (Number.isInteger(value)) {
    return value.toLocaleString("en-US");
  }

  return value.toLocaleString("en-US", { maximumSignificantDigits: 10 });
}
