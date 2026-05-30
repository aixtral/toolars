# toolars Acceptance Criteria

Status: v1 quality gate baseline

## 1. Repository

- Application code exists only in `site/`.
- Non-design documentation exists only in `docs/`.
- Design handoff and visual assets remain in `design/`.
- CDC context and architecture gates pass.

## 2. Public UX

- Home is a tool discovery dashboard, not a marketing-only landing page.
- Global search is visible above the fold on desktop.
- Mobile search is reachable in one tap.
- Category cards expose AI Content, Body, Fitness & Nutrition, Wellness,
  Wealth, Finance Calculators.
- Recent/favorites flows work locally without login.

## 3. Calculator UX

- All 73 calculators have routes.
- Every calculator can be opened from search and at least one category page.
- Basic calculation does not require login.
- Form validation is specific and accessible.
- Result panel shows primary value, interpretation, secondary metrics where
  relevant, and actions.
- Formula, example, FAQ, and related tools appear on calculator pages.

## 4. AI SaaS UX

- AI app routes require login.
- Repurpose page supports URL/Text, platforms, tone, brand voice, model,
  generate/cancel, streaming output.
- Template Library, Brand Voice, History, Analytics, Settings pages exist.
- Plan usage and subscription state are visible.
- Output cards support copy, save, regenerate, status, and word count.

## 5. Monetization

- Calculators stay free.
- AI tools are subscription-gated.
- Cross-device sync, advanced PDF/CSV export, and batch tools can be Pro.
- Upgrade prompts do not block basic calculator use.

## 6. Accessibility

- WCAG 2.1 AA contrast.
- 44px mobile tap targets.
- Keyboard navigation for header, search, mega menu, drawer, modal, tabs, forms.
- Visible focus rings.
- Skip link exists.
- Charts have text summaries or data alternatives.

## 7. Responsive QA

Check:

- 320px
- 390px
- 768px
- 1024px
- 1440px

Required:

- No incoherent overlap.
- No clipped button text.
- No horizontal scrolling except intentional data tables/carousels.
- Primary actions remain reachable.

## 8. SEO

- Public pages have unique titles/descriptions.
- Calculator pages include breadcrumbs, FAQ, formula, related tools.
- Category pages include crawlable tool links.
- Structured data validates for representative pages.
- English-first canonical routes work.
- Future i18n helpers do not generate broken hreflang links.

## 9. Security

- AI input and URL fetch handling are treated as untrusted.
- Billing webhooks verify signatures.
- API keys are masked and not logged.
- User-owned data is protected by database policies.
- Sensitive AI source content is not logged by default.

## 10. Verification Commands

Expected once `site/` is implemented:

```bash
pnpm --dir site lint
pnpm --dir site type-check
pnpm --dir site test
pnpm --dir site test:e2e
```

