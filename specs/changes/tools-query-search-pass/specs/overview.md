# Specs Overview: tools-query-search-pass

## Capabilities

| Capability | Requirement File | Summary |
|---|---|---|
| Tools query search | `specs/tools-query-search/requirements.md` | `/tools?search=...` renders ranked matching tools while preserving the existing default directory. |

## Acceptance Summary

- `/tools` without `search` keeps the current default directory result set.
- `/tools?search=inflation` shows a populated search field and a relevant Inflation Calculator card.
- The filtered result count and empty state are explicit enough for users and crawlers.
- Tests cover both default and query-driven behavior.
