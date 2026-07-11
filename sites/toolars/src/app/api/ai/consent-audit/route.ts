import {
  appendServerConsentAuditRecord,
  bindServerConsentAuditWorkspaceToAccount,
  clearServerConsentAuditLedger,
  getServerConsentAuditLedgerForAccount,
  getServerConsentAuditLedger,
  summarizeServerConsentUsageAnalytics
} from "@/lib/ai/server-consent-audit-ledger";
import { resolveToolarsApiAuthContext } from "@/lib/auth/toolars-api-auth-context";

export const runtime = "nodejs";

export async function GET(request?: Request) {
  const auth = await resolveToolarsApiAuthContext(request);
  if (auth.accountId) {
    const ledger = getServerConsentAuditLedgerForAccount(auth.accountId);
    return Response.json({
      auth,
      ledger,
      usage: summarizeServerConsentUsageAnalytics(ledger)
    });
  }

  const ledger = getServerConsentAuditLedger(auth.workspaceId);
  return Response.json({
    auth,
    ledger,
    usage: summarizeServerConsentUsageAnalytics(ledger)
  });
}

export async function POST(request: Request) {
  try {
    const auth = await resolveToolarsApiAuthContext(request);
    const body = await request.json();
    const ledger = appendServerConsentAuditRecord({
      accountId: auth.accountId,
      event: body.event,
      runMetadata: body.runMetadata,
      workspaceId: auth.workspaceId
    });

    return Response.json({ auth, ledger }, { status: 201 });
  } catch {
    return Response.json(
      {
        error: "Invalid AI consent audit record"
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await resolveToolarsApiAuthContext(request);
    const body = await request.json();
    const { binding, ledger } = bindServerConsentAuditWorkspaceToAccount({
      accountEmail: auth.accountEmail ?? body.accountEmail,
      accountId: auth.accountId ?? body.accountId,
      boundAt: body.boundAt,
      workspaceId: auth.workspaceId
    });

    return Response.json({ auth, binding, ledger });
  } catch {
    return Response.json(
      {
        error: "Invalid AI consent account binding"
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request?: Request) {
  const auth = await resolveToolarsApiAuthContext(request);
  const { deletion, ledger } = clearServerConsentAuditLedger({ workspaceId: auth.workspaceId });
  return Response.json({ auth, deletion, ledger });
}
