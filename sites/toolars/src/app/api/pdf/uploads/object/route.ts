import { resolveServerConsentAuditWorkspaceId } from "@/lib/ai/server-consent-audit-ledger";
import { recordPdfUploadObjectAccess, resolvePdfUploadSignedObject } from "@/lib/tools/pdf-upload-server-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const workspaceId = resolveServerConsentAuditWorkspaceId(request);
  const searchParams = new URL(request.url).searchParams;
  const objectKey = searchParams.get("objectKey");
  const expiresAt = searchParams.get("expiresAt");
  const signature = searchParams.get("signature");

  const object =
    objectKey && expiresAt && signature
      ? resolvePdfUploadSignedObject({
          expiresAt,
          objectKey,
          signature,
          workspaceId
        })
      : null;

  if (!object) {
    recordPdfUploadObjectAccess({
      accessStatus: "rejected",
      denyReason: "invalid-or-expired-object-access",
      objectKey: objectKey ?? "missing-object-key",
      workspaceId
    });
    return Response.json({ error: "Invalid or expired PDF object access" }, { status: 403 });
  }

  recordPdfUploadObjectAccess({
    accessStatus: "granted",
    fileName: object.fileName,
    objectKey: object.objectKey,
    uploadId: object.uploadId,
    workspaceId
  });

  return new Response(new Uint8Array(object.content), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `inline; filename="${sanitizeHeaderFilename(object.fileName)}"`,
      "Content-Type": object.contentType
    },
    status: 200
  });
}

function sanitizeHeaderFilename(fileName: string) {
  return fileName.replace(/[^\x20-\x7E]/g, "_").replace(/[\\"]/g, "_");
}
