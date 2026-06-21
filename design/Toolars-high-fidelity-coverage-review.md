# Toolars high-fidelity coverage review

Date: 2026-06-12

Scope:

- Static high-fidelity pack: `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/new-design`
- Interactive prototype: `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc/src/pages/toolars`
- Merged AI tool source: `/Users/stanvl/Documents/dev/ai-repo/aixtral-lab`

## Verdict

The formal `new-design` pack now covers the current Toolars prototype architecture. It contains 57 numbered high-fidelity PNGs plus the `16-toolars-states-board.html` static reference.

Before this pass, the main gaps were AI Developer Lab surfaces, the Lab tool workspaces, Lab tool detail pages, Billing, Lab workflow variants, and most mobile views. Those are now covered by `17` through `57`.

## Project Inventory Reviewed

The current prototype has 28 Toolars routes:

- Explore and discovery: `/toolars`, `/toolars/explore/pdf`, `/toolars/explore/ai-developer`.
- Workspaces: PDF Toolkit, JSON Repair, Prompt Injection Scanner, LLM Cost Calculator, MCP Server Builder.
- Public tool detail pages: PDF Toolkit, JSON Repair, Prompt Injection Scanner, LLM Cost Calculator, MCP Server Builder.
- Workflows: index, PDF Summary, AI Prompt Hardening, LLM Cost Review, MCP Tool Launch.
- Collections: index, PDF Ops Kit, AI Developer Lab.
- Account and platform surfaces: My Tools, Settings, Billing, Pricing, Submit Tool, Admin Review, States Board.
- Global overlays: Command Center, AI consent, share, save collection, sign in, upgrade, delete confirmation, toast.

## Formal Static Coverage

| Prototype area | Routes / states | Formal high-fidelity files |
| --- | --- | --- |
| Explore home | `/toolars` | `01-toolars-home-desktop.png`, `04-toolars-home-mobile.png` |
| PDF directory | `/toolars/explore/pdf` | `02-toolars-pdf-directory-desktop.png`, `31-toolars-pdf-directory-mobile.png` |
| PDF Toolkit workspace | `/toolars/tools/pdf-toolkit` | `03-toolars-pdf-ai-workspace-desktop.png`, `32-toolars-pdf-toolkit-mobile.png` |
| Workflows index | `/toolars/workflows` | `05-toolars-workflows-index-desktop.png`, `35-toolars-workflows-index-mobile.png` |
| Collections index | `/toolars/collections` | `06-toolars-collections-index-desktop.png`, `36-toolars-collections-index-mobile.png` |
| My Tools | `/toolars/my-tools` | `07-toolars-my-tools-dashboard-desktop.png`, `39-toolars-my-tools-dashboard-mobile.png` |
| Submit Tool | `/toolars/submit` | `08-toolars-submit-tool-desktop.png`, `42-toolars-submit-tool-mobile.png` |
| Pricing | `/toolars/pricing` | `09-toolars-pricing-desktop.png`, `41-toolars-pricing-mobile.png` |
| PDF Summary workflow | `/toolars/workflows/pdf-summary` | `10-toolars-workflow-builder-desktop.png`, `38-toolars-pdf-summary-workflow-mobile.png` |
| PDF Ops Kit collection | `/toolars/collections/pdf-ops-kit` | `11-toolars-collection-detail-desktop.png`, `37-toolars-pdf-ops-kit-collection-mobile.png` |
| PDF Toolkit detail | `/toolars/tools/pdf-toolkit/about` | `12-toolars-tool-detail-desktop.png`, `57-toolars-pdf-toolkit-detail-mobile.png` |
| Account settings | `/toolars/settings` | `13-toolars-account-settings-desktop.png`, `40-toolars-account-settings-mobile.png` |
| Admin Review | `/toolars/admin/review` | `14-toolars-admin-review-console-desktop.png`, `43-toolars-admin-review-mobile.png` |
| Core dialogs | Global overlays | `15-toolars-core-modals-board.png`, `16-toolars-states-board.png` |
| States Board | `/toolars/states` | `16-toolars-states-board.png`, `16-toolars-states-board.html`, `44-toolars-states-board-mobile.png` |
| AI Developer Lab directory | `/toolars/explore/ai-developer` | `17-toolars-ai-developer-lab-directory-desktop.png`, `33-toolars-ai-developer-lab-mobile.png` |
| AI Developer Lab collection | `/toolars/collections/ai-developer-lab` | `18-toolars-ai-developer-lab-collection-desktop.png`, `34-toolars-ai-developer-lab-collection-mobile.png` |
| JSON Repair workspace | `/toolars/tools/json-repair` | `19-toolars-json-repair-workspace-desktop.png`, `45-toolars-json-repair-workspace-mobile.png` |
| Prompt Injection Scanner workspace | `/toolars/tools/prompt-injection-scanner` | `20-toolars-prompt-injection-scanner-workspace-desktop.png`, `46-toolars-prompt-injection-scanner-workspace-mobile.png` |
| LLM Cost Calculator workspace | `/toolars/tools/llm-cost-calculator` | `21-toolars-llm-cost-calculator-workspace-desktop.png`, `47-toolars-llm-cost-calculator-workspace-mobile.png` |
| MCP Server Builder workspace | `/toolars/tools/mcp-server-builder` | `22-toolars-mcp-server-builder-workspace-desktop.png`, `48-toolars-mcp-server-builder-workspace-mobile.png` |
| Billing settings | `/toolars/settings/billing` | `23-toolars-billing-settings-desktop.png`, `53-toolars-billing-settings-mobile.png` |
| AI Prompt Hardening workflow | `/toolars/workflows/ai-prompt-hardening` | `24-toolars-ai-prompt-hardening-workflow-desktop.png`, `54-toolars-ai-prompt-hardening-workflow-mobile.png` |
| LLM Cost Review workflow | `/toolars/workflows/llm-cost-review` | `25-toolars-llm-cost-review-workflow-desktop.png`, `55-toolars-llm-cost-review-workflow-mobile.png` |
| MCP Tool Launch workflow | `/toolars/workflows/mcp-tool-launch` | `26-toolars-mcp-tool-launch-workflow-desktop.png`, `56-toolars-mcp-tool-launch-workflow-mobile.png` |
| JSON Repair detail | `/toolars/tools/json-repair/about` | `27-toolars-json-repair-detail-desktop.png`, `49-toolars-json-repair-detail-mobile.png` |
| Prompt Injection Scanner detail | `/toolars/tools/prompt-injection-scanner/about` | `28-toolars-prompt-injection-scanner-detail-desktop.png`, `50-toolars-prompt-injection-scanner-detail-mobile.png` |
| LLM Cost Calculator detail | `/toolars/tools/llm-cost-calculator/about` | `29-toolars-llm-cost-calculator-detail-desktop.png`, `51-toolars-llm-cost-calculator-detail-mobile.png` |
| MCP Server Builder detail | `/toolars/tools/mcp-server-builder/about` | `30-toolars-mcp-server-builder-detail-desktop.png`, `52-toolars-mcp-server-builder-detail-mobile.png` |

## Gaps Found And Resolved

| Previous gap | Resolution |
| --- | --- |
| AI Developer Lab directory had no formal `new-design` file. | Added desktop and mobile files `17`, `33`. |
| AI Developer Lab collection had no formal `new-design` file. | Added desktop and mobile files `18`, `34`. |
| Four Aixtral Lab representative workspaces were only prototype routes. | Added desktop and mobile files `19-22`, `45-48`. |
| Four Aixtral Lab representative public detail pages were only prototype routes. | Added desktop and mobile files `27-30`, `49-52`. |
| Billing settings had no standalone high-fidelity screen. | Added desktop and mobile files `23`, `53`. |
| Three Lab workflow variants were not represented in the static pack. | Added desktop and mobile files `24-26`, `54-56`. |
| Most non-home mobile pages were QA screenshots only. | Added formal mobile high-fidelity files `31-57`. |

## Remaining Non-Blocking Gaps

These are not blockers for the next development pass, but they should stay visible:

- The full Aixtral Lab source has 92 tools. The current high-fidelity pack does not create a separate custom screen for every long-tail tool. The intended product model is template-driven: catalog card, workspace template, detail template, and workflow template.
- Post-action result states, such as repaired JSON output, high-risk prompt scan output, yearly pricing toggle, admin approve confirmation, and delete confirmation after action, are verified in the interactive prototype and QA screenshots, not all as separate numbered static PNGs.
- Future enterprise surfaces, such as Team management, API keys, audit logs, invoice detail, usage analytics, and provider routing, are referenced in the IA but not designed as standalone pages yet.
- Pricing and Admin mobile use contained table regions lower on the page. Page-level overflow is clean; for production rebuild, convert those table sections into stacked comparison cards and review queue cards on mobile.
- Lab workspaces currently use the generic three-column workspace pattern. PDF Toolkit remains the richer benchmark. A future polish pass should define a dedicated AI Developer Lab workbench shell for code, risk, cost, and MCP tools.

## Development Rule

Use `new-design` as the visual contract and `vitalcalc/toolars-qa` as verification evidence. If a future Toolars route is added, it must either map to one of the numbered high-fidelity templates above or receive a new numbered static design file before implementation.
