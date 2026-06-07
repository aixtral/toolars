# Specs Overview: ai-provider-adapter-implementation

This change implements the first production-capable AI provider adapter
foundation for Toolars.

Capabilities:

- `ai-provider-adapter`: provider-neutral generation contract, deterministic
  preview provider, AI SDK provider wrapper, provider config, route service
  integration, error normalization, and import-boundary checks.

Official source anchors:

- AI SDK Core `generateText`:
  https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text
- AI SDK Core `streamText`:
  https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
- Vercel AI Gateway SDK/API docs:
  https://vercel.com/docs/ai-gateway/sdks-and-apis
- Vercel AI Gateway models/providers:
  https://vercel.com/docs/ai-gateway/models-and-providers
