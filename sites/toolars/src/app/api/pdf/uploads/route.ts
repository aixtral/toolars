import { createHash } from "node:crypto";
import { resolveServerConsentAuditWorkspaceId } from "@/lib/ai/server-consent-audit-ledger";
import {
  deletePdfUploadTempObject,
  listPdfUploadDeletionAudit,
  listPdfUploadHandoffs,
  listPdfUploadObjectAccessAudit,
  registerPdfUploadTempObjects,
  resolvePdfUploadSignedHandoff,
  sweepExpiredPdfUploadTempObjects,
  type PdfUploadTempCandidate
} from "@/lib/tools/pdf-upload-server-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const workspaceId = resolveServerConsentAuditWorkspaceId(request);
  const searchParams = new URL(request.url).searchParams;
  const handoffToken = searchParams.get("handoffToken");
  const signature = searchParams.get("signature");
  if (handoffToken || signature) {
    const upload =
      handoffToken && signature
        ? resolvePdfUploadSignedHandoff({
            handoffToken,
            signature,
            workspaceId
          })
        : null;

    if (!upload) {
      return Response.json({ error: "Invalid or expired PDF handoff" }, { status: 403 });
    }

    return Response.json({ upload });
  }

  const handoffTarget = searchParams.get("handoff") === "pdf-summary" ? "pdf-summary" : "pdf-summary";

  return Response.json({
    deletions: listPdfUploadDeletionAudit({ workspaceId }),
    objectAccesses: listPdfUploadObjectAccessAudit({ workspaceId }),
    uploads: listPdfUploadHandoffs({
      handoffTarget,
      workspaceId
    })
  });
}

export async function POST(request: Request) {
  try {
    const workspaceId = resolveServerConsentAuditWorkspaceId(request);
    const formData = await request.formData();
    const files = formData.getAll("files").filter(isFormDataFile);
    const fileNames = formData.getAll("fileNames").map((value) => String(value));
    if (files.length === 0) {
      return Response.json({ error: "No PDF files supplied" }, { status: 400 });
    }

    const scanMode = new URL(request.url).searchParams.get("scan") === "async" ? "queued" : "sync";
    const candidates = await Promise.all(files.map((file, index) => fileToTempCandidate(file, fileNames[index])));
    const uploads = registerPdfUploadTempObjects({
      files: candidates,
      scanMode,
      workspaceId
    });

    return Response.json({ uploads }, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid PDF upload request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const workspaceId = resolveServerConsentAuditWorkspaceId(request);
    const searchParams = new URL(request.url).searchParams;
    if (searchParams.get("sweep") === "expired") {
      const sweep = sweepExpiredPdfUploadTempObjects({
        now: searchParams.get("now") ?? undefined,
        workspaceId
      });

      return Response.json({
        deletions: sweep.deletions,
        ledger: {
          deletions: listPdfUploadDeletionAudit({ workspaceId })
        }
      });
    }

    const body = (await request.json()) as { uploadId?: string };
    if (!body.uploadId) {
      return Response.json({ error: "Missing upload id" }, { status: 400 });
    }

    const deletion = deletePdfUploadTempObject({
      uploadId: body.uploadId,
      workspaceId
    });

    if (!deletion) {
      return Response.json({ error: "Upload not found" }, { status: 404 });
    }

    return Response.json({ deletion });
  } catch {
    return Response.json({ error: "Invalid PDF upload delete request" }, { status: 400 });
  }
}

async function fileToTempCandidate(file: File, fileName?: string): Promise<PdfUploadTempCandidate> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    contentBase64: buffer.toString("base64"),
    contentHash: createHash("sha256").update(buffer).digest("hex"),
    name: fileName?.trim() || file.name,
    size: file.size,
    type: file.type
  };
}

function isFormDataFile(value: FormDataEntryValue): value is File {
  return typeof value === "object" && "arrayBuffer" in value && "name" in value && "size" in value;
}
