# Design: security-audit-release-gate

## Approach

This pass creates a release-gate security audit report under
`docs/security/SECURITY-AUDIT-RELEASE-GATE.md`.

The report must cover:

- OWASP Top 10 review for current code paths.
- STRIDE threat model for auth, AI, billing, and calculator/public routes.
- Secrets archaeology across tracked source and git history when feasible.
- Dependency supply-chain audit for `site/pnpm-lock.yaml`.
- Release-blocking decision for production launch.

## Source Scope

Primary source files:

```text
site/lib/auth/index.ts
site/lib/auth/__tests__/auth.test.ts
site/app/app/layout.tsx
site/app/app/repurpose/page.tsx
site/app/api/ai/repurpose/route.ts
site/app/api/ai/repurpose/route.test.ts
site/lib/ai/index.ts
site/lib/plans/index.ts
site/lib/plans/__tests__/plans.test.ts
site/lib/billing/index.ts
site/app/api/billing/webhook/route.ts
site/app/api/billing/webhook/route.test.ts
site/lib/calculators/index.ts
site/data/tools.ts
site/package.json
site/pnpm-lock.yaml
```

## Report Structure

The final report should include:

- Executive release decision.
- Scope and commands.
- Critical, High, Medium, Low, and Accepted Preview Boundary sections.
- OWASP checklist.
- STRIDE model.
- Dependency audit notes.
- Secrets archaeology notes.
- Required follow-up CDC changes.

## Verification Plan

```bash
rg -n "Critical|High|Medium|Low|OWASP|STRIDE|deps audit|secret" docs/security/SECURITY-AUDIT-RELEASE-GATE.md
rg -n "site/.+:[0-9]+|@[0-9]+\\." docs/security/SECURITY-AUDIT-RELEASE-GATE.md
rg -n "process\\.env|NEXT_PUBLIC|secret|token|api[_-]?key|password" site -g '!site/node_modules' -g '!site/.next'
pnpm --dir site audit --audit-level high
cdc-workflow gate --mode standard --root .
cdc-workflow ship-preview --change security-audit-release-gate --root .
```

If dependency audit cannot reach the registry, record the failure and keep the
production release decision blocked until the audit is rerun with network
access.

