# Proposal: ai-repurpose-dashboard-pass

## Business Context

Toolars v1 combines free public calculators with subscription-gated AI SaaS
workflows. The calculator surfaces now have a stronger commercial template, so
the next high-leverage page is the AI Content Repurposer at `/app/repurpose`.

`design/DESIGN.md` requires this route to behave like an application workspace:
sidebar, workspace header, URL/Text input tabs, platform picker, tone/voice/model
controls, generate/cancel, streaming outputs, output actions, usage limits, and
history/saved outputs nearby.

## Problem Statement

The current AI repurpose page is functional, but still reads as a basic form and
output card rather than a polished SaaS workspace:

- The input area needs a clearer URL/Text tab system and workflow framing.
- The control row needs visible tone, brand voice, model, usage, and plan state.
- The output area needs stronger streaming state, per-output actions, and nearby
  history/saved context.
- Tests should lock the workspace contract without changing auth, billing, or AI
  provider behavior.

## Scope

### Included

- CDC spec for the AI repurpose dashboard design pass.
- Component and E2E tests for the required workspace controls and sections.
- UI/interaction refinement of the existing `RepurposeWorkspace`.
- Representative browser visual QA for `/app/repurpose?preview=1`.

### Not Included

- No real auth provider integration.
- No database-backed history sync.
- No billing provider changes.
- No AI provider/model changes.
- No prompt or generation algorithm changes.
- No phase-two i18n migration.

## Business Value

| Metric | Current | Target |
|---|---|---|
| AI app perception | Functional preview | Commercial SaaS workspace |
| Subscription clarity | Basic badges | Usage and plan state visible |
| Workflow confidence | Form plus outputs | Input, controls, output, history context |
| Regression safety | Generation E2E only | Required design contract locked by tests |

## Stakeholders

- Users: clearer AI generation workflow and output management.
- Product: stronger paid-tool conversion while keeping calculators free.
- Engineering: reusable AI workspace patterns for templates, history, analytics,
  and settings pages.
