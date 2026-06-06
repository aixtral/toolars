# Tasks: security-audit-release-gate

Documentation-only security audit pass. TDD exception: no production code
changes.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/security-audit-release-gate`.
- [x] 0.2 Read CDC context, architecture, current iteration plan, and
  `cdc-role-security-audit` instructions.
- [x] 0.3 Run CDC gate before audit work.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit spec baseline.

## 2. Audit Report

- [ ] 2.1 Inspect auth, AI, billing, plan gate, and public calculator boundary.
- [ ] 2.2 Run secret/token source scans.
- [ ] 2.3 Run dependency supply-chain audit or record network limitation.
- [ ] 2.4 Add `docs/security/SECURITY-AUDIT-RELEASE-GATE.md`.
- [ ] 2.5 Commit audit report.

## 3. Verification And Ship

- [ ] 3.1 Run report structure and anchor checks.
- [ ] 3.2 Run CDC gate and ship preview.
- [ ] 3.3 Append evidence ledger rows.
- [ ] 3.4 Commit task closure and push branch.
- [ ] 3.5 Compound learning decision: record `none` unless a repeatable process
  issue appears.
