export const runtime = "nodejs";

const DEEPSEEK_CHAT_COMPLETIONS_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const UPSTREAM_TIMEOUT_MS = 60_000;

interface DeepSeekGatewayRequestBody {
  prompt?: string;
  runId?: string;
  stepId?: string;
  workflowSlug?: string;
}

interface DeepSeekChatCompletionPayload {
  choices?: { message?: { content?: string } }[];
  id?: string;
  model?: string;
  usage?: {
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Internal adapter between the Toolars AI provider contract (`POST {ENDPOINT}/runs`)
 * and DeepSeek's OpenAI-compatible chat completions API. The app's own AI routes
 * call this endpoint with TOOLARS_AI_PROVIDER_API_KEY as the bearer token; the
 * DeepSeek key never leaves the server. Configure with:
 *   TOOLARS_AI_PROVIDER_ENDPOINT=https://<site>/api/ai/deepseek-gateway
 *   TOOLARS_AI_PROVIDER_API_KEY=<shared app-to-adapter secret>
 *   TOOLARS_DEEPSEEK_API_KEY=<DeepSeek key>
 */
export async function POST(request: Request) {
  const expectedGatewayKey = process.env.TOOLARS_AI_PROVIDER_API_KEY?.trim();
  if (!expectedGatewayKey) {
    return Response.json({ error: "AI gateway is not configured" }, { status: 503 });
  }
  if ((request.headers.get("authorization") ?? "") !== `Bearer ${expectedGatewayKey}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deepSeekKey = process.env.TOOLARS_DEEPSEEK_API_KEY?.trim();
  if (!deepSeekKey) {
    return Response.json({ error: "DeepSeek provider is not configured" }, { status: 503 });
  }

  let body: DeepSeekGatewayRequestBody;
  try {
    body = (await request.json()) as DeepSeekGatewayRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const model = process.env.TOOLARS_DEEPSEEK_MODEL?.trim() || DEFAULT_DEEPSEEK_MODEL;
  let upstream: Response;
  try {
    upstream = await fetch(DEEPSEEK_CHAT_COMPLETIONS_URL, {
      body: JSON.stringify({
        messages: [{ content: prompt, role: "user" }],
        model,
        stream: false
      }),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${deepSeekKey}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });
  } catch (error) {
    return Response.json(
      { error: `DeepSeek request failed: ${error instanceof Error ? error.message : "unknown error"}` },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const detail = (await upstream.text().catch(() => "")).slice(0, 500);
    return Response.json({ detail, error: `DeepSeek returned ${upstream.status}` }, { status: 502 });
  }

  const payload = (await upstream.json()) as DeepSeekChatCompletionPayload;
  return Response.json(
    {
      modelId: payload.model ?? model,
      outputText: payload.choices?.[0]?.message?.content ?? "",
      providerRunId: payload.id,
      usage: {
        inputTokens: payload.usage?.prompt_tokens ?? 0,
        outputTokens: payload.usage?.completion_tokens ?? 0,
        totalTokens: payload.usage?.total_tokens ?? 0
      }
    },
    { status: 201 }
  );
}
