import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const gatewayKey = "gateway-shared-secret";
const deepSeekKey = "deepseek-api-key";

function authorizedRequest(body: unknown, authorization = `Bearer ${gatewayKey}`) {
  return new Request("http://localhost/api/ai/deepseek-gateway/runs", {
    body: JSON.stringify(body),
    headers: { authorization, "content-type": "application/json" },
    method: "POST"
  });
}

function deepSeekSuccessPayload() {
  return {
    choices: [{ message: { content: "  摘要：这是一段测试输出。 " } }],
    id: "chatcmpl-test-123",
    model: "deepseek-chat",
    usage: { completion_tokens: 12, prompt_tokens: 34, total_tokens: 46 }
  };
}

describe("/api/ai/deepseek-gateway/runs", () => {
  const originalGatewayKey = process.env.TOOLARS_AI_PROVIDER_API_KEY;
  const originalDeepSeekKey = process.env.TOOLARS_DEEPSEEK_API_KEY;
  const originalModel = process.env.TOOLARS_DEEPSEEK_MODEL;

  beforeEach(() => {
    process.env.TOOLARS_AI_PROVIDER_API_KEY = gatewayKey;
    process.env.TOOLARS_DEEPSEEK_API_KEY = deepSeekKey;
    delete process.env.TOOLARS_DEEPSEEK_MODEL;
  });

  afterEach(() => {
    process.env.TOOLARS_AI_PROVIDER_API_KEY = originalGatewayKey;
    process.env.TOOLARS_DEEPSEEK_API_KEY = originalDeepSeekKey;
    process.env.TOOLARS_DEEPSEEK_MODEL = originalModel;
    vi.unstubAllGlobals();
  });

  it("rejects callers without the shared gateway bearer token", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const missingAuth = await POST(authorizedRequest({ prompt: "hi" }, ""));
    const wrongAuth = await POST(authorizedRequest({ prompt: "hi" }, "Bearer nope"));

    expect(missingAuth.status).toBe(401);
    expect(wrongAuth.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports configuration gaps before touching the network", async () => {
    delete process.env.TOOLARS_AI_PROVIDER_API_KEY;
    const noGatewayKey = await POST(authorizedRequest({ prompt: "hi" }));
    expect(noGatewayKey.status).toBe(503);

    process.env.TOOLARS_AI_PROVIDER_API_KEY = gatewayKey;
    delete process.env.TOOLARS_DEEPSEEK_API_KEY;
    const noDeepSeekKey = await POST(authorizedRequest({ prompt: "hi" }));
    expect(noDeepSeekKey.status).toBe(503);
  });

  it("requires a non-empty prompt", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const emptyPrompt = await POST(authorizedRequest({ prompt: "   " }));
    const missingPrompt = await POST(authorizedRequest({}));

    expect(emptyPrompt.status).toBe(400);
    expect(missingPrompt.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("forwards the prompt to DeepSeek and maps the completion to the Toolars provider contract", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(deepSeekSuccessPayload()), {
        headers: { "content-type": "application/json" },
        status: 200
      })
    );
    vi.stubGlobal("fetch", fetchSpy);

    const response = await POST(authorizedRequest({ prompt: "总结一下这份 PDF", runId: "run-1", workflowSlug: "pdf-summary" }));

    expect(response.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://api.deepseek.com/chat/completions");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe(`Bearer ${deepSeekKey}`);
    expect(JSON.parse(init.body)).toEqual({
      messages: [{ content: "总结一下这份 PDF", role: "user" }],
      model: "deepseek-chat",
      stream: false
    });

    const payload = await response.json();
    expect(payload).toEqual({
      modelId: "deepseek-chat",
      outputText: "  摘要：这是一段测试输出。 ",
      providerRunId: "chatcmpl-test-123",
      usage: { inputTokens: 34, outputTokens: 12, totalTokens: 46 }
    });
  });

  it("honors TOOLARS_DEEPSEEK_MODEL for the upstream model", async () => {
    process.env.TOOLARS_DEEPSEEK_MODEL = "deepseek-reasoner";
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(deepSeekSuccessPayload()), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchSpy);

    await POST(authorizedRequest({ prompt: "hi" }));

    expect(JSON.parse(fetchSpy.mock.calls[0]![1].body).model).toBe("deepseek-reasoner");
  });

  it("maps upstream failures to a 502 without leaking the request key", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response("rate limited", { status: 429 }));
    vi.stubGlobal("fetch", fetchSpy);

    const response = await POST(authorizedRequest({ prompt: "hi" }));

    expect(response.status).toBe(502);
    const payload = await response.json();
    expect(payload.error).toBe("DeepSeek returned 429");
    expect(JSON.stringify(payload)).not.toContain(deepSeekKey);
  });

  it("maps network errors to a 502", async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error("socket hangup"));
    vi.stubGlobal("fetch", fetchSpy);

    const response = await POST(authorizedRequest({ prompt: "hi" }));

    expect(response.status).toBe(502);
    expect((await response.json()).error).toContain("socket hangup");
  });
});
