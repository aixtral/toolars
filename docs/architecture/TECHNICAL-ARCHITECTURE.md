# toolars Technical Architecture

Status: approved direction for implementation planning  
Framework decision: Next.js App Router  
Last updated: 2026-05-30

## 1. Architecture Summary

toolars will be implemented as a unified Next.js App Router application under
`site/`. Public calculator and content pages must remain crawlable and fast.
AI SaaS pages are account/subscription-gated and share a consistent app shell.

## 2. Proposed Stack

| Layer | Choice | Rationale |
|---|---|---|
| Web framework | Next.js App Router | Unified public SEO pages, app routes, API route handlers, streaming AI. |
| Language | TypeScript | Shared typed registry, calculator definitions, API contracts. |
| Styling | Tailwind CSS + shadcn-style primitives | Matches `design/DESIGN.md`; fast component system. |
| Icons | Lucide + generated tool icons | Consistent outline UI plus branded tool tiles. |
| AI | Vercel AI SDK with provider adapters | Reuse `aixtral-labs` multi-provider direction. |
| Auth/DB | Supabase Auth + Postgres | Aligns with `aixtral-labs` and supports account data. |
| Billing | Lemon Squeezy | Existing project direction and indie SaaS fit. |
| Email | Resend | Existing project direction for transactional mail. |
| Tests | Vitest + Testing Library + Playwright | Unit, component, and E2E coverage. |
| Content | File-based MD/MDX or typed content modules for v1 | Keeps SEO pages versioned with code. |

## 3. Repository Layout

```text
toolars/
  site/
    app/
    components/
    data/
    lib/
    public/
    tests/
    package.json
  docs/
  design/
  specs/
  .cdc/
```

Application code must not be placed outside `site/`.

## 4. Site Module Layout

```text
site/src or site/
  app/
    (public)/
      page.tsx
      tools/
      categories/
      ai/
      pricing/
      blog/
      compare/
    app/
      repurpose/
      templates/
      brand-voice/
      history/
      analytics/
      settings/
    api/
      ai/
      billing/
      exports/
      search/
  components/
    layout/
    navigation/
    search/
    tools/
    calculators/
    ai/
    billing/
    content/
    ui/
  data/
    tools.ts
    calculators/
    ai-platforms.ts
    templates.ts
    locales/
  lib/
    calculators/
    ai/
    auth/
    billing/
    seo/
    storage/
    formatting/
    analytics/
```

## 5. Core Architecture Decisions

### ADR-1: Next.js App Router

Use Next.js App Router for the unified product rather than keeping Astro and
Next as separate products.

Consequences:

- Public pages and AI app share one design system.
- AI streaming and route handlers stay in one framework.
- Calculator pages from VitalCalc must be migrated into registry-driven routes.

### ADR-2: Registry-Driven Tools

Every calculator and AI tool is represented in a central `ToolRegistry`.

Consequences:

- Home, directory, category pages, search, related tools, and SEO metadata use
  one source of truth.
- All 73 calculators can be discoverable before every bespoke enhancement is
  complete.
- Per-tool overrides are allowed only when the shared template cannot express
  the tool safely.

### ADR-3: Pure Calculator Engine

Calculator formula logic must live in pure TypeScript modules without React,
DOM, network, auth, or browser storage dependencies.

Consequences:

- Formula logic can be unit-tested.
- Public calculators remain independent of AI/account systems.
- Save/export/compare are separate UI/application concerns.

### ADR-4: Progressive Account Boundary

Anonymous users can use calculators, local favorites, local recent tools, and
local saved comparisons. Account is required for AI tools, cross-device sync,
subscription, API keys, and Pro exports.

Consequences:

- SEO and first-use friction stay low.
- Monetization is tied to durable value rather than blocking basic utility.

## 6. Data Contracts

### ToolDefinition

```ts
export type ToolType = "calculator" | "ai" | "template";

export interface ToolDefinition {
  slug: string;
  title: string;
  type: ToolType;
  category: string;
  icon: string;
  description: string;
  route: string;
  badges?: string[];
  isPopular?: boolean;
  requiresAccount?: boolean;
  relatedSlugs?: string[];
  seo: {
    title: string;
    description: string;
    keywords?: string[];
  };
}
```

### CalculatorDefinition

```ts
export interface CalculatorDefinition extends ToolDefinition {
  fields: CalculatorField[];
  resultLabels: string[];
  formulaLabel: string;
  calculateKey: string;
  explanationBlocks: ContentBlock[];
  faq: FaqItem[];
}
```

### RepurposeJob

```ts
export interface RepurposeJob {
  id: string;
  userId: string;
  sourceType: "url" | "text";
  sourceValue: string;
  platforms: string[];
  tone: "professional" | "casual" | "viral";
  brandVoiceId?: string;
  model: string;
  status: "draft" | "streaming" | "completed" | "canceled" | "failed";
}
```

## 7. Persistence

Local:

- Recent tools.
- Favorites.
- Anonymous saved calculator results.
- Compare selections.

Database:

- Users.
- Workspaces.
- Subscriptions.
- AI jobs and outputs.
- Brand voices.
- API keys.
- Account-synced saved results.
- Usage events.

## 8. API Surface

Initial route handlers:

- `POST /api/ai/repurpose`
- `POST /api/ai/repurpose/:id/cancel`
- `POST /api/exports/pdf`
- `POST /api/exports/csv`
- `POST /api/billing/webhook`
- `GET /api/search`
- `GET /api/models`

Public calculators should not require API calls for basic calculations.

## 9. Security

Required before release:

- Validate and rate-limit AI inputs.
- Do not leak API keys to client.
- Webhook signature verification for billing.
- Row-level access control for user-owned data.
- API key masking and one-time display.
- Prompt-injection treatment for fetched URLs and user-supplied content.

## 10. Performance

- Static/pre-render public calculator and category pages where possible.
- Keep tool registry import cost controlled.
- Lazy-load heavy charts and AI app modules.
- Use route-level loading states.
- Avoid making the public calculator path depend on auth session.

## 11. Observability

Track:

- Search usage and no-result terms.
- Calculator usage and validation errors.
- AI generation lifecycle.
- Export usage.
- Billing events.
- API errors and latency.

Do not log raw sensitive calculator inputs or full AI source content unless the
user explicitly saves it to account history.

