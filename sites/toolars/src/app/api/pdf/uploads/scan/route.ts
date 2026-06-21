import { resolveServerConsentAuditWorkspaceId } from "@/lib/ai/server-consent-audit-ledger";
import { runPdfUploadScanWorker } from "@/lib/tools/pdf-upload-server-store";

export const runtime = "nodejs";

export function POST(request: Request) {
  const workspaceId = resolveServerConsentAuditWorkspaceId(request);
  const scan = runPdfUploadScanWorker({
    workspaceId
  });

  return Response.json(scan);
}
