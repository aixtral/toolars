export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrCodeSvgInput {
  backgroundColor: string;
  content: string;
  errorCorrectionLevel: QrErrorCorrectionLevel;
  foregroundColor: string;
  size: number;
}

export interface QrCodeSvgResult {
  output: {
    moduleCount: number;
    svg: string;
  };
  status: "blocked" | "ready";
  trustBoundary: {
    mode: "local-svg-preview";
    note: string;
  };
  validationIssues: string[];
}

const moduleCount = 21;

export function generateQrCodeSvg(input: QrCodeSvgInput): QrCodeSvgResult {
  const content = input.content.trim();
  const validationIssues: string[] = [];

  if (!content) {
    validationIssues.push("Enter text or a URL before generating a QR preview.");
  }
  if (!isHexColor(input.foregroundColor) || !isHexColor(input.backgroundColor)) {
    validationIssues.push("Use valid hex colors for QR foreground and background.");
  }

  if (validationIssues.length > 0) {
    return {
      output: { moduleCount, svg: "" },
      status: "blocked",
      trustBoundary,
      validationIssues
    };
  }

  return {
    output: {
      moduleCount,
      svg: buildPreviewSvg({
        backgroundColor: input.backgroundColor,
        content,
        errorCorrectionLevel: input.errorCorrectionLevel,
        foregroundColor: input.foregroundColor,
        size: clamp(input.size, 128, 512)
      })
    },
    status: "ready",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-svg-preview" as const,
  note: "This dependency-free workspace renders a deterministic QR-style SVG preview locally; scan-test production codes with a full QR encoder before print."
};

function buildPreviewSvg({
  backgroundColor,
  content,
  errorCorrectionLevel,
  foregroundColor,
  size
}: {
  backgroundColor: string;
  content: string;
  errorCorrectionLevel: QrErrorCorrectionLevel;
  foregroundColor: string;
  size: number;
}) {
  const cellSize = size / moduleCount;
  const rects: string[] = [];

  for (let row = 0; row < moduleCount; row++) {
    for (let column = 0; column < moduleCount; column++) {
      if (isFinderPattern(row, column) || shouldFillModule(content, row, column)) {
        rects.push(
          `<rect x="${round(column * cellSize)}" y="${round(row * cellSize)}" width="${round(cellSize)}" height="${round(cellSize)}" />`
        );
      }
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR preview" data-qr-content-length="${content.length}" data-error-correction="${errorCorrectionLevel}">`,
    `<rect width="${size}" height="${size}" fill="${backgroundColor}" />`,
    `<g fill="${foregroundColor}">`,
    rects.join(""),
    "</g>",
    `<desc>${escapeXml(content)}</desc>`,
    "</svg>"
  ].join("");
}

function isFinderPattern(row: number, column: number): boolean {
  const inTopLeft = row < 7 && column < 7;
  const inTopRight = row < 7 && column >= moduleCount - 7;
  const inBottomLeft = row >= moduleCount - 7 && column < 7;
  if (!inTopLeft && !inTopRight && !inBottomLeft) return false;

  const localRow = row >= moduleCount - 7 ? row - (moduleCount - 7) : row;
  const localColumn = column >= moduleCount - 7 ? column - (moduleCount - 7) : column;

  return localRow === 0 || localRow === 6 || localColumn === 0 || localColumn === 6 || (localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4);
}

function shouldFillModule(content: string, row: number, column: number): boolean {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index++) {
    hash ^= content.charCodeAt(index) + row * 31 + column * 17 + index;
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> ((row + column) % 8)) & 1) === 1;
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
