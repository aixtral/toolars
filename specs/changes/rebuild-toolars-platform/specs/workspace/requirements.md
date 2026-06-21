# Workspace Requirements

## Requirement R1: JSON Repair Local Workspace

### Description

JSON Repair is the first fully interactive local developer utility.

### Scenario R1-S1: Repair sample payload

**Given** the user enters `{ user: 'ada', score: 42, flags: ['beta', 'pro'], }`
**When** they run repair
**Then** the output is valid formatted JSON and the fixes include unquoted keys, single quotes, and trailing comma.

### Scenario R1-S2: Valid JSON pass-through

**Given** the user enters valid JSON
**When** they run repair
**Then** parsing succeeds and no fixes are reported.

### Scenario R1-S3: Unparseable input

**Given** the user enters text that cannot be repaired
**When** they run repair
**Then** the workspace shows a failure state without throwing.

## Requirement R2: Workspace Design Contract

### Description

Workspaces must follow the design contract: context, input, output, next steps.

### Scenario R2-S1: Desktop layout

**Given** the viewport is desktop width
**When** `/tools/json-repair` renders
**Then** it shows a left context panel, central input/output panels, and right next-steps panel.

### Scenario R2-S2: Mobile layout

**Given** the viewport is 390px wide
**When** `/tools/json-repair` renders
**Then** content stacks in a single column with no page-level horizontal overflow.

## Requirement R3: PDF Toolkit Workspace

### Description

PDF Toolkit is the first multi-panel traditional-tool workspace and must combine local PDF operations with optional AI enhancement.

### Scenario R3-S1: Local PDF operation

**Given** sample PDFs are loaded
**When** the user runs Merge
**Then** the workspace produces a completed local result and labels security as processed locally.

### Scenario R3-S2: AI consent gate

**Given** the user selects Summarize
**When** they run AI summary without consent
**Then** the workspace blocks AI processing and asks for explicit consent.

### Scenario R3-S3: AI summary after consent

**Given** the user grants consent
**When** they run AI summary
**Then** the workspace shows a generated summary, citations, and an AI-consent security label.

## Requirement R4: Prompt Injection Scanner Workspace

### Description

Prompt Injection Scanner is the first AI Developer Lab security workspace and must provide local heuristic scanning before any optional AI review.

### Scenario R4-S1: Workspace sections

**Given** the scanner workspace renders
**When** the user opens `/tools/prompt-injection-scanner`
**Then** it shows AI security context, prompt surface, risk report, remediation, and local scan profile sections.

### Scenario R4-S2: Critical sample scan

**Given** the design sample prompt asks to ignore previous instructions, reveal hidden system prompts, and enter developer override mode
**When** the user scans the prompt
**Then** the workspace reports critical risk and findings for ignore instructions, system prompt leak, and role override.

### Scenario R4-S3: Safe local prompt

**Given** the user enters an ordinary product-summary prompt
**When** they scan the prompt
**Then** the workspace reports low risk and no injection patterns detected.

### Scenario R4-S4: Responsive design

**Given** the viewport is mobile width
**When** `/tools/prompt-injection-scanner` renders
**Then** the workspace stacks into a single column with no page-level horizontal overflow.

### Scenario R4-S5: Non-destructive draft save

**Given** the user edits the prompt content
**When** they save a draft
**Then** the workspace stores the draft locally without replacing the current prompt.

## Requirement R5: LLM Cost Calculator Workspace

### Description

LLM Cost Calculator is an AI Developer Lab planning workspace for estimating monthly token spend locally before launch.

### Scenario R5-S1: Workspace sections

**Given** the LLM cost workspace renders
**When** the user opens `/tools/llm-cost-calculator`
**Then** it shows cost model context, usage inputs, monthly estimate, and before-production review checklist sections.

### Scenario R5-S2: Balanced sample calculation

**Given** the design sample uses 2400 input tokens, 700 output tokens, 180000 requests per month, and Balanced model
**When** the user calculates cost
**Then** the workspace reports `$562`, `558M` monthly tokens, and the input/output cost breakdown.

### Scenario R5-S3: Model profile comparison

**Given** the user changes the model profile to Small utility model
**When** they calculate cost
**Then** the workspace updates the estimate to the small-profile pricing while keeping the same usage assumptions.

### Scenario R5-S4: Non-destructive scenario save

**Given** the user edits usage assumptions
**When** they save a scenario
**Then** the workspace stores the scenario locally without changing the current inputs.

### Scenario R5-S5: Responsive design

**Given** the viewport is mobile width
**When** `/tools/llm-cost-calculator` renders
**Then** the workspace stacks into a single column with no page-level horizontal overflow.

## Requirement R6: MCP Server Builder Workspace

### Description

MCP Server Builder is an AI Developer Lab workflow workspace for drafting local MCP server manifests, tool schemas, resources, and test payloads.

### Scenario R6-S1: Workspace sections

**Given** the MCP builder workspace renders
**When** the user opens `/tools/mcp-server-builder`
**Then** it shows builder stages, server draft, manifest preview, and launch review sections.

### Scenario R6-S2: Default manifest generation

**Given** the design sample server name, primary tool, and tool description are loaded
**When** the user generates a manifest
**Then** the workspace outputs a manifest with one tool, one resource index, and one test payload.

### Scenario R6-S3: Tool name update

**Given** the user edits the primary tool name
**When** they generate a manifest
**Then** the manifest preview uses the edited tool name.

### Scenario R6-S4: Non-destructive draft save

**Given** the user edits the server draft
**When** they save the draft
**Then** the workspace stores the draft locally without changing current fields.

### Scenario R6-S5: Responsive design

**Given** the viewport is mobile width
**When** `/tools/mcp-server-builder` renders
**Then** the workspace stacks into a single column with no page-level horizontal overflow.

## Requirement R7: LLM Cost Review Workflow

### Description

LLM Cost Review is the first AI Developer Lab workflow builder route and must combine workflow context, local steps, run preview, and tool-chain handoff.

### Scenario R7-S1: Workflow builder sections

**Given** the LLM cost review workflow renders
**When** the user opens `/workflows/llm-cost-review`
**Then** it shows cost workflow context, review mode controls, cost review canvas, run preview, tool chain, and budget policy sections.

### Scenario R7-S2: Default launch review

**Given** the design sample launch assumptions are used
**When** the user runs the review
**Then** the workflow reports `Cost review ready`, `76%` progress, `$562/month`, and a memo recommending smaller-model routing for low-risk jobs.

### Scenario R7-S3: Local workflow steps

**Given** the workflow canvas renders
**When** the user reviews the step list
**Then** the workflow shows Count tokens, Compare models, Plan context, and Export budget as local steps.

### Scenario R7-S4: Responsive design

**Given** the viewport is mobile width
**When** `/workflows/llm-cost-review` renders
**Then** the workflow stacks into a single column with no page-level horizontal overflow.

## Requirement R8: MCP Tool Launch Workflow

### Description

MCP Tool Launch is the second AI Developer Lab workflow builder route and must connect MCP server drafting, manifest generation, MCP tests, docs export, and review-gate readiness.

### Scenario R8-S1: Workflow builder sections

**Given** the MCP tool launch workflow renders
**When** the user opens `/workflows/mcp-tool-launch`
**Then** it shows MCP launch workflow context, launch target controls, launch canvas, run preview, tool chain, and review gate sections.

### Scenario R8-S2: Default launch check

**Given** the design sample MCP launch assumptions are used
**When** the user runs the launch check
**Then** the workflow reports `Launch checklist ready`, `88%` progress, manifest generation, queued test payload, docs export, and pending auth policy notes.

### Scenario R8-S3: MCP test gate

**Given** the launch canvas renders
**When** the user reviews the step list
**Then** the workflow shows Define tools, Build manifest, Run MCP tests, and Export docs with Run MCP tests labeled as `Test`.

### Scenario R8-S4: Responsive design

**Given** the viewport is mobile width
**When** `/workflows/mcp-tool-launch` renders
**Then** the workflow stacks into a single column with no page-level horizontal overflow.

## Requirement R9: AI Prompt Hardening Workflow

### Description

AI Prompt Hardening is an AI Developer Lab workflow builder route for turning raw prompt surfaces into injection-risk reports, guardrails, and red-team variants.

### Scenario R9-S1: Workflow builder sections

**Given** the AI prompt hardening workflow renders
**When** the user opens `/workflows/ai-prompt-hardening`
**Then** it shows AI security workflow context, input surface controls, hardening canvas, run preview, tool chain, and AI deep review consent sections.

### Scenario R9-S2: Default hardening preview

**Given** the design sample prompt-hardening assumptions are used
**When** the user runs hardening
**Then** the workflow reports `Hardening report ready`, `82%` progress, 3 injection patterns found, generated guardrails, and red-team variants.

### Scenario R9-S3: Scan gate

**Given** the hardening canvas renders
**When** the user reviews the step list
**Then** the workflow shows Paste prompt, Scan injection risk, Add guardrails, and Red-team variants with Scan injection risk labeled as `Scan`.

### Scenario R9-S4: Responsive design

**Given** the viewport is mobile width
**When** `/workflows/ai-prompt-hardening` renders
**Then** the workflow stacks into a single column with no page-level horizontal overflow.

## Requirement R10: AI Developer Lab Public Tool Detail Template

### Description

Featured AI Developer Lab tools must have public listing pages separate from their operating workspaces so catalog discovery, trust review, related tools, collections, and workflow handoff can be shared.

### Scenario R10-S1: Prompt Injection Scanner detail

**Given** the Prompt Injection Scanner public detail renders
**When** the user opens `/tools/prompt-injection-scanner/about`
**Then** it shows a public tool listing header, Open workspace CTA, Overview metrics, How it works, Privacy and review model, Implementation handoff, Included in collections, Related tools, and AI Prompt Hardening workflow handoff.

### Scenario R10-S2: LLM Cost Calculator detail

**Given** the LLM Cost Calculator public detail renders
**When** the user opens `/tools/llm-cost-calculator/about`
**Then** it shows the shared detail template with cost-specific Overview metrics, Pricing and limits, related LLM cost tools, and LLM Cost Review workflow handoff.

### Scenario R10-S3: MCP Server Builder detail

**Given** the MCP Server Builder public detail renders
**When** the user opens `/tools/mcp-server-builder/about`
**Then** it shows the shared detail template with MCP-specific Overview metrics, Security and launch review, related MCP tools, and MCP Tool Launch workflow handoff.

### Scenario R10-S4: Workspace/detail separation

**Given** a featured AI Developer Lab detail page renders
**When** the user selects Open workspace
**Then** the CTA links to `/tools/:slug` while the listing keeps `data-tool-detail=":slug"` for QA and analytics.

### Scenario R10-S5: Responsive design

**Given** the viewport is mobile width
**When** an AI Developer Lab detail page renders
**Then** the public listing stacks into a single column with no page-level horizontal overflow.

## Requirement R11: PDF Summary Workflow

### Description

PDF Summary is a workflow builder route for merging PDFs, extracting text locally, summarizing selected text with AI consent, and exporting a cited summary.

### Scenario R11-S1: Workflow builder sections

**Given** the PDF summary workflow renders
**When** the user opens `/workflows/pdf-summary`
**Then** it shows workflow context, recommended variations, step canvas, run preview, step settings, PDF Toolkit handoff, and step-scoped AI consent.

### Scenario R11-S2: Default workflow run

**Given** the design sample PDF workflow assumptions are used
**When** the user runs the workflow
**Then** the workflow reports `Workflow simulated`, `72%` progress, local extraction complete, and AI summary waiting for consent approval.

### Scenario R11-S3: AI consent gate

**Given** the step canvas renders
**When** the user reviews the step list
**Then** the workflow shows Upload PDF, Extract text locally, Summarize with AI, and Export summary with Summarize with AI labeled as `AI`.

### Scenario R11-S4: Responsive design

**Given** the viewport is mobile width
**When** `/workflows/pdf-summary` renders
**Then** the workflow stacks into a single column with no page-level horizontal overflow.

## Requirement R12: Collection Detail Template

### Description

Collections must have shareable detail pages that combine collection context, recommended path, included tools, included workflows, notes, related handoffs, and save/share actions.

### Scenario R12-S1: PDF Ops Kit collection detail

**Given** the PDF Ops Kit collection renders
**When** the user opens `/collections/pdf-ops-kit`
**Then** it shows an official collection header, Share and Save collection actions, recommended path, tools in this collection, workflows included, collection notes, and links to PDF Toolkit and PDF Summary workflow.

### Scenario R12-S2: AI Developer Lab collection detail

**Given** the AI Developer Lab collection renders
**When** the user opens `/collections/ai-developer-lab`
**Then** it shows the shared collection template with Lab-specific recommended path, tools, workflows, playbooks, collection notes, and Browse full Lab link.

### Scenario R12-S3: Collection data integrity

**Given** a designed collection detail is generated
**When** the page resolves its data
**Then** all included tools and workflows come from the shared registry and keep workspace/workflow hrefs separate from collection hrefs.

### Scenario R12-S4: Responsive design

**Given** the viewport is mobile width
**When** a collection detail page renders
**Then** the collection page stacks into a single column with no page-level horizontal overflow.

## Requirement R13: Workflows Index

### Description

The workflows landing page must make reusable multi-tool automation paths discoverable and route users into existing workflow builders.

### Scenario R13-S1: Workflows landing modules

**Given** the workflows index renders
**When** the user opens `/workflows`
**Then** it shows Workflows active navigation, workflow search, Featured workflows, Popular workflow templates, Trending this week, Build from scratch, and workflow trust panels.

### Scenario R13-S2: Registry workflow links

**Given** workflows are listed on the index
**When** the user reviews workflow cards
**Then** each listed workflow comes from the shared workflow registry and links to its workflow builder route.

### Scenario R13-S3: Responsive design

**Given** the viewport is mobile width
**When** `/workflows` renders
**Then** workflow cards and right-rail panels stack into a single column with no page-level horizontal overflow.

## Requirement R14: Collections Index

### Description

The collections landing page must present curated reusable stacks of tools and workflows, and route users into collection detail pages.

### Scenario R14-S1: Collections landing modules

**Given** the collections index renders
**When** the user opens `/collections`
**Then** it shows Collections active navigation, collection creation actions, Featured collections, All collections, Recently updated, Suggested for you, and Create a private collection.

### Scenario R14-S2: Registry collection links

**Given** collections are listed on the index
**When** the user reviews collection cards
**Then** each listed collection comes from the shared collection registry and links to its collection detail route.

### Scenario R14-S3: Responsive design

**Given** the viewport is mobile width
**When** `/collections` renders
**Then** collection cards and right-rail panels stack into a single column with no page-level horizontal overflow.

## Requirement R15: My Tools Dashboard

### Description

The personal workspace dashboard must help signed-in users resume recent outputs, reopen favorites, track saved workflows and collections, and understand usage.

### Scenario R15-S1: Dashboard modules

**Given** the My Tools dashboard renders
**When** the user opens `/my-tools`
**Then** it shows the personal workspace header, quick command, KPI cards, continue timeline, favorite tools, saved collections, recommended next workflows, recent shared links, usage/storage, and install extension prompts.

### Scenario R15-S2: Workspace navigation

**Given** the dashboard uses the Toolars shell
**When** the page renders
**Then** it shows My workspace navigation instead of the general tool/category sidebar.

### Scenario R15-S3: Registry handoffs

**Given** dashboard cards link to saved resources
**When** the user reviews the page
**Then** links resolve to existing tool, workflow, and collection routes.

### Scenario R15-S4: Responsive design

**Given** the viewport is mobile width
**When** `/my-tools` renders
**Then** dashboard cards and right-rail panels stack into a single column with no page-level horizontal overflow.

## Requirement R16: Submit Tool Page

### Description

The submit page must collect tool listing data, preview the public card, and explain Toolars review before the submission enters pending review.

### Scenario R16-S1: Submit form modules

**Given** the submit page renders
**When** the user opens `/submit`
**Then** it shows Tool basics, Classification, Pricing & processing, Review preview, Live listing preview, Review checklist, Submission guidelines, and What happens next.

### Scenario R16-S2: Required submission controls

**Given** the submit form renders
**When** the user reviews the inputs
**Then** it exposes tool name, website URL, short description, long description, contact email, tool type controls, processing checkboxes, pricing controls, and Submit for review.

### Scenario R16-S3: Pending review handoff

**Given** a tool is ready for review
**When** the page shows the review timeline
**Then** it labels the next system state as `pending_review`.

### Scenario R16-S4: Responsive design

**Given** the viewport is mobile width
**When** `/submit` renders
**Then** the form, preview, and review rail stack into a single column with no page-level horizontal overflow.

## Requirement R17: Pricing Page

### Description

The pricing page must explain Toolars' free local-tool promise and the paid upgrade path for AI credits, workflow history, shared collections, and team billing.

### Scenario R17-S1: Pricing modules

**Given** the pricing page renders
**When** the user opens `/pricing`
**Then** it shows the pricing hero, Monthly / Yearly billing toggle, Free / Pro / Team plan cards, feature comparison, usage estimator, FAQ preview, and trust strip.

### Scenario R17-S2: Billing shell context

**Given** the pricing page uses the Toolars shell
**When** the page renders
**Then** it shows a billing navigation sidebar and a Pricing primary navigation item only on the pricing surface.

### Scenario R17-S3: Upgrade model

**Given** the user compares plans
**When** the page renders
**Then** Free preserves the local traditional tools promise, Pro is highlighted as the recommended plan, and Team explains shared workflow and billing controls.

### Scenario R17-S4: Responsive design

**Given** the viewport is mobile width
**When** `/pricing` renders
**Then** pricing cards, comparison rows, usage estimator, FAQ, and trust modules stack into readable cards with no page-level horizontal overflow.

## Requirement R18: Account Settings Page

### Description

The account settings page must let signed-in users manage workspace preferences, plan handoffs, privacy defaults, storage, team access, API keys, connected apps, notifications, and account risk actions.

### Scenario R18-S1: Settings modules

**Given** the account settings page renders
**When** the user opens `/settings`
**Then** it shows current plan, usage meters, billing details, compare plans, Privacy & AI defaults, API keys preview, team invite, connected apps, storage summary, notifications, and danger zone.

### Scenario R18-S2: Settings shell context

**Given** the settings page uses the Toolars shell
**When** the page renders
**Then** it shows a settings navigation sidebar instead of tool, workflow, collection, workspace, or billing navigation.

### Scenario R18-S3: Trust defaults

**Given** privacy defaults render
**When** the user reviews the settings
**Then** Ask before AI processing, Auto-delete uploads after session, Prefer local tools, and Save output history are visibly enabled.

### Scenario R18-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings` renders
**Then** account modules stack into readable cards with no page-level horizontal overflow.

## Requirement R19: Billing Settings Page

### Description

The billing settings page must summarize plan usage, payment details, invoices, customer portal handoff, and usage policy inside the billing shell.

### Scenario R19-S1: Billing modules

**Given** the billing settings page renders
**When** the user opens `/settings/billing`
**Then** it shows billing and usage hero, plan summary, AI credits, storage, next invoice, customer portal, billing details, invoices, and usage policy.

### Scenario R19-S2: Billing shell context

**Given** the billing settings page uses the Toolars shell
**When** the page renders
**Then** it shows Billing navigation with Plans & pricing, Usage, Payment methods, Invoices, Team plans, and Upgrade guide.

### Scenario R19-S3: Customer portal and invoices

**Given** billing details render
**When** the user reviews account billing
**Then** payment method, billing email, tax details, Open portal, Compare plans, and paid invoice rows are visible.

### Scenario R19-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/billing` renders
**Then** summary cards, billing details, invoices, and policy cards stack into a single column with no page-level horizontal overflow.

## Requirement R20: Admin Review Console

### Description

The admin review console must provide an internal queue for submitted tools, including review KPIs, submission filters, queue rows, selected submission details, automated checks, reviewer notes, review checklist, audit trail, and approve/request changes/reject actions.

### Scenario R20-S1: Admin review modules

**Given** the admin review console renders
**When** the user opens `/admin/review`
**Then** it shows Review queue, Review queues sidebar, KPI cards, Submission table, Submission details, Automated checks, Review checklist, Audit trail, Internal comments, Attachments, and Approve / Request changes / Reject actions.

### Scenario R20-S2: Admin shell context

**Given** the admin review console uses the Toolars shell
**When** the page renders
**Then** it shows Toolars Admin branding, admin primary navigation, and an admin review sidebar rather than public tool, workflow, collection, workspace, billing, or settings navigation.

### Scenario R20-S3: Review risk and compliance signals

**Given** a submitted AI tool is selected
**When** the admin reviews the detail panel
**Then** the page surfaces risk level, AI consent required processing, URL reachable, duplicate scan, malware scan, privacy policy, AI disclosure, and review completion count.

### Scenario R20-S4: Responsive design

**Given** the viewport is mobile width
**When** `/admin/review` renders
**Then** the review KPIs, queue rows, and selected submission detail stack into readable cards with no page-level horizontal overflow.

## Requirement R21: States & Overlays Board

### Description

The states board must be a full-width implementation reference for empty, loading, error, offline, toast, validation, mobile drawer, destructive confirmation, and mobile command overlay states.

### Scenario R21-S1: States board modules

**Given** the states board renders
**When** the user opens `/states`
**Then** it shows Empty state, Loading skeleton, Upload error, Offline mode, Toast stack, Form validation, Mobile drawer, Delete confirmation, and Mobile command overlay.

### Scenario R21-S2: Toast and destructive action states

**Given** the states board renders
**When** the user reviews feedback and destructive action examples
**Then** it shows saved, AI consent, upload failed, and share copied toast examples plus a delete confirmation with Cancel and Delete output actions.

### Scenario R21-S3: No-sidebar shell context

**Given** the states board uses the Toolars shell
**When** the page renders
**Then** it uses the no-sidebar shell variant so the state cards can span the implementation board.

### Scenario R21-S4: Responsive design

**Given** the viewport is mobile width
**When** `/states` renders
**Then** state examples stack as single-column cards with no page-level horizontal overflow.

## Requirement R22: Privacy & AI Settings Page

### Description

The Privacy & AI settings page must let signed-in users inspect and adjust consent defaults, AI processing policy, local-first routing, training controls, retention rules, export/deletion handoffs, and the consent preview that appears before AI workflows run.

### Scenario R22-S1: Privacy & AI modules

**Given** the privacy settings page renders
**When** the user opens `/settings/privacy-ai`
**Then** it shows Consent defaults, AI processing policy, Local-first routing, Training controls, Data retention, Consent preview, Privacy log, Download privacy log, and Delete AI history.

### Scenario R22-S2: Trust default controls

**Given** consent defaults render
**When** the user toggles Ask before AI processing
**Then** the control updates visibly and the page shows the workspace-level consent status change.

### Scenario R22-S3: Settings shell context

**Given** the privacy settings page uses the Toolars shell
**When** the page renders
**Then** it shows the settings navigation sidebar and links Privacy & AI directly to `/settings/privacy-ai`.

### Scenario R22-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/privacy-ai` renders
**Then** policy cards, toggles, preview, and audit handoffs stack into a single column with no page-level horizontal overflow.

## Requirement R23: API Keys Settings Page

### Description

The API keys settings page must let signed-in users inspect active keys, scopes, environments, last-used metadata, signing secrets, key activity, and security guidance while supporting local create and revoke states for the settings prototype.

### Scenario R23-S1: API key modules

**Given** the API keys page renders
**When** the user opens `/settings/api-keys`
**Then** it shows API keys, Production key, Development key, Create API key, Scopes, Webhook signing secret, Key activity, and Security checklist.

### Scenario R23-S2: Create key state

**Given** the API keys page renders
**When** the user chooses Create key
**Then** a new local key row appears and the page confirms that a local key was created.

### Scenario R23-S3: Revoke key state

**Given** the Production key is active
**When** the user chooses Revoke Production key
**Then** the Production key row changes to revoked and the page confirms the revocation.

### Scenario R23-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/api-keys` renders
**Then** key rows, create form, activity, and security guidance stack into readable cards with no page-level horizontal overflow.

## Requirement R24: Storage Settings Page

### Description

The storage settings page must help signed-in users inspect workspace storage usage, uploaded files, temporary file cleanup, file type limits, archive export, and upgrade handoffs.

### Scenario R24-S1: Storage modules

**Given** the storage settings page renders
**When** the user opens `/settings/storage`
**Then** it shows Storage, Storage usage, Upload cleanup policy, File types, Recent uploads, Storage automation, Export archive, and Upgrade storage.

### Scenario R24-S2: Temporary upload cleanup state

**Given** temporary uploads are listed
**When** the user chooses Clear temporary uploads
**Then** the page confirms the cleanup and updates the temporary file count.

### Scenario R24-S3: Settings shell context

**Given** the storage page uses the Toolars shell
**When** the page renders
**Then** it shows the settings navigation sidebar and links Storage directly to `/settings/storage`.

### Scenario R24-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/storage` renders
**Then** usage cards, upload rows, automation, and archive handoffs stack with no page-level horizontal overflow.

## Requirement R25: Team Settings Page

### Description

The team settings page must let signed-in users inspect workspace members, roles, seat usage, pending invites, shared collections, team activity, and ownership handoffs while supporting a local invite state.

### Scenario R25-S1: Team modules

**Given** the team settings page renders
**When** the user opens `/settings/team`
**Then** it shows Team workspace, Members, Invite members, Roles and permissions, Seat usage, Pending invites, Shared collections, Activity log, and Transfer ownership.

### Scenario R25-S2: Invite member state

**Given** the invite form renders
**When** the user enters an email and sends an invite
**Then** the pending invites list includes the invited email and the page confirms that the invite was queued.

### Scenario R25-S3: Settings shell context

**Given** the team page uses the Toolars shell
**When** the page renders
**Then** it shows the settings navigation sidebar and links Team directly to `/settings/team`.

### Scenario R25-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/team` renders
**Then** member rows, invite form, roles, and team activity stack with no page-level horizontal overflow.

## Requirement R26: Notifications Settings Page

### Description

The notifications settings page must let signed-in users inspect delivery channels, workflow alerts, review alerts, billing alerts, product updates, digest schedule, quiet hours, and notification preview while supporting local alert toggles.

### Scenario R26-S1: Notification modules

**Given** the notifications page renders
**When** the user opens `/settings/notifications`
**Then** it shows Notifications, Delivery channels, Workflow alerts, Review alerts, Billing alerts, Product updates, Digest schedule, Quiet hours, and Notification preview.

### Scenario R26-S2: Notification toggle state

**Given** workflow completion alerts are enabled
**When** the user toggles Workflow completion alerts
**Then** the control updates visibly and the page confirms that workflow completion alerts were paused.

### Scenario R26-S3: Settings shell context

**Given** the notifications page uses the Toolars shell
**When** the page renders
**Then** it shows the settings navigation sidebar and links Notifications directly to `/settings/notifications`.

### Scenario R26-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/notifications` renders
**Then** alert toggles, channel preferences, digest schedule, quiet hours, and preview stack with no page-level horizontal overflow.

## Requirement R27: Connected Apps Settings Page

### Description

The connected apps settings page must let signed-in users inspect app integrations, connection status, granted scopes, sync policy, extension health, app activity, and integration health while supporting local reconnect and disconnect states.

### Scenario R27-S1: Connected apps modules

**Given** the connected apps settings page renders
**When** the user opens `/settings/connected-apps`
**Then** it shows Connected apps, Google Drive, Browser extension, Notion, Connection scopes, Sync policy, App activity, Connect new app, and Integration health.

### Scenario R27-S2: Disconnect app state

**Given** Notion is connected
**When** the user chooses Disconnect Notion
**Then** the Notion row changes to disconnected and the page confirms that Notion was disconnected.

### Scenario R27-S3: Settings shell context

**Given** the connected apps page uses the Toolars shell
**When** the page renders
**Then** it shows the settings navigation sidebar and links Connected apps directly to `/settings/connected-apps`.

### Scenario R27-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/connected-apps` renders
**Then** integration rows, scopes, sync policy, activity, and health cards stack with no page-level horizontal overflow.

## Requirement R28: Security Settings Page

### Description

The security settings page must let signed-in users inspect account security posture, two-factor authentication, active sessions, login activity, recovery methods, upload deletion policy, security checklist, and session risk actions while supporting local toggle and session sign-out states.

### Scenario R28-S1: Security modules

**Given** the security settings page renders
**When** the user opens `/settings/security`
**Then** it shows Security, Security overview, Two-factor authentication, Active sessions, Login activity, Recovery methods, Upload deletion policy, Security checklist, and Sign out all sessions.

### Scenario R28-S2: Security action states

**Given** two-factor authentication and active sessions render
**When** the user toggles Two-factor authentication or chooses Sign out all sessions
**Then** the control updates visibly and the page confirms the security action.

### Scenario R28-S3: Settings shell context

**Given** the security page uses the Toolars shell
**When** the page renders
**Then** it shows the settings navigation sidebar and links Security directly to `/settings/security`.

### Scenario R28-S4: Responsive design

**Given** the viewport is mobile width
**When** `/settings/security` renders
**Then** overview cards, security controls, session rows, login activity, and recovery methods stack with no page-level horizontal overflow.

## Requirement R29: Settings Risk Confirmation Dialogs

### Description

Settings pages must protect high-risk workspace actions with focused confirmation dialogs that explain the impact, support cancellation, and only commit the local prototype state after explicit confirmation.

### Scenario R29-S1: Security session sign-out confirmation

**Given** active sessions are listed on `/settings/security`
**When** the user chooses Sign out all sessions
**Then** a confirmation dialog opens, the current sessions remain unchanged until the user confirms, Cancel closes the dialog without changing state, and Sign out other sessions leaves only the current session.

### Scenario R29-S2: Connected app disconnect confirmation

**Given** Notion is connected on `/settings/connected-apps`
**When** the user chooses Disconnect Notion
**Then** a confirmation dialog opens, Notion remains connected until the user confirms, Cancel closes the dialog without changing state, and Disconnect app marks Notion disconnected.

### Scenario R29-S3: Dialog accessibility

**Given** either confirmation dialog is open
**When** assistive technology inspects the surface
**Then** the dialog uses `role="dialog"`, `aria-modal="true"`, a specific dialog title, and explicit Cancel and confirmation buttons.

### Scenario R29-S4: Responsive design

**Given** the viewport is mobile width
**When** a settings confirmation dialog opens
**Then** the dialog fits within the viewport, action buttons stack cleanly, and the page has no horizontal overflow.

## Requirement R30: Account Danger Zone Actions

### Description

The account settings page must turn the Danger zone from a static placeholder into real prototype actions for exporting workspace data and requesting account deletion, with clear recovery copy and confirmation before destructive state changes.

### Scenario R30-S1: Danger zone modules

**Given** the account settings page renders
**When** the user reviews the Danger zone
**Then** it shows Export data, Delete account, account data coverage, and a status note explaining the current state.

### Scenario R30-S2: Export data state

**Given** the Danger zone renders
**When** the user chooses Export data
**Then** the page confirms that the data export is being prepared and explains that the archive link will be sent by email.

### Scenario R30-S3: Delete account confirmation

**Given** the Danger zone renders
**When** the user chooses Delete account
**Then** a confirmation dialog opens, the account deletion state remains unchanged until the user confirms, Cancel closes the dialog without changing state, and Delete account permanently queues the deletion request.

### Scenario R30-S4: Responsive design

**Given** the viewport is mobile width
**When** the account Danger zone renders or its confirmation dialog opens
**Then** the action controls and dialog fit within the viewport without horizontal overflow.

## Requirement R31: VitalCalc Public Tool Detail Expansion

### Description

The merged Toolars catalog must extend the public detail template beyond AI Developer Lab pages by adding representative VitalCalc finance and health tools sourced from the VitalCalc inventory, while preserving local-first trust metadata.

### Scenario R31-S1: Featured VitalCalc detail pages

**Given** the public tool detail data is loaded
**When** Toolars builds detail routes
**Then** Mortgage Calculator, BMI Calculator, and Loan Calculator each have a generated `/tools/{slug}/about` detail page with VitalCalc source metadata.

### Scenario R31-S2: VitalCalc detail content model

**Given** a VitalCalc detail page renders
**When** the user reviews the listing
**Then** it shows Overview, How it works, Local calculation model, Implementation handoff, Related tools, Free pricing, and Local processing badges.

### Scenario R31-S3: Source inventory coverage

**Given** the registry merges source inventories
**When** the VitalCalc group is inspected
**Then** it includes at least five representative local tools across Finance and Health, including Loan Calculator.

### Scenario R31-S4: Responsive design

**Given** the viewport is mobile width
**When** a VitalCalc detail page renders
**Then** the detail layout stacks without page-level horizontal overflow.

## Requirement R32: VitalCalc Detail Batch Coverage

### Description

The merged Toolars catalog must continue expanding VitalCalc coverage with a second batch of finance and health calculators, using shared local-first detail content instead of one-off page implementations.

### Scenario R32-S1: Second batch registry coverage

**Given** the merged registry is loaded
**When** the VitalCalc group is inspected
**Then** it includes Retirement Calculator, Debt Payoff Calculator, ROI Calculator, TDEE Calculator, Body Fat Calculator, and Protein Calculator as free local tools.

### Scenario R32-S2: Second batch detail routes

**Given** Toolars builds public tool detail routes
**When** static params are generated
**Then** all six second-batch VitalCalc tools generate `/tools/{slug}/about` detail pages.

### Scenario R32-S3: Shared detail template

**Given** a second-batch VitalCalc detail page renders
**When** the user reviews the listing
**Then** it uses the shared detail template with Local calculation model, VitalCalc source, Related tools, four metrics, and four how-it-works steps.

### Scenario R32-S4: Responsive design

**Given** the viewport is mobile width
**When** a second-batch VitalCalc detail page renders
**Then** the detail page has no framework overlay or page-level horizontal overflow.

## Requirement R33: VitalCalc Related Detail Link Coverage

### Description

VitalCalc public detail pages must not send users from related tool cards to missing detail routes. Existing VitalCalc related links for finance and health calculators should resolve to generated `/tools/{slug}/about` detail pages with the same local-first trust model.

### Scenario R33-S1: Related detail route coverage

**Given** a VitalCalc public detail page lists related tools
**When** the related tool cards are inspected
**Then** each related VitalCalc tool shown on the existing detail pages has a generated `/tools/{slug}/about` detail page.

### Scenario R33-S2: Existing related gaps

**Given** Toolars builds public tool detail routes
**When** static params are generated
**Then** Compound Interest Calculator, BMR Calculator, and Water Intake Calculator each generate `/tools/{slug}/about` detail pages.

### Scenario R33-S3: Shared local template

**Given** the new related coverage detail pages render
**When** the user reviews the listing
**Then** each page uses the shared VitalCalc detail template with Local calculation model, VitalCalc source, Related tools, four metrics, and four how-it-works steps.

### Scenario R33-S4: Responsive design

**Given** the viewport is mobile width
**When** a related coverage VitalCalc detail page renders
**Then** the page has no framework overlay or page-level horizontal overflow.

## Requirement R34: Mortgage Calculator Workspace

### Description

The merged Toolars site must turn the representative VitalCalc Mortgage Calculator listing into a real local-first workspace so users can calculate mortgage payments directly from the public catalog without leaving Toolars.

### Scenario R34-S1: Local mortgage calculation

**Given** the mortgage calculator receives home price, down payment, interest rate, loan term, annual property tax, and monthly insurance inputs
**When** the user runs the calculation
**Then** it returns loan amount, monthly principal and interest, monthly escrow, full monthly payment, total interest, down payment percent, and loan-to-value percent without calling a server.

### Scenario R34-S2: Mortgage workspace surface

**Given** the user opens `/tools/mortgage-calculator`
**When** the workspace renders
**Then** it shows loan inputs, monthly payment, affordability notes, local-first trust metadata, a Tool details link, and default VitalCalc sample values.

### Scenario R34-S3: Local scenario save

**Given** the mortgage workspace renders
**When** the user updates inputs and chooses Save scenario
**Then** the workspace stores the current scenario in localStorage without changing calculation inputs.

### Scenario R34-S4: Responsive design

**Given** the viewport is mobile width
**When** the mortgage workspace renders and calculates a payment
**Then** the controls and result cards fit within the viewport without framework overlays or page-level horizontal overflow.

## Requirement R35: BMI Calculator Workspace

### Description

The merged Toolars site must turn the representative VitalCalc BMI Calculator listing into a real local-first health workspace so users can calculate body mass index directly from the catalog while seeing clear non-diagnostic caveats.

### Scenario R35-S1: Local BMI calculation

**Given** the BMI calculator receives height and weight inputs
**When** the user runs the calculation
**Then** it returns BMI, category, healthy weight range, input summary, and a reference recommendation without calling a server.

### Scenario R35-S2: BMI workspace surface

**Given** the user opens `/tools/bmi-calculator`
**When** the workspace renders
**Then** it shows body metric inputs, BMI result cards, health reference notes, local-first trust metadata, a Tool details link, and default VitalCalc sample values.

### Scenario R35-S3: Local profile save

**Given** the BMI workspace renders
**When** the user updates inputs and chooses Save profile
**Then** the workspace stores the current profile in localStorage without changing calculation inputs.

### Scenario R35-S4: Responsive design

**Given** the viewport is mobile width
**When** the BMI workspace renders and calculates a result
**Then** the controls and result cards fit within the viewport without framework overlays or page-level horizontal overflow.

## Requirement R36: VitalCalc Detail Batch Expansion 3

### Description

The merged Toolars site must continue importing real VitalCalc finance and health calculators into the public Toolars detail template so users can browse more local-first calculators before full workspaces are rebuilt.

### Scenario R36-S1: Third finance and health batch in registry

**Given** the source VitalCalc site includes finance tools such as Income Tax, FIRE, and Discount calculators plus health tools such as Heart Rate Zone, Sleep, and Ideal Weight calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R36-S2: Third batch public detail data

**Given** the third batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R36-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/income-tax/about`, `/tools/fire-calculator/about`, `/tools/discount-calculator/about`, `/tools/heart-rate-zone/about`, `/tools/sleep-calculator/about`, and `/tools/ideal-weight-calculator/about` are included.

### Scenario R36-S4: Rendered detail page quality

**Given** a user opens one third-batch finance detail and one third-batch health detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R37: VitalCalc Detail Batch Expansion 4

### Description

The merged Toolars site must keep expanding real VitalCalc finance and health calculator coverage with housing, vehicle, and body reference calculators that can use the shared local-first public detail template before full workspaces are rebuilt.

### Scenario R37-S1: Fourth finance and health batch in registry

**Given** the source VitalCalc site includes finance tools such as Car Loan, Rent vs Buy, and Home Affordability calculators plus health tools such as Waist-Hip Ratio, Blood Pressure, and Child Growth calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R37-S2: Fourth batch public detail data

**Given** the fourth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R37-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/car-loan/about`, `/tools/rent-vs-buy/about`, `/tools/home-affordability-calculator/about`, `/tools/waist-hip-ratio/about`, `/tools/blood-pressure/about`, and `/tools/child-growth/about` are included.

### Scenario R37-S4: Rendered detail page quality

**Given** a user opens one fourth-batch finance detail and one fourth-batch health detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R38: VitalCalc Detail Batch Expansion 5

### Description

The merged Toolars site must continue expanding real VitalCalc public details for education finance, savings-growth, and nutrition planning calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R38-S1: Fifth finance and health batch in registry

**Given** the source VitalCalc site includes finance tools such as Student Loan, APY, and Rule of 72 calculators plus health tools such as Calorie Deficit, Macro, and Lean Body Mass calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R38-S2: Fifth batch public detail data

**Given** the fifth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R38-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/student-loan-calculator/about`, `/tools/apy-calculator/about`, `/tools/rule-of-72/about`, `/tools/calorie-deficit/about`, `/tools/macro-calculator/about`, and `/tools/lean-body-mass/about` are included.

### Scenario R38-S4: Rendered detail page quality

**Given** a user opens one fifth-batch finance detail and one fifth-batch health detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R39: VitalCalc Detail Batch Expansion 6

### Description

The merged Toolars site must continue expanding real VitalCalc public details for personal finance planning calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R39-S1: Sixth finance planning batch in registry

**Given** the source VitalCalc site includes finance tools such as Emergency Fund, Savings Goal, DTI, Net Worth, Budget Rule, and Side Income Tax calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R39-S2: Sixth batch public detail data

**Given** the sixth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R39-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/emergency-fund/about`, `/tools/savings-goal/about`, `/tools/dti-calculator/about`, `/tools/net-worth-calculator/about`, `/tools/budget-rule/about`, and `/tools/side-income-tax/about` are included.

### Scenario R39-S4: Rendered detail page quality

**Given** a user opens one sixth-batch savings detail and one sixth-batch tax detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R40: VitalCalc Detail Batch Expansion 7

### Description

The merged Toolars site must continue expanding real VitalCalc public details for fitness, nutrition, and wellness reference calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R40-S1: Seventh health and wellness batch in registry

**Given** the source VitalCalc site includes health tools such as Intermittent Fasting, Creatine, VO2 Max, Biological Age, Glycemic Load, and 30-30-30 Method calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R40-S2: Seventh batch public detail data

**Given** the seventh batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R40-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/intermittent-fasting/about`, `/tools/creatine-calculator/about`, `/tools/vo2-max/about`, `/tools/biological-age/about`, `/tools/glycemic-load/about`, and `/tools/30-30-30-method/about` are included.

### Scenario R40-S4: Rendered detail page quality

**Given** a user opens one seventh-batch fitness detail and one seventh-batch nutrition detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R41: VitalCalc Detail Batch Expansion 8

### Description

The merged Toolars site must continue expanding real VitalCalc public details for everyday utility and personal finance reference calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R41-S1: Eighth utility and everyday finance batch in registry

**Given** the source VitalCalc site includes tools such as Tip, Bill Split, Unit Converter, Hourly to Salary, Inflation, and Habit Cost calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R41-S2: Eighth batch public detail data

**Given** the eighth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R41-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/tip-calculator/about`, `/tools/bill-split-calculator/about`, `/tools/unit-converter/about`, `/tools/hourly-to-salary/about`, `/tools/inflation-calculator/about`, and `/tools/habit-cost/about` are included.

### Scenario R41-S4: Rendered detail page quality

**Given** a user opens one eighth-batch finance detail and one eighth-batch utility detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R42: VitalCalc Detail Batch Expansion 9

### Description

The merged Toolars site must continue expanding real VitalCalc public details for health, nutrition, and lifestyle reference calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R42-S1: Ninth health and lifestyle batch in registry

**Given** the source VitalCalc site includes tools such as Caffeine, Alcohol Metabolism, Blood Sugar, Drink Calories, Fiber Intake, and Steps to Calories calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R42-S2: Ninth batch public detail data

**Given** the ninth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R42-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/caffeine-calculator/about`, `/tools/alcohol-metabolism/about`, `/tools/blood-sugar-calculator/about`, `/tools/drink-calories/about`, `/tools/fiber-intake/about`, and `/tools/steps-to-calories/about` are included.

### Scenario R42-S4: Rendered detail page quality

**Given** a user opens one ninth-batch lifestyle detail and one ninth-batch nutrition detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, clear educational or medical disclaimers where needed, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R43: VitalCalc Detail Batch Expansion 10

### Description

The merged Toolars site must continue expanding real VitalCalc public details for finance utility, exchange-rate, credit, and investment reference calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R43-S1: Tenth finance utility and investment batch in registry

**Given** the source VitalCalc site includes tools such as Currency Converter, Percentage Calculator, Stock Average, Credit Card APR, Investment Fee, and Investment Goal calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R43-S2: Tenth batch public detail data

**Given** the tenth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R43-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/currency-converter/about`, `/tools/percentage-calculator/about`, `/tools/stock-average/about`, `/tools/credit-card-apr/about`, `/tools/investment-fee/about`, and `/tools/investment-goal/about` are included.

### Scenario R43-S4: Rendered detail page quality

**Given** a user opens one tenth-batch exchange-rate detail and one tenth-batch investment detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, clear rate/fee/investment caveats where needed, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R44: VitalCalc Detail Batch Expansion 11

### Description

The merged Toolars site must continue expanding real VitalCalc public details for credit, tax, freelance pricing, subscription, savings, and relocation calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R44-S1: Eleventh life-money batch in registry

**Given** the source VitalCalc site includes tools such as Credit Score Simulator, Crypto Tax, Freelance Rate, Subscription Audit, Savings Challenge, and City Cost Comparison calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R44-S2: Eleventh batch public detail data

**Given** the eleventh batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R44-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/credit-score-simulator/about`, `/tools/crypto-tax/about`, `/tools/freelance-rate/about`, `/tools/subscription-audit/about`, `/tools/savings-challenge/about`, and `/tools/city-cost-comparison/about` are included.

### Scenario R44-S4: Rendered detail page quality

**Given** a user opens one eleventh-batch credit detail and one eleventh-batch relocation or spending detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, clear credit/tax/pricing/relocation caveats where needed, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R45: VitalCalc Detail Batch Expansion 12

### Description

The merged Toolars site must continue expanding real VitalCalc public details for payroll, reinvestment, refinancing, FIRE, SIP, and quit-smoking calculators that can be browsed as local-first Toolars listings before full workspaces are rebuilt.

### Scenario R45-S1: Twelfth finance and lifestyle batch in registry

**Given** the source VitalCalc site includes tools such as China Social Insurance, Dividend Reinvestment, Mortgage Refinance, Coast FIRE, Fund SIP, and Quit Smoking calculators
**When** Toolars builds its merged registry
**Then** those six calculators are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R45-S2: Twelfth batch public detail data

**Given** the twelfth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R45-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/social-insurance-calculator/about`, `/tools/dividend-reinvestment/about`, `/tools/mortgage-refinance-calculator/about`, `/tools/coast-fire/about`, `/tools/sip-calculator/about`, and `/tools/smoke-free/about` are included.

### Scenario R45-S4: Rendered detail page quality

**Given** a user opens one twelfth-batch payroll or housing detail and one twelfth-batch health or lifestyle detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, clear payroll/tax/investment/refinance/health caveats where needed, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R46: VitalCalc Detail Batch Expansion 13

### Description

The merged Toolars site must continue expanding real VitalCalc public details for mental-health screeners and medication eligibility checks that can be browsed as local-first Toolars listings before full interactive workspaces are rebuilt.

### Scenario R46-S1: Thirteenth screening batch in registry

**Given** the source VitalCalc site includes tools such as ADHD Adult Screener, Burnout Assessment, GAD-7 Anxiety, PHQ-9 Depression, PSS-10 Stress, and GLP-1 Eligibility checks
**When** Toolars builds its merged registry
**Then** those six tools are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R46-S2: Thirteenth batch public detail data

**Given** the thirteenth batch tools are registered
**When** Toolars generates public detail data
**Then** each tool uses the shared VitalCalc local calculation template, shows four workflow steps, exposes local trust metadata, includes a VitalCalc source handoff, and has at least two related tools with implemented detail pages.

### Scenario R46-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/adhd-screener/about`, `/tools/burnout-assessment/about`, `/tools/gad7-anxiety/about`, `/tools/phq9-depression/about`, `/tools/pss10-stress/about`, and `/tools/glp1-eligibility/about` are included.

### Scenario R46-S4: Rendered detail page quality

**Given** a user opens one thirteenth-batch mental-health screener detail and one thirteenth-batch eligibility detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local screening or eligibility model, VitalCalc source handoff, Open workspace action, clear screening-only, crisis-support, or prescription-evaluation caveats where needed, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R47: PDF Toolkit and JSON Repair Public Details

### Description

The merged Toolars site must close the remaining high-fidelity public detail gap for PDF Toolkit and JSON Repair so the designed detail pages are reachable at `/tools/{slug}/about` instead of returning 404.

### Scenario R47-S1: Lab and PDF detail data

**Given** the design pack includes PDF Toolkit and JSON Repair public detail pages
**When** Toolars builds its public tool details
**Then** `pdf-toolkit` and `json-repair` are included in the shared detail slug list with four metrics, four workflow steps, trust rows, implementation handoff rows, related tools, and a recommended workflow or collection path.

### Scenario R47-S2: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/pdf-toolkit/about` and `/tools/json-repair/about` are included.

### Scenario R47-S3: Rendered detail page quality

**Given** a user opens the PDF Toolkit or JSON Repair public detail page
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, public listing badges, trust section, implementation handoff, related tools, Open workspace action, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R48: VitalCalc Final Public Detail Coverage

### Description

The merged Toolars site must complete public registry and detail coverage for every real VitalCalc root tool page, including the final body composition, metabolic, reproductive, nutrition, and performance calculators.

### Scenario R48-S1: Final VitalCalc batch in registry

**Given** the source VitalCalc site includes Body Recomposition, GLP-1 Nutrition, HOMA-IR, One Rep Max, Ovulation, Pregnancy Due Date, Running Pace, and Testosterone calculators
**When** Toolars builds its merged registry
**Then** those eight tools are represented as free local VitalCalc tools with `/tools/{slug}` workspace hrefs and `/tools/{slug}/about` detail hrefs.

### Scenario R48-S2: Final VitalCalc detail data

**Given** all 86 VitalCalc root tool pages have been inventoried
**When** Toolars generates public detail data
**Then** every VitalCalc source slug has a matching detail slug, the final eight tools use the shared local calculation template, and related tool cards point only to implemented detail pages.

### Scenario R48-S3: Static about route coverage

**Given** Next.js prebuilds public tool detail routes
**When** static params are generated
**Then** `/tools/body-recomposition/about`, `/tools/glp1-nutrition/about`, `/tools/homa-ir/about`, `/tools/one-rep-max/about`, `/tools/ovulation-calculator/about`, `/tools/pregnancy-due-date/about`, `/tools/running-pace/about`, and `/tools/testosterone-calculator/about` are included.

### Scenario R48-S4: Rendered detail page quality

**Given** a user opens one final-batch performance detail and one final-batch reproductive or metabolic detail
**When** the pages render on desktop and mobile widths
**Then** the pages show the correct title, local calculation model, VitalCalc source handoff, Open workspace action, clear fitness, reproductive-health, metabolic-health, or medical-evaluation caveats where needed, no framework overlay, no console errors, and no page-level horizontal overflow.

## Requirement R49: Core Modals Second Wave

### Description

The merged Toolars site must turn the remaining high-fidelity core modal board actions into real prototype dialogs for sharing, saving collections, signing in, and upgrading.

### Scenario R49-S1: Share modal

**Given** a user is on a public tool detail page
**When** they activate Share
**Then** a modal dialog opens with the current public link, Copy link, and Close actions without navigating away.

### Scenario R49-S2: Save collection modal

**Given** a user is on a collection detail page
**When** they activate Save collection
**Then** a modal dialog opens with workspace destination options, a save action, and a visible saved confirmation state.

### Scenario R49-S3: Sign in modal

**Given** a signed-out user is anywhere in the public shell
**When** they activate Sign in
**Then** a modal dialog opens with email and SSO choices, privacy copy, and a close action.

### Scenario R49-S4: Upgrade modal

**Given** a user sees an Upgrade action in pricing or shell billing surfaces
**When** they activate Upgrade
**Then** a modal dialog opens with the selected plan, included benefits, billing note, and close action.

## Requirement R50: Public Detail Workspace Link Safety

### Description

Every implemented public tool detail page must have a reachable workspace route. Dedicated interactive workspaces should continue to win for rebuilt tools, while the remaining source-backed listings must land on a consistent workspace handoff instead of returning 404.

### Scenario R50-S1: Static workspace route coverage

**Given** Toolars has public detail data for Lab and VitalCalc tools
**When** Next.js prebuilds tool workspace routes
**Then** `/tools/{slug}` static params include every slug from `allDetailSlugs`, including VitalCalc listings that do not yet have dedicated interactive workspace pages.

### Scenario R50-S2: VitalCalc workspace handoff

**Given** a user opens a source-backed VitalCalc tool such as `/tools/loan-calculator`
**When** the generic workspace route renders
**Then** it shows the tool name, local calculation model, VitalCalc source handoff, metrics, related tools, Tool details link, and a clear full-calculator readiness path.

### Scenario R50-S3: Lab and category shell context

**Given** a user opens a Lab or PDF public detail workspace route without a more specific page
**When** the generic workspace shell resolves the detail data
**Then** it selects AI Developer Lab navigation for Lab tools, PDF navigation for PDF tools, and Explore navigation for other local-first tools without changing existing dedicated workspace pages.

## Requirement R51: High-Traffic VitalCalc Interactive Workspaces

### Description

The highest-traffic VitalCalc fallback pages must be promoted into real local interactive workspaces while keeping the Toolars workspace design contract: context, inputs, calculated output, review notes, local storage, and detail handoff.

### Scenario R51-S1: Loan Calculator workspace

**Given** the user opens `/tools/loan-calculator`
**When** they calculate the default principal, APR, and term
**Then** Toolars shows monthly payment, total interest, total repayment, first-year amortization, local trust notes, and a Tool details link.

### Scenario R51-S2: Pregnancy Due Date workspace

**Given** the user opens `/tools/pregnancy-due-date`
**When** they calculate from last menstrual period and cycle length
**Then** Toolars shows estimated due date, conception estimate, current gestational week, trimester, days remaining, pregnancy progress, medical caveats, and a Tool details link.

### Scenario R51-S3: Compound Interest workspace

**Given** the user opens `/tools/compound-interest`
**When** they calculate initial investment, monthly contribution, annual return, and years
**Then** Toolars shows future value, total contributions, interest earned, year-one growth, investment caveats, and a Tool details link.

### Scenario R51-S4: TDEE Calculator workspace

**Given** the user opens `/tools/tdee-calculator`
**When** they calculate from BMR and activity level
**Then** Toolars shows TDEE, activity burn, fat-loss target, muscle-gain target, nutrition planning caveats, and a Tool details link.

### Scenario R51-S5: Responsive and fallback replacement quality

**Given** any of the promoted VitalCalc routes renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R52: Health Nutrition VitalCalc Interactive Workspaces

### Description

The next high-value health and nutrition VitalCalc fallback pages must become real local interactive workspaces with source-backed formulas, private browser-state inputs, clearly labeled reference caveats, local save actions, and public detail handoff.

### Scenario R52-S1: BMR Calculator workspace

**Given** the user opens `/tools/bmr-calculator`
**When** they calculate from sex, age, height, and weight
**Then** Toolars uses the VitalCalc Mifflin-St Jeor formula and shows BMR, maintain calories, loss target, gain target, formula notes, and a Tool details link.

### Scenario R52-S2: Body Fat Calculator workspace

**Given** the user opens `/tools/body-fat-calculator`
**When** they calculate from sex, height, neck, waist, hip, and weight
**Then** Toolars uses the VitalCalc US Navy circumference formula and shows body fat percentage, category, fat mass, lean mass, measurement caveats, and a Tool details link.

### Scenario R52-S3: Protein Calculator workspace

**Given** the user opens `/tools/protein-calculator`
**When** they calculate from weight and selected activity or goal factor
**Then** Toolars shows daily protein grams, per-meal target, egg equivalent, chicken breast equivalent, nutrition caveats, and a Tool details link.

### Scenario R52-S4: Water Intake Calculator workspace

**Given** the user opens `/tools/water-intake`
**When** they calculate from weight, activity multiplier, and climate adjustment
**Then** Toolars shows total daily water target, cup equivalent, base need, activity extra, climate extra, hydration caveats, and a Tool details link.

### Scenario R52-S5: Source-backed real workspace quality

**Given** any promoted health or nutrition route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R53: Nutrition Planning VitalCalc Interactive Workspaces

### Description

The next nutrition and body-composition VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical planning outputs, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R53-S1: Calorie Deficit workspace

**Given** the user opens `/tools/calorie-deficit`
**When** they calculate from current weight, target weight, TDEE, and weekly loss pace
**Then** Toolars uses the VitalCalc 7,700 kcal/kg deficit rule and shows daily intake, daily deficit, estimated weeks, fat to lose, safety message, and a Tool details link.

### Scenario R53-S2: Macro Calculator workspace

**Given** the user opens `/tools/macro-calculator`
**When** they calculate from daily calories, weight, and diet goal preset
**Then** Toolars uses the VitalCalc macro preset percentages and 4/4/9 kcal/g conversion to show protein grams, carbohydrate grams, fat grams, percentages, nutrition notes, and a Tool details link.

### Scenario R53-S3: Lean Body Mass workspace

**Given** the user opens `/tools/lean-body-mass`
**When** they calculate from weight and body fat percentage
**Then** Toolars shows lean body mass, fat mass, lean mass ratio, body composition caveats, and a Tool details link.

### Scenario R53-S4: Body Recomposition workspace

**Given** the user opens `/tools/body-recomposition`
**When** they calculate from sex, age, height, weight, activity, and recomposition goal
**Then** Toolars uses the VitalCalc BMR/TDEE, deficit, protein, fat, and carbohydrate split to show target calories, TDEE, macro grams, macro percentages, recomp caveats, and a Tool details link.

### Scenario R53-S5: Nutrition workspace quality

**Given** any promoted nutrition planning route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R54: Finance Planning VitalCalc Interactive Workspaces

### Description

The next finance planning VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical planning outputs, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R54-S1: Emergency Fund workspace

**Given** the user opens `/tools/emergency-fund`
**When** they calculate from monthly expenses, coverage months, current savings, and target timeline
**Then** Toolars uses the VitalCalc target, gap, monthly savings, and progress formula to show emergency fund target, savings gap, monthly savings needed, current progress, planning notes, and a Tool details link.

### Scenario R54-S2: Savings Goal workspace

**Given** the user opens `/tools/savings-goal`
**When** they calculate from goal amount, current savings, monthly savings, and annual return rate
**Then** Toolars uses the VitalCalc month-by-month savings loop to show months to goal, total contributions, interest earned, final amount, planning notes, and a Tool details link.

### Scenario R54-S3: Debt Payoff workspace

**Given** the user opens `/tools/debt-payoff`
**When** they calculate from debt balance, annual interest rate, monthly payment, and payoff strategy
**Then** Toolars uses the VitalCalc monthly interest and principal payoff loop to show payoff months, total interest, total paid, payoff message, first-month breakdown, strategy notes, and a Tool details link.

### Scenario R54-S4: Retirement Calculator workspace

**Given** the user opens `/tools/retirement-calculator`
**When** they calculate from current age, retirement age, current savings, monthly contribution, annual return, and retirement expenses
**Then** Toolars uses the VitalCalc 4% rule and monthly compounding formula to show nest egg needed, projected savings, gap or surplus, years to retirement, first-year projection, planning notes, and a Tool details link.

### Scenario R54-S5: Finance planning workspace quality

**Given** any promoted finance planning route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R55: Finance Ratio And Yield VitalCalc Interactive Workspaces

### Description

The next finance ratio and yield VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical planning outputs, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R55-S1: Net Worth workspace

**Given** the user opens `/tools/net-worth-calculator`
**When** they calculate from asset and liability categories
**Then** Toolars uses the VitalCalc total assets minus total liabilities formula to show net worth, total assets, total liabilities, debt-to-asset ratio, financial health message, planning notes, and a Tool details link.

### Scenario R55-S2: Budget Rule workspace

**Given** the user opens `/tools/budget-rule`
**When** they calculate from monthly income and needs, wants, and savings percentages
**Then** Toolars uses the VitalCalc percentage allocation model to show needs amount, wants amount, savings amount, total percentage health, budget notes, and a Tool details link.

### Scenario R55-S3: DTI Calculator workspace

**Given** the user opens `/tools/dti-calculator`
**When** they calculate from gross monthly income, mortgage payment, other monthly debt, and housing add-ons
**Then** Toolars uses the VitalCalc front-end and back-end DTI formula to show housing DTI, total DTI, total monthly payments, disposable income, qualification guidance, and a Tool details link.

### Scenario R55-S4: APY Calculator workspace

**Given** the user opens `/tools/apy-calculator`
**When** they calculate from APR, compounding frequency, and optional principal
**Then** Toolars uses the VitalCalc APY formula to show effective APY, APR, one-year balance, interest earned, comparison rows across compounding frequencies, and a Tool details link.

### Scenario R55-S5: Finance ratio and yield workspace quality

**Given** any promoted finance ratio or yield route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R56: Everyday Finance And Utility VitalCalc Interactive Workspaces

### Description

The next everyday finance and utility VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical outputs, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R56-S1: Tip Calculator workspace

**Given** the user opens `/tools/tip-calculator`
**When** they calculate from bill amount, tip percentage, and people count
**Then** Toolars uses the VitalCalc bill times tip percentage formula to show original bill, tip amount, total bill, per-person share, tipping notes, and a Tool details link.

### Scenario R56-S2: Bill Split Calculator workspace

**Given** the user opens `/tools/bill-split-calculator`
**When** they calculate from subtotal, people, tip percentage, tax percentage, and split mode
**Then** Toolars uses the VitalCalc subtotal plus tip and tax model to show subtotal, fees, grand total, equal split amount, split mode guidance, and a Tool details link.

### Scenario R56-S3: Unit Converter workspace

**Given** the user opens `/tools/unit-converter`
**When** they convert a value between source and target units
**Then** Toolars uses the VitalCalc unit factor model and temperature base conversion rules to show converted value, target unit, formula note, quick reference values, category context, and a Tool details link.

### Scenario R56-S4: Hourly to Salary workspace

**Given** the user opens `/tools/hourly-to-salary`
**When** they calculate from hourly rate, regular hours, weeks per year, overtime hours, and overtime multiplier
**Then** Toolars uses the VitalCalc gross pay formula to show annual salary, monthly salary, weekly salary, overtime pay, gross-pay assumptions, and a Tool details link.

### Scenario R56-S5: Everyday utility workspace quality

**Given** any promoted everyday finance or utility route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R57: Purchasing Power Tax And Percent VitalCalc Interactive Workspaces

### Description

The next purchasing power, tax, and percentage VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical planning outputs, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R57-S1: Inflation Calculator workspace

**Given** the user opens `/tools/inflation-calculator`
**When** they calculate from current amount, annual inflation rate, and years
**Then** Toolars uses the VitalCalc purchasing-power formula to show future purchasing power, original amount, cumulative inflation, purchasing-power loss, break-even return, assumption notes, and a Tool details link.

### Scenario R57-S2: Habit Cost workspace

**Given** the user opens `/tools/habit-cost`
**When** they calculate from cost per occurrence, frequency per week, years, and annual return assumption
**Then** Toolars uses the VitalCalc weekly-cost and ordinary-annuity model to show total spent, future value, investment gain, opportunity cost, reflection notes, and a Tool details link.

### Scenario R57-S3: Income Tax workspace

**Given** the user opens `/tools/income-tax`
**When** they calculate from monthly salary, flat tax rate, deductions, and extra withheld amount
**Then** Toolars uses the VitalCalc simplified flat-rate tax estimate to show net income, gross income, tax, deductions, annual summary, effective rate, no-advice caveat, and a Tool details link.

### Scenario R57-S4: Percentage Calculator workspace

**Given** the user opens `/tools/percentage-calculator`
**When** they calculate percent-of, ratio percentage, or percentage change
**Then** Toolars uses the VitalCalc percentage formulas to show the selected calculation result, formula context, direction of change, denominator notes, and a Tool details link.

### Scenario R57-S5: Purchasing power tax and percent workspace quality

**Given** any promoted purchasing power, tax, or percent route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R58: Shopping FX And Credit VitalCalc Interactive Workspaces

### Description

The next shopping, foreign-exchange, investment cost-basis, and credit-cost VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical outputs, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R58-S1: Discount Calculator workspace

**Given** the user opens `/tools/discount-calculator`
**When** they calculate from original price, discount percentage, and optional tax percentage
**Then** Toolars uses the VitalCalc checkout formula to show original price, discount amount, tax amount, final price, savings summary, checkout notes, and a Tool details link.

### Scenario R58-S2: Currency Converter workspace

**Given** the user opens `/tools/currency-converter`
**When** they convert from an amount, source currency, target currency, and user-entered exchange rate
**Then** Toolars uses the VitalCalc manual exchange-rate formula to show converted amount, currency pair, rate display, source amount, rate freshness notes, and a Tool details link.

### Scenario R58-S3: Stock Average workspace

**Given** the user opens `/tools/stock-average`
**When** they calculate from multiple purchase lots with shares and price per share
**Then** Toolars uses the VitalCalc total-cost divided by total-shares formula to show average cost, total shares, total cost, breakeven price, cost-basis notes, and a Tool details link.

### Scenario R58-S4: Credit Card APR workspace

**Given** the user opens `/tools/credit-card-apr`
**When** they calculate from installment amount, number of payments, and monthly fee rate
**Then** Toolars uses the VitalCalc installment IRR model to show estimated APR, nominal total rate, total fees, total payment, financing-cost guidance, and a Tool details link.

### Scenario R58-S5: Shopping FX and credit workspace quality

**Given** any promoted shopping, FX, investment, or credit route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R59: Investment Planning VitalCalc Interactive Workspaces

### Description

The next investment-planning VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose scenario assumptions, support local save actions, and keep the Toolars local-first / no-advice review pattern.

### Scenario R59-S1: Investment Fee workspace

**Given** the user opens `/tools/investment-fee`
**When** they calculate from initial investment, monthly contribution, expected annual return, investment period, and annual management fee
**Then** Toolars uses the VitalCalc fee-drag formula to show no-fee ending value, with-fee ending value, total fees eroded, total invested, fee impact percentages, fee caveats, and a Tool details link.

### Scenario R59-S2: Investment Goal workspace

**Given** the user opens `/tools/investment-goal`
**When** they calculate from goal amount, starting balance, annual return, and years to goal
**Then** Toolars uses the VitalCalc future-value annuity formula to show required monthly investment, total invested, projected starting-balance growth, goal gap, schedule context, market-return caveats, and a Tool details link.

### Scenario R59-S3: ROI Calculator workspace

**Given** the user opens `/tools/roi-calculator`
**When** they calculate from investment cost and final value
**Then** Toolars uses the VitalCalc ROI formula to show ROI percentage, net profit or loss, input values, result tone, comparison caveats, and a Tool details link.

### Scenario R59-S4: Rule of 72 workspace

**Given** the user opens `/tools/rule-of-72`
**When** they calculate from annual return rate and starting principal
**Then** Toolars uses the VitalCalc Rule of 72 shortcut and exact compound-growth formula to show approximate doubling time, exact doubling time, doubled value, reverse 10-year rate, growth schedule context, shortcut caveats, and a Tool details link.

### Scenario R59-S5: Investment planning workspace quality

**Given** any promoted investment planning route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R60: Work Income And Relocation VitalCalc Interactive Workspaces

### Description

The next work, tax, payroll, and relocation VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical review outputs, support local save actions, and keep the Toolars local-first / no-advice pattern. The roadmap's Salary Calculator item maps to the already-completed R56 `hourly-to-salary` workspace, so this slice promotes the adjacent `city-cost-comparison` source tool to keep a four-workspace batch.

### Scenario R60-S1: Freelance Rate workspace

**Given** the user opens `/tools/freelance-rate`
**When** they calculate from target annual income, paid vacation, weekly hours, non-billable ratio, tax rate, insurance, operating costs, and location factor
**Then** Toolars uses the VitalCalc billable-hour pricing formula to show hourly rate, daily rate, project rate, premium rate, revenue target, billable hours, pricing caveats, and a Tool details link.

### Scenario R60-S2: Side Income Tax workspace

**Given** the user opens `/tools/side-income-tax`
**When** they calculate from W-2 salary, side income, business expenses, retirement contribution, filing status, and state tax rate
**Then** Toolars uses the VitalCalc self-employment tax and progressive federal tax model to show self-employment tax, federal plus state tax, effective rate, quarterly payment, tax caveats, and a Tool details link.

### Scenario R60-S3: City Cost Comparison workspace

**Given** the user opens `/tools/city-cost-comparison`
**When** they compare monthly income and city-by-city rent, food, transport, and entertainment costs
**Then** Toolars uses the VitalCalc simplified federal tax and monthly surplus formula to show City A surplus, City B surplus, annual difference, lower-cost scenario guidance, relocation caveats, and a Tool details link.

### Scenario R60-S4: Social Insurance Calculator workspace

**Given** the user opens `/tools/social-insurance-calculator`
**When** they calculate from monthly pre-tax salary, housing fund rate, and optional contribution base limits
**Then** Toolars uses the VitalCalc five-insurances, housing-fund, and China individual tax formulas to show net salary, employee contribution, employer contribution, housing-fund deposit, tax, contribution breakdown, policy caveats, and a Tool details link.

### Scenario R60-S5: Work income and relocation workspace quality

**Given** any promoted work income or relocation route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R61: FIRE Housing And Auto VitalCalc Interactive Workspaces

### Description

The next FIRE, auto-loan, and housing-decision VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical planning outputs, support local save actions, and keep the Toolars local-first / no-advice review pattern.

### Scenario R61-S1: FIRE Calculator workspace

**Given** the user opens `/tools/fire-calculator`
**When** they calculate from annual expenses, annual income, current net worth, and expected annual return
**Then** Toolars uses the VitalCalc 25x-expenses target and yearly compounding loop to show FIRE number, savings rate, annual savings, years to FIRE, projected balance, guidance message, and a Tool details link.

### Scenario R61-S2: Coast FIRE workspace

**Given** the user opens `/tools/coast-fire`
**When** they calculate from current age, retirement age, current assets, annual expenses, return rate, and withdrawal rate
**Then** Toolars uses the VitalCalc FIRE target and Coast FIRE present-value formula to show traditional FIRE target, Coast FIRE target, progress, surplus or gap, status guidance, and a Tool details link.

### Scenario R61-S3: Car Loan workspace

**Given** the user opens `/tools/car-loan`
**When** they calculate from vehicle price, down payment percent, annual interest rate, and term
**Then** Toolars uses the VitalCalc equal-installment loan formula to show monthly payment, loan amount, total interest, total payment, down payment, true cost, ownership caveats, and a Tool details link.

### Scenario R61-S4: Rent vs Buy workspace

**Given** the user opens `/tools/rent-vs-buy`
**When** they compare home price, down payment, mortgage rate, holding cost, rent, investment return, and analysis period
**Then** Toolars uses the VitalCalc buy-cost and rent-cost formulas to show recommendation, buying cost, renting cost, monthly mortgage, opportunity cost, scenario caveats, and a Tool details link.

### Scenario R61-S5: FIRE housing and auto workspace quality

**Given** any promoted FIRE, housing, or auto route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R62: Real Estate Debt And Credit VitalCalc Interactive Workspaces

### Description

The next real-estate, education-loan, refinancing, and credit-score VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical review outputs, support local save actions, and keep the Toolars local-first / no-advice review pattern. The earlier roadmap candidate `mortgage-payoff` is not present in the current VitalCalc source or Toolars registry, so this slice promotes the source-backed `credit-score-simulator` instead.

### Scenario R62-S1: Home Affordability workspace

**Given** the user opens `/tools/home-affordability-calculator`
**When** they calculate from monthly after-tax income, existing monthly debt, down payment ratio, mortgage rate, loan term, and DTI limit
**Then** Toolars uses the VitalCalc reverse mortgage affordability formula to show max affordable price, monthly payment, loan amount, down payment, DTI ratio, affordability guidance, and a Tool details link.

### Scenario R62-S2: Student Loan workspace

**Given** the user opens `/tools/student-loan-calculator`
**When** they calculate from loan amount, annual interest rate, repayment term, and grace period
**Then** Toolars uses the VitalCalc fixed-rate payment formula and yearly amortization loop to show monthly payment, total interest, total repayment, first-year payoff context, grace-period note, repayment caveats, and a Tool details link.

### Scenario R62-S3: Mortgage Refinance workspace

**Given** the user opens `/tools/mortgage-refinance-calculator`
**When** they compare current balance, current rate, remaining term, new rate, new term, and refinancing costs
**Then** Toolars uses the VitalCalc payment, total-interest, savings, and break-even formulas to show monthly savings, old payment, new payment, total interest saved net of costs, break-even months, recommendation status, refinance caveats, and a Tool details link.

### Scenario R62-S4: Credit Score Simulator workspace

**Given** the user opens `/tools/credit-score-simulator`
**When** they simulate a credit action from current score, credit limit, balance, and action type
**Then** Toolars uses the VitalCalc utilization and action-weight model to show simulated score, score change, current utilization, new utilization, rating, score range context, education caveats, and a Tool details link.

### Scenario R62-S5: Real estate debt and credit workspace quality

**Given** any promoted real estate, education loan, refinance, or credit route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R63: Finance Operations VitalCalc Interactive Workspaces

### Description

The next subscription, savings challenge, dividend reinvestment, and systematic investment VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose practical review outputs, support local save actions, and keep the Toolars local-first / no-advice review pattern.

### Scenario R63-S1: Subscription Audit workspace

**Given** the user opens `/tools/subscription-audit`
**When** they calculate from a local list of subscriptions with cost, frequency, and category
**Then** Toolars uses the VitalCalc monthly-cost normalization formula to show monthly spend, yearly spend, subscription count, average monthly cost, category breakdown, savings tips, and a Tool details link.

### Scenario R63-S2: Savings Challenge workspace

**Given** the user opens `/tools/savings-challenge`
**When** they calculate a 52-week, envelope, no-spend, or reverse savings challenge
**Then** Toolars uses the VitalCalc challenge formulas to show total savings, average or duration, per-period amount, progress schedule context, challenge caveats, and a Tool details link.

### Scenario R63-S3: Dividend Reinvestment workspace

**Given** the user opens `/tools/dividend-reinvestment`
**When** they calculate from initial investment, dividend yield, stock growth, holding period, reinvestment frequency, and tax rate
**Then** Toolars uses the VitalCalc DRIP compounding loop to show final value, total dividends, no-reinvestment comparison, reinvestment advantage, tax caveats, and a Tool details link.

### Scenario R63-S4: Fund SIP workspace

**Given** the user opens `/tools/sip-calculator`
**When** they calculate from monthly investment, expected annual return, investment duration, and initial principal
**Then** Toolars uses the VitalCalc monthly annuity future-value formula to show total portfolio value, total invested, investment returns, return rate, yearly schedule context, market caveats, and a Tool details link.

### Scenario R63-S5: Finance operations workspace quality

**Given** any promoted subscription, savings, dividend, or SIP route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R64: Health Body Metrics VitalCalc Interactive Workspaces

### Description

The next body-measurement, blood-pressure, child-growth, and blood-sugar VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose medical-reference caveats, support local save actions, and keep the Toolars local-first / not-a-diagnosis review pattern.

### Scenario R64-S1: Waist-Hip Ratio workspace

**Given** the user opens `/tools/waist-hip-ratio`
**When** they calculate from sex, waist circumference, and hip circumference
**Then** Toolars uses the VitalCalc waist divided by hip formula and WHO-style sex-specific thresholds to show waist-to-hip ratio, risk category, measurement recap, health caveats, and a Tool details link.

### Scenario R64-S2: Blood Pressure workspace

**Given** the user opens `/tools/blood-pressure`
**When** they calculate from systolic and diastolic readings
**Then** Toolars uses the VitalCalc ACC/AHA category thresholds to show reading, category, threshold reason, recommendation copy, measurement caveats, and a Tool details link.

### Scenario R64-S3: Child Growth workspace

**Given** the user opens `/tools/child-growth`
**When** they calculate from child sex, age, height, and weight
**Then** Toolars uses the VitalCalc BMI and percentile approximation formula to show BMI, percentile, category, percentile rank, ideal-weight reference, pediatric caveats, and a Tool details link.

### Scenario R64-S4: Blood Sugar / A1C workspace

**Given** the user opens `/tools/blood-sugar-calculator`
**When** they calculate from fasting glucose, A1C, or estimated average glucose
**Then** Toolars uses the VitalCalc A1C / estimated-average-glucose conversion formulas and WHO/ADA reference bands to show equivalent values, risk band, source unit context, medical caveats, and a Tool details link.

### Scenario R64-S5: Health body metrics workspace quality

**Given** any promoted body metrics or lab-reference route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors, and has no page-level horizontal overflow.

## Requirement R65: Lifestyle And Safety VitalCalc Interactive Workspaces

### Description

The next lifestyle, safety, and behavior-change VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose legal / medical / safety caveats, support local save actions, and keep the Toolars local-first review pattern.

### Scenario R65-S1: Crypto Tax workspace

**Given** the user opens `/tools/crypto-tax`
**When** they calculate from buy transactions, sell transactions, and current price
**Then** Toolars uses the VitalCalc average cost-basis model to show average cost, realized PnL, unrealized PnL, remaining quantity, tax caveats, and a Tool details link.

### Scenario R65-S2: Smoke-Free workspace

**Given** the user opens `/tools/smoke-free`
**When** they calculate from quit date, cigarettes per day, pack size, and pack price
**Then** Toolars uses the VitalCalc elapsed-day, savings, cigarettes-avoided, life-extension, and recovery-milestone logic to show progress, health caveats, and a Tool details link.

### Scenario R65-S3: Caffeine Calculator workspace

**Given** the user opens `/tools/caffeine-calculator`
**When** they calculate from body weight, pregnancy status, and selected drink sources
**Then** Toolars uses the VitalCalc 5.7 mg/kg, 400 mg adult cap, 200 mg pregnancy cap, and drink-reference values to show safe limit, consumed caffeine, remaining allowance, timing caveats, and a Tool details link.

### Scenario R65-S4: Alcohol Metabolism workspace

**Given** the user opens `/tools/alcohol-metabolism`
**When** they calculate from sex, weight, drink type, quantity, drinking duration, and stomach state
**Then** Toolars uses the VitalCalc drink table, Widmark-style estimate, metabolism-rate timeline, impairment bands, safety caveats, and a Tool details link.

### Scenario R65-S5: Lifestyle and safety workspace quality

**Given** any promoted crypto, smoking, caffeine, or alcohol route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, and has no page-level horizontal overflow.

## Requirement R66: Lab And Nutrition VitalCalc Interactive Workspaces

### Description

The next lab-reference and nutrition VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose diet / lab interpretation caveats, support versioned local save actions, and keep the Toolars local-first review pattern.

### Scenario R66-S1: Glycemic Load workspace

**Given** the user opens `/tools/glycemic-load`
**When** they calculate from food GI, carbohydrate density, and serving size
**Then** Toolars uses the VitalCalc `GI × carbs per serving / 100` model to show glycemic load, GL category, total carbs, blood-sugar impact, nutrition caveats, and a Tool details link.

### Scenario R66-S2: HOMA-IR workspace

**Given** the user opens `/tools/homa-ir`
**When** they calculate from fasting glucose and fasting insulin with selectable units
**Then** Toolars uses the VitalCalc glucose / insulin conversions and HOMA-IR formula to show HOMA-IR value, resistance range, interpretation copy, lab caveats, and a Tool details link.

### Scenario R66-S3: Drink Calories workspace

**Given** the user opens `/tools/drink-calories`
**When** they calculate from drink type, serving size, and cups per day
**Then** Toolars uses the VitalCalc beverage calorie and sugar reference table to show total liquid calories, sugar grams, steps-to-burn estimate, daily calorie percentage, intake caveats, and a Tool details link.

### Scenario R66-S4: Fiber Intake workspace

**Given** the user opens `/tools/fiber-intake`
**When** they calculate from weight, age, sex, and optional current fiber intake
**Then** Toolars uses the VitalCalc weight-based recommendation and age / sex adjustments to show daily fiber target, recommended range, intake progress, food-source references, gut-health caveats, and a Tool details link.

### Scenario R66-S5: Lab and nutrition workspace quality

**Given** any promoted glycemic, insulin, beverage, or fiber route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, versioned local save works, and has no page-level horizontal overflow.

## Requirement R67: Training And Reproductive Health VitalCalc Interactive Workspaces

### Description

The next training, race planning, reproductive-health, and sports supplement VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose safety / health caveats, support versioned local save actions, and keep the Toolars local-first review pattern.

### Scenario R67-S1: One Rep Max workspace

**Given** the user opens `/tools/one-rep-max`
**When** they calculate from working weight and completed reps
**Then** Toolars uses the VitalCalc Epley formula to show estimated 1RM, percentage-based working sets, high-rep accuracy caveats, and a Tool details link.

### Scenario R67-S2: Running Pace workspace

**Given** the user opens `/tools/running-pace`
**When** they calculate from target race distance and finish time
**Then** Toolars uses the VitalCalc pace math and Riegel equivalent-performance formula to show pace per km, pace per mile, speed, 400m split, equivalent times, race-condition caveats, and a Tool details link.

### Scenario R67-S3: Ovulation workspace

**Given** the user opens `/tools/ovulation-calculator`
**When** they calculate from last period date, cycle length, and period duration
**Then** Toolars uses the VitalCalc next-period-minus-14 ovulation model to show ovulation date, fertile window, next period, safe-period reference, reproductive-health caveats, and a Tool details link.

### Scenario R67-S4: Creatine workspace

**Given** the user opens `/tools/creatine-calculator`
**When** they calculate from body weight, unit, training intensity, vegetarian context, and loading preference
**Then** Toolars uses the VitalCalc 0.03g/kg maintenance model, 3-5g cap, intense / vegetarian adjustment, optional 20g loading phase, hydration guidance, supplement caveats, and a Tool details link.

### Scenario R67-S5: Training and reproductive health workspace quality

**Given** any promoted 1RM, running pace, ovulation, or creatine route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, versioned local save works, and has no page-level horizontal overflow.

## Requirement R68: Cardio Hormone And Fasting VitalCalc Interactive Workspaces

### Description

The next cardio-fitness, training-zone, hormone-reference, and intermittent-fasting VitalCalc fallback pages must become real local interactive workspaces that preserve source formulas, expose medical / training caveats, support versioned local save actions, and keep the Toolars local-first review pattern.

### Scenario R68-S1: VO2 Max workspace

**Given** the user opens `/tools/vo2-max`
**When** they calculate by Cooper 12-minute run distance or resting heart rate method
**Then** Toolars uses the VitalCalc Cooper formula `(distance(m) - 504.9) / 44.73`, female multiplier `0.85`, and resting-HR formula `15.3 * (208 - 0.7 * age) / restingHR` to show VO2 Max, cardio fitness level, reference bands, training caveats, and a Tool details link.

### Scenario R68-S2: Heart Rate Zone workspace

**Given** the user opens `/tools/heart-rate-zone`
**When** they calculate from age and resting heart rate
**Then** Toolars uses the VitalCalc Karvonen model `Target HR = Resting HR + (220 - age - resting HR) * intensity` to show maximum heart rate, heart-rate reserve, five training zones, measurement caveats, and a Tool details link.

### Scenario R68-S3: Testosterone workspace

**Given** the user opens `/tools/testosterone-calculator`
**When** they calculate from total testosterone, SHBG, albumin, units, and sex
**Then** Toolars uses the VitalCalc source conversion and free / bioavailable testosterone estimate, including the source clamp to zero, to show free testosterone, bioavailable testosterone, free percentage, sex-specific reference status, medical caveats, and a Tool details link.

### Scenario R68-S4: Intermittent Fasting workspace

**Given** the user opens `/tools/intermittent-fasting`
**When** they calculate from fasting protocol and last-meal time
**Then** Toolars uses the VitalCalc protocol windows for 16:8, 18:6, 20:4, 14:10, OMAD, and 5:2 to show next meal time, fasting hours, eating window, fasting window, timeline notes, contraindication caveats, and a Tool details link.

### Scenario R68-S5: Cardio, hormone, and fasting workspace quality

**Given** any promoted VO2, heart-rate-zone, testosterone, or intermittent-fasting route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, versioned local save works, and has no page-level horizontal overflow.

## Requirement R69: Sleep Body And Activity VitalCalc Interactive Workspaces

### Description

The next sleep, body-reference, activity-burn, and biological-age VitalCalc fallback pages must become real local interactive workspaces that preserve source models, expose health caveats, support versioned local save actions, and keep the Toolars local-first review pattern.

### Scenario R69-S1: Sleep Calculator workspace

**Given** the user opens `/tools/sleep-calculator`
**When** they calculate from a wake-up time or bedtime, sleep latency, cycle length, caffeine cutoff, and screen cutoff
**Then** Toolars uses the VitalCalc 90-minute-cycle model with 6 / 5 / 4 / 3 cycle options to show the recommended primary time, alternate times, caffeine / screen / dinner / light tips, sleep-cycle caveats, and a Tool details link.

### Scenario R69-S2: Ideal Weight workspace

**Given** the user opens `/tools/ideal-weight-calculator`
**When** they calculate from sex and height
**Then** Toolars uses the VitalCalc Devine formula `male: 50 + 0.91 * (heightCm - 152.4)`, `female: 45.5 + 0.91 * (heightCm - 152.4)` to show ideal weight, +/-10% healthy range, body-composition caveats, and a Tool details link.

### Scenario R69-S3: Steps To Calories workspace

**Given** the user opens `/tools/steps-to-calories`
**When** they calculate from steps, weight, height, and walking speed
**Then** Toolars uses the VitalCalc stride coefficient `height * 0.414 / 100`, MET table, walking-speed table, and food-equivalent table to show calories burned, distance, rice / soda / burger equivalents, 10,000-step burn estimate, and a Tool details link; the source stride distance is normalized from meters to kilometers so the result matches the source FAQ calorie range.

### Scenario R69-S4: Biological Age workspace

**Given** the user opens `/tools/biological-age`
**When** they calculate from chronological age, BMI, systolic BP, exercise, sleep, smoking, alcohol, and stress
**Then** Toolars uses the VitalCalc lifestyle delta scoring model to show estimated biological age, age difference status, improvement tips, entertainment / medical-test caveats, and a Tool details link.

### Scenario R69-S5: Sleep, body, and activity workspace quality

**Given** any promoted sleep, ideal-weight, steps, or biological-age route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, versioned local save works, and has no page-level horizontal overflow.

## Requirement R70: Health Sensitive VitalCalc Interactive Workspaces

### Description

The next health-sensitive VitalCalc fallback pages must become real local interactive workspaces that preserve source scoring / calculator models, expose stronger medical and screening caveats, support versioned local save actions, and keep the Toolars local-first review pattern.

### Scenario R70-S1: 30-30-30 Method workspace

**Given** the user opens `/tools/30-30-30-method`
**When** they calculate from weight, age, sex context, and low-intensity activity choice
**Then** Toolars uses the VitalCalc `MET * weightKg * 0.5` 30-minute burn model, fixed 30g protein target, activity tip table, protein pairing ideas, nutrition caveats, and a Tool details link.

### Scenario R70-S2: GLP-1 Eligibility workspace

**Given** the user opens `/tools/glp1-eligibility`
**When** they calculate from height, weight, and weight-related comorbidity checkboxes
**Then** Toolars uses the VitalCalc BMI model and common BMI threshold logic `BMI >= 30` or `BMI >= 27 plus comorbidity` to show BMI, BMI category, criteria match, medication-discussion notes, clinician-review caveats, and a Tool details link.

### Scenario R70-S3: GLP-1 Nutrition workspace

**Given** the user opens `/tools/glp1-nutrition`
**When** they calculate from weight, height, age, sex, medication context, and activity level
**Then** Toolars uses the VitalCalc Mifflin-St Jeor BMR, `TDEE * 0.75` calorie-floor model with sex-specific minimums, `1.4g/kg` protein, `35ml/kg` water plus activity adjustment, fiber floor, medication caveats, and a Tool details link.

### Scenario R70-S4: GAD-7 Anxiety workspace

**Given** the user opens `/tools/gad7-anxiety`
**When** they answer the 7 GAD-7 frequency questions
**Then** Toolars scores all answers locally, maps the total to the VitalCalc minimal / mild / moderate / severe bands, shows support guidance and screening limits, and includes a Tool details link.

### Scenario R70-S5: Health-sensitive workspace quality

**Given** any promoted 30-30-30, GLP-1, or GAD-7 route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, versioned local save works, no page-level horizontal overflow, and copy clearly says outputs are educational / screening references rather than diagnosis, prescription, or medical nutrition advice.

## Requirement R71: Mental Health Screener VitalCalc Interactive Workspaces

### Description

The remaining high-value mental-health VitalCalc fallback pages must become real local interactive workspaces that preserve source screening scores, show dimensional breakdowns where the source does, expose crisis / professional-evaluation caveats, support versioned local save actions, and keep the Toolars local-first review pattern.

### Scenario R71-S1: PHQ-9 Depression workspace

**Given** the user opens `/tools/phq9-depression`
**When** they answer the 9 PHQ-9 frequency questions
**Then** Toolars scores all answers locally, maps the total to the VitalCalc 0-4 / 5-9 / 10-14 / 15-19 / 20-27 severity bands, highlights item 9 self-harm risk when non-zero, shows professional-help guidance, and includes a Tool details link.

### Scenario R71-S2: PSS-10 Stress workspace

**Given** the user opens `/tools/pss10-stress`
**When** they answer the 10 PSS-10 frequency questions
**Then** Toolars scores all answers locally using the source reverse-scored items 4, 5, 7, 9, and 10, maps totals to low / moderate / high perceived stress bands, shows stress-management guidance, and includes a Tool details link.

### Scenario R71-S3: ADHD Adult Screener workspace

**Given** the user opens `/tools/adhd-screener`
**When** they answer the 6 ASRS-v1.1 frequency questions
**Then** Toolars scores part A and part B, counts answers with score >= 2, maps >= 4 positive answers to the source screening-positive outcome, shows adult ADHD professional-evaluation caveats, and includes a Tool details link.

### Scenario R71-S4: Burnout Assessment workspace

**Given** the user opens `/tools/burnout-assessment`
**When** they answer the 10 burnout frequency questions
**Then** Toolars scores the first 6 items as exhaustion, the last 4 as detachment, maps total score to the VitalCalc no-significant / mild / moderate / severe burnout bands, shows work-health intervention guidance, and includes a Tool details link.

### Scenario R71-S5: Mental-health screener workspace quality

**Given** any promoted PHQ-9, PSS-10, ADHD, or Burnout route renders
**When** the page is checked at desktop and mobile widths
**Then** it uses the real workspace component instead of the generic fallback, has no framework overlay, has no console errors or warnings, versioned local save works, no page-level horizontal overflow, and copy clearly says outputs are screening references rather than diagnosis, crisis support, or a substitute for professional evaluation.

## Requirement R72: Core Modal Keyboard Focus And Stacking QA

### Description

The shared Core action modal system must behave like a production dialog primitive for Share, Save collection, Sign in, and Upgrade entry points before Phase 4 connects these actions to backed services.

### Scenario R72-S1: Dialog focus lifecycle

**Given** a user activates a Share, Save collection, Sign in, or Upgrade action
**When** the Core modal opens
**Then** the mounted dialog uses `role="dialog"`, `aria-modal="true"`, a labelled title, and receives focus so keyboard users start inside the active overlay.

### Scenario R72-S2: Keyboard close and focus restore

**Given** a Core modal is open
**When** the user presses Escape or activates Close
**Then** the modal closes, transient status copy resets, and focus returns to the action button that opened the modal.

### Scenario R72-S3: Single active Core modal

**Given** more than one Core modal action exists on a surface
**When** another Core modal action is activated
**Then** the previous Core modal is unmounted before the new dialog opens, leaving only one active `role="dialog"` in the document.

## Requirement R73: Settings Confirmation Dialog Keyboard Focus

### Description

The destructive and sensitive settings confirmation dialogs must use the same keyboard-first dialog lifecycle as the Core modal primitive, while preserving each settings page's existing confirmation copy and prototype state updates.

### Scenario R73-S1: Delete account confirmation lifecycle

**Given** a user opens `/settings`
**When** they activate Delete account
**Then** the Delete account confirmation dialog receives focus, keeps `role="dialog"` and `aria-modal="true"`, closes on Escape or Cancel, and restores focus to the Delete account opener.

### Scenario R73-S2: Security session confirmation lifecycle

**Given** a user opens `/settings/security`
**When** they activate Sign out all sessions
**Then** the Sign out all sessions confirmation dialog receives focus, closes on Escape or Cancel, restores focus to the opener, and still queues the existing prototype session state only after explicit confirmation.

### Scenario R73-S3: Connected app confirmation lifecycle

**Given** a user opens `/settings/connected-apps`
**When** they activate Disconnect on a specific integration
**Then** the Disconnect confirmation dialog receives focus, closes on Escape or Cancel, restores focus to the exact integration button that opened it, and still updates the integration status only after explicit confirmation.

## Requirement R74: AI Consent Dialog Keyboard Focus And Consent Approval

### Description

The AI consent entry points must use a real keyboard-first dialog before any AI-scoped action is marked approved, with clear copy about what is sent, when it is sent, and how cancellation / retention work.

### Scenario R74-S1: PDF Toolkit AI consent lifecycle

**Given** a user opens `/tools/pdf-toolkit`
**When** they activate I consent
**Then** Toolars opens one `aria-modal` dialog labelled Review AI consent, moves focus into the dialog, explains that only selected PDF text is sent after approval, closes on Escape or Cancel with focus restored to I consent, and only grants consent after Approve AI consent.

### Scenario R74-S2: PDF Summary workflow step consent lifecycle

**Given** a user opens `/workflows/pdf-summary`
**When** they activate Review consent
**Then** Toolars opens the same AI consent dialog pattern, moves focus into it, explains that only extracted text from the selected workflow step is sent, restores focus on dismissal, and only shows the workflow step as reviewed after Approve AI consent.

### Scenario R74-S3: AI consent dialog copy and overlay quality

**Given** either AI consent dialog is open
**When** the surface is checked in tests and browser QA
**Then** the dialog copy covers when data is sent, what content is sent, deletion and cancel behavior, and the page has no console errors, warnings, or visible framework overlay.

## Requirement R75: Command Center Mobile Density And Focus Trap

### Description

The Command Center must behave like a production command palette on mobile as well as desktop: keyboard focus must stay inside the active dialog, closing must return focus to the opener, and the 390px mobile viewport must keep search, results, and footer controls visible without horizontal overflow.

### Scenario R75-S1: Command Center Tab focus trap

**Given** the Command Center is open
**When** keyboard focus is at the first focusable item and the user presses Shift+Tab
**Then** focus wraps to the last command result inside the dialog, and pressing Tab from that last item wraps back to the searchbox instead of escaping to the page behind the overlay.

### Scenario R75-S2: Command Center close focus restoration

**Given** a user opens the Command Center from the shell trigger
**When** they close it with Escape, the Esc button, or the overlay background
**Then** the dialog unmounts, body scroll locking clears, and focus returns to the Open command search trigger.

### Scenario R75-S3: Command Center mobile density

**Given** the app is viewed at a 390px mobile width
**When** the Command Center opens
**Then** the dialog fits within the viewport, the results area owns internal scrolling, the footer remains visible, there is no page-level horizontal overflow, no visible framework overlay, and no console errors or warnings.

## Requirement R76: File Upload Overlay And Command Center Long-Result Stress

### Description

The next overlay polish slice must cover future upload entry points and long-result Command Center states before those surfaces are connected to backed storage, scanning, or ranking services.

### Scenario R76-S1: PDF Toolkit upload overlay lifecycle

**Given** a user opens `/tools/pdf-toolkit`
**When** they activate Add files
**Then** Toolars opens one local file-upload dialog with `role="dialog"`, `aria-modal="true"`, a labelled title, local-only upload copy, PDF limit guidance, queued-local status copy, Escape / Cancel close, and focus restoration to the Add files opener.

### Scenario R76-S2: Upload copy remains separate from AI consent

**Given** the PDF Toolkit upload dialog is open
**When** the user reviews the guidance
**Then** the dialog explains local file handling and size limits without showing Approve AI consent copy or implying that upload automatically sends data to an AI provider.

### Scenario R76-S3: Command Center long-result stress

**Given** the Command Center opens from the shell
**When** a broad query such as `calculator` returns more than eight matches
**Then** the default Command Center renders a larger scrollable result window, keeps the footer mounted, preserves Tab wrapping between the searchbox and final visible result, and avoids mobile horizontal overflow.

### Scenario R76-S4: Overlay stress browser quality

**Given** the upload overlay and long-result Command Center state are checked in browser QA
**When** each surface is opened, closed, and inspected at desktop or mobile widths
**Then** there is no visible framework overlay, no console error or warning, no page-level horizontal overflow, and focus returns to the expected opener.

## Requirement R77: AI Provider Routing And Consent Audit Persistence

### Description

Phase 4 AI work must start with an explicit provider-routing and consent-audit contract before real external AI providers are wired into workflow execution.

### Scenario R77-S1: PDF Summary provider route

**Given** PDF Summary reaches the `summarize-with-ai` step
**When** Toolars selects an AI provider route
**Then** it returns a stable route id, provider label, model family, retention days, fallback route id, `requiresConsent: true`, and content scope limited to extracted text from the selected workflow step.

### Scenario R77-S2: Versioned consent audit storage

**Given** a user approves an AI workflow consent dialog
**When** Toolars records the decision locally
**Then** it writes a versioned audit log under `toolars.ai-consent-audit:v1`, preserves existing valid events, ignores malformed stored payloads, and does not throw during SSR or when storage is unavailable.

### Scenario R77-S3: PDF Summary consent records provider metadata

**Given** a user opens `/workflows/pdf-summary`
**When** they approve Review consent
**Then** the dialog shows the selected provider route summary and the local audit event records workflow, step, provider label, provider route id, content summary, and approval timestamp before the workflow state is marked reviewed.

### Scenario R77-S4: Privacy & AI audit visibility

**Given** local consent audit events exist
**When** a user opens `/settings/privacy-ai`
**Then** Toolars renders the retained event count, latest workflow, provider label, and route id without hydration mismatch, console warnings, or mobile horizontal overflow.

## Requirement R78: Server AI Audit Ledger And Run Metadata

### Description

The local AI consent audit slice must graduate into a server-side audit contract that records provider route approvals and run metadata without sending source content or extracted text bodies to the ledger.

### Scenario R78-S1: Consent audit API route

**Given** PDF Summary approval produces an audit event and run metadata
**When** Toolars posts to `/api/ai/consent-audit`
**Then** the route stores a versioned server ledger with `events` and `runs`, returns `201`, and `GET /api/ai/consent-audit` returns the same route id, workflow, step, model family, retention days, content bytes, run id, and `consent-approved` status.

### Scenario R78-S2: PDF Summary server run metadata

**Given** a user approves the PDF Summary workflow consent dialog
**When** Toolars marks the step reviewed
**Then** it continues writing the local browser audit log and also sends server run metadata containing route id, model family, retention days, content byte count, workflow, step, run id, and status without blocking the UI on the network request.

### Scenario R78-S3: Privacy & AI server ledger visibility

**Given** the server audit ledger contains run metadata
**When** a user opens `/settings/privacy-ai`
**Then** Toolars loads the ledger after hydration, preserves the local audit summary, and renders server sync status, run count, latest run id, model family, and run status without console errors or horizontal overflow.

## Requirement R79: Real PDF File Upload Lifecycle

### Description

The PDF Toolkit upload overlay must move from a static future-state dialog to a real browser File API entry point with local scan, retention, queue, and delete states while keeping upload separate from AI consent.

### Scenario R79-S1: File API upload mapping

**Given** a user selects files in the PDF Toolkit upload dialog
**When** Toolars receives File API objects
**Then** it maps valid PDFs into local upload items with stable id, name, size bytes, size MB, estimated pages, scan-passed status, session retention, and active delete status.

### Scenario R79-S2: Upload rejection before queue

**Given** a user selects oversized files or non-PDF files
**When** Toolars scans the staged files
**Then** rejected files show local scan failure copy, are not retained, and cannot be added to the runnable PDF queue.

### Scenario R79-S3: Queue and delete lifecycle

**Given** valid uploaded PDFs are staged
**When** the user adds them to the queue and later deletes one
**Then** the selected file list shows uploaded scan and retention metadata, local operations use the updated queue, and deletion removes the file with an `aria-live` status message.

### Scenario R79-S4: Upload mobile quality

**Given** the PDF Toolkit upload overlay is opened at 390px mobile width
**When** the dialog, file input, footer actions, and upload guidance render
**Then** the dialog, footer, and buttons fit within the viewport, no page-level horizontal overflow occurs, no visible framework overlay appears, and console error/warn logs are empty.

## Requirement R80: Privacy AI History Export And Deletion Audit

### Description

The Privacy & AI settings page must let users export the current AI privacy log and delete AI history while retaining a minimal server-side deletion audit entry.

### Scenario R80-S1: Server AI history deletion audit

**Given** the server consent audit ledger contains approved events and run metadata
**When** Toolars receives `DELETE /api/ai/consent-audit`
**Then** the route clears `events` and `runs`, returns a completed `ai-history` deletion entry with deleted counts and timestamp, and preserves that deletion entry in future `GET /api/ai/consent-audit` responses.

### Scenario R80-S2: Privacy log export

**Given** local audit events and server run metadata are visible on `/settings/privacy-ai`
**When** the user clicks Download privacy log
**Then** Toolars prepares a JSON export containing local audit log and server ledger data, triggers a browser download when supported, and renders a visible export status with local event and server run counts.

### Scenario R80-S3: Privacy AI history deletion UI

**Given** local audit events and server run metadata exist
**When** the user clicks Delete AI history
**Then** Toolars clears the local `toolars.ai-consent-audit:v1` log, calls the server deletion route, updates the Privacy log to show zero local events and zero server runs, and renders the retained server deletion audit status without console errors.

## Requirement R81: Workspace Scoped Durable AI Audit Store

### Description

The server consent audit ledger must move beyond module memory by writing a workspace-scoped JSON store behind the same API contract, so the boundary can later be replaced by account-backed database storage.

### Scenario R81-S1: JSON-backed audit store

**Given** a server audit record is appended for a workspace
**When** Toolars writes the ledger
**Then** the ledger persists to a versioned JSON store containing the workspace id, events, runs, deletion entries, and schema version.

### Scenario R81-S2: Workspace scoped API access

**Given** two workspaces send consent audit records through `/api/ai/consent-audit`
**When** each request includes `x-toolars-workspace-id`
**Then** `GET` returns only that workspace's ledger and `DELETE` clears only that workspace while preserving other workspace runs.

### Scenario R81-S3: Build-safe server runtime

**Given** the audit store uses filesystem operations in the server route
**When** Toolars runs a production build
**Then** `/api/ai/consent-audit` remains a Node.js dynamic route, the build generates the full 210 route/page set, and Turbopack does not warn about whole-project NFT tracing.

## Requirement R82: Anonymous Workspace Identity Audit Headers

### Description

The client must create a stable anonymous workspace identity before authenticated accounts exist and send it with AI audit API requests so server-side workspace scoping is exercised in real flows.

### Scenario R82-S1: Stable anonymous workspace identity

**Given** a browser has no saved workspace identity
**When** Toolars needs an audit workspace id
**Then** it creates a versioned `toolars.workspace-identity:v1` localStorage record with `source: anonymous-local`, `createdAt`, and a stable `workspaceId`, and reuses that id on subsequent calls.

### Scenario R82-S2: PDF Summary audit POST header

**Given** a user approves PDF Summary AI consent
**When** Toolars posts the audit event and run metadata to `/api/ai/consent-audit`
**Then** the request includes `x-toolars-workspace-id` with the stable anonymous workspace id.

### Scenario R82-S3: Privacy audit GET and DELETE headers

**Given** a user opens `/settings/privacy-ai` and later deletes AI history
**When** Toolars reads and clears the server audit ledger
**Then** both the `GET` and `DELETE` requests include the same `x-toolars-workspace-id`, preserving server-side workspace isolation.

## Requirement R83: Account-Bound Anonymous Workspace Ledger

### Description

The anonymous workspace identity must be bindable to a future authenticated account without losing existing workspace-scoped AI audit history.

### Scenario R83-S1: Local future account binding

**Given** a browser already has a `toolars.workspace-identity:v1` anonymous identity
**When** Toolars receives a future account id from a sign-in handoff
**Then** it stores an `accountBinding` on the same identity with account id, optional email, timestamp, and `future-login` source, and audit headers include both `x-toolars-workspace-id` and `x-toolars-account-id`.

### Scenario R83-S2: Server account ledger binding

**Given** an anonymous workspace already has server AI audit run metadata
**When** Toolars calls `PATCH /api/ai/consent-audit` with an account id and the anonymous workspace header
**Then** the JSON-backed ledger stores an account binding on that workspace, and `GET /api/ai/consent-audit` with `x-toolars-account-id` returns an account-scoped ledger containing the bound workspace runs and binding metadata.

## Requirement R84: PDF Upload Temp Store And Summary Handoff

### Description

The PDF upload lifecycle must advance from browser-only staging to a server-scanned temporary object contract that can hand ready files to the PDF Summary workflow.

### Scenario R84-S1: Server temp object scan

**Given** PDF upload metadata reaches the server
**When** Toolars registers the upload
**Then** it writes a versioned JSON temp store record with workspace id, upload id, object key, scan worker version, scan status, retention label, expiry timestamp, and PDF Summary handoff token, while rejecting non-PDF or oversized files.

### Scenario R84-S2: PDF upload API lifecycle

**Given** a user uploads a PDF through the File API
**When** the browser posts `FormData` to `POST /api/pdf/uploads`
**Then** the route scans and stores temporary object metadata, `GET /api/pdf/uploads?handoff=pdf-summary` returns active ready handoffs for the same workspace, and `DELETE /api/pdf/uploads` marks a temp object deleted without returning it as ready.

### Scenario R84-S3: PDF Toolkit server registration

**Given** the PDF Toolkit upload overlay stages a locally valid PDF
**When** the server temp store accepts the file metadata
**Then** the staged upload row upgrades from local scan copy to server scan copy, displays temporary server retention and handoff token, and the queued file keeps that server scan metadata.

### Scenario R84-S4: PDF Summary handoff visibility

**Given** the PDF upload temp store contains a ready PDF Summary handoff for the current workspace
**When** the user opens `/workflows/pdf-summary`
**Then** the workflow input source panel fetches the handoff with the workspace header and renders the file name, handoff token, and `Server handoff ready` status.

## Requirement R85: Signed PDF Handoff And Retention Sweep

### Description

The PDF temporary upload contract must protect handoff tokens with a server signature and clear expired temp objects with an auditable retention sweep.

### Scenario R85-S1: Signed handoff resolution

**Given** a server-scanned PDF temp object is ready for PDF Summary
**When** Toolars returns it from `/api/pdf/uploads?handoff=pdf-summary`
**Then** the record includes a signed handoff URL whose signature can be resolved only for the same workspace before the temp object expires.

### Scenario R85-S2: Tamper and expiry rejection

**Given** a client sends a handoff token with a tampered signature or after the temp object expiry time
**When** Toolars handles `GET /api/pdf/uploads?handoffToken=...&signature=...`
**Then** the route rejects the request and does not expose object metadata.

### Scenario R85-S3: Retention sweep deletion audit

**Given** the PDF temp store contains active uploads where some have expired
**When** Toolars handles `DELETE /api/pdf/uploads?sweep=expired`
**Then** it marks expired records deleted, keeps active non-expired handoffs available, and appends deletion audit entries with `expired` reason, deleted timestamp, upload id, file name, workspace id, object key, and handoff token.

## Requirement R86: PDF Signed Object URL And Storage Retry UI

### Description

The PDF temporary upload contract must expose a signed object-access URL shape and let users recover from server storage registration failures without reselecting local files.

### Scenario R86-S1: Signed object URL contract

**Given** a server-scanned PDF temp object is ready for downstream processing
**When** Toolars stores or reads the temp object record
**Then** the record includes a signed object URL whose signature covers workspace id, object key, and expiry, and legacy cached records without this field are upgraded on read.

### Scenario R86-S2: Handoff response includes object access

**Given** a client resolves a signed PDF handoff URL
**When** `/api/pdf/uploads` returns the upload metadata
**Then** the response includes both the signed handoff URL and the signed object URL so later worker handoff can fetch the temporary object through the signed object-access contract.

### Scenario R86-S3: Upload storage failure retry

**Given** the PDF Toolkit upload overlay has locally scanned files
**When** server storage registration fails
**Then** the staged upload rows show `Storage handoff failed`, keep the local files available, and expose a retry action that reuses the same File API objects and replaces the rows with server scan / handoff metadata after a successful retry.

## Requirement R87: PDF Temp Object Content Read Route

### Description

The signed object-access URL must resolve to temporary PDF bytes in the local productionization slice so later scan workers and workflows can hand off content through the same boundary.

### Scenario R87-S1: Local temp content persistence

**Given** a PDF upload reaches the server route with File API bytes
**When** Toolars registers the temporary PDF object
**Then** it stores ready PDF bytes in a local temp content store keyed by object key, while keeping rejected or missing-content uploads out of the object read path.

### Scenario R87-S2: Signed object GET route

**Given** a ready PDF temp object has a signed object URL
**When** a client requests `/api/pdf/uploads/object?objectKey=...&expiresAt=...&signature=...` with the same workspace header
**Then** Toolars returns the PDF bytes with `Content-Type: application/pdf` and `Cache-Control: no-store`.

### Scenario R87-S3: Object access rejection

**Given** a signed object URL is tampered, expired, deleted, scoped to another workspace, or points to missing temp content
**When** Toolars handles the object GET request
**Then** the route returns a forbidden response and does not expose PDF bytes.

## Requirement R88: PDF Temp Content Cleanup And Object Read Audit

### Description

Temporary PDF bytes must be removed when records are deleted or expired, and signed object reads must leave a workspace-scoped audit trail.

### Scenario R88-S1: User delete removes temp content

**Given** a ready PDF temp object has local content bytes
**When** Toolars deletes the upload by workspace and upload id
**Then** it removes the local temp content file as well as marking metadata deleted, so a later metadata-only record with the same object key cannot read stale bytes.

### Scenario R88-S2: Expired sweep removes temp content

**Given** the retention sweep marks expired PDF temp objects deleted
**When** Toolars sweeps the expired records
**Then** it removes each expired record's local temp content file while preserving active non-expired content.

### Scenario R88-S3: Object read audit

**Given** a client requests a signed object URL
**When** the object route grants or rejects the read
**Then** Toolars appends a workspace-scoped object access audit entry with timestamp, status, object key, and upload metadata when available, and `/api/pdf/uploads` returns those audit entries with the handoff ledger.
