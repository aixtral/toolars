# Spec Overview: final-production-security-audit

This change creates a consolidated release security audit for the current
Toolars W2 top stack. It is primarily a review, evidence, and documentation
pass. Production code changes are allowed only for narrow, test-backed fixes
when the audit discovers an actionable release blocker.

Capabilities:

- `security-release-gate`: audit and record auth, AI, billing, database,
  logging, dependency, and secrets posture with a go/no-go decision.
