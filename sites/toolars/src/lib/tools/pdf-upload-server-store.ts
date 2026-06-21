import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { dirname, join } from "node:path";
import { getToolarsPdfObjectRoot, getToolarsRuntimeFilePath, TOOLARS_RUNTIME_FILES } from "@/lib/ops/toolars-runtime-config";
import { PDF_UPLOAD_LIMIT_BYTES } from "./pdf-upload-lifecycle";

export type PdfUploadServerScanStatus = "queued" | "ready" | "rejected";
export type PdfUploadServerDeleteStatus = "active" | "deleted";
export type PdfUploadHandoffTarget = "pdf-summary";
export type PdfUploadServerScanMode = "queued" | "sync";

export interface PdfUploadTempCandidate {
  contentBase64?: string;
  contentHash?: string;
  name: string;
  size: number;
  type?: string;
}

export interface PdfUploadServerRecord {
  deleteStatus: PdfUploadServerDeleteStatus;
  deletedAt?: string;
  expiresAt: string;
  fileName: string;
  fileSizeBytes: number;
  handoffTarget: PdfUploadHandoffTarget;
  handoffToken: string;
  objectKey: string;
  retentionLabel: string;
  scanCompletedAt?: string;
  scanLabel: string;
  scanQueuedAt?: string;
  scanStatus: PdfUploadServerScanStatus;
  scanWorker: "pdf-upload-metadata-scan:v1";
  signedHandoffUrl: string;
  signedObjectUrl: string;
  uploadId: string;
  uploadedAt: string;
  workspaceId: string;
}

export interface PdfUploadDeletionAuditEntry {
  deleteReason: "expired" | "user-requested";
  deleteStatus: "deleted";
  deletedAt: string;
  fileName: string;
  handoffToken: string;
  objectKey: string;
  uploadId: string;
  workspaceId: string;
}

export interface PdfUploadObjectAccessAuditEntry {
  accessedAt: string;
  accessStatus: "granted" | "rejected";
  denyReason?: "invalid-or-expired-object-access";
  fileName?: string;
  objectKey: string;
  uploadId?: string;
  workspaceId: string;
}

interface PdfUploadTempStore {
  deletions: PdfUploadDeletionAuditEntry[];
  objectAccesses: PdfUploadObjectAccessAuditEntry[];
  uploads: Record<string, PdfUploadServerRecord>;
  version: 1;
}

export interface PdfUploadObjectStorageDriver {
  delete: (objectKey: string) => void;
  read: (objectKey: string) => Buffer | null;
  reset?: () => void;
  write: (objectKey: string, content: Buffer) => void;
}

let objectStorageDriverForTest: PdfUploadObjectStorageDriver | null = null;
let storagePathForTest: string | null = null;

export function registerPdfUploadTempObjects({
  files,
  scanMode = "sync",
  uploadedAt = new Date().toISOString(),
  workspaceId
}: {
  files: PdfUploadTempCandidate[];
  scanMode?: PdfUploadServerScanMode;
  uploadedAt?: string;
  workspaceId: string;
}) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const store = readTempStore();
  const records = files.map((file) => buildPdfUploadServerRecord(file, normalizedWorkspaceId, uploadedAt, scanMode));

  for (const [index, record] of records.entries()) {
    store.uploads[record.uploadId] = record;
    writePdfUploadTempObjectContent(record, files[index]);
  }

  writeTempStore(store);
  return records.map((record) => ({ ...record }));
}

export function listPdfUploadHandoffs({
  handoffTarget,
  workspaceId
}: {
  handoffTarget: PdfUploadHandoffTarget;
  workspaceId: string;
}) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const store = readTempStore();

  return Object.values(store.uploads)
    .filter(
      (record) =>
        record.workspaceId === normalizedWorkspaceId &&
        record.handoffTarget === handoffTarget &&
        record.scanStatus === "ready" &&
        record.deleteStatus === "active"
    )
    .map((record) => ({ ...record }));
}

export function resolvePdfUploadSignedHandoff({
  handoffToken,
  now = new Date().toISOString(),
  signature,
  workspaceId
}: {
  handoffToken: string;
  now?: string;
  signature: string;
  workspaceId: string;
}) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const record = Object.values(readTempStore().uploads).find(
    (upload) => upload.handoffToken === handoffToken && upload.workspaceId === normalizedWorkspaceId
  );

  if (!record || record.deleteStatus !== "active" || record.scanStatus !== "ready" || isExpired(record, now)) return null;
  const expectedSignature = signPdfUploadHandoff(record);
  if (!isMatchingSignature(signature, expectedSignature)) return null;

  return { ...record };
}

export function resolvePdfUploadSignedObject({
  expiresAt,
  now = new Date().toISOString(),
  objectKey,
  signature,
  workspaceId
}: {
  expiresAt: string;
  now?: string;
  objectKey: string;
  signature: string;
  workspaceId: string;
}) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const record = Object.values(readTempStore().uploads).find(
    (upload) => upload.objectKey === objectKey && upload.workspaceId === normalizedWorkspaceId
  );

  if (
    !record ||
    record.deleteStatus !== "active" ||
    record.scanStatus !== "ready" ||
    record.expiresAt !== expiresAt ||
    isExpired(record, now)
  ) {
    return null;
  }

  const expectedSignature = signPdfUploadObjectAccess(record);
  if (!isMatchingSignature(signature, expectedSignature)) return null;

  const content = readPdfUploadTempObjectContent(record);
  if (!content) return null;

  return {
    ...record,
    content,
    contentType: "application/pdf" as const
  };
}

export function listPdfUploadDeletionAudit({ workspaceId }: { workspaceId: string }) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  return readTempStore().deletions
    .filter((deletion) => deletion.workspaceId === normalizedWorkspaceId)
    .map((deletion) => ({ ...deletion }));
}

export function listPdfUploadObjectAccessAudit({ workspaceId }: { workspaceId: string }) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  return readTempStore().objectAccesses
    .filter((entry) => entry.workspaceId === normalizedWorkspaceId)
    .map((entry) => ({ ...entry }));
}

export function recordPdfUploadObjectAccess({
  accessedAt = new Date().toISOString(),
  accessStatus,
  denyReason,
  fileName,
  objectKey,
  uploadId,
  workspaceId
}: {
  accessedAt?: string;
  accessStatus: PdfUploadObjectAccessAuditEntry["accessStatus"];
  denyReason?: PdfUploadObjectAccessAuditEntry["denyReason"];
  fileName?: string;
  objectKey: string;
  uploadId?: string;
  workspaceId: string;
}) {
  const store = readTempStore();
  const entry: PdfUploadObjectAccessAuditEntry = {
    accessedAt,
    accessStatus,
    denyReason,
    fileName,
    objectKey,
    uploadId,
    workspaceId: normalizeWorkspaceId(workspaceId)
  };

  store.objectAccesses = [...store.objectAccesses, entry];
  writeTempStore(store);
  return { ...entry };
}

export function deletePdfUploadTempObject({
  deletedAt = new Date().toISOString(),
  deleteReason = "user-requested",
  uploadId,
  workspaceId
}: {
  deletedAt?: string;
  deleteReason?: PdfUploadDeletionAuditEntry["deleteReason"];
  uploadId: string;
  workspaceId: string;
}) {
  const normalizedWorkspaceId = normalizeWorkspaceId(workspaceId);
  const store = readTempStore();
  const record = store.uploads[uploadId];

  if (!record || record.workspaceId !== normalizedWorkspaceId) return null;

  const nextRecord: PdfUploadServerRecord = {
    ...record,
    deleteStatus: "deleted",
    deletedAt
  };
  store.uploads[uploadId] = nextRecord;
  deletePdfUploadTempObjectContent(record);
  const deletion = buildDeletionAuditEntry(nextRecord, deletedAt, deleteReason);
  store.deletions = [...store.deletions, deletion];
  writeTempStore(store);

  return { ...deletion };
}

export function sweepExpiredPdfUploadTempObjects({
  deletedAt = new Date().toISOString(),
  now = new Date().toISOString(),
  workspaceId
}: {
  deletedAt?: string;
  now?: string;
  workspaceId?: string;
}) {
  const normalizedWorkspaceId = workspaceId ? normalizeWorkspaceId(workspaceId) : null;
  const store = readTempStore();
  const deletions: PdfUploadDeletionAuditEntry[] = [];

  for (const [uploadId, record] of Object.entries(store.uploads)) {
    if (normalizedWorkspaceId && record.workspaceId !== normalizedWorkspaceId) continue;
    if (record.deleteStatus !== "active" || !isExpired(record, now)) continue;

    const nextRecord: PdfUploadServerRecord = {
      ...record,
      deleteStatus: "deleted",
      deletedAt
    };
    store.uploads[uploadId] = nextRecord;
    deletePdfUploadTempObjectContent(record);
    deletions.push(buildDeletionAuditEntry(nextRecord, deletedAt, "expired"));
  }

  store.deletions = [...store.deletions, ...deletions];
  writeTempStore(store);

  return {
    deletions: deletions.map((deletion) => ({ ...deletion }))
  };
}

export function runPdfUploadScanWorker({
  scannedAt = new Date().toISOString(),
  workspaceId
}: {
  scannedAt?: string;
  workspaceId?: string;
}) {
  const normalizedWorkspaceId = workspaceId ? normalizeWorkspaceId(workspaceId) : null;
  const store = readTempStore();
  const processed: PdfUploadServerRecord[] = [];

  for (const [uploadId, record] of Object.entries(store.uploads)) {
    if (normalizedWorkspaceId && record.workspaceId !== normalizedWorkspaceId) continue;
    if (record.deleteStatus !== "active" || record.scanStatus !== "queued") continue;

    const isPdf = record.fileName.toLowerCase().endsWith(".pdf");
    const isWithinLimit = record.fileSizeBytes <= PDF_UPLOAD_LIMIT_BYTES;
    const scanStatus: PdfUploadServerScanStatus = isPdf && isWithinLimit ? "ready" : "rejected";
    const nextRecord = ensureSignedUploadUrls({
      ...record,
      retentionLabel: getServerRetentionLabel(scanStatus),
      scanCompletedAt: scannedAt,
      scanLabel: getServerScanLabel({ isPdf, isWithinLimit }),
      scanStatus
    });

    store.uploads[uploadId] = nextRecord;
    if (scanStatus === "rejected") {
      deletePdfUploadTempObjectContent(nextRecord);
    }
    processed.push({ ...nextRecord });
  }

  writeTempStore(store);

  return {
    processed
  };
}

export function resetPdfUploadTempStore() {
  const objectStorageDriver = getPdfUploadObjectStorageDriver();
  if (objectStorageDriver) {
    objectStorageDriver.reset?.();
  } else {
    rmSync(/*turbopackIgnore: true*/ getTempObjectRoot(), { force: true, recursive: true });
  }
  writeTempStore(createEmptyTempStore());
}

export function setPdfUploadTempStorePathForTest(path: string | null) {
  storagePathForTest = path;
}

export function setPdfUploadObjectStorageDriverForTest(driver: PdfUploadObjectStorageDriver | null) {
  objectStorageDriverForTest = driver;
}

function buildPdfUploadServerRecord(
  file: PdfUploadTempCandidate,
  workspaceId: string,
  uploadedAt: string,
  scanMode: PdfUploadServerScanMode
): PdfUploadServerRecord {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isWithinLimit = file.size <= PDF_UPLOAD_LIMIT_BYTES;
  const scanStatus: PdfUploadServerScanStatus = scanMode === "queued" ? "queued" : isPdf && isWithinLimit ? "ready" : "rejected";
  const uploadId = buildUploadId(file, uploadedAt);

  const record: PdfUploadServerRecord = {
    deleteStatus: "active",
    expiresAt: buildExpiresAt(uploadedAt),
    fileName: file.name,
    fileSizeBytes: file.size,
    handoffTarget: "pdf-summary",
    handoffToken: `handoff_pdf-summary_${uploadId.replace(/^pdf_upload_/, "")}`,
    objectKey: `temp/${workspaceId}/${uploadId}.pdf`,
    retentionLabel: getServerRetentionLabel(scanStatus),
    scanLabel: scanStatus === "queued" ? "Queued for server scan" : getServerScanLabel({ isPdf, isWithinLimit }),
    scanQueuedAt: scanStatus === "queued" ? uploadedAt : undefined,
    scanStatus,
    scanWorker: "pdf-upload-metadata-scan:v1",
    signedHandoffUrl: "",
    signedObjectUrl: "",
    uploadId,
    uploadedAt,
    workspaceId
  };
  return ensureSignedUploadUrls(record);
}

function buildUploadId(file: PdfUploadTempCandidate, uploadedAt: string) {
  const compactUploadedAt = uploadedAt.replace(/\D/g, "").slice(0, 14) || "local";
  const slug = file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "file";
  const hash = (file.contentHash ?? String(file.size)).replace(/[^a-zA-Z0-9]+/g, "").slice(0, 12) || "upload";
  return `pdf_upload_${compactUploadedAt}_${slug}_${hash}`;
}

function buildExpiresAt(uploadedAt: string) {
  const uploadedDate = new Date(uploadedAt);
  const expiresAt = Number.isNaN(uploadedDate.getTime()) ? new Date() : uploadedDate;
  expiresAt.setHours(expiresAt.getHours() + 2);
  return expiresAt.toISOString();
}

function getServerScanLabel({ isPdf, isWithinLimit }: { isPdf: boolean; isWithinLimit: boolean }) {
  if (!isPdf) return "Only PDF files can be queued";
  if (!isWithinLimit) return "Blocked by 50 MB PDF limit";
  return "Server scan passed";
}

function getServerRetentionLabel(scanStatus: PdfUploadServerScanStatus) {
  if (scanStatus === "queued") return "Encrypted temp object pending scan";
  if (scanStatus === "ready") return "Encrypted temporary server object";
  return "Not retained";
}

function readTempStore(): PdfUploadTempStore {
  const storagePath = getTempStorePath();
  if (!existsSync(/*turbopackIgnore: true*/ storagePath)) return createEmptyTempStore();

  try {
    const parsed = JSON.parse(readFileSync(/*turbopackIgnore: true*/ storagePath, "utf8")) as Partial<PdfUploadTempStore>;
    if (parsed.version !== 1 || !parsed.uploads || typeof parsed.uploads !== "object") return createEmptyTempStore();

    return {
      deletions: Array.isArray(parsed.deletions) ? parsed.deletions.filter(isPdfUploadDeletionAuditEntry) : [],
      objectAccesses: Array.isArray(parsed.objectAccesses) ? parsed.objectAccesses.filter(isPdfUploadObjectAccessAuditEntry) : [],
      uploads: Object.entries(parsed.uploads).reduce<Record<string, PdfUploadServerRecord>>((nextUploads, [uploadId, record]) => {
        const coerced = coerceUploadRecord(record);
        if (coerced) nextUploads[uploadId] = coerced;
        return nextUploads;
      }, {}),
      version: 1
    };
  } catch {
    return createEmptyTempStore();
  }
}

function writeTempStore(store: PdfUploadTempStore) {
  const storagePath = getTempStorePath();
  mkdirSync(/*turbopackIgnore: true*/ dirname(storagePath), { recursive: true });
  writeFileSync(/*turbopackIgnore: true*/ storagePath, `${JSON.stringify(store, null, 2)}\n`);
}

function createEmptyTempStore(): PdfUploadTempStore {
  return {
    deletions: [],
    objectAccesses: [],
    uploads: {},
    version: 1
  };
}

function coerceUploadRecord(record: unknown): PdfUploadServerRecord | null {
  if (!record || typeof record !== "object") return null;

  const candidate = record as Partial<PdfUploadServerRecord>;
  if (
    !candidate.expiresAt ||
    !candidate.fileName ||
    candidate.fileSizeBytes === undefined ||
    !candidate.handoffToken ||
    !candidate.objectKey ||
    !candidate.scanLabel ||
    !candidate.uploadId ||
    !candidate.uploadedAt ||
    !candidate.workspaceId
  ) {
    return null;
  }

  return ensureSignedUploadUrls({
    deleteStatus: candidate.deleteStatus === "deleted" ? "deleted" : "active",
    deletedAt: candidate.deletedAt,
    expiresAt: candidate.expiresAt,
    fileName: candidate.fileName,
    fileSizeBytes: candidate.fileSizeBytes,
    handoffTarget: "pdf-summary",
    handoffToken: candidate.handoffToken,
    objectKey: candidate.objectKey,
    retentionLabel: candidate.retentionLabel ?? "Temporary server object",
    scanCompletedAt: candidate.scanCompletedAt,
    scanLabel: candidate.scanLabel,
    scanQueuedAt: candidate.scanQueuedAt,
    scanStatus: coerceScanStatus(candidate.scanStatus),
    scanWorker: "pdf-upload-metadata-scan:v1",
    signedHandoffUrl: candidate.signedHandoffUrl ?? "",
    signedObjectUrl: candidate.signedObjectUrl ?? "",
    uploadId: candidate.uploadId,
    uploadedAt: candidate.uploadedAt,
    workspaceId: normalizeWorkspaceId(candidate.workspaceId)
  });
}

function getTempStorePath() {
  return (
    storagePathForTest ??
    getToolarsRuntimeFilePath({
      envKey: "TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH",
      fallbackPath: join(".next", "cache", TOOLARS_RUNTIME_FILES.pdfUploadTempStore),
      fileName: TOOLARS_RUNTIME_FILES.pdfUploadTempStore
    })
  );
}

function writePdfUploadTempObjectContent(record: PdfUploadServerRecord, file: PdfUploadTempCandidate) {
  if (record.scanStatus === "rejected" || !file.contentBase64) return;

  const content = Buffer.from(file.contentBase64, "base64");
  const encryptedContent = encryptPdfUploadObjectContent(record.objectKey, content);
  const objectStorageDriver = getPdfUploadObjectStorageDriver();
  if (objectStorageDriver) {
    objectStorageDriver.write(record.objectKey, encryptedContent);
    return;
  }

  const objectPath = getTempObjectPath(record.objectKey);
  mkdirSync(/*turbopackIgnore: true*/ dirname(objectPath), { recursive: true });
  writeFileSync(/*turbopackIgnore: true*/ objectPath, encryptedContent);
}

function readPdfUploadTempObjectContent(record: Pick<PdfUploadServerRecord, "objectKey">) {
  const objectStorageDriver = getPdfUploadObjectStorageDriver();
  if (objectStorageDriver) {
    const storedContent = objectStorageDriver.read(record.objectKey);
    return storedContent ? decryptPdfUploadObjectContent(record.objectKey, storedContent) : null;
  }

  const objectPath = getTempObjectPath(record.objectKey);
  if (!existsSync(/*turbopackIgnore: true*/ objectPath)) return null;

  return decryptPdfUploadObjectContent(record.objectKey, readFileSync(/*turbopackIgnore: true*/ objectPath));
}

function deletePdfUploadTempObjectContent(record: Pick<PdfUploadServerRecord, "objectKey">) {
  const objectStorageDriver = getPdfUploadObjectStorageDriver();
  if (objectStorageDriver) {
    objectStorageDriver.delete(record.objectKey);
    return;
  }

  rmSync(/*turbopackIgnore: true*/ getTempObjectPath(record.objectKey), { force: true });
}

function getPdfUploadObjectStorageDriver() {
  return objectStorageDriverForTest;
}

function getTempObjectPath(objectKey: string) {
  return join(getTempObjectRoot(), ...objectKey.split("/").map(sanitizeObjectKeySegment).filter(Boolean));
}

function getTempObjectRoot() {
  return getToolarsPdfObjectRoot({
    fallbackRoot: join(dirname(getTempStorePath()), TOOLARS_RUNTIME_FILES.pdfObjectStorage)
  });
}

function encryptPdfUploadObjectContent(objectKey: string, content: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getObjectStorageEncryptionKey(), iv);
  cipher.setAAD(Buffer.from(objectKey));
  const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.from(
    `toolars.enc.v1.${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`,
    "utf8"
  );
}

function decryptPdfUploadObjectContent(objectKey: string, storedContent: Buffer) {
  const envelope = storedContent.toString("utf8");
  if (!envelope.startsWith("toolars.enc.v1.")) return storedContent;

  const [, , , encodedIv, encodedAuthTag, encodedContent] = envelope.split(".");
  if (!encodedIv || !encodedAuthTag || !encodedContent) return null;

  try {
    const decipher = createDecipheriv("aes-256-gcm", getObjectStorageEncryptionKey(), Buffer.from(encodedIv, "base64url"));
    decipher.setAAD(Buffer.from(objectKey));
    decipher.setAuthTag(Buffer.from(encodedAuthTag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(encodedContent, "base64url")), decipher.final()]);
  } catch {
    return null;
  }
}

function getObjectStorageEncryptionKey() {
  return createHash("sha256").update(process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY ?? "toolars-local-object-storage-encryption-secret").digest();
}

function sanitizeObjectKeySegment(segment: string) {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "segment";
}

function normalizeWorkspaceId(workspaceId?: string | null) {
  const normalized = workspaceId?.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80);
  return normalized || "anonymous-local";
}

function coerceScanStatus(scanStatus?: string): PdfUploadServerScanStatus {
  if (scanStatus === "ready" || scanStatus === "queued") return scanStatus;
  return "rejected";
}

function buildDeletionAuditEntry(
  record: PdfUploadServerRecord,
  deletedAt: string,
  deleteReason: PdfUploadDeletionAuditEntry["deleteReason"]
): PdfUploadDeletionAuditEntry {
  return {
    deleteReason,
    deleteStatus: "deleted",
    deletedAt,
    fileName: record.fileName,
    handoffToken: record.handoffToken,
    objectKey: record.objectKey,
    uploadId: record.uploadId,
    workspaceId: record.workspaceId
  };
}

function buildSignedHandoffUrl(record: PdfUploadServerRecord) {
  const searchParams = new URLSearchParams({
    handoffToken: record.handoffToken,
    signature: signPdfUploadHandoff(record)
  });
  return `/api/pdf/uploads?${searchParams.toString()}`;
}

function buildSignedObjectUrl(record: PdfUploadServerRecord) {
  const searchParams = new URLSearchParams({
    objectKey: record.objectKey,
    expiresAt: record.expiresAt,
    signature: signPdfUploadObjectAccess(record)
  });
  return `/api/pdf/uploads/object?${searchParams.toString()}`;
}

function ensureSignedUploadUrls(record: PdfUploadServerRecord): PdfUploadServerRecord {
  return {
    ...record,
    signedHandoffUrl: record.signedHandoffUrl || buildSignedHandoffUrl(record),
    signedObjectUrl: record.signedObjectUrl || buildSignedObjectUrl(record)
  };
}

function signPdfUploadHandoff(record: Pick<PdfUploadServerRecord, "expiresAt" | "handoffToken" | "objectKey" | "workspaceId">) {
  return createHmac("sha256", getHandoffSigningSecret())
    .update(`${record.workspaceId}:${record.handoffToken}:${record.objectKey}:${record.expiresAt}`)
    .digest("hex");
}

function signPdfUploadObjectAccess(record: Pick<PdfUploadServerRecord, "expiresAt" | "objectKey" | "workspaceId">) {
  return createHmac("sha256", getHandoffSigningSecret())
    .update(`${record.workspaceId}:${record.objectKey}:${record.expiresAt}`)
    .digest("hex");
}

function getHandoffSigningSecret() {
  return process.env.TOOLARS_UPLOAD_HANDOFF_SECRET ?? "toolars-local-upload-handoff-secret";
}

function isMatchingSignature(candidate: string, expected: string) {
  if (!candidate || candidate.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
  } catch {
    return false;
  }
}

function isExpired(record: Pick<PdfUploadServerRecord, "expiresAt">, now: string) {
  return new Date(record.expiresAt).getTime() <= new Date(now).getTime();
}

function isPdfUploadDeletionAuditEntry(deletion: unknown): deletion is PdfUploadDeletionAuditEntry {
  if (!deletion || typeof deletion !== "object") return false;

  const candidate = deletion as Partial<PdfUploadDeletionAuditEntry>;
  return Boolean(
    (candidate.deleteReason === "expired" || candidate.deleteReason === "user-requested") &&
      candidate.deleteStatus === "deleted" &&
      candidate.deletedAt &&
      candidate.fileName &&
      candidate.handoffToken &&
      candidate.objectKey &&
      candidate.uploadId &&
      candidate.workspaceId
  );
}

function isPdfUploadObjectAccessAuditEntry(entry: unknown): entry is PdfUploadObjectAccessAuditEntry {
  if (!entry || typeof entry !== "object") return false;

  const candidate = entry as Partial<PdfUploadObjectAccessAuditEntry>;
  return Boolean(
    candidate.accessedAt &&
      (candidate.accessStatus === "granted" || candidate.accessStatus === "rejected") &&
      candidate.objectKey &&
      candidate.workspaceId
  );
}
