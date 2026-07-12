import {
  isAiConsentAuditEvent,
  isAiConsentRunMetadata,
  summarizeServerConsentUsageAnalytics
} from "@/lib/ai/server-consent-audit-ledger";
import type { AiConsentAuditEvent } from "@/lib/ai/consent-audit-storage";
import type { AiConsentRunMetadata, AiConsentRunUsage } from "@/lib/ai/consent-audit-run-metadata";
import {
  isToolarsAuthenticationError,
  requireAuthenticatedUser
} from "@/lib/auth/toolars-api-auth-context";
import type { ToolarsAuthenticatedAuthContext } from "@/lib/auth/toolars-api-auth-context";
import {
  createToolarsPrivateAuditRecord,
  listToolarsPrivateAuditRecords
} from "@/lib/supabase/toolars-private-data";

export const runtime = "nodejs";

interface ProviderRunRequestBody {
  event?: AiConsentAuditEvent;
  prompt?: string;
  runMetadata?: AiConsentRunMetadata;
}

interface ProviderRunResponsePayload {
  modelId?: string;
  outputText?: string;
  providerRunId?: string;
  usage?: Partial<AiConsentRunUsage>;
}

class AiProviderExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProviderExecutionError";
  }
}

export async function POST(request: Request) {
  let auth: ToolarsAuthenticatedAuthContext | null = null;
  let body: ProviderRunRequestBody | null = null;

  try {
    auth = await requireAuthenticatedUser(request);
    body = (await request.json()) as ProviderRunRequestBody;
    assertProviderRunBody(body);
    const providerRun = await executeConfiguredAiProviderRun({
      auth,
      event: body.event,
      prompt: body.prompt ?? "",
      runMetadata: body.runMetadata
    });
    const runMetadata = buildCompletedRunMetadata(body.runMetadata, providerRun);
    await createToolarsPrivateAuditRecord({
      event: body.event,
      runMetadata,
      userId: auth.accountId
    });
    const ledger = await loadLedger(auth.accountId);

    return Response.json(
      {
        auth,
        ledger,
        outputText: providerRun.outputText ?? "",
        run: runMetadata,
        usage: summarizeServerConsentUsageAnalytics(ledger)
      },
      { status: 201 }
    );
  } catch (error) {
    if (isToolarsAuthenticationError(error)) return Response.json({ error: "Authentication required" }, { status: 401 });
    if (auth && body?.event && body.runMetadata && error instanceof AiProviderExecutionError) {
      const failedRun = buildFailedRunMetadata(body.runMetadata, error.message);
      await createToolarsPrivateAuditRecord({
        event: body.event,
        runMetadata: failedRun,
      userId: auth.accountId
      });
      const ledger = await loadLedger(auth.accountId);

      return Response.json(
        {
          auth,
          error: "AI provider execution failed",
          ledger,
          run: failedRun,
          usage: summarizeServerConsentUsageAnalytics(ledger)
        },
        { status: 502 }
      );
    }

    return Response.json({ auth, error: "Invalid AI provider run request" }, { status: 400 });
  }
}

async function executeConfiguredAiProviderRun({
  auth,
  event,
  prompt,
  runMetadata
}: {
  auth: ToolarsAuthenticatedAuthContext;
  event: AiConsentAuditEvent;
  prompt: string;
  runMetadata: AiConsentRunMetadata;
}): Promise<ProviderRunResponsePayload> {
  const endpoint = process.env.TOOLARS_AI_PROVIDER_ENDPOINT?.trim();
  if (!endpoint || typeof fetch !== "function") throw new AiProviderExecutionError("AI provider endpoint is not configured");

  const response = await fetch(`${endpoint.replace(/\/+$/g, "")}/runs`, {
    body: JSON.stringify({
      accountId: auth.accountId,
      contentSummary: event.contentSummary,
      prompt,
      providerRouteId: runMetadata.providerRouteId,
      runId: runMetadata.runId,
      stepId: runMetadata.stepId,
      workflowSlug: runMetadata.workflowSlug,
      workspaceId: auth.workspaceId
    }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.TOOLARS_AI_PROVIDER_API_KEY ?? ""}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) throw new AiProviderExecutionError(`Provider returned ${response.status}`);
  return (await response.json()) as ProviderRunResponsePayload;
}

function buildCompletedRunMetadata(
  runMetadata: AiConsentRunMetadata,
  providerRun: ProviderRunResponsePayload
): AiConsentRunMetadata {
  return {
    ...runMetadata,
    completedAt: new Date().toISOString(),
    modelId: providerRun.modelId?.trim() || undefined,
    providerRunId: providerRun.providerRunId?.trim() || undefined,
    status: "provider-completed",
    usage: normalizeUsage(providerRun.usage)
  };
}

function buildFailedRunMetadata(runMetadata: AiConsentRunMetadata, failureReason: string): AiConsentRunMetadata {
  return {
    ...runMetadata,
    failedAt: new Date().toISOString(),
    failureReason,
    status: "provider-failed"
  };
}

function normalizeUsage(usage?: Partial<AiConsentRunUsage>): AiConsentRunUsage {
  return {
    costUsdCents: normalizeNonNegativeNumber(usage?.costUsdCents),
    credits: normalizeNonNegativeNumber(usage?.credits),
    inputTokens: normalizeNonNegativeNumber(usage?.inputTokens),
    outputTokens: normalizeNonNegativeNumber(usage?.outputTokens),
    totalTokens: normalizeNonNegativeNumber(usage?.totalTokens)
  };
}

function normalizeNonNegativeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

function assertProviderRunBody(body: ProviderRunRequestBody): asserts body is Required<ProviderRunRequestBody> {
  if (!isAiConsentAuditEvent(body.event) || !isAiConsentRunMetadata(body.runMetadata)) {
    throw new Error("Invalid AI provider run body");
  }
}

async function loadLedger(accountId: string) {
  const records = await listToolarsPrivateAuditRecords({ userId: accountId });
  return {
    accountBindings: [],
    deletions: [],
    events: records.map((record) => record.event),
    runs: records.map((record) => record.runMetadata),
    version: 1 as const,
    workspaceId: `account:${accountId}`
  };
}
