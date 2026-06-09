# Tasks: final-production-security-audit

This is primarily a security review and evidence pass. TDD exception:
documentation-only audit outputs do not require Red/Green. If production code
changes are needed, add a failing test before the fix.

## 0. Preparation

- [x] 0.1 Create branch `feat/final-production-security-audit`.
- [x] 0.2 Add this CDC spec package.
  - Files: `specs/changes/final-production-security-audit/**`
  - Verification: `test -f specs/changes/final-production-security-audit/design.md`

## 1. Security Audit

- [x] 1.1 Build the security scope map.
  - Files: `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`, `site/proxy.ts`,
    `site/app/api/**`, `site/lib/{auth,ai,billing,usage,supabase,security,env}/**`,
    `supabase/migrations/**`
  - Covers: R2-S1, R2-S2, R2-S3, R2-S4
  - Verification: `rg "createToolarsSupabaseServiceClient|emitSecurityEvent|TOOLARS_ENABLE_PREVIEW_AUTH|Lemon|usage_counters" site supabase`
- [x] 1.2 Run dependency and secret archaeology checks.
  - Commands: `pnpm --dir site audit --json --registry=https://registry.npmjs.org`,
    `rg -n -i "sk-|api[_-]?key|password|secret|token|private key|BEGIN RSA|BEGIN OPENSSH" --glob '!site/node_modules/**' --glob '!site/.next/**' .`,
    `git log --all -p -G "API_KEY|SECRET|PASSWORD|TOKEN|PRIVATE_KEY|BEGIN RSA|BEGIN OPENSSH" -- .`
  - Covers: R3-S1, R3-S2
- [x] 1.3 Produce the security audit report.
  - File: `docs/security/FINAL-PRODUCTION-SECURITY-AUDIT.md`
  - Covers: R1-S1, R1-S2, R4-S2
  - Verification: `rg "Critical|High|Medium|Low|Go/No-Go|deps audit|secret archaeology" docs/security/FINAL-PRODUCTION-SECURITY-AUDIT.md`

## 2. Verification

- [x] 2.1 Run current branch verification.
  - Verification: `pnpm --dir site audit --json --registry=https://registry.npmjs.org`,
    `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `pnpm --dir site test:e2e`, `cdc-workflow gate --mode standard --root .`
- [x] 2.2 Run ship preview.
  - Verification: `cdc-workflow ship-preview --change final-production-security-audit --root .`

## 3. PR And Closeout

- [ ] 3.1 Push `feat/final-production-security-audit`.
- [ ] 3.2 Create draft PR targeting `feat/integrate-latest-stack-to-main`.
- [ ] 3.3 Record CDC evidence and closeout.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/final-production-security-audit/tasks.md`
