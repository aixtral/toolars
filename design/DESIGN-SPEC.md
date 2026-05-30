# toolars Design Specification

Status: implementation-ready design guidance  
Primary source: `design/DESIGN.md`  
Visual references: `design/images/original_generated_files/`  
Last updated: 2026-05-30

## 1. Design Source Of Truth

`design/DESIGN.md` is the canonical v1 design source for tokens, components,
interactions, accessibility, and page structure.
The PNGs are visual references only. Missing per-calculator PNGs do not block
implementation because calculator pages must use the shared template and token
system described in `design/DESIGN.md`.

## 2. Brand Direction

toolars should feel:

- Calm
- Precise
- Fast
- Trustworthy
- Independent
- Modern

Visual metaphor:

```text
instrument panel + clean toolbox + editorial knowledge base
```

The product must not look like a generic AI-purple SaaS site. It should combine
tool density with enterprise polish.

## 3. Core UX Model

The product is search-first:

1. Search any tool or article.
2. Browse direct category cards.
3. Continue from recent/favorites.
4. Open calculators without signup.
5. Sign in only for AI, cross-device sync, Pro exports, and subscription flows.

## 4. Design Tokens

Use tokens from `design/DESIGN.md`:

- Primary brand: Toolars Mint `#14B8A6`.
- Ink: `#0F172A`.
- Porcelain background: `#FAFAFC`.
- AI accent: cobalt `#2563EB`.
- Finance accent: amber `#F59E0B`.
- Health accent: green `#22C55E`.
- Primary radius: `8px`.
- Large radius: `12px`.
- Font: Inter/system sans.
- Layout grid: desktop max width `1180px-1240px`, 12 columns.

All implementation components should use semantic tokens rather than raw color
values.

## 5. Required Component System

Components required before broad page implementation:

- App/Header shell.
- Desktop mega menu.
- Mobile navigation drawer.
- Global command palette.
- Tool card.
- Category tabs/chips.
- Calculator form field primitives.
- Result panel.
- Chart card.
- AI output card.
- Pricing card.
- Blog card.
- Auth form.
- Modal.
- Drawer.
- Toast.
- Tooltip.
- Empty, loading, error, offline states.

## 6. Public Page Design

Home:

- Must be usable as a tool dashboard.
- Must show search, trust strip, popular/recent/favorites, quick actions,
  categories, AI entry, and compact previews.

Tools directory:

- Must support category tabs, filters, sort, favorites/recent, load more or
  pagination.

Category pages:

- Must support health/finance templates with tool grid, insights, popular
  searches, FAQ, about category, schema notes, and language availability.

Calculator pages:

- Must put form and result in the primary viewport.
- Must include formula, example, FAQ, related tools, share/save/compare.
- Must not put ad slots between form and result.

## 7. App Page Design

AI SaaS pages use a consistent app shell:

- Sidebar navigation.
- Workspace header.
- Usage/subscription state.
- Dense panels, not marketing layout.
- Streaming output state and cancel control.

Pages:

- AI Content Repurposer.
- Template Library.
- Brand Voice Manager.
- History.
- Analytics.
- Settings.

## 8. Interaction Requirements

- Cmd/Ctrl+K opens command palette.
- Esc closes command palette, menus, drawers, and modals.
- Inputs have visible focus ring.
- Cards use border change and subtle shadow on hover.
- Favorites toggle with accessible state text.
- Compare supports limit messaging.
- AI streaming output uses polite live region.
- Reduced motion is respected.

## 9. Accessibility

Minimum:

- WCAG 2.1 AA.
- 44px mobile tap targets.
- Visible focus rings.
- Logical tab order.
- Skip link.
- `aria-label` for icon buttons.
- `aria-describedby` for input errors.
- Accessible chart summaries and data alternatives.
- Text must scale to 200%.

## 10. Visual QA Checklist

- No text overflow at 320, 390, 768, 1024, 1440 widths.
- No decorative blobs/orbs.
- No nested cards except deliberate modal/content group boundaries.
- No generic AI gradient dominance.
- Icons are consistent.
- Pages feel shipped and commercial, not concept-only.

