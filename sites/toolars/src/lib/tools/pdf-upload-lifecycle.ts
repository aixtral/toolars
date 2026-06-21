import type { PdfFile } from "./pdf-toolkit";

export const PDF_UPLOAD_LIMIT_BYTES = 50 * 1024 * 1024;

export type PdfUploadScanStatus = "scan-passed" | "rejected";
export type PdfUploadDeleteStatus = "active" | "deleted";
export type PdfUploadStorageStatus = "local-only" | "stored" | "failed";

export interface PdfUploadFileLike {
  lastModified?: number;
  name: string;
  size: number;
  type?: string;
}

export interface PdfUploadItem extends PdfFile {
  deleteStatus: PdfUploadDeleteStatus;
  handoffToken?: string;
  objectKey?: string;
  retentionLabel: string;
  scanLabel: string;
  scanStatus: PdfUploadScanStatus;
  serverUploadId?: string;
  sizeBytes: number;
  signedHandoffUrl?: string;
  signedObjectUrl?: string;
  storageLabel: string;
  storageStatus: PdfUploadStorageStatus;
}

export interface PdfUploadServerHandoffRecord {
  deleteStatus: "active" | "deleted";
  fileName: string;
  fileSizeBytes?: number;
  handoffToken: string;
  objectKey: string;
  retentionLabel: string;
  scanLabel: string;
  scanStatus: "ready" | "rejected";
  signedHandoffUrl?: string;
  signedObjectUrl?: string;
  uploadId: string;
}

export function buildPdfUploadItems(files: PdfUploadFileLike[]): PdfUploadItem[] {
  return files.map((file) => {
    const isPdf = isPdfFile(file);
    const isWithinLimit = file.size <= PDF_UPLOAD_LIMIT_BYTES;
    const scanStatus: PdfUploadScanStatus = isPdf && isWithinLimit ? "scan-passed" : "rejected";
    const scanLabel = getScanLabel({ isPdf, isWithinLimit });

    return {
      deleteStatus: "active",
      id: buildUploadId(file),
      name: file.name,
      pages: estimatePdfPages(file.size),
      retentionLabel: scanStatus === "scan-passed" ? "Auto-delete after session" : "Not retained",
      scanLabel,
      scanStatus,
      sizeBytes: file.size,
      sizeMb: roundMb(file.size / 1024 / 1024),
      source: "local",
      storageLabel: "Local only",
      storageStatus: "local-only"
    };
  });
}

export function getReadyPdfUploadItems(items: PdfUploadItem[]): PdfUploadItem[] {
  return items.filter((item) => item.scanStatus === "scan-passed" && item.deleteStatus === "active");
}

export function mergePdfUploadServerRecords(items: PdfUploadItem[], records: PdfUploadServerHandoffRecord[]): PdfUploadItem[] {
  return items.map((item) => {
    const record = records.find((candidate) => candidate.fileName === item.name && (candidate.fileSizeBytes === undefined || candidate.fileSizeBytes === item.sizeBytes));
    if (!record) return item;

    return {
      ...item,
      deleteStatus: record.deleteStatus === "deleted" ? "deleted" : item.deleteStatus,
      handoffToken: record.handoffToken,
      id: record.uploadId,
      objectKey: record.objectKey,
      retentionLabel: record.retentionLabel,
      scanLabel: record.scanLabel,
      scanStatus: record.scanStatus === "ready" ? "scan-passed" : "rejected",
      serverUploadId: record.uploadId,
      signedHandoffUrl: record.signedHandoffUrl,
      signedObjectUrl: record.signedObjectUrl,
      storageLabel: "Storage handoff ready",
      storageStatus: "stored"
    };
  });
}

export function markPdfUploadStorageFailed(items: PdfUploadItem[]): PdfUploadItem[] {
  return items.map((item) => {
    if (item.scanStatus !== "scan-passed" || item.deleteStatus !== "active") return item;

    return {
      ...item,
      storageLabel: "Storage handoff failed",
      storageStatus: "failed"
    };
  });
}

function buildUploadId(file: PdfUploadFileLike) {
  return `upload-${file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${file.size}`;
}

function estimatePdfPages(sizeBytes: number) {
  return Math.max(1, Math.round(sizeBytes / 350_000));
}

function getScanLabel({ isPdf, isWithinLimit }: { isPdf: boolean; isWithinLimit: boolean }) {
  if (!isPdf) return "Only PDF files can be queued";
  if (!isWithinLimit) return "Blocked by 50 MB PDF limit";
  return "Scan passed";
}

function isPdfFile(file: PdfUploadFileLike) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function roundMb(value: number): number {
  return Math.round(value * 10) / 10;
}
