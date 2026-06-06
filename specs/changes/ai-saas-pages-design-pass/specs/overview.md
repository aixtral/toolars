# Specs Overview: ai-saas-pages-design-pass

## Capabilities

- `ai-template-library`: template pages expose grouping, output metadata,
  filters, usage context, and clear use actions.
- `ai-brand-voice-manager`: voice pages expose create/edit/delete, plan limits,
  default voice state, sample preview, and workspace assignment.
- `ai-history-operations`: history pages expose search, filters, status badges,
  detail/copy/regenerate actions, and saved-output context.
- `ai-analytics-settings`: analytics and settings pages expose SaaS metrics,
  account sections, Pro state, and operational controls.

## Shared Acceptance

- Pages use the existing app shell and no public calculator login gates.
- Page hierarchy follows the border-first, compact, commercial style in
  `design/DESIGN.md`.
- Tests verify semantic regions and user-visible controls.
- No backend provider, database, or billing side effect is introduced.
