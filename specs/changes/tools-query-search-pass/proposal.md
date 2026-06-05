# Proposal: tools-query-search-pass

## Business Context

Toolars now publishes a site-level `WebSite` schema with a `SearchAction` target at `/tools?search={search_term_string}`. The public tools directory must honor that URL so search engines, AI answer engines, and users land on a matching filtered result set.

## Problem Statement

`/tools` currently renders a static first-page directory and the search input does not read URL query state. This creates a mismatch between structured metadata and the visible product experience.

## Scope

### Included
- Read the `search` query parameter on `/tools`.
- Use the existing `searchTools` scoring helper for query result ranking.
- Preserve the current first 12 tools when there is no query.
- Populate the directory search box with the query value.
- Add unit and E2E coverage for `/tools?search=...`.

### Not Included
- Client-side live search or debounced URL updates.
- Category, pricing, type, or sort query parameters.
- Pagination, load more, saved filters, or analytics instrumentation.
- Changes to the command palette search flow.

## Business Value

| Metric | Current | Target |
|---|---|---|
| SearchAction usability | Advertised but not reflected by `/tools` UI | Query URL shows matching directory results |
| GEO consistency | JSON-LD search target can look disconnected | Visible page confirms the same search intent |
| Public discovery UX | Static first 12 tools only | Shareable filtered directory URL |

## Stakeholders

- Users: can open or share a focused tools directory search.
- Search engines and AI answer engines: can resolve the SearchAction target to visible relevant results.
- Engineering: reuses existing pure search logic without adding client state complexity.
