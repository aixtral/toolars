# toolars Product Requirements Document

Status: Approved direction for v1 planning  
Owner: toolars product/engineering  
Source of truth: `design/DESIGN.md`  
Last updated: 2026-05-30

## 1. Summary

toolars is a commercial overseas independent tools website that combines a
free public calculator/tools directory with a subscription-based AI content
repurposing SaaS.

The product must not open with a marketing-only landing page. The first screen
is a usable tool discovery dashboard: global search, popular tools, recent
tools, favorites, quick actions, category cards, and a featured AI Content
Repurposer entry.

## 2. Goals

- Ship a unified Next.js App Router product under the `toolars` brand.
- Include all 73 existing calculators in the v1 route and product scope.
- Include all currently implemented AI SaaS pages in the v1 product scope.
- Keep calculators free and usable without login.
- Gate AI tools behind account/subscription.
- Use English-first public copy while keeping i18n architecture ready.
- Rebuild UI according to `design/DESIGN.md`; migrate only feature inventory,
  formula logic, and content structure from source projects.

## 3. Non-Goals

- No direct clone of 10015.io, VitalCalc, or XtralRepurpose UI.
- No launch-blocking multi-locale content migration for v1.
- No native mobile apps in v1.
- No CMS dependency in v1 unless explicitly approved later.
- No account requirement for basic calculator use.

## 4. Target Users

| Persona | Need | Primary flows |
|---|---|---|
| Utility seeker | Fast calculator/tool result without signup | Search, open calculator, calculate, share/save locally |
| Creator/marketer | Repurpose one source into many platform outputs | Sign in, paste URL/text, select platforms/tone/model, generate |
| Small business operator | Reuse calculators and AI tools repeatedly | Favorites, recent tools, compare results, Pro exports |
| SEO visitor | Arrives from long-tail calculator/article search | Calculator result, formula, FAQ, related tools |
| Power user/team | Uses AI workflow at volume | Subscription, API keys, history, analytics, brand voices |

## 5. Product Principles

- Search first: every major page should help users find a tool quickly.
- Fast path to value: calculators show inputs above the fold and results
  immediately after calculation.
- Account only when useful: login is required for AI, sync, Pro exports, and
  subscription features, not for basic calculator use.
- Trust through clarity: show formulas, FAQ, source notes, privacy notes, and
  last-updated metadata.
- One design system: all public pages and app pages share tokens, spacing,
  typography, icon style, and interaction states.

## 6. Information Architecture

Public routes:

```text
/                         home utility dashboard
/tools                    all tools directory
/tools/[slug]             calculator/tool detail pages
/categories/health        health tools
/categories/finance       finance tools
/ai                       public AI tools directory
/pricing                  pricing
/blog                     blog index
/blog/[slug]              article template
/compare                  saved calculator result comparison
/about                    about
/contact                  contact
/privacy                  privacy
/login                    login
/register                 register
/404                      not found
```

App routes:

```text
/app/repurpose            AI Content Repurposer
/app/templates            Template Library
/app/brand-voice          Brand Voice Manager
/app/history              History
/app/analytics            Analytics
/app/settings             Settings
```

## 7. Calculator Scope

v1 must include all 73 calculator routes in the product scope.

Body:
BMI Calculator, Body Fat Calculator, Ideal Weight Calculator, Waist-Hip Ratio,
Blood Pressure, Child Growth, Lean Body Mass, Biological Age.

Fitness & Nutrition:
BMR Calculator, TDEE Calculator, Calorie Deficit, Protein Calculator, Macro
Calculator, Intermittent Fasting, Glycemic Load, Fiber Intake, Water Intake,
HOMA-IR, 30-30-30 Method, Heart Rate Zones, One Rep Max, Steps to Calories,
Body Recomposition, Running Pace, VO2 Max.

Wellness:
Sleep Calculator, Drink Calories, Pregnancy Due Date, Ovulation Calculator,
GLP-1 Eligibility, GLP-1 Nutrition, Alcohol Metabolism, Smoke Free, Caffeine
Calculator, Testosterone Calculator, PHQ-9 Depression, GAD-7 Anxiety, PSS-10
Stress.

Wealth:
Mortgage Calculator, Loan Calculator, Car Loan, Rent vs Buy, Compound
Interest, APY Calculator, SIP Calculator, Investment Goal, Savings Goal, Rule
of 72, Investment Fee, Dividend Reinvestment, Retirement Calculator, FIRE
Calculator, Coast FIRE, Inflation Calculator, Net Worth Calculator, Emergency
Fund, 50/30/20 Budget Rule, Habit Cost.

Finance Calculators:
Income Tax, Credit Card APR, Discount Calculator, Percentage Calculator, ROI
Calculator, Tip Calculator, Currency Converter, Hourly to Salary, Side Income
Tax, Crypto Tax, City Cost Comparison, Stock Average, Debt Payoff, DTI
Calculator, Credit Score Simulator.

## 8. AI SaaS Scope

v1 must include:

- AI Content Repurposer: URL/Text input, platform picker, tone selector, brand
  voice selector, model picker, generation/cancel, streaming outputs.
- Template Library: Social, Long-form, Email, Community templates.
- Brand Voice Manager: create, edit, delete, limits by plan.
- History: search, filter, detail modal, copy/regenerate.
- Analytics: usage stats, platform breakdown, tone breakdown, activity.
- Settings: profile, subscription, API keys, notifications, danger zone.
- Auth: login and register.
- Pricing: Free, Pro, Team.

Supported platforms:
Twitter Thread, LinkedIn Post, Newsletter, Medium Article, Reddit Post,
Instagram, YouTube, Facebook, Hacker News, Indie Hackers, WeChat,
Xiaohongshu, Jike, Zhihu.

Supported tones:
Professional, Casual, Viral.

## 9. Monetization Requirements

Free:

- Basic calculator usage.
- Local favorites/recent tools.
- Local saved calculator comparisons.
- Limited AI trial if approved later.

Pro:

- AI tools subscription.
- Cross-device save/sync.
- Advanced PDF/CSV exports.
- Batch tools where useful.
- More brand voices and usage limits.

Team:

- Shared brand voices.
- Team usage analytics.
- Higher AI limits.
- Workspace administration.

Basic calculators must not be hard-gated behind login or subscription.

## 10. Functional Requirements

### Home

- Show global search above fold.
- Show trust strip: free calculators, private/local where possible, no signup
  for calculators, multilingual-ready, AI account required.
- Show Featured AI Content Repurposer.
- Show Popular Tools, Recent Tools, Favorites, Quick Actions.
- Show category cards for AI Content, Body, Fitness & Nutrition, Wellness,
  Wealth, Finance Calculators.
- Show compact AI dashboard, templates, and analytics previews.

### Global Search

- Keyboard shortcut: Cmd/Ctrl+K.
- Search tabs: All, Calculators, AI Tools, Health, Finance, Articles.
- Include recent tools, favorites, popular searches, close matches.
- No-results state must suggest next actions.
- Keyboard navigation and accessible result count required.

### Calculator Pages

- Use shared calculator page template.
- Inputs appear above the fold.
- Results appear immediately after calculation.
- Include validation, formula, example, FAQ, related tools, share/save/compare.
- Basic calculation runs without account.
- Formula logic must be pure and unit-tested.

### AI App Pages

- Require authenticated account.
- Show subscription/usage state.
- Streaming generation can be canceled.
- Output cards support copy, save, regenerate, status, word count.
- History and analytics reflect generated outputs and usage.

### Blog/SEO

- Blog index and article template must support calculator SEO.
- Calculator/category pages must be crawlable.
- Metadata, breadcrumbs, FAQ, HowTo/WebApplication/ItemList schema are required
  where applicable.

### i18n

- v1 public copy is English-first.
- Route/content architecture must preserve future locale expansion for
  es/fr/zh/ja/ru/ar/pt/hi/zh-tw.
- RTL support must be considered in layout and tokens, even if Arabic content
  ships in phase two.

## 11. Non-Functional Requirements

- Accessibility: WCAG 2.1 AA minimum.
- Mobile: no text overflow at 320px and 390px.
- Performance: public calculator pages should be fast, cacheable, and
  crawlable.
- Security: AI/account/billing/API key surfaces require security review before
  release.
- Privacy: anonymous calculator inputs should stay local unless the user saves
  to account.
- Observability: track calculator usage, search queries, no-result searches,
  AI generation status, errors, and billing events without leaking private input.

## 12. Analytics Events

- `tool_search_opened`
- `tool_search_result_clicked`
- `tool_search_no_results`
- `calculator_opened`
- `calculator_calculated`
- `calculator_saved_local`
- `calculator_saved_account`
- `calculator_exported`
- `ai_generation_started`
- `ai_generation_canceled`
- `ai_generation_completed`
- `ai_output_copied`
- `subscription_started`
- `upgrade_prompt_viewed`

## 13. Acceptance Criteria

- All 73 calculator routes exist and are discoverable from search and category
  pages.
- All AI SaaS pages exist and use a consistent app shell.
- Calculators are usable without login.
- AI workflows require account/subscription according to plan.
- Design matches `design/DESIGN.md` tokens and component behavior.
- Public pages pass SEO crawlability checks.
- Keyboard navigation works for search, menus, modals, tabs, drawers, and forms.
- No page has incoherent overlap or text overflow at target breakpoints.

