import { PDF_UPLOAD_LIMIT_BYTES, type PdfUploadServerHandoffRecord } from "@/lib/tools/pdf-upload-lifecycle";
import { isToolarsAuthenticationError, requireAuthenticatedUser } from "@/lib/auth/toolars-api-auth-context";
import {
  createToolarsPrivatePdfUpload,
  deleteToolarsPrivatePdfUpload,
  getToolarsPrivatePdfUpload,
  listToolarsPrivatePdfUploads,
  type ToolarsPrivatePdfUpload
} from "@/lib/supabase/toolars-private-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const handoffToken = new URL(request.url).searchParams.get("handoffToken");
    if (handoffToken) {
      const upload = await getToolarsPrivatePdfUpload({ id: handoffToken, userId: auth.accountId! });
      if (!upload) return Response.json({ error: "PDF upload not found" }, { status: 404 });
      return Response.json({ upload: toHandoffRecord(upload) });
    }
    const uploads = await listToolarsPrivatePdfUploads({ userId: auth.accountId! });
    return Response.json({ uploads: uploads.map(toHandoffRecord) });
  } catch (error) {
    return toPdfFailure(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const formData = await request.formData();
    const files = formData.getAll("files").filter(isFormDataFile);
    if (files.length === 0) return Response.json({ error: "No PDF files supplied" }, { status: 400 });
    if (files.some((file) => !isValidPdfFile(file))) {
      return Response.json({ error: "Only PDF files up to 50 MB are supported" }, { status: 400 });
    }
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const uploads = await Promise.all(
      files.map(async (file) =>
        createToolarsPrivatePdfUpload({
          content: await file.arrayBuffer(),
          contentType: "application/pdf",
          expiresAt,
          fileName: file.name,
          fileSizeBytes: file.size,
          userId: auth.accountId!
        })
      )
    );
    return Response.json({ uploads: uploads.map(toHandoffRecord) }, { status: 201 });
  } catch (error) {
    return toPdfFailure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const body = (await request.json()) as { uploadId?: string };
    if (!body.uploadId) return Response.json({ error: "Missing upload id" }, { status: 400 });
    const deleted = await deleteToolarsPrivatePdfUpload({ id: body.uploadId, userId: auth.accountId! });
    if (!deleted) return Response.json({ error: "PDF upload not found" }, { status: 404 });
    return Response.json({ deleted: true });
  } catch (error) {
    return toPdfFailure(error);
  }
}

function toHandoffRecord(upload: ToolarsPrivatePdfUpload): PdfUploadServerHandoffRecord {
  return {
    deleteStatus: "active",
    fileName: upload.fileName,
    fileSizeBytes: upload.fileSizeBytes,
    handoffToken: upload.id,
    objectKey: upload.objectPath,
    retentionLabel: "Private temporary storage",
    scanLabel: "PDF type and size validated",
    scanStatus: "ready",
    signedHandoffUrl: `/api/pdf/uploads?handoffToken=${encodeURIComponent(upload.id)}`,
    signedObjectUrl: upload.signedObjectUrl,
    uploadId: upload.id
  };
}

function isFormDataFile(value: FormDataEntryValue): value is File {
  return typeof value === "object" && "arrayBuffer" in value && "name" in value && "size" in value;
}

function isValidPdfFile(file: File) {
  return file.size > 0 && file.size <= PDF_UPLOAD_LIMIT_BYTES && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
}

function toPdfFailure(error: unknown) {
  if (isToolarsAuthenticationError(error)) return Response.json({ error: "Authentication required" }, { status: 401 });
  return Response.json({ error: "Unable to process PDF upload" }, { status: 500 });
}
