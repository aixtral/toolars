# Specification Overview: ai-repurpose-dashboard-pass

This change upgrades `/app/repurpose` into the AI SaaS workspace described in
`design/DESIGN.md` section 7.7.

Capabilities:

- `ai-workspace-shell`: route includes a workspace header with plan, usage, and
  paid-tool context.
- `ai-input-controls`: workspace exposes URL/Text tabs, platform picker, tone,
  brand voice, model, generate, and cancel controls.
- `ai-output-management`: generated outputs stream into cards with copy, save,
  and regenerate actions.
- `ai-history-context`: history and saved-output context are nearby without
  claiming database sync.
- `ai-dashboard-qa`: unit, E2E, browser, and CDC gates verify the design pass.

Primary source of truth:

- `design/DESIGN.md`

Supporting references:

- `.cdc/ARCHITECTURE.md`
- `.cdc/CONTEXT.md`
