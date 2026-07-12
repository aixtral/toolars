import {
  isAiConsentAuditEvent,
  isAiConsentRunMetadata,
  summarizeServerConsentUsageAnalytics,
  type AiConsentDeletionAuditEntry,
  type ServerConsentAuditLedger
} from "@/lib/ai/server-consent-audit-ledger";
import type { AiConsentAuditEvent } from "@/lib/ai/consent-audit-storage";
import type { AiConsentRunMetadata } from "@/lib/ai/consent-audit-run-metadata";
import { isToolarsAuthenticationError, requireAuthenticatedUser } from "@/lib/auth/toolars-api-auth-context";
import {
  createToolarsPrivateAuditRecord,
  deleteToolarsPrivateAuditRecords,
  listToolarsPrivateAuditRecords
} from "@/lib/supabase/toolars-private-data";

export const runtime = "nodejs";

export async function GET(request?: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const ledger = await loadLedger(auth.accountId!);
    return Response.json({ auth, ledger, usage: summarizeServerConsentUsageAnalytics(ledger) });
  } catch (error) {
    return toAuthFailure(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const body = (await request.json()) as { event?: unknown; runMetadata?: unknown };
    if (!isAiConsentAuditEvent(body.event) || !isAiConsentRunMetadata(body.runMetadata)) {
      return Response.json({ error: "Invalid AI consent audit record" }, { status: 400 });
    }
    await createToolarsPrivateAuditRecord({
      event: body.event,
      runMetadata: body.runMetadata,
      userId: auth.accountId!
    });
    const ledger = await loadLedger(auth.accountId!);
    return Response.json({ auth, ledger }, { status: 201 });
  } catch (error) {
    return toAuthFailure(error, "Invalid AI consent audit record");
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAuthenticatedUser(request);
    return Response.json({ error: "Anonymous audit migration is retired" }, { status: 410 });
  } catch (error) {
    return toAuthFailure(error);
  }
}

export async function DELETE(request?: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const deleted = await deleteToolarsPrivateAuditRecords({ userId: auth.accountId! });
    const deletion: AiConsentDeletionAuditEntry = {
      deletedEvents: deleted.deletedRecords,
      deletedRuns: deleted.deletedRecords,
      requestedAt: new Date().toISOString(),
      scope: "ai-history",
      status: "completed"
    };
    const ledger = await loadLedger(auth.accountId!, [deletion]);
    return Response.json({ auth, deletion, ledger });
  } catch (error) {
    return toAuthFailure(error);
  }
}

async function loadLedger(accountId: string, deletions: AiConsentDeletionAuditEntry[] = []): Promise<ServerConsentAuditLedger> {
  const records = await listToolarsPrivateAuditRecords({ userId: accountId });
  return {
    accountBindings: [],
    deletions,
    events: records.map((record) => record.event as AiConsentAuditEvent),
    runs: records.map((record) => record.runMetadata as AiConsentRunMetadata),
    version: 1,
    workspaceId: `account:${accountId}`
  };
}

function toAuthFailure(error: unknown, fallbackMessage = "Unable to process AI consent audit record") {
  if (isToolarsAuthenticationError(error)) return Response.json({ error: "Authentication required" }, { status: 401 });
  return Response.json({ error: fallbackMessage }, { status: 400 });
}
