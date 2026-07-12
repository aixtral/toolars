import { randomUUID } from "node:crypto";
import type { AiConsentAuditEvent } from "@/lib/ai/consent-audit-storage";
import type { AiConsentRunMetadata } from "@/lib/ai/consent-audit-run-metadata";
import { createToolarsSupabaseServerClient } from "./server";

export const TOOLARS_PDF_UPLOAD_BUCKET = "toolars-pdf-temp";
const PDF_UPLOAD_URL_TTL_SECONDS = 60 * 15;

export interface ToolarsPrivateAuditRecord {
  createdAt: string;
  event: AiConsentAuditEvent;
  runMetadata: AiConsentRunMetadata;
}

export interface ToolarsPrivatePdfUpload {
  createdAt: string;
  expiresAt: string;
  fileName: string;
  fileSizeBytes: number;
  id: string;
  objectPath: string;
  signedObjectUrl: string;
}

export interface ToolarsPrivateDataDriver {
  createAuditRecord: (input: {
    event: AiConsentAuditEvent;
    runMetadata: AiConsentRunMetadata;
    userId: string;
  }) => Promise<ToolarsPrivateAuditRecord>;
  createPdfUpload: (input: {
    content: ArrayBuffer;
    contentType: string;
    expiresAt: string;
    fileName: string;
    fileSizeBytes: number;
    userId: string;
  }) => Promise<ToolarsPrivatePdfUpload>;
  deleteAuditRecords: (input: { userId: string }) => Promise<{ deletedRecords: number }>;
  deletePdfUpload: (input: { id: string; userId: string }) => Promise<boolean>;
  getPdfUpload: (input: { id: string; userId: string }) => Promise<ToolarsPrivatePdfUpload | null>;
  listAuditRecords: (input: { userId: string }) => Promise<ToolarsPrivateAuditRecord[]>;
  listPdfUploads: (input: { userId: string }) => Promise<ToolarsPrivatePdfUpload[]>;
}

let privateDataDriverForTest: ToolarsPrivateDataDriver | null = null;

export function setToolarsPrivateDataDriverForTest(driver: ToolarsPrivateDataDriver | null) {
  privateDataDriverForTest = driver;
}

export async function createToolarsPrivateAuditRecord(input: {
  event: AiConsentAuditEvent;
  runMetadata: AiConsentRunMetadata;
  userId: string;
}) {
  return getPrivateDataDriver().createAuditRecord(input);
}

export async function listToolarsPrivateAuditRecords(input: { userId: string }) {
  return getPrivateDataDriver().listAuditRecords(input);
}

export async function deleteToolarsPrivateAuditRecords(input: { userId: string }) {
  return getPrivateDataDriver().deleteAuditRecords(input);
}

export async function createToolarsPrivatePdfUpload(input: {
  content: ArrayBuffer;
  contentType: string;
  expiresAt: string;
  fileName: string;
  fileSizeBytes: number;
  userId: string;
}) {
  return getPrivateDataDriver().createPdfUpload(input);
}

export async function listToolarsPrivatePdfUploads(input: { userId: string }) {
  return getPrivateDataDriver().listPdfUploads(input);
}

export async function getToolarsPrivatePdfUpload(input: { id: string; userId: string }) {
  return getPrivateDataDriver().getPdfUpload(input);
}

export async function deleteToolarsPrivatePdfUpload(input: { id: string; userId: string }) {
  return getPrivateDataDriver().deletePdfUpload(input);
}

function getPrivateDataDriver(): ToolarsPrivateDataDriver {
  return privateDataDriverForTest ?? createSupabasePrivateDataDriver();
}

function createSupabasePrivateDataDriver(): ToolarsPrivateDataDriver {
  return {
    async createAuditRecord({ event, runMetadata, userId }) {
      const client = await createToolarsSupabaseServerClient();
      const { data, error } = await client
        .from("ai_consent_audit_records")
        .insert({ event, run_metadata: runMetadata, user_id: userId })
        .select("created_at, event, run_metadata")
        .single();
      if (error || !data) throw new Error("Unable to persist AI consent audit record");
      return mapAuditRecord(data);
    },

    async createPdfUpload({ content, contentType, expiresAt, fileName, fileSizeBytes, userId }) {
      const client = await createToolarsSupabaseServerClient();
      const objectPath = `${userId}/${randomUUID()}.pdf`;
      const storage = client.storage.from(TOOLARS_PDF_UPLOAD_BUCKET);
      const upload = await storage.upload(objectPath, content, { contentType, upsert: false });
      if (upload.error) throw new Error("Unable to store PDF upload");

      const { data, error } = await client
        .from("pdf_uploads")
        .insert({
          content_type: contentType,
          expires_at: expiresAt,
          file_name: fileName,
          file_size_bytes: fileSizeBytes,
          object_path: objectPath,
          user_id: userId
        })
        .select("id, file_name, file_size_bytes, object_path, expires_at, created_at")
        .single();
      if (error || !data) {
        await storage.remove([objectPath]);
        throw new Error("Unable to persist PDF upload metadata");
      }
      return signPdfUpload(client, data);
    },

    async deleteAuditRecords({ userId }) {
      const client = await createToolarsSupabaseServerClient();
      const { data, error } = await client
        .from("ai_consent_audit_records")
        .delete()
        .eq("user_id", userId)
        .select("id");
      if (error) throw new Error("Unable to delete AI consent audit records");
      return { deletedRecords: data?.length ?? 0 };
    },

    async deletePdfUpload({ id, userId }) {
      const client = await createToolarsSupabaseServerClient();
      const { data, error } = await client
        .from("pdf_uploads")
        .select("object_path")
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle();
      if (error || !data) return false;
      const removed = await client.storage.from(TOOLARS_PDF_UPLOAD_BUCKET).remove([data.object_path]);
      if (removed.error) throw new Error("Unable to delete PDF object");
      const deletion = await client.from("pdf_uploads").delete().eq("id", id).eq("user_id", userId);
      if (deletion.error) throw new Error("Unable to delete PDF upload metadata");
      return true;
    },

    async getPdfUpload({ id, userId }) {
      const client = await createToolarsSupabaseServerClient();
      const { data, error } = await client
        .from("pdf_uploads")
        .select("id, file_name, file_size_bytes, object_path, expires_at, created_at")
        .eq("id", id)
        .eq("user_id", userId)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();
      if (error || !data) return null;
      return signPdfUpload(client, data);
    },

    async listAuditRecords({ userId }) {
      const client = await createToolarsSupabaseServerClient();
      const { data, error } = await client
        .from("ai_consent_audit_records")
        .select("created_at, event, run_metadata")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) throw new Error("Unable to load AI consent audit records");
      return (data ?? []).map(mapAuditRecord);
    },

    async listPdfUploads({ userId }) {
      const client = await createToolarsSupabaseServerClient();
      const { data, error } = await client
        .from("pdf_uploads")
        .select("id, file_name, file_size_bytes, object_path, expires_at, created_at")
        .eq("user_id", userId)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (error) throw new Error("Unable to load PDF uploads");
      return Promise.all((data ?? []).map((row) => signPdfUpload(client, row)));
    }
  };
}

function mapAuditRecord(row: { created_at: string; event: unknown; run_metadata: unknown }): ToolarsPrivateAuditRecord {
  return {
    createdAt: row.created_at,
    event: row.event as AiConsentAuditEvent,
    runMetadata: row.run_metadata as AiConsentRunMetadata
  };
}

async function signPdfUpload(
  client: Awaited<ReturnType<typeof createToolarsSupabaseServerClient>>,
  row: { created_at: string; expires_at: string; file_name: string; file_size_bytes: number; id: string; object_path: string }
): Promise<ToolarsPrivatePdfUpload> {
  const { data, error } = await client.storage.from(TOOLARS_PDF_UPLOAD_BUCKET).createSignedUrl(row.object_path, PDF_UPLOAD_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) throw new Error("Unable to create PDF upload URL");
  return {
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    fileName: row.file_name,
    fileSizeBytes: row.file_size_bytes,
    id: row.id,
    objectPath: row.object_path,
    signedObjectUrl: data.signedUrl
  };
}
