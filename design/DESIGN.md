# Toolars DESIGN.md

> 面向开发实现的产品设计规范与交互指南  
> Project: `toolars`  
> Version: `v1.0`  
> Status: Development handoff  
> Product type: AI content repurposing SaaS + 73 calculators/tools directory

---

## 1. 产品定位

Toolars 是一个商业级海外独立工具网站，将两类产品合并为一个统一体验：

1. **AI Content Repurposing SaaS**：支持 URL / Text 输入，多平台内容生成，品牌声音，模板库，历史记录，分析，设置，登录注册，订阅定价。
2. **Calculator / Tools Directory**：73 个已实现的健康、健身、财富、金融与日常计算器，支持多语言页面、博客、收藏、最近使用、对比保存结果、搜索与分类浏览。

核心原则：**首页不是营销落地页，而是可立即使用的工具发现与启动界面。** 第一屏必须让用户完成搜索、浏览、继续使用、收藏、进入 AI Content Repurposer 或打开任意计算器。

### 1.1 品牌关键词

- Calm：克制、干净，不制造视觉噪音。
- Precise：表单、结果、图表、数值展示必须准确清晰。
- Fast：搜索优先，路径短，操作可见。
- Trustworthy：使用公式说明、来源、隐私提示、无注册计算器定位增强信任。
- Independent：避免夸张营销，不让工具像广告站或模板站。
- Modern：现代 SaaS 质感，但必须工具化、实用化。

### 1.2 视觉隐喻

**Instrument panel + clean toolbox + editorial knowledge base**

实现方式：

- 工具目录像仪表盘：搜索、过滤、最近、收藏、指标一目了然。
- 组件像工具箱：紧凑、直接、重复可复用。
- 内容区像知识库：FAQ、公式解释、相关文章、Schema 信息保持清晰。

### 1.3 明确禁止

- 不做通用 AI 紫色渐变 SaaS 风格。
- 不克隆 10015.io，只参考搜索优先与工具密度。
- 不使用装饰性渐变球、bokeh 光斑、股票照片、卡通吉祥物、大面积空洞 hero。
- 不嵌套卡片套卡片；只在重复项、工具面板、表单、模态、仪表盘中使用卡片。
- 不使用不可读小字、乱码、lorem ipsum、文本溢出。

---

## 2. 信息架构 IA

### 2.1 顶层导航

Desktop Header：

```text
Left:   toolars logo
Center: Global search input: “Search 73 calculators and AI tools...”
Right:  Tools mega menu | AI Tools | Blog | Pricing | Language | Sign in | Open app
```

Header 要求：

- Sticky，紧凑，高度建议 `64px`。
- 背景 `--bg-primary`，底部 `1px` border。
- `Open app` 为唯一主 CTA。
- `Tools` 打开 Mega Menu，菜单内必须展示热门工具直达链接，不只展示分类名。

Mobile Header：

```text
Left: hamburger
Center: logo
Right: search icon | account/avatar
```

底部可启用移动导航：`Home / Tools / Favorites / Recent / Account`。

### 2.2 主路由建议

```text
/                         Home utility dashboard
/tools                    All tools directory
/tools/[slug]             Shared calculator/tool detail template
/categories/health        Health tools category
/categories/finance       Finance tools category
/ai                       AI tools directory
/app/repurpose            AI Repurpose dashboard
/app/templates            Template library
/app/brand-voice          Brand Voice manager
/app/history              History list + detail modal
/app/analytics            Analytics dashboard
/app/settings             Profile / Subscription / API keys
/pricing                  Pricing
/login                    Login
/register                 Register
/blog                     Blog index
/blog/[slug]              Blog article template
/compare                  Compare saved results
/about                    About
/contact                  Contact
/privacy                  Privacy
/404                      Not found
```

### 2.3 工具分类

#### AI Content

- AI Content Repurposer
- Blog Post Generator
- Social Media Post Generator
- Email Generator
- AI Summarizer
- AI Image Generator
- Cold Email Generator
- Code Explainer
- Study Planner

#### Body

- BMI Calculator
- Body Fat Calculator
- Ideal Weight Calculator
- Waist-Hip Ratio
- Blood Pressure
- Child Growth
- Lean Body Mass
- Biological Age

#### Fitness & Nutrition

- BMR Calculator
- TDEE Calculator
- Calorie Deficit
- Protein Calculator
- Macro Calculator
- Intermittent Fasting
- Glycemic Load
- Fiber Intake
- Water Intake
- HOMA-IR
- 30-30-30 Method
- Heart Rate Zones
- One Rep Max
- Steps to Calories
- Body Recomposition
- Running Pace
- VO2 Max

#### Wellness

- Sleep Calculator
- Drink Calories
- Pregnancy Due Date
- Ovulation Calculator
- GLP-1 Eligibility
- GLP-1 Nutrition
- Alcohol Metabolism
- Smoke Free
- Caffeine Calculator
- Testosterone Calculator
- PHQ-9 Depression
- GAD-7 Anxiety
- PSS-10 Stress

#### Wealth

- Mortgage Calculator
- Loan Calculator
- Car Loan
- Rent vs Buy
- Compound Interest
- APY Calculator
- SIP Calculator
- Investment Goal
- Savings Goal
- Rule of 72
- Investment Fee
- Dividend Reinvestment
- Retirement Calculator
- FIRE Calculator
- Coast FIRE
- Inflation Calculator
- Net Worth Calculator
- Emergency Fund
- 50/30/20 Budget Rule
- Habit Cost

#### Finance Calculators

- Income Tax
- Credit Card APR
- Discount Calculator
- Percentage Calculator
- ROI Calculator
- Tip Calculator
- Currency Converter
- Hourly to Salary
- Side Income Tax
- Crypto Tax
- City Cost Comparison
- Stock Average
- Debt Payoff
- DTI Calculator
- Credit Score Simulator

---

## 3. Design Tokens

### 3.1 Color Tokens

Use semantic tokens in components. Do not hard-code raw hex values in component files except inside token definitions.

```css
:root {
  /* Brand */
  --color-ink: #0F172A;
  --color-bg: #FAFAFC;
  --color-porcelain: #FAFAFC;

  --brand-500: #14B8A6;
  --brand-600: #0D9488;
  --brand-700: #0F766E;
  --brand-900: #0B1220;

  /* Accents */
  --accent-ai: #2563EB;
  --accent-finance: #F59E0B;
  --accent-health: #22C55E;

  /* Semantic */
  --success: #16A34A;
  --info: #2563EB;
  --warning: #F59E0B;
  --danger: #EF4444;

  /* Neutral */
  --neutral-50: #F8FAFC;
  --neutral-100: #F1F5F9;
  --neutral-200: #E2E8F0;
  --neutral-300: #CBD5E1;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-900: #0F172A;

  /* Surfaces */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-tertiary: #F1F5F9;
  --border: #E2E8F0;
  --border-hover: #CBD5E1;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #64748B;

  /* Focus */
  --focus-ring: #14B8A6;
}
```

Usage rules：

- 主操作使用 `brand-500`，hover 使用 `brand-600`。
- AI 类型可使用 `accent-ai`，但不要把整站变成 AI 紫蓝风格。
- Finance 使用 amber，Health 使用 green，Data chart 可用 teal + cobalt + amber 组合。
- 文本优先使用 `text-primary / text-secondary / text-tertiary`。
- 所有表单、卡片、列表默认使用浅边框，不使用重投影。

### 3.2 Typography

Font family：

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
```

Type scale：

| Token | Size / Line | Weight | Use |
|---|---:|---:|---|
| `text-5xl` | 48 / 56 | 700 | Large page title, limited use |
| `text-4xl` | 36 / 44 | 700 | Category heading |
| `text-3xl` | 28 / 36 | 600 | Section page title |
| `text-2xl` | 22 / 30 | 600 | Card group title |
| `text-xl` | 18 / 28 | 600 | Card title / modal title |
| `text-lg` | 16 / 24 | 500 | Section title |
| `text-base` | 14 / 20 | 400 | Body text / UI copy |
| `text-sm` | 13 / 18 | 400 | Helper text |
| `text-xs` | 12 / 16 | 400 / 600 | Labels, badges, metadata |
| `text-2xs` | 11 / 14 | 600 | Overline, tiny metadata |

Rules：

- 不使用 viewport-scaled fonts。
- 不使用负 letter spacing。
- 数值结果可使用 `24px / 700` 或 `28px / 700`，颜色使用 brand 或 semantic。
- UI 密集区域默认 `14px`，不能低于 `11px`。

### 3.3 Spacing

Use a 4px base with 8px rhythm.

```text
space-0  = 0
space-1  = 4px
space-2  = 8px
space-3  = 12px
space-4  = 16px
space-5  = 20px
space-6  = 24px
space-8  = 32px
space-10 = 40px
space-12 = 48px
space-16 = 64px
space-20 = 80px
space-24 = 96px
```

Common layout spacing：

- Header horizontal padding: desktop `32px`, mobile `16px`.
- Page section gap: `24px–32px`.
- Card padding: `16px–20px`.
- Form row gap: `12px`.
- Input internal padding: `10px 12px`.
- Tool grid gap: `16px–20px`.

### 3.4 Radius

```text
radius-sm   4px
radius-md   6px
radius-lg   8px   primary default
radius-xl   12px  large surfaces only
radius-full 9999px
```

Rules：

- Default component radius: `8px`。
- Button/input/card 均使用 `8px`。
- 大型 hero preview / mobile mockup 可以使用 `12px`，不要过度圆角化。

### 3.5 Borders and Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
--shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.08);
--shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08);
```

Rules：

- 默认使用 border 区分层级。
- Shadow 只用于 dropdown、popover、modal、sticky overlay。
- Card hover 可使用 border darkening + subtle shadow，不要重投影。

### 3.6 Z-index

```text
z-base       0
z-dropdown   1000
z-sticky     1020
z-overlay    1040
z-modal      1060
z-toast      1100
z-tooltip    1200
```

### 3.7 Breakpoints and Container

```text
Mobile:  390px target, support 320–767
Tablet:  768px target, support 768–1023
Desktop: 1440px target, support 1024–1439
Wide:    1440+
```

Container：

- Max content width: `1180px–1240px`。
- Desktop side padding: `32px–64px`。
- Tablet side padding: `24px`。
- Mobile side padding: `16px`。
- Desktop grid: 12 columns, 24px gutter。

---

## 4. Tailwind / shadcn Implementation

### 4.1 Tailwind Token Mapping

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        porcelain: "#FAFAFC",
        brand: {
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          900: "#0B1220",
        },
        accent: {
          ai: "#2563EB",
          finance: "#F59E0B",
          health: "#22C55E",
        },
        success: "#16A34A",
        info: "#2563EB",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        toolars: "0 4px 6px -1px rgba(15,23,42,.08), 0 2px 4px -2px rgba(15,23,42,.08)",
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 4.2 CSS Variables for shadcn/ui

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 174 84% 40%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 174 84% 40%;
  --radius: 0.5rem;
}
```

---

## 5. Logo and Icon System

### 5.1 Logo

Logo 由两部分组成：

- Abstract mark：模块化 tiles + search cursor + calculator grid。
- Wordmark：lowercase `toolars`，dark ink。

Usage：

- Header 使用 horizontal lockup。
- Favicon 使用 icon mark。
- App icon 使用 deep ink background + tile mark。
- 单色场景可使用 monochrome dark version。

### 5.2 Icon Style

- Use Lucide-style outline icons。
- Stroke: `1.5px–2px`。
- Grid: `24px`。
- Rounded caps and joins。
- Do not mix filled pictograms with outline icons unless inside tool icon tiles.

### 5.3 Tool Icon Tile

```text
Container: 40–64px square
Radius: 10–14px
Background: light semantic tint
Icon: centered, category color
```

Category color suggestions：

- Calculators: mint / teal
- AI: cobalt or purple-tinted blue, but restrained
- Finance: amber / blue
- Health: green / pink / teal depending tool
- Wellness: pink / blue
- Data & Analytics: cobalt / teal

Asset usage：

```text
/assets/icons/toolars/[slug].png
/assets/icons/toolars/_preview_sheet.png
```

---

## 6. Component Specifications

### 6.1 Header

Desktop dimensions：

```text
height: 64px
padding-inline: 32px
logo width: 130–160px
center search width: 420–560px
right nav gap: 24px
```

States：

- Sticky on scroll。
- Border bottom always visible。
- Search receives focus ring。
- On desktop, `Tools` opens Mega Menu on click and keyboard enter。
- On mobile, hamburger opens drawer; background becomes inert。

### 6.2 Mega Menu

Must include：

- Popular Calculators direct links。
- Categories。
- Solutions / use cases。
- Resources。
- Recent tools strip。
- Shortcut hint: `Press ⌘K to search anything`。

Interaction：

- `Esc` closes menu。
- Click outside closes menu。
- Focus is trapped only if menu behaves as modal; otherwise focus order must remain logical。
- Hover does not replace click behavior.

### 6.3 Global Search / Command Palette

Command trigger：

```text
Input label: Search 73 calculators and AI tools...
Shortcut: ⌘K / Ctrl+K
```

Command palette tabs：

- All
- Calculators
- AI Tools
- Health
- Finance
- Articles

Palette content：

- Recent tools
- Favorites
- Popular searches
- Suggested close matches
- Keyboard shortcuts

No-results state：

```text
No results found
We couldn't find anything for “{query}”.
Suggestions:
- Check spelling or try different keywords
- Browse all calculators
- Search articles and guides
```

Accessibility：

- `role="dialog"` when overlay opens。
- Search input auto-focused。
- Result list uses active descendant or roving tabindex。
- `Esc` closes, `Enter` opens, arrow keys navigate。

### 6.4 Tool Card

Required content：

```text
Icon tile
Title
Category label
Short description, max 2 lines
Badges: Popular / New / Free / AI / Category
Usage metric or estimated time
Favorite button
Open action
```

Card variants：

- `compact`: directory lists and mega menu。
- `standard`: all tools directory grid。
- `featured`: home and category highlights。

States：

- Default: border `neutral-200`。
- Hover: border `brand-500`, subtle shadow。
- Focus: visible 2px ring。
- Favorite active: filled star, accessible label changes to “Remove from favorites”。

### 6.5 Calculator Form

Rules：

- Inputs above the fold。
- Result preview visible after calculate。
- Save / compare / share actions near result panel。
- Formula and explanation below the active calculation area。
- Form values must preserve on page refresh when safe, ideally local storage for free calculators.

Form fields：

- Label always visible。
- Units shown inline or suffix。
- Helper text allowed below field。
- Validation appears after blur and after submit。
- Invalid fields use red border + message; do not rely on color alone.

### 6.6 Result Panel

Result hierarchy：

```text
Primary result label
Large numeric result
Interpretation / category badge
Secondary metrics
Actions: Save, Compare, Share, Copy, Download CSV/PDF where relevant
```

Result panel should support：

- Empty before calculation。
- Loading while calculating。
- Error state。
- Privacy note for local calculations。

### 6.7 Chart Card

Use cases：

- Amortization over time
- Investment growth
- Budget breakdown
- Health ranges and categories

Rules：

- Charts need title, legend, axes, units, source / “calculated” label。
- Colors must meet contrast and not rely on color alone。
- Provide table alternative for screen readers and exports。

### 6.8 AI Output Card

Required elements：

```text
Platform label
Tone label
Generated output
Copy button
Regenerate button
Save button
Word count
Timestamp/status
```

Streaming state：

- Show partial output as it arrives。
- `Cancel` button visible during generation。
- Cancel preserves partial output and marks status `Canceled`。
- Live region announces generation progress politely。

### 6.9 Modal / Drawer / Toast / Tooltip

Modal：

- Use for save confirmation, history detail, delete voice, API key display。
- Focus trapped。
- `Esc` closes unless destructive confirmation is in progress。

Drawer：

- Mobile navigation slides from right。
- Background content inert。
- Swipe right or close button dismisses。

Toast：

- Success, info, warning, error variants。
- Auto-dismiss after `4–6s` except destructive errors。
- Include icon + text; do not rely on color alone。

Tooltip：

- Only for short helper info。
- Must be keyboard accessible。
- Do not hide critical instructions in tooltip only。

### 6.10 Auth Forms

Login：

- Email
- Password
- Remember me
- Forgot password
- Social auth options where supported

Register：

- Name
- Email
- Password
- Plan context when entering from pricing
- Terms and privacy links

Rules：

- AI tools require account。
- Calculators remain free / no signup unless saving, comparing across account, or exporting premium formats。

---

## 7. Page Specifications

### 7.1 Home Desktop

Purpose：usable tool discovery dashboard.

Above fold must include：

- Global search。
- Trust line: free calculators, local browser calculations where applicable, no signup for calculators, multilingual support, AI tools require account。
- Featured AI Content Repurposer。
- Popular tools。
- Recent tools。
- Favorites。
- Quick actions。
- Category cards: AI Content, Body, Fitness & Nutrition, Wellness, Wealth, Finance Calculators。
- Compact preview panels: AI dashboard, calculator templates, analytics。

Layout suggestion：

```text
Header
Trust strip
3-column dashboard row:
  Left: Featured AI + quick actions + upgrade card
  Center/right: popular/recent/favorites
Category card grid
Preview panels row
Comparison mode banner
```

### 7.2 Home Mobile

Priority order：

1. Header + search。
2. Category chips。
3. Continue where you left off。
4. Favorites。
5. Quick start。
6. Featured AI Content Repurposer。
7. Trust metrics。
8. Browse categories。
9. Bottom nav。

Mobile cards should be horizontally scrollable where useful, but primary actions must remain reachable with one hand.

### 7.3 All Tools Directory

Content：

- Sidebar categories on desktop。
- Search and filters top area。
- Tabs: All, Popular, AI Writing, Data & Analytics, Finance, Marketing, Productivity, Design, Development, Education, Health & Wellness。
- Tool cards grid, 12 per page default。
- Favorites and Recently Used quick access。
- Pagination or load more。

Filters：

- Category
- Tool type: Calculator / AI Tool
- Pricing: Free / Freemium / Paid
- Sort: Most popular / Newest / Highest rated / A–Z

### 7.4 AI Tools Directory

Layout：

- Left app sidebar。
- Main grid of AI tools。
- Right rail platform support list。
- Usage plan card and credits.

Required tools/cards：

- AI Content Repurposer
- Template Library
- Brand Voice Manager
- History
- Analytics
- Settings
- AI Email Writer
- Community Post Generator

Right platform support list：

- Twitter Thread
- LinkedIn Post
- Newsletter
- Medium Article
- Reddit Post
- Instagram Post
- YouTube Script
- Facebook Post
- Hacker News Post
- Indie Hackers Post
- WeChat Article
- Xiaohongshu Post
- Jike Post
- Zhihu Answer

### 7.5 Category Pages

Health / Finance category pages share a template：

- Breadcrumb。
- Category title。
- Trust copy / category intro。
- Subcategory chips。
- Tool grid。
- Right rail: insights/articles, popular searches, FAQ, about category, schema notes, language availability。
- Bottom reassurance strip。

### 7.6 Calculator Detail Page Template

Desktop layout：

```text
Header
Breadcrumb
Title + description + favorite/share
Main two-column area:
  Left: calculator form
  Right: result panel
Below:
  chart / schedule / breakdown tabs
  formula explanation
  related tools
  FAQ
  article/content blocks
  ad slot placeholder
```

Mobile layout：

```text
Header
Breadcrumb collapsed
Title
Primary form
Sticky calculate CTA if long form
Result panel immediately after form
Tabs / explanation / FAQ / related tools
```

Calculator page requirements：

- Inputs above fold。
- Result visible after calculation。
- Save / compare / share present。
- Explain formula in plain English。
- Include related tools。
- Include FAQ and SEO schema。
- Ad slot must not interrupt form or result.

### 7.7 AI Repurpose Dashboard

Required controls：

- URL / Text input tabs。
- Platform picker。
- Tone selector: Professional, Casual, Viral。
- Brand voice selector。
- Model picker。
- Generate / Cancel button。
- Streaming outputs。
- Copy / save / regenerate per output。
- Usage limits and plan state。

Layout：

```text
App sidebar
Workspace header
Input panel
Controls row
Output variants grid/list
History and saved outputs nearby
```

### 7.8 Template Library

Template groupings：

- Social
- Long-form
- Email
- Community

Each template card：

- Title
- Output type
- Platform support
- Estimated length
- Tone tags
- Use template action

### 7.9 Brand Voice Manager

Features：

- Create / edit / delete voice。
- Voice cards with limits by plan。
- Sample tone preview。
- Workspace assignment。
- Default voice selector。

Plan limits：

- Free: limited voices。
- Pro: more voices。
- Team: shared brand voices and permissions。

### 7.10 History

List requirements：

- Search。
- Filters by status, platform, date, tone。
- Status badges: Completed, Draft, Canceled, Failed。
- Detail modal with source, outputs, copy buttons, regenerate option。

### 7.11 Analytics

Metrics：

- Total tool uses。
- AI outputs generated。
- Credits used。
- Usage over time。
- Platform breakdown。
- Tone breakdown。
- Recent activity。

### 7.12 Settings

Sections：

- Profile。
- Subscription。
- API keys。
- Notifications。
- Workspace / team where applicable。
- Danger zone。

---

## 8. Interaction Rules

### 8.1 Hover / Active / Focus

```text
Button hover: darker brand background
Button active: slight press / darker shade
Card hover: border brand + subtle shadow
Input focus: 2px brand ring, no layout shift
Link hover: underline or darker color
```

Focus must be visible on all interactive elements.

### 8.2 Keyboard

Required shortcuts：

- `Cmd/Ctrl + K`: open global search。
- `Esc`: close modal, drawer, command palette, dropdown。
- `Enter`: activate selected command/search result。
- `Tab / Shift+Tab`: logical order。
- Arrow keys: navigate command palette list where implemented。

### 8.3 Mobile Navigation

Behavior：

1. User taps hamburger。
2. Drawer slides in from right。
3. Focus moves to drawer close button or first nav link。
4. Background content becomes inert。
5. User can close with close button, swipe right, backdrop tap, or `Esc` on keyboard devices。

### 8.4 Favorites

States：

- Default: outline star。
- Hover: highlighted outline。
- Active: filled star。
- Toast: “Added to favorites” / “Removed from favorites”。

No account：

- Store locally.
- Prompt sign-in only when syncing or saving across devices.

### 8.5 Compare / Save / Share

Compare：

- Allow up to 4 tools by default。
- On limit reached, disable additional selections and show upgrade/context message。

Save：

- Local save for anonymous calculator results where possible。
- Account save for cross-device/history。

Share：

- Copy link。
- Email。
- Social share where relevant。
- Download PDF / CSV for calculators with tabular output。

### 8.6 Form Validation

Validation rules：

- Validate on blur and submit。
- Numeric fields reject invalid text。
- Range fields show min/max errors。
- Required fields show clear error。
- Error text must be specific: “Please enter a value greater than 0.”

### 8.7 Loading / Empty / Error States

Empty：

```text
No results found
Try adjusting your filters or search term.
Action: Clear filters
```

Loading：

```text
Loading your results...
This may take a few seconds.
```

Error：

```text
Something went wrong
We couldn't load your data. Please try again.
Action: Retry
```

Offline：

```text
You're offline
Check your connection and try again.
Action: Try again
```

---

## 9. Accessibility Requirements

Minimum requirements：

- WCAG 2.1 AA contrast for text and UI components。
- 44px minimum tap target for mobile interactive elements。
- Visible focus rings。
- Logical tab order。
- Skip link: “Skip to main content”。
- `aria-label` for icon-only buttons。
- `aria-live="polite"` for AI streaming and async calculation status。
- Do not use color alone to communicate status。
- Text must scale to 200% without loss of core functionality。
- Respect `prefers-reduced-motion`。

Component accessibility notes：

- Modal / drawer: focus trap, initial focus, restore focus on close。
- Command palette: keyboard navigation and screen-reader result count。
- Charts: provide accessible summary and data table。
- Forms: associate labels and errors with inputs using `aria-describedby`。
- Tabs: use correct tablist / tab / tabpanel roles or accessible component library equivalent。

---

## 10. SEO and Content Requirements

### 10.1 Calculator Pages

Each calculator page should include：

- Unique title and meta description。
- Breadcrumbs。
- Intro explaining what the tool does。
- Calculator form。
- Result explanation。
- Formula section。
- Example calculation。
- FAQ。
- Related tools。
- Last updated date。
- Language alternates where supported。

Recommended schema：

- `BreadcrumbList`
- `FAQPage`
- `HowTo` where instructions are step-based
- `SoftwareApplication` or `WebApplication`
- `ItemList` for category pages

### 10.2 Category Pages

Include：

- Category introduction。
- Tool list with crawlable links。
- Popular searches。
- Related articles。
- FAQ。
- Available languages。
- Last updated date。

### 10.3 AI Pages

AI app pages can be gated where needed, but public AI directory and pricing pages should remain crawlable with clear feature descriptions.

---

## 11. Data Model Suggestions

### 11.1 Tool Registry

```ts
export type ToolType = "calculator" | "ai" | "template";
export type ToolCategory =
  | "ai-content"
  | "body"
  | "fitness-nutrition"
  | "wellness"
  | "wealth"
  | "finance"
  | "marketing"
  | "productivity"
  | "data-analytics";

export interface ToolDefinition {
  slug: string;
  title: string;
  type: ToolType;
  category: ToolCategory;
  icon: string;
  description: string;
  badges?: string[];
  isPopular?: boolean;
  isNew?: boolean;
  requiresAccount?: boolean;
  route: string;
  relatedSlugs?: string[];
  seo: {
    title: string;
    description: string;
    keywords?: string[];
  };
}
```

### 11.2 Calculator Definition

```ts
export interface CalculatorField {
  id: string;
  label: string;
  type: "number" | "select" | "date" | "radio" | "checkbox";
  unit?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  helperText?: string;
  required?: boolean;
}

export interface CalculatorDefinition extends ToolDefinition {
  formulaLabel: string;
  fields: CalculatorField[];
  calculate: string; // function key or module reference
  resultLabels: string[];
  explanationBlocks: {
    heading: string;
    body: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}
```

### 11.3 AI Repurpose Output

```ts
export type RepurposePlatform =
  | "twitter-thread"
  | "linkedin-post"
  | "newsletter"
  | "medium-article"
  | "reddit-post"
  | "instagram-post"
  | "youtube-script"
  | "facebook-post"
  | "hacker-news-post"
  | "indie-hackers-post"
  | "wechat-article"
  | "xiaohongshu-post"
  | "jike-post"
  | "zhihu-answer";

export type RepurposeTone = "professional" | "casual" | "viral";

export interface RepurposeJob {
  id: string;
  sourceType: "url" | "text";
  sourceValue: string;
  platforms: RepurposePlatform[];
  tone: RepurposeTone;
  brandVoiceId?: string;
  model: string;
  status: "draft" | "streaming" | "completed" | "canceled" | "failed";
  outputs: RepurposeOutput[];
}

export interface RepurposeOutput {
  id: string;
  platform: RepurposePlatform;
  content: string;
  wordCount: number;
  copiedAt?: string;
  createdAt: string;
}
```

---

## 12. Implementation Checklist

### 12.1 Foundation

- [ ] Add design tokens to Tailwind and CSS variables。
- [ ] Set Inter/system font stack。
- [ ] Add app-wide `Container` component with max width `1240px`。
- [ ] Add `FocusRing` standards through global CSS。
- [ ] Configure Lucide icon usage。
- [ ] Add tool icon assets by slug。

### 12.2 Components

- [ ] Header。
- [ ] Mega Menu。
- [ ] Command Palette。
- [ ] Tool Card。
- [ ] Category Tabs。
- [ ] Calculator Form primitives。
- [ ] Result Panel。
- [ ] Chart Card。
- [ ] AI Output Card。
- [ ] Pricing Card。
- [ ] Blog Card。
- [ ] Auth Form。
- [ ] Modal / Drawer / Toast / Tooltip。
- [ ] Empty / Loading / Error / Offline states。

### 12.3 Pages

- [ ] Home desktop/mobile responsive implementation。
- [ ] All tools directory。
- [ ] AI tools directory。
- [ ] Health category page。
- [ ] Finance category page。
- [ ] Shared calculator detail page template。
- [ ] 73 calculator route registry。
- [ ] AI Repurpose dashboard。
- [ ] Template Library。
- [ ] Brand Voice Manager。
- [ ] History。
- [ ] Analytics。
- [ ] Settings。
- [ ] Pricing。
- [ ] Auth pages。
- [ ] Blog pages。
- [ ] Compare saved results。
- [ ] Static/legal pages。
- [ ] 404。
- [ ] RTL/i18n adaptation。

### 12.4 QA

- [ ] No text overflow at 320px, 390px, 768px, 1024px, 1440px。
- [ ] All interactive targets are at least 44px on mobile。
- [ ] Keyboard-only navigation works for header, menu, search, modal, forms。
- [ ] `Cmd/Ctrl + K` opens search。
- [ ] `Esc` closes overlays。
- [ ] Calculator result states are covered: empty, loading, success, invalid, error。
- [ ] AI output states are covered: draft, streaming, canceled, completed, failed。
- [ ] No card nesting except deliberate modal/content group boundaries。
- [ ] SEO schemas validate。
- [ ] Color contrast passes AA。
- [ ] Reduced motion mode avoids drawer/transition-heavy animation。

---

## 13. Asset Handoff

Recommended project structure：

```text
/public/
  icons/
    toolars/
      ai_content_repurposer.png
      loan_payment_calculator.png
      bmi_calculator.png
      ...
  brand/
    logo-horizontal.svg
    logo-mark.svg
    favicon.svg
    app-icon.png

/src/
  app/
  components/
    layout/
    navigation/
    search/
    tools/
    calculators/
    ai/
    ui/
  data/
    tools.ts
    calculators.ts
    ai-platforms.ts
  lib/
    calculators/
    seo/
    formatting/
```

Generated design reference files：

```text
original_generated_files/
  design spec cover board
  brand and visual identity board
  token board
  component library board
  interaction behavior board
  home desktop
  home mobile
  all tools directory
  AI tools directory
  health tools category

extracted_tool_icons/
  42 cropped tool icon PNG files
```

---

## 14. Development Notes

- Treat the design system as the source of truth for UI rhythm, spacing, border radius, and interaction states。
- Build the product around a central `ToolRegistry`; do not hard-code directories per page。
- Shared calculator template should receive configuration from data definitions to avoid 73 separate UI implementations。
- AI app pages should use the same shell/sidebar patterns for consistency。
- Public calculator pages should remain fast, indexable, and usable without account。
- Account-required actions should be progressive: explain why login is needed only when user tries to save, sync, use AI, or access premium exports。
- Keep UI density practical; avoid marketing-first hero sections on utility pages。

---

## 15. Design Acceptance Criteria

A screen is considered aligned with the Toolars design system when：

1. It uses search-first utility UX where applicable。
2. It follows the token palette and typography scale。
3. Components use 8px primary radius and border-first hierarchy。
4. Text is legible, non-overlapping, and meaningful。
5. The user can reach the primary tool action quickly。
6. Calculator forms show inputs and results clearly。
7. AI workflows show generation status and allow cancellation。
8. Mobile prioritizes search, recent/favorites, and active tool form。
9. Accessibility and SEO requirements are implemented, not left as visual notes。
10. The page looks like a shipped product, not concept art。
