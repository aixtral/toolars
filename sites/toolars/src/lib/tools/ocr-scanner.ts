export type OcrLanguage = "en" | "es" | "zh-hans" | "zh-hant";
export type OcrOutputFormat = "txt" | "json";

export interface OcrFile {
  name: string;
  pages?: number;
  sizeBytes: number;
  type?: string;
}

export interface OcrPlanResult {
  inputKind?: "image" | "pdf";
  output?: {
    estimatedPages: number;
    fileName: string;
    language: OcrLanguage;
  };
  status: "blocked" | "ready-for-ocr";
  trustBoundary: {
    mode: "local-scan-handoff";
    note: string;
    requiresBackend: boolean;
  };
  validationIssues: string[];
}

const supportedImageTypes = new Set(["image/png", "image/jpeg", "image/jpg", "image/tiff"]);

export function planOcrScan({
  file,
  language,
  outputFormat
}: {
  file: OcrFile;
  language: OcrLanguage;
  outputFormat: OcrOutputFormat;
}): OcrPlanResult {
  const inputKind = getInputKind(file);
  if (!inputKind) {
    return {
      status: "blocked",
      trustBoundary,
      validationIssues: ["Choose a PDF, PNG, JPG, or TIFF file before planning OCR."]
    };
  }

  return {
    inputKind,
    output: {
      estimatedPages: inputKind === "pdf" ? Math.max(1, file.pages ?? Math.round(file.sizeBytes / 350_000)) : 1,
      fileName: `${sanitizeBaseName(file.name)}_ocr.${outputFormat}`,
      language
    },
    status: "ready-for-ocr",
    trustBoundary,
    validationIssues: []
  };
}

const trustBoundary = {
  mode: "local-scan-handoff" as const,
  note: "OCR engine required: this browser workspace validates file type, language, and output settings before an OCR worker runs.",
  requiresBackend: true
};

function getInputKind(file: OcrFile): "image" | "pdf" | null {
  const lowerName = file.name.toLowerCase();
  if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  if (file.type && supportedImageTypes.has(file.type)) return "image";
  if (/\.(png|jpe?g|tiff?)$/.test(lowerName)) return "image";
  return null;
}

function sanitizeBaseName(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, "").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "toolars";
}
