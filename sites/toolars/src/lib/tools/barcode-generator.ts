export type BarcodeFormat = "CODE39" | "CODE128" | "EAN13" | "UPC";

export interface BarcodeSvgInput {
  format: BarcodeFormat;
  height: number;
  value: string;
  width: number;
}

export interface BarcodeSvgResult {
  output: {
    formattedValue: string;
    svg: string;
    widthPx: number;
  };
  status: "blocked" | "ready";
  trustBoundary: {
    mode: "local-svg";
    note: string;
  };
  validationIssues: string[];
}

const code39Patterns: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  "$": "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn"
};

export function generateBarcodeSvg(input: BarcodeSvgInput): BarcodeSvgResult {
  const value = input.value.trim();
  const validationIssues = validateInput(value, input.format);

  if (validationIssues.length > 0) {
    return {
      output: { formattedValue: "", svg: "", widthPx: 0 },
      status: "blocked",
      trustBoundary,
      validationIssues
    };
  }

  const formattedValue = formatBarcodeValue(value, input.format);
  const bars = input.format === "CODE39" ? buildCode39Bars(formattedValue, input.width) : buildPreviewBars(formattedValue, input.width);
  const widthPx = Math.ceil(bars.totalWidth + 20);
  const height = clamp(input.height, 40, 200);

  return {
    output: {
      formattedValue,
      svg: [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthPx} ${height + 28}" role="img" aria-label="Barcode preview" data-barcode-format="${input.format}">`,
        '<rect width="100%" height="100%" fill="#ffffff" />',
        bars.rects.map((rect) => `<rect x="${rect.x}" y="10" width="${rect.width}" height="${height}" fill="#111111" />`).join(""),
        `<text x="${widthPx / 2}" y="${height + 24}" text-anchor="middle" font-family="monospace" font-size="14" fill="#111111">${escapeXml(formattedValue)}</text>`,
        "</svg>"
      ].join(""),
      widthPx
    },
    status: "ready",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-svg" as const,
  note: "CODE39 SVG is generated locally. Other formats use validation and preview bars; verify scanner compatibility before production labels."
};

function validateInput(value: string, format: BarcodeFormat): string[] {
  if (!value) return ["Enter a barcode value before generating SVG."];

  if (format === "CODE39" && !/^[0-9A-Z .$/+%-]+$/i.test(value)) {
    return ["CODE39 supports letters, numbers, spaces, and . $ / + % - only."];
  }

  if (format === "EAN13" && (!/^\d{13}$/.test(value) || getEan13CheckDigit(value.slice(0, 12)) !== Number(value[12]))) {
    return ["EAN-13 requires 13 digits with a valid check digit."];
  }

  if (format === "UPC" && !/^\d{12}$/.test(value)) {
    return ["UPC requires 12 digits."];
  }

  return [];
}

function formatBarcodeValue(value: string, format: BarcodeFormat): string {
  const normalized = format === "CODE39" ? value.toUpperCase() : value;
  return format === "CODE39" ? `*${normalized.replace(/^\*|\*$/g, "")}*` : normalized;
}

function buildCode39Bars(value: string, narrowWidth: number) {
  let cursor = 10;
  const rects: Array<{ width: number; x: number }> = [];
  const narrow = clamp(narrowWidth, 1, 5);

  for (const character of value) {
    const pattern = code39Patterns[character] ?? code39Patterns["-"];
    let drawBar = true;

    for (const segment of pattern) {
      const width = segment === "w" ? narrow * 3 : narrow;
      if (drawBar) {
        rects.push({ width, x: cursor });
      }
      cursor += width;
      drawBar = !drawBar;
    }

    cursor += narrow;
  }

  return { rects, totalWidth: cursor };
}

function buildPreviewBars(value: string, narrowWidth: number) {
  let cursor = 10;
  const rects: Array<{ width: number; x: number }> = [];
  const narrow = clamp(narrowWidth, 1, 5);

  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    for (let bit = 0; bit < 7; bit++) {
      const width = ((code >> bit) & 1) === 1 ? narrow * 2 : narrow;
      if (bit % 2 === 0) {
        rects.push({ width, x: cursor });
      }
      cursor += width;
    }
    cursor += narrow;
  }

  return { rects, totalWidth: cursor };
}

function getEan13CheckDigit(firstTwelveDigits: string): number {
  const sum = firstTwelveDigits.split("").reduce((total, digit, index) => {
    const value = Number(digit);
    return total + value * (index % 2 === 0 ? 1 : 3);
  }, 0);

  return (10 - (sum % 10)) % 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
