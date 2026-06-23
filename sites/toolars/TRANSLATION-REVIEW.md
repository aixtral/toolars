# Translation Review Checklist

This document tracks content that requires professional review before
production release. AI-generated translations are accurate at a general level
but must be verified by qualified professionals for medical, legal, and
financial domains.

## Medical Content (Clinical Review Required)

The following tools contain medical screening content translated to `es` and
`zh-hans`/`zh-hant`. A licensed clinician fluent in each target language must
review the severity bands, guidance text, and crisis notes before the
translated versions are shown to end users.

### Severity Bands + Guidance

| Tool | Messages Path | Key Areas |
|------|--------------|-----------|
| PHQ-9 Depression | `tools.phq9-depression.severity.*` | 5 severity bands + guidance + **crisisNote.flagged** (item 9 self-harm) |
| GAD-7 Anxiety | `tools.gad7-anxiety.severity.*` | 4 severity bands + guidance |
| PSS-10 Stress | `tools.pss10-stress.severity.*` | 3 severity bands + guidance |
| Burnout | `tools.burnout-assessment.severity.*` | 4 severity bands + guidance |
| ADHD Screener | `tools.adhd-screener.outcome.*` | 3 outcome bands + guidance |
| BMI Calculator | `tools.bmi-calculator.category.*` | 5 category labels + recommendations |
| Blood Pressure | `tools.blood-pressure.category.*` | 5 categories + reason + advice |

### Questionnaire Items

Each screener's `questions.*` and `answerLabels.*` are translated. The
question wording must match the validated instrument's official translation
(if one exists for the target language).

## Legal Content (Legal Review Required)

| Document | Files | Status |
|----------|-------|--------|
| Privacy Policy | `src/data/legal.ts` → `privacyPolicy` | EN only; ES/ZH fallback to EN |
| Terms of Service | `src/data/legal.ts` → `termsOfService` | EN only; ES/ZH fallback to EN |

Legal documents should be translated by a qualified legal translator and
reviewed by counsel familiar with GDPR and CCPA before publishing non-English
versions.

## zh-hant (Traditional Chinese) Review

All `zh-hant` messages were generated via simplified-to-traditional character
conversion. A native Traditional Chinese speaker should review for:
- Correct character usage in legal/medical contexts
- Natural phrasing (character conversion may produce awkward combinations)
- Domain-specific terminology differences (e.g., 软件 vs 軟體)

## Review Process

1. Reviewer opens `messages/<locale>.json` and searches for the tool slug
2. For each key marked in this document, verify the translation
3. If incorrect, update the value in the JSON file directly
4. Submit a PR with the corrections

## Locales Summary

| Locale | UI Chrome | Tool Data | Medical | Legal | Notes |
|--------|-----------|-----------|---------|-------|-------|
| `en` | ✅ Complete | ✅ 100 tools | ✅ Source | ✅ Source | Baseline |
| `es` | ✅ Complete | ✅ 100 tools | ⚠️ Review | ❌ EN fallback | Clinical review needed |
| `zh-hans` | ✅ Complete | ✅ 100 tools | ⚠️ Review | ❌ EN fallback | Clinical review needed |
| `zh-hant` | ⚠️ Auto-converted | ⚠️ Auto-converted | ⚠️ Review | ❌ EN fallback | Native TC review needed |
