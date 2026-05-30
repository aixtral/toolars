# CLAUDE.md — toolars Collaboration Notes

This repository also supports Claude-style agents. Follow `AGENTS.md` first;
this file only repeats the operational summary for tools that look for
`CLAUDE.md`.

## Scope

`toolars` is the new main repository for a unified Next.js App Router product:

- Free no-login calculators and tools.
- Subscription-gated AI content repurposing tools.
- English-first public UX with future i18n expansion.

## Directory Contract

- `site/` contains all application code.
- `docs/` contains product, architecture, migration, QA, and implementation
  documents.
- `design/` contains design handoff materials and visual assets.
- `.cdc/` and `specs/` contain CDC workflow artifacts.

## Source Of Truth

- Product/design handoff: `design/DESIGN.md`.
- CDC project facts: `.cdc/CONTEXT.md`.
- CDC architecture facts: `.cdc/ARCHITECTURE.md`.
- Main change spec: `specs/changes/merge-toolars-platform/`.

## Rules

- Do not implement production code without tests unless the task is docs/config
  only.
- Do not move design assets into `docs/`.
- Do not put code outside `site/`.
- Do not use the old projects' UI as-is; migrate logic and content structure
  only.
- Keep calculator pages crawlable and usable without account.

