# Tasks: rebuild-toolars-platform

按依赖顺序执行。每个生产代码 task 先 Red 再 Green。

## 0. 准备

- [x] 0.1 读取设计文档和关键设计稿。
- [x] 0.2 盘点 VitalCalc 和 Aixtral Lab 源项目。
- [x] 0.3 创建 docs 与 CDC spec。

## 1. 测试基线

- [x] 1.1 写 registry 测试
  - 文件：`sites/toolars/src/data/registry.test.ts`
  - covers：tool-platform R1-S1, R1-S2；source-inventory R1-S1, R1-S2
  - verify：`pnpm test`
- [x] 1.2 写 Command Search 测试
  - 文件：`sites/toolars/src/lib/command-search.test.ts`
  - covers：tool-platform R2-S1, R2-S2, R2-S3
  - verify：`pnpm test`
- [x] 1.3 写 JSON Repair 测试
  - 文件：`sites/toolars/src/lib/tools/json-repair.test.ts`
  - covers：workspace R1-S1, R1-S2, R1-S3
  - verify：`pnpm test`

## 2. 生产实现

- [x] 2.1 实现 registry
  - 文件：`sites/toolars/src/data/registry.ts`
  - verify：`pnpm test -- registry`
- [x] 2.2 实现 command search
  - 文件：`sites/toolars/src/lib/command-search.ts`
  - verify：`pnpm test -- command-search`
- [x] 2.3 实现 JSON Repair pure function
  - 文件：`sites/toolars/src/lib/tools/json-repair.ts`
  - verify：`pnpm test -- json-repair`
- [x] 2.4 实现首批页面与 shell
  - 文件：`sites/toolars/src/app/**`, `sites/toolars/src/components/**`
  - verify：`pnpm typecheck`, `pnpm build`

## 3. QA

- [x] 3.1 浏览器打开 `/`, `/explore/pdf`, `/explore/ai-developer`, `/tools/json-repair`。
- [x] 3.2 JSON Repair 输入设计稿示例并确认输出。
- [x] 3.3 移动 390px 检查无横向溢出。
- [x] 3.4 记录 `git diff --stat`。

## 4. 第二批起步：PDF Toolkit 工作台

- [x] 4.1 写 PDF Toolkit 逻辑测试
  - 文件：`sites/toolars/src/lib/tools/pdf-toolkit.test.ts`
  - covers：workspace R3-S1, R3-S2, R3-S3
  - verify：`pnpm test -- pdf-toolkit`
- [x] 4.2 写 PDF Toolkit UI 测试
  - 文件：`sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx`
  - covers：workspace R3-S1, R3-S2, R3-S3
  - verify：`pnpm test -- pdf-toolkit`
- [x] 4.3 实现 PDF Toolkit pure job planner
  - 文件：`sites/toolars/src/lib/tools/pdf-toolkit.ts`
  - verify：`pnpm test -- pdf-toolkit`
- [x] 4.4 实现 `/tools/pdf-toolkit` 工作台页面
  - 文件：`sites/toolars/src/app/tools/pdf-toolkit/**`
  - verify：`pnpm test -- pdf-toolkit`, `pnpm typecheck`, `pnpm build`

## 5. Command Center 真实弹层

- [x] 5.1 写 Command Center UI 测试
  - 文件：`sites/toolars/src/components/search/command-center.test.tsx`
  - covers：tool-platform R4-S1, R4-S2, R4-S3, R4-S4
  - verify：`pnpm test -- command-center`
- [x] 5.2 实现 Command Center client component
  - 文件：`sites/toolars/src/components/search/command-center.tsx`
  - verify：`pnpm test -- command-center`
- [x] 5.3 接入 Shell trigger 与弹层样式
  - 文件：`sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test`, `pnpm typecheck`, `pnpm build`

## 6. AI Developer Lab：Prompt Injection Scanner 工作台

- [x] 6.1 写 Prompt Injection Scanner 逻辑测试
  - 文件：`sites/toolars/src/lib/tools/prompt-injection-scanner.test.ts`
  - covers：workspace R4-S2, R4-S3
  - verify：`pnpm test -- prompt-injection-scanner`
- [x] 6.2 写 Prompt Injection Scanner UI 测试
  - 文件：`sites/toolars/src/app/tools/prompt-injection-scanner/prompt-injection-scanner-workspace.test.tsx`
  - covers：workspace R4-S1, R4-S2, R4-S3, R4-S5
  - verify：`pnpm test -- prompt-injection-scanner`
- [x] 6.3 实现本地启发式扫描器
  - 文件：`sites/toolars/src/lib/tools/prompt-injection-scanner.ts`
  - verify：`pnpm test -- prompt-injection-scanner`
- [x] 6.4 实现 `/tools/prompt-injection-scanner` 工作台页面
  - 文件：`sites/toolars/src/app/tools/prompt-injection-scanner/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- prompt-injection-scanner`, `pnpm typecheck`, `pnpm build`

## 7. AI Developer Lab：LLM Cost Calculator 工作台

- [x] 7.1 写 LLM Cost Calculator 逻辑测试
  - 文件：`sites/toolars/src/lib/tools/llm-cost-calculator.test.ts`
  - covers：workspace R5-S2, R5-S3
  - verify：`pnpm test -- llm-cost-calculator`
- [x] 7.2 写 LLM Cost Calculator UI 测试
  - 文件：`sites/toolars/src/app/tools/llm-cost-calculator/llm-cost-calculator-workspace.test.tsx`
  - covers：workspace R5-S1, R5-S2, R5-S3, R5-S4
  - verify：`pnpm test -- llm-cost-calculator`
- [x] 7.3 实现本地成本估算器
  - 文件：`sites/toolars/src/lib/tools/llm-cost-calculator.ts`
  - verify：`pnpm test -- llm-cost-calculator`
- [x] 7.4 实现 `/tools/llm-cost-calculator` 工作台页面
  - 文件：`sites/toolars/src/app/tools/llm-cost-calculator/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- llm-cost-calculator`, `pnpm typecheck`, `pnpm build`

## 8. AI Developer Lab：MCP Server Builder 工作台

- [x] 8.1 写 MCP Server Builder 逻辑测试
  - 文件：`sites/toolars/src/lib/tools/mcp-server-builder.test.ts`
  - covers：workspace R6-S2, R6-S3
  - verify：`pnpm test -- mcp-server-builder`
- [x] 8.2 写 MCP Server Builder UI 测试
  - 文件：`sites/toolars/src/app/tools/mcp-server-builder/mcp-server-builder-workspace.test.tsx`
  - covers：workspace R6-S1, R6-S2, R6-S3, R6-S4
  - verify：`pnpm test -- mcp-server-builder`
- [x] 8.3 实现本地 MCP manifest builder
  - 文件：`sites/toolars/src/lib/tools/mcp-server-builder.ts`
  - verify：`pnpm test -- mcp-server-builder`
- [x] 8.4 实现 `/tools/mcp-server-builder` 工作台页面
  - 文件：`sites/toolars/src/app/tools/mcp-server-builder/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- mcp-server-builder`, `pnpm typecheck`, `pnpm build`

## 9. AI Developer Lab：LLM Cost Review Workflow

- [x] 9.1 写 LLM Cost Review workflow 逻辑测试
  - 文件：`sites/toolars/src/lib/workflows/llm-cost-review.test.ts`
  - covers：workspace R7-S2, R7-S3
  - verify：`pnpm test -- llm-cost-review`
- [x] 9.2 写 LLM Cost Review workflow UI 测试
  - 文件：`sites/toolars/src/app/workflows/llm-cost-review/llm-cost-review-workflow.test.tsx`
  - covers：workspace R7-S1, R7-S2
  - verify：`pnpm test -- llm-cost-review`
- [x] 9.3 实现本地成本 review workflow runner
  - 文件：`sites/toolars/src/lib/workflows/llm-cost-review.ts`
  - verify：`pnpm test -- llm-cost-review`
- [x] 9.4 实现 `/workflows/llm-cost-review` workflow builder 页面
  - 文件：`sites/toolars/src/app/workflows/llm-cost-review/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- llm-cost-review`, `pnpm typecheck`, `pnpm build`

## 10. AI Developer Lab：MCP Tool Launch Workflow

- [x] 10.1 写 MCP Tool Launch workflow 逻辑测试
  - 文件：`sites/toolars/src/lib/workflows/mcp-tool-launch.test.ts`
  - covers：workspace R8-S2, R8-S3
  - verify：`pnpm test -- mcp-tool-launch`
- [x] 10.2 写 MCP Tool Launch workflow UI 测试
  - 文件：`sites/toolars/src/app/workflows/mcp-tool-launch/mcp-tool-launch-workflow.test.tsx`
  - covers：workspace R8-S1, R8-S2, R8-S3
  - verify：`pnpm test -- mcp-tool-launch`
- [x] 10.3 实现本地 MCP launch workflow runner
  - 文件：`sites/toolars/src/lib/workflows/mcp-tool-launch.ts`
  - verify：`pnpm test -- mcp-tool-launch`
- [x] 10.4 实现 `/workflows/mcp-tool-launch` workflow builder 页面
  - 文件：`sites/toolars/src/app/workflows/mcp-tool-launch/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- mcp-tool-launch`, `pnpm typecheck`, `pnpm build`

## 11. AI Developer Lab：AI Prompt Hardening Workflow

- [x] 11.1 写 AI Prompt Hardening workflow 逻辑测试
  - 文件：`sites/toolars/src/lib/workflows/ai-prompt-hardening.test.ts`
  - covers：workspace R9-S2, R9-S3
  - verify：`pnpm test -- ai-prompt-hardening`
- [x] 11.2 写 AI Prompt Hardening workflow UI 测试
  - 文件：`sites/toolars/src/app/workflows/ai-prompt-hardening/ai-prompt-hardening-workflow.test.tsx`
  - covers：workspace R9-S1, R9-S2, R9-S3
  - verify：`pnpm test -- ai-prompt-hardening`
- [x] 11.3 实现本地 hardening workflow runner
  - 文件：`sites/toolars/src/lib/workflows/ai-prompt-hardening.ts`
  - verify：`pnpm test -- ai-prompt-hardening`
- [x] 11.4 实现 `/workflows/ai-prompt-hardening` workflow builder 页面
  - 文件：`sites/toolars/src/app/workflows/ai-prompt-hardening/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- ai-prompt-hardening`, `pnpm typecheck`, `pnpm build`

## 12. AI Developer Lab：Public Tool Detail Template

- [x] 12.1 写 AI Lab detail 数据测试
  - 文件：`sites/toolars/src/data/tool-details.test.ts`
  - covers：workspace R10-S1, R10-S2, R10-S3, R10-S4
  - verify：`pnpm test -- tool-details`
- [x] 12.2 写 AI Lab detail UI 测试
  - 文件：`sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R10-S1, R10-S2, R10-S4
  - verify：`pnpm test -- tool-detail`
- [x] 12.3 实现共享 public detail 数据模型
  - 文件：`sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- tool-details`
- [x] 12.4 实现 `/tools/[slug]/about` public listing 模板
  - 文件：`sites/toolars/src/app/tools/[slug]/about/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- tool-detail`, `pnpm typecheck`, `pnpm build`

## 13. PDF Summary Workflow

- [x] 13.1 写 PDF Summary workflow 逻辑测试
  - 文件：`sites/toolars/src/lib/workflows/pdf-summary.test.ts`
  - covers：workspace R11-S2, R11-S3
  - verify：`pnpm test -- pdf-summary`
- [x] 13.2 写 PDF Summary workflow UI 测试
  - 文件：`sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.test.tsx`
  - covers：workspace R11-S1, R11-S2, R11-S3
  - verify：`pnpm test -- pdf-summary`
- [x] 13.3 实现本地 PDF summary workflow runner
  - 文件：`sites/toolars/src/lib/workflows/pdf-summary.ts`
  - verify：`pnpm test -- pdf-summary`
- [x] 13.4 实现 `/workflows/pdf-summary` workflow builder 页面
  - 文件：`sites/toolars/src/app/workflows/pdf-summary/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- pdf-summary`, `pnpm typecheck`, `pnpm build`

## 14. Collection Detail Template

- [x] 14.1 写 collection detail 数据测试
  - 文件：`sites/toolars/src/data/collection-details.test.ts`
  - covers：workspace R12-S1, R12-S2, R12-S3
  - verify：`pnpm test -- collection-details`
- [x] 14.2 写 collection detail UI 测试
  - 文件：`sites/toolars/src/app/collections/[slug]/collection-detail-view.test.tsx`
  - covers：workspace R12-S1, R12-S2
  - verify：`pnpm test -- collection-detail`
- [x] 14.3 实现共享 collection detail 数据模型
  - 文件：`sites/toolars/src/data/collection-details.ts`
  - verify：`pnpm test -- collection-details`
- [x] 14.4 实现 `/collections/[slug]` collection detail 模板
  - 文件：`sites/toolars/src/app/collections/[slug]/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- collection-detail`, `pnpm typecheck`, `pnpm build`

## 15. Workflows Index

- [x] 15.1 写 workflows index UI 测试
  - 文件：`sites/toolars/src/app/workflows/workflows-index-view.test.tsx`
  - covers：workspace R13-S1, R13-S2
  - verify：`pnpm test -- workflows-index`
- [x] 15.2 实现 `/workflows` landing 页面
  - 文件：`sites/toolars/src/app/workflows/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- workflows-index`, `pnpm typecheck`, `pnpm build`

## 16. Collections Index

- [x] 16.1 写 collections index UI 测试
  - 文件：`sites/toolars/src/app/collections/collections-index-view.test.tsx`
  - covers：workspace R14-S1, R14-S2
  - verify：`pnpm test -- collections-index`
- [x] 16.2 实现 `/collections` landing 页面
  - 文件：`sites/toolars/src/app/collections/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- collections-index`, `pnpm typecheck`, `pnpm build`

## 17. My Tools Dashboard

- [x] 17.1 写 Shell workspace / none variant 测试
  - 文件：`sites/toolars/src/components/shell/toolars-shell.test.tsx`
  - covers：workspace R15-S2, R16-S4
  - verify：`pnpm test -- toolars-shell`
- [x] 17.2 写 My Tools dashboard UI 测试
  - 文件：`sites/toolars/src/app/my-tools/my-tools-dashboard-view.test.tsx`
  - covers：workspace R15-S1, R15-S3
  - verify：`pnpm test -- my-tools`
- [x] 17.3 实现 `/my-tools` personal workspace dashboard
  - 文件：`sites/toolars/src/app/my-tools/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- my-tools toolars-shell`, `pnpm typecheck`, `pnpm build`

## 18. Submit Tool Page

- [x] 18.1 写 Submit Tool UI 测试
  - 文件：`sites/toolars/src/app/submit/submit-tool-view.test.tsx`
  - covers：workspace R16-S1, R16-S2, R16-S3
  - verify：`pnpm test -- submit-tool`
- [x] 18.2 实现 `/submit` submission form 页面
  - 文件：`sites/toolars/src/app/submit/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- submit-tool toolars-shell`, `pnpm typecheck`, `pnpm build`

## 19. Pricing Page

- [x] 19.1 写 Shell billing variant / pricing nav 测试
  - 文件：`sites/toolars/src/components/shell/toolars-shell.test.tsx`
  - covers：workspace R17-S2
  - verify：`pnpm test -- toolars-shell`
- [x] 19.2 写 Pricing page UI 测试
  - 文件：`sites/toolars/src/app/pricing/pricing-view.test.tsx`
  - covers：workspace R17-S1, R17-S3
  - verify：`pnpm test -- pricing`
- [x] 19.3 实现 `/pricing` plans and billing 页面
  - 文件：`sites/toolars/src/app/pricing/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- pricing toolars-shell`, `pnpm typecheck`, `pnpm build`

## 20. Account Settings Page

- [x] 20.1 写 Shell settings variant 测试
  - 文件：`sites/toolars/src/components/shell/toolars-shell.test.tsx`
  - covers：workspace R18-S2
  - verify：`pnpm test -- toolars-shell`
- [x] 20.2 写 Account Settings UI 测试
  - 文件：`sites/toolars/src/app/settings/settings-view.test.tsx`
  - covers：workspace R18-S1, R18-S3
  - verify：`pnpm test -- settings-view`
- [x] 20.3 实现 `/settings` account settings 页面
  - 文件：`sites/toolars/src/app/settings/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- settings-view toolars-shell`, `pnpm typecheck`, `pnpm build`

## 21. Billing Settings Page

- [x] 21.1 写 Billing Settings UI 测试
  - 文件：`sites/toolars/src/app/settings/billing/billing-settings-view.test.tsx`
  - covers：workspace R19-S1, R19-S3
  - verify：`pnpm test -- billing-settings`
- [x] 21.2 实现 `/settings/billing` billing and usage 页面
  - 文件：`sites/toolars/src/app/settings/billing/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- billing-settings toolars-shell`, `pnpm typecheck`, `pnpm build`

## 22. Admin Review Console

- [x] 22.1 写 Shell admin variant 测试
  - 文件：`sites/toolars/src/components/shell/toolars-shell.test.tsx`
  - covers：workspace R20-S2
  - verify：`pnpm test -- toolars-shell`
- [x] 22.2 写 Admin Review UI 测试
  - 文件：`sites/toolars/src/app/admin/review/admin-review-view.test.tsx`
  - covers：workspace R20-S1, R20-S3
  - verify：`pnpm test -- admin-review`
- [x] 22.3 实现 `/admin/review` admin review console 页面
  - 文件：`sites/toolars/src/app/admin/review/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- admin-review toolars-shell`, `pnpm typecheck`, `pnpm build`

## 23. States & Overlays Board

- [x] 23.1 写 States Board UI 测试
  - 文件：`sites/toolars/src/app/states/states-board-view.test.tsx`
  - covers：workspace R21-S1, R21-S2, R21-S3
  - verify：`pnpm test -- states-board`
- [x] 23.2 实现 `/states` states and overlays board 页面
  - 文件：`sites/toolars/src/app/states/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- states-board`, `pnpm typecheck`, `pnpm build`

## 24. Privacy & AI Settings Page

- [x] 24.1 写 Privacy & AI settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx`
  - covers：workspace R22-S1, R22-S2
  - verify：`pnpm test -- privacy-ai-settings`
- [x] 24.2 实现 `/settings/privacy-ai` privacy and AI controls 页面
  - 文件：`sites/toolars/src/app/settings/privacy-ai/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- privacy-ai-settings toolars-shell`, `pnpm typecheck`, `pnpm build`

## 25. API Keys Settings Page

- [x] 25.1 写 API keys settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/api-keys/api-keys-settings-view.test.tsx`
  - covers：workspace R23-S1, R23-S2, R23-S3
  - verify：`pnpm test -- api-keys-settings`
- [x] 25.2 实现 `/settings/api-keys` key management 页面
  - 文件：`sites/toolars/src/app/settings/api-keys/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- api-keys-settings toolars-shell`, `pnpm typecheck`, `pnpm build`

## 26. Storage Settings Page

- [x] 26.1 写 Storage settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/storage/storage-settings-view.test.tsx`
  - covers：workspace R24-S1, R24-S2
  - verify：`pnpm test -- storage-settings`
- [x] 26.2 实现 `/settings/storage` storage controls 页面
  - 文件：`sites/toolars/src/app/settings/storage/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- storage-settings toolars-shell`, `pnpm typecheck`, `pnpm build`

## 27. Team Settings Page

- [x] 27.1 写 Team settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/team/team-settings-view.test.tsx`
  - covers：workspace R25-S1, R25-S2
  - verify：`pnpm test -- team-settings`
- [x] 27.2 实现 `/settings/team` team controls 页面
  - 文件：`sites/toolars/src/app/settings/team/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- team-settings toolars-shell`, `pnpm typecheck`, `pnpm build`

## 28. Notifications Settings Page

- [x] 28.1 写 Notifications settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/notifications/notifications-settings-view.test.tsx`
  - covers：workspace R26-S1, R26-S2
  - verify：`pnpm test -- notifications-settings`
- [x] 28.2 实现 `/settings/notifications` notification controls 页面
  - 文件：`sites/toolars/src/app/settings/notifications/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- notifications-settings toolars-shell`, `pnpm typecheck`, `pnpm build`

## 29. Connected Apps Settings Page

- [x] 29.1 写 Connected apps settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/connected-apps/connected-apps-settings-view.test.tsx`
  - covers：workspace R27-S1, R27-S2, R27-S3
  - verify：`pnpm test -- connected-apps-settings`
- [x] 29.2 实现 `/settings/connected-apps` app integration controls 页面
  - 文件：`sites/toolars/src/app/settings/connected-apps/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- connected-apps-settings toolars-shell settings-view`, `pnpm typecheck`, `pnpm build`

## 30. Security Settings Page

- [x] 30.1 写 Security settings UI/interaction 测试
  - 文件：`sites/toolars/src/app/settings/security/security-settings-view.test.tsx`
  - covers：workspace R28-S1, R28-S2, R28-S3
  - verify：`pnpm test -- security-settings`
- [x] 30.2 实现 `/settings/security` security controls 页面
  - 文件：`sites/toolars/src/app/settings/security/**`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- security-settings toolars-shell settings-view`, `pnpm typecheck`, `pnpm build`

## 31. Settings Risk Confirmation Dialogs

- [x] 31.1 写 Security / Connected apps 风险确认弹层测试
  - 文件：`sites/toolars/src/app/settings/security/security-settings-view.test.tsx`, `sites/toolars/src/app/settings/connected-apps/connected-apps-settings-view.test.tsx`
  - covers：workspace R29-S1, R29-S2, R29-S3
  - verify：`pnpm test -- security-settings connected-apps-settings`
- [x] 31.2 实现 Settings 高风险操作确认弹层
  - 文件：`sites/toolars/src/app/settings/security/security-settings-view.tsx`, `sites/toolars/src/app/settings/connected-apps/connected-apps-settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- security-settings connected-apps-settings`, `pnpm typecheck`, `pnpm build`

## 32. Account Danger Zone Actions

- [x] 32.1 写 Settings Danger zone 导出/删除确认测试
  - 文件：`sites/toolars/src/app/settings/settings-view.test.tsx`
  - covers：workspace R30-S1, R30-S2, R30-S3
  - verify：`pnpm test -- settings-view`
- [x] 32.2 实现 Settings 总页 Danger zone 本地动作
  - 文件：`sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- settings-view`, `pnpm typecheck`, `pnpm build`

## 33. VitalCalc Public Tool Detail Expansion

- [x] 33.1 写 VitalCalc registry/detail/route 测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R31-S1, R31-S2, R31-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`
- [x] 33.2 实现 VitalCalc 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`, `sites/toolars/src/app/tools/[slug]/about/page.tsx`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 34. VitalCalc Detail Batch Coverage

- [x] 34.1 写第二批 VitalCalc registry/detail/route 测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R32-S1, R32-S2, R32-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`
- [x] 34.2 实现第二批 VitalCalc 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 35. VitalCalc Related Detail Link Coverage

- [x] 35.1 写 VitalCalc related detail route 覆盖测试
  - 文件：`sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R33-S1, R33-S2, R33-S3
  - verify：`pnpm test -- tool-details tool-detail-view`
- [x] 35.2 实现 Compound Interest / BMR / Water Intake 详情数据与静态路由
  - 文件：`sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 36. Mortgage Calculator Workspace

- [x] 36.1 写 Mortgage calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/mortgage-calculator.test.ts`, `sites/toolars/src/app/tools/mortgage-calculator/mortgage-calculator-workspace.test.tsx`
  - covers：workspace R34-S1, R34-S2, R34-S3
  - verify：`pnpm test -- mortgage-calculator`
- [x] 36.2 实现本地 Mortgage calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/mortgage-calculator.ts`, `sites/toolars/src/app/tools/mortgage-calculator/**`
  - verify：`pnpm test -- mortgage-calculator`, `pnpm typecheck`, `pnpm build`

## 37. BMI Calculator Workspace

- [x] 37.1 写 BMI calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/bmi-calculator.test.ts`, `sites/toolars/src/app/tools/bmi-calculator/bmi-calculator-workspace.test.tsx`
  - covers：workspace R35-S1, R35-S2, R35-S3
  - verify：`pnpm test -- bmi-calculator`
- [x] 37.2 实现本地 BMI calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/bmi-calculator.ts`, `sites/toolars/src/app/tools/bmi-calculator/**`
  - verify：`pnpm test -- bmi-calculator`, `pnpm typecheck`, `pnpm build`

## 38. VitalCalc Detail Batch Expansion 3

- [x] 38.1 写第三批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R36-S1, R36-S2, R36-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`
- [x] 38.2 实现第三批 VitalCalc finance/health 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 39. VitalCalc Detail Batch Expansion 4

- [x] 39.1 写第四批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R37-S1, R37-S2, R37-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`
- [x] 39.2 实现第四批 VitalCalc finance/health 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 40. VitalCalc Detail Batch Expansion 5

- [x] 40.1 写第五批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R38-S1, R38-S2, R38-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`
- [x] 40.2 实现第五批 VitalCalc finance/health 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 41. VitalCalc Detail Batch Expansion 6

- [x] 41.1 写第六批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R39-S1, R39-S2, R39-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 41.2 实现第六批 VitalCalc finance planning 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 42. VitalCalc Detail Batch Expansion 7

- [x] 42.1 写第七批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R40-S1, R40-S2, R40-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 42.2 实现第七批 VitalCalc health/wellness 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 43. VitalCalc Detail Batch Expansion 8

- [x] 43.1 写第八批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R41-S1, R41-S2, R41-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 43.2 实现第八批 VitalCalc utility/everyday finance 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 44. VitalCalc Detail Batch Expansion 9

- [x] 44.1 写第九批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R42-S1, R42-S2, R42-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 44.2 实现第九批 VitalCalc health/lifestyle 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 45. VitalCalc Detail Batch Expansion 10

- [x] 45.1 写第十批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R43-S1, R43-S2, R43-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 45.2 实现第十批 VitalCalc finance utility/investment 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 46. VitalCalc Detail Batch Expansion 11

- [x] 46.1 写第十一批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R44-S1, R44-S2, R44-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 46.2 实现第十一批 VitalCalc life-money/credit/tax 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 47. VitalCalc Detail Batch Expansion 12

- [x] 47.1 写第十二批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R45-S1, R45-S2, R45-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 47.2 实现第十二批 VitalCalc payroll/investment/refinance/lifestyle 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 48. VitalCalc Detail Batch Expansion 13

- [x] 48.1 写第十三批 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R46-S1, R46-S2, R46-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 48.2 实现第十三批 VitalCalc mental-health/eligibility screening 详情数据与静态路由
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 49. PDF Toolkit and JSON Repair Public Details

- [x] 49.1 写 PDF Toolkit / JSON Repair detail data 与 static route 覆盖测试
  - 文件：`sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R47-S1, R47-S2, R47-S3
  - verify：`pnpm test -- tool-details tool-detail-view`

- [x] 49.2 实现 PDF Toolkit / JSON Repair public detail 数据与 `/tools/{slug}/about` 静态路由
  - 文件：`sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 50. VitalCalc Final Public Detail Coverage

- [x] 50.1 写最终 8 个 VitalCalc registry/detail/static route 覆盖测试
  - 文件：`sites/toolars/src/data/registry.test.ts`, `sites/toolars/src/data/tool-details.test.ts`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`
  - covers：workspace R48-S1, R48-S2, R48-S3
  - verify：`pnpm test -- registry tool-details tool-detail-view`

- [x] 50.2 实现最终 8 个 VitalCalc public detail 与 86/86 source coverage
  - 文件：`sites/toolars/src/data/registry.ts`, `sites/toolars/src/data/tool-details.ts`
  - verify：`pnpm test -- registry tool-details tool-detail-view`, `pnpm typecheck`, `pnpm build`

## 51. Core Modals Second Wave

- [x] 51.1 写 Share / Save collection / Sign in / Upgrade modal 交互测试
  - 文件：`sites/toolars/src/components/core/core-action-modal.test.tsx`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.test.tsx`, `sites/toolars/src/app/collections/[slug]/collection-detail-view.test.tsx`, `sites/toolars/src/components/shell/toolars-shell.test.tsx`, `sites/toolars/src/app/pricing/pricing-view.test.tsx`
  - covers：workspace R49-S1, R49-S2, R49-S3, R49-S4
  - verify：`pnpm test -- core-action-modal tool-detail-view collection-detail toolars-shell pricing`

- [x] 51.2 实现共享 Core action modal 并接入四类入口
  - 文件：`sites/toolars/src/components/core/**`, `sites/toolars/src/app/tools/[slug]/about/tool-detail-view.tsx`, `sites/toolars/src/app/collections/[slug]/collection-detail-view.tsx`, `sites/toolars/src/components/shell/toolars-shell.tsx`, `sites/toolars/src/app/pricing/pricing-view.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- core-action-modal tool-detail-view collection-detail toolars-shell pricing`, `pnpm typecheck`, `pnpm build`

## 52. Public Detail Workspace Link Safety

- [x] 52.1 写 `/tools/[slug]` workspace route 与 handoff UI 覆盖测试
  - 文件：`sites/toolars/src/app/tools/[slug]/page.test.tsx`, `sites/toolars/src/app/tools/[slug]/tool-workspace-shell-view.test.tsx`
  - covers：workspace R50-S1, R50-S2, R50-S3
  - verify：`pnpm test -- "tools/\\[slug\\]"`

- [x] 52.2 实现通用 source-backed workspace handoff，确保 public detail Open workspace 全部可达
  - 文件：`sites/toolars/src/app/tools/[slug]/**`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- "tools/\\[slug\\]"`, `pnpm typecheck`, `pnpm build`

## 53. Loan Calculator Workspace

- [x] 53.1 写 Loan calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/loan-calculator.test.ts`, `sites/toolars/src/app/tools/loan-calculator/loan-calculator-workspace.test.tsx`
  - covers：workspace R51-S1, R51-S5
  - verify：`pnpm test -- loan-calculator`

- [x] 53.2 实现本地 Loan calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/loan-calculator.ts`, `sites/toolars/src/app/tools/loan-calculator/**`
  - verify：`pnpm test -- loan-calculator`, `pnpm typecheck`, `pnpm build`

## 54. Pregnancy Due Date Workspace

- [x] 54.1 写 Pregnancy due date 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/pregnancy-due-date.test.ts`, `sites/toolars/src/app/tools/pregnancy-due-date/pregnancy-due-date-workspace.test.tsx`
  - covers：workspace R51-S2, R51-S5
  - verify：`pnpm test -- pregnancy-due-date`

- [x] 54.2 实现本地 Pregnancy due date 工作台
  - 文件：`sites/toolars/src/lib/tools/pregnancy-due-date.ts`, `sites/toolars/src/app/tools/pregnancy-due-date/**`
  - verify：`pnpm test -- pregnancy-due-date`, `pnpm typecheck`, `pnpm build`

## 55. Compound Interest Workspace

- [x] 55.1 写 Compound interest 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/compound-interest.test.ts`, `sites/toolars/src/app/tools/compound-interest/compound-interest-workspace.test.tsx`
  - covers：workspace R51-S3, R51-S5
  - verify：`pnpm test -- compound-interest`

- [x] 55.2 实现本地 Compound interest 工作台
  - 文件：`sites/toolars/src/lib/tools/compound-interest.ts`, `sites/toolars/src/app/tools/compound-interest/**`
  - verify：`pnpm test -- compound-interest`, `pnpm typecheck`, `pnpm build`

## 56. TDEE Calculator Workspace

- [x] 56.1 写 TDEE calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/tdee-calculator.test.ts`, `sites/toolars/src/app/tools/tdee-calculator/tdee-calculator-workspace.test.tsx`
  - covers：workspace R51-S4, R51-S5
  - verify：`pnpm test -- tdee-calculator`

- [x] 56.2 实现本地 TDEE calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/tdee-calculator.ts`, `sites/toolars/src/app/tools/tdee-calculator/**`
  - verify：`pnpm test -- tdee-calculator`, `pnpm typecheck`, `pnpm build`

## 57. BMR Calculator Workspace

- [x] 57.1 写 BMR calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/bmr-calculator.test.ts`, `sites/toolars/src/app/tools/bmr-calculator/bmr-calculator-workspace.test.tsx`
  - covers：workspace R52-S1, R52-S5
  - verify：`pnpm test -- bmr-calculator`

- [x] 57.2 实现本地 BMR calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/bmr-calculator.ts`, `sites/toolars/src/app/tools/bmr-calculator/**`
  - verify：`pnpm test -- bmr-calculator`, `pnpm typecheck`, `pnpm build`

## 58. Body Fat Calculator Workspace

- [x] 58.1 写 Body fat calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/body-fat-calculator.test.ts`, `sites/toolars/src/app/tools/body-fat-calculator/body-fat-calculator-workspace.test.tsx`
  - covers：workspace R52-S2, R52-S5
  - verify：`pnpm test -- body-fat-calculator`

- [x] 58.2 实现本地 Body fat calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/body-fat-calculator.ts`, `sites/toolars/src/app/tools/body-fat-calculator/**`
  - verify：`pnpm test -- body-fat-calculator`, `pnpm typecheck`, `pnpm build`

## 59. Protein Calculator Workspace

- [x] 59.1 写 Protein calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/protein-calculator.test.ts`, `sites/toolars/src/app/tools/protein-calculator/protein-calculator-workspace.test.tsx`
  - covers：workspace R52-S3, R52-S5
  - verify：`pnpm test -- protein-calculator`

- [x] 59.2 实现本地 Protein calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/protein-calculator.ts`, `sites/toolars/src/app/tools/protein-calculator/**`
  - verify：`pnpm test -- protein-calculator`, `pnpm typecheck`, `pnpm build`

## 60. Water Intake Calculator Workspace

- [x] 60.1 写 Water intake calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/water-intake.test.ts`, `sites/toolars/src/app/tools/water-intake/water-intake-workspace.test.tsx`
  - covers：workspace R52-S4, R52-S5
  - verify：`pnpm test -- water-intake`

- [x] 60.2 实现本地 Water intake calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/water-intake.ts`, `sites/toolars/src/app/tools/water-intake/**`
  - verify：`pnpm test -- water-intake`, `pnpm typecheck`, `pnpm build`

## 61. Calorie Deficit Workspace

- [x] 61.1 写 Calorie deficit 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/calorie-deficit.test.ts`, `sites/toolars/src/app/tools/calorie-deficit/calorie-deficit-workspace.test.tsx`
  - covers：workspace R53-S1, R53-S5
  - verify：`pnpm test -- calorie-deficit`

- [x] 61.2 实现本地 Calorie deficit 工作台
  - 文件：`sites/toolars/src/lib/tools/calorie-deficit.ts`, `sites/toolars/src/app/tools/calorie-deficit/**`
  - verify：`pnpm test -- calorie-deficit`, `pnpm typecheck`, `pnpm build`

## 62. Macro Calculator Workspace

- [x] 62.1 写 Macro calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/macro-calculator.test.ts`, `sites/toolars/src/app/tools/macro-calculator/macro-calculator-workspace.test.tsx`
  - covers：workspace R53-S2, R53-S5
  - verify：`pnpm test -- macro-calculator`

- [x] 62.2 实现本地 Macro calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/macro-calculator.ts`, `sites/toolars/src/app/tools/macro-calculator/**`
  - verify：`pnpm test -- macro-calculator`, `pnpm typecheck`, `pnpm build`

## 63. Lean Body Mass Workspace

- [x] 63.1 写 Lean body mass 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/lean-body-mass.test.ts`, `sites/toolars/src/app/tools/lean-body-mass/lean-body-mass-workspace.test.tsx`
  - covers：workspace R53-S3, R53-S5
  - verify：`pnpm test -- lean-body-mass`

- [x] 63.2 实现本地 Lean body mass 工作台
  - 文件：`sites/toolars/src/lib/tools/lean-body-mass.ts`, `sites/toolars/src/app/tools/lean-body-mass/**`
  - verify：`pnpm test -- lean-body-mass`, `pnpm typecheck`, `pnpm build`

## 64. Body Recomposition Workspace

- [x] 64.1 写 Body recomposition 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/body-recomposition.test.ts`, `sites/toolars/src/app/tools/body-recomposition/body-recomposition-workspace.test.tsx`
  - covers：workspace R53-S4, R53-S5
  - verify：`pnpm test -- body-recomposition`

- [x] 64.2 实现本地 Body recomposition 工作台
  - 文件：`sites/toolars/src/lib/tools/body-recomposition.ts`, `sites/toolars/src/app/tools/body-recomposition/**`
  - verify：`pnpm test -- body-recomposition`, `pnpm typecheck`, `pnpm build`

## 65. Emergency Fund Workspace

- [x] 65.1 写 Emergency fund 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/emergency-fund.test.ts`, `sites/toolars/src/app/tools/emergency-fund/emergency-fund-workspace.test.tsx`
  - covers：workspace R54-S1, R54-S5
  - verify：`pnpm test -- emergency-fund`

- [x] 65.2 实现本地 Emergency fund 工作台
  - 文件：`sites/toolars/src/lib/tools/emergency-fund.ts`, `sites/toolars/src/app/tools/emergency-fund/**`
  - verify：`pnpm test -- emergency-fund`, `pnpm typecheck`, `pnpm build`

## 66. Savings Goal Workspace

- [x] 66.1 写 Savings goal 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/savings-goal.test.ts`, `sites/toolars/src/app/tools/savings-goal/savings-goal-workspace.test.tsx`
  - covers：workspace R54-S2, R54-S5
  - verify：`pnpm test -- savings-goal`

- [x] 66.2 实现本地 Savings goal 工作台
  - 文件：`sites/toolars/src/lib/tools/savings-goal.ts`, `sites/toolars/src/app/tools/savings-goal/**`
  - verify：`pnpm test -- savings-goal`, `pnpm typecheck`, `pnpm build`

## 67. Debt Payoff Workspace

- [x] 67.1 写 Debt payoff 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/debt-payoff.test.ts`, `sites/toolars/src/app/tools/debt-payoff/debt-payoff-workspace.test.tsx`
  - covers：workspace R54-S3, R54-S5
  - verify：`pnpm test -- debt-payoff`

- [x] 67.2 实现本地 Debt payoff 工作台
  - 文件：`sites/toolars/src/lib/tools/debt-payoff.ts`, `sites/toolars/src/app/tools/debt-payoff/**`
  - verify：`pnpm test -- debt-payoff`, `pnpm typecheck`, `pnpm build`

## 68. Retirement Calculator Workspace

- [x] 68.1 写 Retirement calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/retirement-calculator.test.ts`, `sites/toolars/src/app/tools/retirement-calculator/retirement-calculator-workspace.test.tsx`
  - covers：workspace R54-S4, R54-S5
  - verify：`pnpm test -- retirement-calculator`

- [x] 68.2 实现本地 Retirement calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/retirement-calculator.ts`, `sites/toolars/src/app/tools/retirement-calculator/**`
  - verify：`pnpm test -- retirement-calculator`, `pnpm typecheck`, `pnpm build`

## 69. Net Worth Workspace

- [x] 69.1 写 Net worth 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/net-worth-calculator.test.ts`, `sites/toolars/src/app/tools/net-worth-calculator/net-worth-calculator-workspace.test.tsx`
  - covers：workspace R55-S1, R55-S5
  - verify：`pnpm test -- net-worth-calculator`

- [x] 69.2 实现本地 Net worth 工作台
  - 文件：`sites/toolars/src/lib/tools/net-worth-calculator.ts`, `sites/toolars/src/app/tools/net-worth-calculator/**`
  - verify：`pnpm test -- net-worth-calculator`, `pnpm typecheck`, `pnpm build`

## 70. Budget Rule Workspace

- [x] 70.1 写 Budget rule 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/budget-rule.test.ts`, `sites/toolars/src/app/tools/budget-rule/budget-rule-workspace.test.tsx`
  - covers：workspace R55-S2, R55-S5
  - verify：`pnpm test -- budget-rule`

- [x] 70.2 实现本地 Budget rule 工作台
  - 文件：`sites/toolars/src/lib/tools/budget-rule.ts`, `sites/toolars/src/app/tools/budget-rule/**`
  - verify：`pnpm test -- budget-rule`, `pnpm typecheck`, `pnpm build`

## 71. DTI Calculator Workspace

- [x] 71.1 写 DTI calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/dti-calculator.test.ts`, `sites/toolars/src/app/tools/dti-calculator/dti-calculator-workspace.test.tsx`
  - covers：workspace R55-S3, R55-S5
  - verify：`pnpm test -- dti-calculator`

- [x] 71.2 实现本地 DTI calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/dti-calculator.ts`, `sites/toolars/src/app/tools/dti-calculator/**`
  - verify：`pnpm test -- dti-calculator`, `pnpm typecheck`, `pnpm build`

## 72. APY Calculator Workspace

- [x] 72.1 写 APY calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/apy-calculator.test.ts`, `sites/toolars/src/app/tools/apy-calculator/apy-calculator-workspace.test.tsx`
  - covers：workspace R55-S4, R55-S5
  - verify：`pnpm test -- apy-calculator`

- [x] 72.2 实现本地 APY calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/apy-calculator.ts`, `sites/toolars/src/app/tools/apy-calculator/**`
  - verify：`pnpm test -- apy-calculator`, `pnpm typecheck`, `pnpm build`

## 73. Tip Calculator Workspace

- [x] 73.1 写 Tip calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/tip-calculator.test.ts`, `sites/toolars/src/app/tools/tip-calculator/tip-calculator-workspace.test.tsx`
  - covers：workspace R56-S1, R56-S5
  - verify：`pnpm test -- tip-calculator`

- [x] 73.2 实现本地 Tip calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/tip-calculator.ts`, `sites/toolars/src/app/tools/tip-calculator/**`
  - verify：`pnpm test -- tip-calculator`, `pnpm typecheck`, `pnpm build`

## 74. Bill Split Calculator Workspace

- [x] 74.1 写 Bill split calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/bill-split-calculator.test.ts`, `sites/toolars/src/app/tools/bill-split-calculator/bill-split-calculator-workspace.test.tsx`
  - covers：workspace R56-S2, R56-S5
  - verify：`pnpm test -- bill-split-calculator`

- [x] 74.2 实现本地 Bill split calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/bill-split-calculator.ts`, `sites/toolars/src/app/tools/bill-split-calculator/**`
  - verify：`pnpm test -- bill-split-calculator`, `pnpm typecheck`, `pnpm build`

## 75. Unit Converter Workspace

- [x] 75.1 写 Unit converter 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/unit-converter.test.ts`, `sites/toolars/src/app/tools/unit-converter/unit-converter-workspace.test.tsx`
  - covers：workspace R56-S3, R56-S5
  - verify：`pnpm test -- unit-converter`

- [x] 75.2 实现本地 Unit converter 工作台
  - 文件：`sites/toolars/src/lib/tools/unit-converter.ts`, `sites/toolars/src/app/tools/unit-converter/**`
  - verify：`pnpm test -- unit-converter`, `pnpm typecheck`, `pnpm build`

## 76. Hourly To Salary Workspace

- [x] 76.1 写 Hourly to salary 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/hourly-to-salary.test.ts`, `sites/toolars/src/app/tools/hourly-to-salary/hourly-to-salary-workspace.test.tsx`
  - covers：workspace R56-S4, R56-S5
  - verify：`pnpm test -- hourly-to-salary`

- [x] 76.2 实现本地 Hourly to salary 工作台
  - 文件：`sites/toolars/src/lib/tools/hourly-to-salary.ts`, `sites/toolars/src/app/tools/hourly-to-salary/**`
  - verify：`pnpm test -- hourly-to-salary`, `pnpm typecheck`, `pnpm build`

## 77. Inflation Calculator Workspace

- [x] 77.1 写 Inflation calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/inflation-calculator.test.ts`, `sites/toolars/src/app/tools/inflation-calculator/inflation-calculator-workspace.test.tsx`
  - covers：workspace R57-S1, R57-S5
  - verify：`pnpm test -- inflation-calculator`

- [x] 77.2 实现本地 Inflation calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/inflation-calculator.ts`, `sites/toolars/src/app/tools/inflation-calculator/**`
  - verify：`pnpm test -- inflation-calculator`, `pnpm typecheck`, `pnpm build`

## 78. Habit Cost Workspace

- [x] 78.1 写 Habit cost 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/habit-cost.test.ts`, `sites/toolars/src/app/tools/habit-cost/habit-cost-workspace.test.tsx`
  - covers：workspace R57-S2, R57-S5
  - verify：`pnpm test -- habit-cost`

- [x] 78.2 实现本地 Habit cost 工作台
  - 文件：`sites/toolars/src/lib/tools/habit-cost.ts`, `sites/toolars/src/app/tools/habit-cost/**`
  - verify：`pnpm test -- habit-cost`, `pnpm typecheck`, `pnpm build`

## 79. Income Tax Workspace

- [x] 79.1 写 Income tax 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/income-tax.test.ts`, `sites/toolars/src/app/tools/income-tax/income-tax-workspace.test.tsx`
  - covers：workspace R57-S3, R57-S5
  - verify：`pnpm test -- income-tax`

- [x] 79.2 实现本地 Income tax 工作台
  - 文件：`sites/toolars/src/lib/tools/income-tax.ts`, `sites/toolars/src/app/tools/income-tax/**`
  - verify：`pnpm test -- income-tax`, `pnpm typecheck`, `pnpm build`

## 80. Percentage Calculator Workspace

- [x] 80.1 写 Percentage calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/percentage-calculator.test.ts`, `sites/toolars/src/app/tools/percentage-calculator/percentage-calculator-workspace.test.tsx`
  - covers：workspace R57-S4, R57-S5
  - verify：`pnpm test -- percentage-calculator`

- [x] 80.2 实现本地 Percentage calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/percentage-calculator.ts`, `sites/toolars/src/app/tools/percentage-calculator/**`
  - verify：`pnpm test -- percentage-calculator`, `pnpm typecheck`, `pnpm build`

## 81. Discount Calculator Workspace

- [x] 81.1 写 Discount calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/discount-calculator.test.ts`, `sites/toolars/src/app/tools/discount-calculator/discount-calculator-workspace.test.tsx`
  - covers：workspace R58-S1, R58-S5
  - verify：`pnpm test -- discount-calculator`

- [x] 81.2 实现本地 Discount calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/discount-calculator.ts`, `sites/toolars/src/app/tools/discount-calculator/**`
  - verify：`pnpm test -- discount-calculator`, `pnpm typecheck`, `pnpm build`

## 82. Currency Converter Workspace

- [x] 82.1 写 Currency converter 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/currency-converter.test.ts`, `sites/toolars/src/app/tools/currency-converter/currency-converter-workspace.test.tsx`
  - covers：workspace R58-S2, R58-S5
  - verify：`pnpm test -- currency-converter`

- [x] 82.2 实现本地 Currency converter 工作台
  - 文件：`sites/toolars/src/lib/tools/currency-converter.ts`, `sites/toolars/src/app/tools/currency-converter/**`
  - verify：`pnpm test -- currency-converter`, `pnpm typecheck`, `pnpm build`

## 83. Stock Average Workspace

- [x] 83.1 写 Stock average 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/stock-average.test.ts`, `sites/toolars/src/app/tools/stock-average/stock-average-workspace.test.tsx`
  - covers：workspace R58-S3, R58-S5
  - verify：`pnpm test -- stock-average`

- [x] 83.2 实现本地 Stock average 工作台
  - 文件：`sites/toolars/src/lib/tools/stock-average.ts`, `sites/toolars/src/app/tools/stock-average/**`
  - verify：`pnpm test -- stock-average`, `pnpm typecheck`, `pnpm build`

## 84. Credit Card APR Workspace

- [x] 84.1 写 Credit card APR 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/credit-card-apr.test.ts`, `sites/toolars/src/app/tools/credit-card-apr/credit-card-apr-workspace.test.tsx`
  - covers：workspace R58-S4, R58-S5
  - verify：`pnpm test -- credit-card-apr`

- [x] 84.2 实现本地 Credit card APR 工作台
  - 文件：`sites/toolars/src/lib/tools/credit-card-apr.ts`, `sites/toolars/src/app/tools/credit-card-apr/**`
  - verify：`pnpm test -- credit-card-apr`, `pnpm typecheck`, `pnpm build`

## 85. Investment Fee Workspace

- [x] 85.1 写 Investment fee 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/investment-fee.test.ts`, `sites/toolars/src/app/tools/investment-fee/investment-fee-workspace.test.tsx`
  - covers：workspace R59-S1, R59-S5
  - verify：`pnpm test -- investment-fee`

- [x] 85.2 实现本地 Investment fee 工作台
  - 文件：`sites/toolars/src/lib/tools/investment-fee.ts`, `sites/toolars/src/app/tools/investment-fee/**`
  - verify：`pnpm test -- investment-fee`, `pnpm typecheck`, `pnpm build`

## 86. Investment Goal Workspace

- [x] 86.1 写 Investment goal 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/investment-goal.test.ts`, `sites/toolars/src/app/tools/investment-goal/investment-goal-workspace.test.tsx`
  - covers：workspace R59-S2, R59-S5
  - verify：`pnpm test -- investment-goal`

- [x] 86.2 实现本地 Investment goal 工作台
  - 文件：`sites/toolars/src/lib/tools/investment-goal.ts`, `sites/toolars/src/app/tools/investment-goal/**`
  - verify：`pnpm test -- investment-goal`, `pnpm typecheck`, `pnpm build`

## 87. ROI Calculator Workspace

- [x] 87.1 写 ROI calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/roi-calculator.test.ts`, `sites/toolars/src/app/tools/roi-calculator/roi-calculator-workspace.test.tsx`
  - covers：workspace R59-S3, R59-S5
  - verify：`pnpm test -- roi-calculator`

- [x] 87.2 实现本地 ROI calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/roi-calculator.ts`, `sites/toolars/src/app/tools/roi-calculator/**`
  - verify：`pnpm test -- roi-calculator`, `pnpm typecheck`, `pnpm build`

## 88. Rule of 72 Workspace

- [x] 88.1 写 Rule of 72 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/rule-of-72.test.ts`, `sites/toolars/src/app/tools/rule-of-72/rule-of-72-workspace.test.tsx`
  - covers：workspace R59-S4, R59-S5
  - verify：`pnpm test -- rule-of-72`

- [x] 88.2 实现本地 Rule of 72 工作台
  - 文件：`sites/toolars/src/lib/tools/rule-of-72.ts`, `sites/toolars/src/app/tools/rule-of-72/**`
  - verify：`pnpm test -- rule-of-72`, `pnpm typecheck`, `pnpm build`

## 89. Freelance Rate Workspace

- [x] 89.1 写 Freelance rate 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/freelance-rate.test.ts`, `sites/toolars/src/app/tools/freelance-rate/freelance-rate-workspace.test.tsx`
  - covers：workspace R60-S1, R60-S5
  - verify：`pnpm test -- freelance-rate`

- [x] 89.2 实现本地 Freelance rate 工作台
  - 文件：`sites/toolars/src/lib/tools/freelance-rate.ts`, `sites/toolars/src/app/tools/freelance-rate/**`
  - verify：`pnpm test -- freelance-rate`, `pnpm typecheck`, `pnpm build`

## 90. Side Income Tax Workspace

- [x] 90.1 写 Side income tax 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/side-income-tax.test.ts`, `sites/toolars/src/app/tools/side-income-tax/side-income-tax-workspace.test.tsx`
  - covers：workspace R60-S2, R60-S5
  - verify：`pnpm test -- side-income-tax`

- [x] 90.2 实现本地 Side income tax 工作台
  - 文件：`sites/toolars/src/lib/tools/side-income-tax.ts`, `sites/toolars/src/app/tools/side-income-tax/**`
  - verify：`pnpm test -- side-income-tax`, `pnpm typecheck`, `pnpm build`

## 91. City Cost Comparison Workspace

- [x] 91.1 写 City cost comparison 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/city-cost-comparison.test.ts`, `sites/toolars/src/app/tools/city-cost-comparison/city-cost-comparison-workspace.test.tsx`
  - covers：workspace R60-S3, R60-S5
  - verify：`pnpm test -- city-cost-comparison`

- [x] 91.2 实现本地 City cost comparison 工作台
  - 文件：`sites/toolars/src/lib/tools/city-cost-comparison.ts`, `sites/toolars/src/app/tools/city-cost-comparison/**`
  - verify：`pnpm test -- city-cost-comparison`, `pnpm typecheck`, `pnpm build`

## 92. Social Insurance Calculator Workspace

- [x] 92.1 写 Social insurance calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/social-insurance-calculator.test.ts`, `sites/toolars/src/app/tools/social-insurance-calculator/social-insurance-calculator-workspace.test.tsx`
  - covers：workspace R60-S4, R60-S5
  - verify：`pnpm test -- social-insurance-calculator`

- [x] 92.2 实现本地 Social insurance calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/social-insurance-calculator.ts`, `sites/toolars/src/app/tools/social-insurance-calculator/**`
  - verify：`pnpm test -- social-insurance-calculator`, `pnpm typecheck`, `pnpm build`

## 93. FIRE Calculator Workspace

- [x] 93.1 写 FIRE calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/fire-calculator.test.ts`, `sites/toolars/src/app/tools/fire-calculator/fire-calculator-workspace.test.tsx`
  - covers：workspace R61-S1, R61-S5
  - verify：`pnpm test -- fire-calculator`

- [x] 93.2 实现本地 FIRE calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/fire-calculator.ts`, `sites/toolars/src/app/tools/fire-calculator/**`
  - verify：`pnpm test -- fire-calculator`, `pnpm typecheck`, `pnpm build`

## 94. Coast FIRE Workspace

- [x] 94.1 写 Coast FIRE 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/coast-fire.test.ts`, `sites/toolars/src/app/tools/coast-fire/coast-fire-workspace.test.tsx`
  - covers：workspace R61-S2, R61-S5
  - verify：`pnpm test -- coast-fire`

- [x] 94.2 实现本地 Coast FIRE 工作台
  - 文件：`sites/toolars/src/lib/tools/coast-fire.ts`, `sites/toolars/src/app/tools/coast-fire/**`
  - verify：`pnpm test -- coast-fire`, `pnpm typecheck`, `pnpm build`

## 95. Car Loan Workspace

- [x] 95.1 写 Car loan 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/car-loan.test.ts`, `sites/toolars/src/app/tools/car-loan/car-loan-workspace.test.tsx`
  - covers：workspace R61-S3, R61-S5
  - verify：`pnpm test -- car-loan`

- [x] 95.2 实现本地 Car loan 工作台
  - 文件：`sites/toolars/src/lib/tools/car-loan.ts`, `sites/toolars/src/app/tools/car-loan/**`
  - verify：`pnpm test -- car-loan`, `pnpm typecheck`, `pnpm build`

## 96. Rent Vs Buy Workspace

- [x] 96.1 写 Rent vs buy 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/rent-vs-buy.test.ts`, `sites/toolars/src/app/tools/rent-vs-buy/rent-vs-buy-workspace.test.tsx`
  - covers：workspace R61-S4, R61-S5
  - verify：`pnpm test -- rent-vs-buy`

- [x] 96.2 实现本地 Rent vs buy 工作台
  - 文件：`sites/toolars/src/lib/tools/rent-vs-buy.ts`, `sites/toolars/src/app/tools/rent-vs-buy/**`
  - verify：`pnpm test -- rent-vs-buy`, `pnpm typecheck`, `pnpm build`

## 97. Home Affordability Calculator Workspace

- [x] 97.1 写 Home affordability calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/home-affordability-calculator.test.ts`, `sites/toolars/src/app/tools/home-affordability-calculator/home-affordability-calculator-workspace.test.tsx`
  - covers：workspace R62-S1, R62-S5
  - verify：`pnpm test -- home-affordability-calculator`

- [x] 97.2 实现本地 Home affordability calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/home-affordability-calculator.ts`, `sites/toolars/src/app/tools/home-affordability-calculator/**`
  - verify：`pnpm test -- home-affordability-calculator`, `pnpm typecheck`, `pnpm build`

## 98. Student Loan Calculator Workspace

- [x] 98.1 写 Student loan calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/student-loan-calculator.test.ts`, `sites/toolars/src/app/tools/student-loan-calculator/student-loan-calculator-workspace.test.tsx`
  - covers：workspace R62-S2, R62-S5
  - verify：`pnpm test -- student-loan-calculator`

- [x] 98.2 实现本地 Student loan calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/student-loan-calculator.ts`, `sites/toolars/src/app/tools/student-loan-calculator/**`
  - verify：`pnpm test -- student-loan-calculator`, `pnpm typecheck`, `pnpm build`

## 99. Mortgage Refinance Calculator Workspace

- [x] 99.1 写 Mortgage refinance calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/mortgage-refinance-calculator.test.ts`, `sites/toolars/src/app/tools/mortgage-refinance-calculator/mortgage-refinance-calculator-workspace.test.tsx`
  - covers：workspace R62-S3, R62-S5
  - verify：`pnpm test -- mortgage-refinance-calculator`

- [x] 99.2 实现本地 Mortgage refinance calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/mortgage-refinance-calculator.ts`, `sites/toolars/src/app/tools/mortgage-refinance-calculator/**`
  - verify：`pnpm test -- mortgage-refinance-calculator`, `pnpm typecheck`, `pnpm build`

## 100. Credit Score Simulator Workspace

- [x] 100.1 写 Credit score simulator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/credit-score-simulator.test.ts`, `sites/toolars/src/app/tools/credit-score-simulator/credit-score-simulator-workspace.test.tsx`
  - covers：workspace R62-S4, R62-S5
  - verify：`pnpm test -- credit-score-simulator`

- [x] 100.2 实现本地 Credit score simulator 工作台
  - 文件：`sites/toolars/src/lib/tools/credit-score-simulator.ts`, `sites/toolars/src/app/tools/credit-score-simulator/**`
  - verify：`pnpm test -- credit-score-simulator`, `pnpm typecheck`, `pnpm build`

## 101. Subscription Audit Workspace

- [x] 101.1 写 Subscription audit 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/subscription-audit.test.ts`, `sites/toolars/src/app/tools/subscription-audit/subscription-audit-workspace.test.tsx`
  - covers：workspace R63-S1, R63-S5
  - verify：`pnpm test -- subscription-audit`

- [x] 101.2 实现本地 Subscription audit 工作台
  - 文件：`sites/toolars/src/lib/tools/subscription-audit.ts`, `sites/toolars/src/app/tools/subscription-audit/**`
  - verify：`pnpm test -- subscription-audit`, `pnpm typecheck`, `pnpm build`

## 102. Savings Challenge Workspace

- [x] 102.1 写 Savings challenge 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/savings-challenge.test.ts`, `sites/toolars/src/app/tools/savings-challenge/savings-challenge-workspace.test.tsx`
  - covers：workspace R63-S2, R63-S5
  - verify：`pnpm test -- savings-challenge`

- [x] 102.2 实现本地 Savings challenge 工作台
  - 文件：`sites/toolars/src/lib/tools/savings-challenge.ts`, `sites/toolars/src/app/tools/savings-challenge/**`
  - verify：`pnpm test -- savings-challenge`, `pnpm typecheck`, `pnpm build`

## 103. Dividend Reinvestment Workspace

- [x] 103.1 写 Dividend reinvestment 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/dividend-reinvestment.test.ts`, `sites/toolars/src/app/tools/dividend-reinvestment/dividend-reinvestment-workspace.test.tsx`
  - covers：workspace R63-S3, R63-S5
  - verify：`pnpm test -- dividend-reinvestment`

- [x] 103.2 实现本地 Dividend reinvestment 工作台
  - 文件：`sites/toolars/src/lib/tools/dividend-reinvestment.ts`, `sites/toolars/src/app/tools/dividend-reinvestment/**`
  - verify：`pnpm test -- dividend-reinvestment`, `pnpm typecheck`, `pnpm build`

## 104. Fund SIP Workspace

- [x] 104.1 写 Fund SIP 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/sip-calculator.test.ts`, `sites/toolars/src/app/tools/sip-calculator/sip-calculator-workspace.test.tsx`
  - covers：workspace R63-S4, R63-S5
  - verify：`pnpm test -- sip-calculator`

- [x] 104.2 实现本地 Fund SIP 工作台
  - 文件：`sites/toolars/src/lib/tools/sip-calculator.ts`, `sites/toolars/src/app/tools/sip-calculator/**`
  - verify：`pnpm test -- sip-calculator`, `pnpm typecheck`, `pnpm build`

## 105. Waist-Hip Ratio Workspace

- [x] 105.1 写 Waist-Hip ratio 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/waist-hip-ratio.test.ts`, `sites/toolars/src/app/tools/waist-hip-ratio/waist-hip-ratio-workspace.test.tsx`
  - covers：workspace R64-S1, R64-S5
  - verify：`pnpm test -- waist-hip-ratio`

- [x] 105.2 实现本地 Waist-Hip ratio 工作台
  - 文件：`sites/toolars/src/lib/tools/waist-hip-ratio.ts`, `sites/toolars/src/app/tools/waist-hip-ratio/**`
  - verify：`pnpm test -- waist-hip-ratio`, `pnpm typecheck`, `pnpm build`

## 106. Blood Pressure Workspace

- [x] 106.1 写 Blood pressure 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/blood-pressure.test.ts`, `sites/toolars/src/app/tools/blood-pressure/blood-pressure-workspace.test.tsx`
  - covers：workspace R64-S2, R64-S5
  - verify：`pnpm test -- blood-pressure`

- [x] 106.2 实现本地 Blood pressure 工作台
  - 文件：`sites/toolars/src/lib/tools/blood-pressure.ts`, `sites/toolars/src/app/tools/blood-pressure/**`
  - verify：`pnpm test -- blood-pressure`, `pnpm typecheck`, `pnpm build`

## 107. Child Growth Workspace

- [x] 107.1 写 Child growth 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/child-growth.test.ts`, `sites/toolars/src/app/tools/child-growth/child-growth-workspace.test.tsx`
  - covers：workspace R64-S3, R64-S5
  - verify：`pnpm test -- child-growth`

- [x] 107.2 实现本地 Child growth 工作台
  - 文件：`sites/toolars/src/lib/tools/child-growth.ts`, `sites/toolars/src/app/tools/child-growth/**`
  - verify：`pnpm test -- child-growth`, `pnpm typecheck`, `pnpm build`

## 108. Blood Sugar Calculator Workspace

- [x] 108.1 写 Blood sugar calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/blood-sugar-calculator.test.ts`, `sites/toolars/src/app/tools/blood-sugar-calculator/blood-sugar-calculator-workspace.test.tsx`
  - covers：workspace R64-S4, R64-S5
  - verify：`pnpm test -- blood-sugar-calculator`

- [x] 108.2 实现本地 Blood sugar calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/blood-sugar-calculator.ts`, `sites/toolars/src/app/tools/blood-sugar-calculator/**`
  - verify：`pnpm test -- blood-sugar-calculator`, `pnpm typecheck`, `pnpm build`

## 109. Crypto Tax Workspace

- [x] 109.1 写 Crypto tax 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/crypto-tax.test.ts`, `sites/toolars/src/app/tools/crypto-tax/crypto-tax-workspace.test.tsx`
  - covers：workspace R65-S1, R65-S5
  - verify：`pnpm test -- crypto-tax`

- [x] 109.2 实现本地 Crypto tax 工作台
  - 文件：`sites/toolars/src/lib/tools/crypto-tax.ts`, `sites/toolars/src/app/tools/crypto-tax/**`
  - verify：`pnpm test -- crypto-tax`, `pnpm typecheck`, `pnpm build`

## 110. Smoke-Free Workspace

- [x] 110.1 写 Smoke-free 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/smoke-free.test.ts`, `sites/toolars/src/app/tools/smoke-free/smoke-free-workspace.test.tsx`
  - covers：workspace R65-S2, R65-S5
  - verify：`pnpm test -- smoke-free`

- [x] 110.2 实现本地 Smoke-free 工作台
  - 文件：`sites/toolars/src/lib/tools/smoke-free.ts`, `sites/toolars/src/app/tools/smoke-free/**`
  - verify：`pnpm test -- smoke-free`, `pnpm typecheck`, `pnpm build`

## 111. Caffeine Calculator Workspace

- [x] 111.1 写 Caffeine calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/caffeine-calculator.test.ts`, `sites/toolars/src/app/tools/caffeine-calculator/caffeine-calculator-workspace.test.tsx`
  - covers：workspace R65-S3, R65-S5
  - verify：`pnpm test -- caffeine-calculator`

- [x] 111.2 实现本地 Caffeine calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/caffeine-calculator.ts`, `sites/toolars/src/app/tools/caffeine-calculator/**`
  - verify：`pnpm test -- caffeine-calculator`, `pnpm typecheck`, `pnpm build`

## 112. Alcohol Metabolism Workspace

- [x] 112.1 写 Alcohol metabolism 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/alcohol-metabolism.test.ts`, `sites/toolars/src/app/tools/alcohol-metabolism/alcohol-metabolism-workspace.test.tsx`
  - covers：workspace R65-S4, R65-S5
  - verify：`pnpm test -- alcohol-metabolism`

- [x] 112.2 实现本地 Alcohol metabolism 工作台
  - 文件：`sites/toolars/src/lib/tools/alcohol-metabolism.ts`, `sites/toolars/src/app/tools/alcohol-metabolism/**`
  - verify：`pnpm test -- alcohol-metabolism`, `pnpm typecheck`, `pnpm build`

## 113. Glycemic Load Workspace

- [x] 113.1 写 Glycemic load 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/glycemic-load.test.ts`, `sites/toolars/src/app/tools/glycemic-load/glycemic-load-workspace.test.tsx`
  - covers：workspace R66-S1, R66-S5
  - verify：`pnpm test -- glycemic-load`

- [x] 113.2 实现本地 Glycemic load 工作台
  - 文件：`sites/toolars/src/lib/tools/glycemic-load.ts`, `sites/toolars/src/app/tools/glycemic-load/**`
  - verify：`pnpm test -- glycemic-load`, `pnpm typecheck`, `pnpm build`

## 114. HOMA-IR Workspace

- [x] 114.1 写 HOMA-IR 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/homa-ir.test.ts`, `sites/toolars/src/app/tools/homa-ir/homa-ir-workspace.test.tsx`
  - covers：workspace R66-S2, R66-S5
  - verify：`pnpm test -- homa-ir`

- [x] 114.2 实现本地 HOMA-IR 工作台
  - 文件：`sites/toolars/src/lib/tools/homa-ir.ts`, `sites/toolars/src/app/tools/homa-ir/**`
  - verify：`pnpm test -- homa-ir`, `pnpm typecheck`, `pnpm build`

## 115. Drink Calories Workspace

- [x] 115.1 写 Drink calories 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/drink-calories.test.ts`, `sites/toolars/src/app/tools/drink-calories/drink-calories-workspace.test.tsx`
  - covers：workspace R66-S3, R66-S5
  - verify：`pnpm test -- drink-calories`

- [x] 115.2 实现本地 Drink calories 工作台
  - 文件：`sites/toolars/src/lib/tools/drink-calories.ts`, `sites/toolars/src/app/tools/drink-calories/**`
  - verify：`pnpm test -- drink-calories`, `pnpm typecheck`, `pnpm build`

## 116. Fiber Intake Workspace

- [x] 116.1 写 Fiber intake 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/fiber-intake.test.ts`, `sites/toolars/src/app/tools/fiber-intake/fiber-intake-workspace.test.tsx`
  - covers：workspace R66-S4, R66-S5
  - verify：`pnpm test -- fiber-intake`

- [x] 116.2 实现本地 Fiber intake 工作台
  - 文件：`sites/toolars/src/lib/tools/fiber-intake.ts`, `sites/toolars/src/app/tools/fiber-intake/**`
  - verify：`pnpm test -- fiber-intake`, `pnpm typecheck`, `pnpm build`

## 117. One Rep Max Workspace

- [x] 117.1 写 One rep max 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/one-rep-max.test.ts`, `sites/toolars/src/app/tools/one-rep-max/one-rep-max-workspace.test.tsx`
  - covers：workspace R67-S1, R67-S5
  - verify：`pnpm test -- one-rep-max`

- [x] 117.2 实现本地 One rep max 工作台
  - 文件：`sites/toolars/src/lib/tools/one-rep-max.ts`, `sites/toolars/src/app/tools/one-rep-max/**`
  - verify：`pnpm test -- one-rep-max`, `pnpm typecheck`, `pnpm build`

## 118. Running Pace Workspace

- [x] 118.1 写 Running pace 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/running-pace.test.ts`, `sites/toolars/src/app/tools/running-pace/running-pace-workspace.test.tsx`
  - covers：workspace R67-S2, R67-S5
  - verify：`pnpm test -- running-pace`

- [x] 118.2 实现本地 Running pace 工作台
  - 文件：`sites/toolars/src/lib/tools/running-pace.ts`, `sites/toolars/src/app/tools/running-pace/**`
  - verify：`pnpm test -- running-pace`, `pnpm typecheck`, `pnpm build`

## 119. Ovulation Workspace

- [x] 119.1 写 Ovulation 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/ovulation-calculator.test.ts`, `sites/toolars/src/app/tools/ovulation-calculator/ovulation-calculator-workspace.test.tsx`
  - covers：workspace R67-S3, R67-S5
  - verify：`pnpm test -- ovulation-calculator`

- [x] 119.2 实现本地 Ovulation 工作台
  - 文件：`sites/toolars/src/lib/tools/ovulation-calculator.ts`, `sites/toolars/src/app/tools/ovulation-calculator/**`
  - verify：`pnpm test -- ovulation-calculator`, `pnpm typecheck`, `pnpm build`

## 120. Creatine Workspace

- [x] 120.1 写 Creatine 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/creatine-calculator.test.ts`, `sites/toolars/src/app/tools/creatine-calculator/creatine-calculator-workspace.test.tsx`
  - covers：workspace R67-S4, R67-S5
  - verify：`pnpm test -- creatine-calculator`

- [x] 120.2 实现本地 Creatine 工作台
  - 文件：`sites/toolars/src/lib/tools/creatine-calculator.ts`, `sites/toolars/src/app/tools/creatine-calculator/**`
  - verify：`pnpm test -- creatine-calculator`, `pnpm typecheck`, `pnpm build`

## 121. VO2 Max Workspace

- [x] 121.1 写 VO2 max 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/vo2-max.test.ts`, `sites/toolars/src/app/tools/vo2-max/vo2-max-workspace.test.tsx`
  - covers：workspace R68-S1, R68-S5
  - verify：`pnpm test -- vo2-max`

- [x] 121.2 实现本地 VO2 max 工作台
  - 文件：`sites/toolars/src/lib/tools/vo2-max.ts`, `sites/toolars/src/app/tools/vo2-max/**`
  - verify：`pnpm test -- vo2-max`, `pnpm typecheck`, `pnpm build`

## 122. Heart Rate Zone Workspace

- [x] 122.1 写 Heart rate zone 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/heart-rate-zone.test.ts`, `sites/toolars/src/app/tools/heart-rate-zone/heart-rate-zone-workspace.test.tsx`
  - covers：workspace R68-S2, R68-S5
  - verify：`pnpm test -- heart-rate-zone`

- [x] 122.2 实现本地 Heart rate zone 工作台
  - 文件：`sites/toolars/src/lib/tools/heart-rate-zone.ts`, `sites/toolars/src/app/tools/heart-rate-zone/**`
  - verify：`pnpm test -- heart-rate-zone`, `pnpm typecheck`, `pnpm build`

## 123. Testosterone Workspace

- [x] 123.1 写 Testosterone 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/testosterone-calculator.test.ts`, `sites/toolars/src/app/tools/testosterone-calculator/testosterone-calculator-workspace.test.tsx`
  - covers：workspace R68-S3, R68-S5
  - verify：`pnpm test -- testosterone-calculator`

- [x] 123.2 实现本地 Testosterone 工作台
  - 文件：`sites/toolars/src/lib/tools/testosterone-calculator.ts`, `sites/toolars/src/app/tools/testosterone-calculator/**`
  - verify：`pnpm test -- testosterone-calculator`, `pnpm typecheck`, `pnpm build`

## 124. Intermittent Fasting Workspace

- [x] 124.1 写 Intermittent fasting 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/intermittent-fasting.test.ts`, `sites/toolars/src/app/tools/intermittent-fasting/intermittent-fasting-workspace.test.tsx`
  - covers：workspace R68-S4, R68-S5
  - verify：`pnpm test -- intermittent-fasting`

- [x] 124.2 实现本地 Intermittent fasting 工作台
  - 文件：`sites/toolars/src/lib/tools/intermittent-fasting.ts`, `sites/toolars/src/app/tools/intermittent-fasting/**`
  - verify：`pnpm test -- intermittent-fasting`, `pnpm typecheck`, `pnpm build`

## 125. Sleep Calculator Workspace

- [x] 125.1 写 Sleep calculator 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/sleep-calculator.test.ts`, `sites/toolars/src/app/tools/sleep-calculator/sleep-calculator-workspace.test.tsx`
  - covers：workspace R69-S1, R69-S5
  - verify：`pnpm test -- sleep-calculator`

- [x] 125.2 实现本地 Sleep calculator 工作台
  - 文件：`sites/toolars/src/lib/tools/sleep-calculator.ts`, `sites/toolars/src/app/tools/sleep-calculator/**`
  - verify：`pnpm test -- sleep-calculator`, `pnpm typecheck`, `pnpm build`

## 126. Ideal Weight Workspace

- [x] 126.1 写 Ideal weight 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/ideal-weight-calculator.test.ts`, `sites/toolars/src/app/tools/ideal-weight-calculator/ideal-weight-calculator-workspace.test.tsx`
  - covers：workspace R69-S2, R69-S5
  - verify：`pnpm test -- ideal-weight-calculator`

- [x] 126.2 实现本地 Ideal weight 工作台
  - 文件：`sites/toolars/src/lib/tools/ideal-weight-calculator.ts`, `sites/toolars/src/app/tools/ideal-weight-calculator/**`
  - verify：`pnpm test -- ideal-weight-calculator`, `pnpm typecheck`, `pnpm build`

## 127. Steps To Calories Workspace

- [x] 127.1 写 Steps to calories 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/steps-to-calories.test.ts`, `sites/toolars/src/app/tools/steps-to-calories/steps-to-calories-workspace.test.tsx`
  - covers：workspace R69-S3, R69-S5
  - verify：`pnpm test -- steps-to-calories`

- [x] 127.2 实现本地 Steps to calories 工作台
  - 文件：`sites/toolars/src/lib/tools/steps-to-calories.ts`, `sites/toolars/src/app/tools/steps-to-calories/**`
  - verify：`pnpm test -- steps-to-calories`, `pnpm typecheck`, `pnpm build`

## 128. Biological Age Workspace

- [x] 128.1 写 Biological age 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/biological-age.test.ts`, `sites/toolars/src/app/tools/biological-age/biological-age-workspace.test.tsx`
  - covers：workspace R69-S4, R69-S5
  - verify：`pnpm test -- biological-age`

- [x] 128.2 实现本地 Biological age 工作台
  - 文件：`sites/toolars/src/lib/tools/biological-age.ts`, `sites/toolars/src/app/tools/biological-age/**`
  - verify：`pnpm test -- biological-age`, `pnpm typecheck`, `pnpm build`

## 129. 30-30-30 Method Workspace

- [x] 129.1 写 30-30-30 Method 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/30-30-30-method.test.ts`, `sites/toolars/src/app/tools/30-30-30-method/30-30-30-method-workspace.test.tsx`
  - covers：workspace R70-S1, R70-S5
  - verify：`pnpm test -- 30-30-30-method`

- [x] 129.2 实现本地 30-30-30 Method 工作台
  - 文件：`sites/toolars/src/lib/tools/30-30-30-method.ts`, `sites/toolars/src/app/tools/30-30-30-method/**`
  - verify：`pnpm test -- 30-30-30-method`, `pnpm typecheck`, `pnpm build`

## 130. GLP-1 Eligibility Workspace

- [x] 130.1 写 GLP-1 eligibility 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/glp1-eligibility.test.ts`, `sites/toolars/src/app/tools/glp1-eligibility/glp1-eligibility-workspace.test.tsx`
  - covers：workspace R70-S2, R70-S5
  - verify：`pnpm test -- glp1-eligibility`

- [x] 130.2 实现本地 GLP-1 eligibility 工作台
  - 文件：`sites/toolars/src/lib/tools/glp1-eligibility.ts`, `sites/toolars/src/app/tools/glp1-eligibility/**`
  - verify：`pnpm test -- glp1-eligibility`, `pnpm typecheck`, `pnpm build`

## 131. GLP-1 Nutrition Workspace

- [x] 131.1 写 GLP-1 nutrition 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/glp1-nutrition.test.ts`, `sites/toolars/src/app/tools/glp1-nutrition/glp1-nutrition-workspace.test.tsx`
  - covers：workspace R70-S3, R70-S5
  - verify：`pnpm test -- glp1-nutrition`

- [x] 131.2 实现本地 GLP-1 nutrition 工作台
  - 文件：`sites/toolars/src/lib/tools/glp1-nutrition.ts`, `sites/toolars/src/app/tools/glp1-nutrition/**`
  - verify：`pnpm test -- glp1-nutrition`, `pnpm typecheck`, `pnpm build`

## 132. GAD-7 Anxiety Workspace

- [x] 132.1 写 GAD-7 anxiety 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/gad7-anxiety.test.ts`, `sites/toolars/src/app/tools/gad7-anxiety/gad7-anxiety-workspace.test.tsx`
  - covers：workspace R70-S4, R70-S5
  - verify：`pnpm test -- gad7-anxiety`

- [x] 132.2 实现本地 GAD-7 anxiety 工作台
  - 文件：`sites/toolars/src/lib/tools/gad7-anxiety.ts`, `sites/toolars/src/app/tools/gad7-anxiety/**`
  - verify：`pnpm test -- gad7-anxiety`, `pnpm typecheck`, `pnpm build`

## 133. PHQ-9 Depression Workspace

- [x] 133.1 写 PHQ-9 depression 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/phq9-depression.test.ts`, `sites/toolars/src/app/tools/phq9-depression/phq9-depression-workspace.test.tsx`
  - covers：workspace R71-S1, R71-S5
  - verify：`pnpm test -- phq9-depression`

- [x] 133.2 实现本地 PHQ-9 depression 工作台
  - 文件：`sites/toolars/src/lib/tools/phq9-depression.ts`, `sites/toolars/src/app/tools/phq9-depression/**`
  - verify：`pnpm test -- phq9-depression`, `pnpm typecheck`, `pnpm build`

## 134. PSS-10 Stress Workspace

- [x] 134.1 写 PSS-10 stress 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/pss10-stress.test.ts`, `sites/toolars/src/app/tools/pss10-stress/pss10-stress-workspace.test.tsx`
  - covers：workspace R71-S2, R71-S5
  - verify：`pnpm test -- pss10-stress`

- [x] 134.2 实现本地 PSS-10 stress 工作台
  - 文件：`sites/toolars/src/lib/tools/pss10-stress.ts`, `sites/toolars/src/app/tools/pss10-stress/**`
  - verify：`pnpm test -- pss10-stress`, `pnpm typecheck`, `pnpm build`

## 135. ADHD Adult Screener Workspace

- [x] 135.1 写 ADHD adult screener 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/adhd-screener.test.ts`, `sites/toolars/src/app/tools/adhd-screener/adhd-screener-workspace.test.tsx`
  - covers：workspace R71-S3, R71-S5
  - verify：`pnpm test -- adhd-screener`

- [x] 135.2 实现本地 ADHD adult screener 工作台
  - 文件：`sites/toolars/src/lib/tools/adhd-screener.ts`, `sites/toolars/src/app/tools/adhd-screener/**`
  - verify：`pnpm test -- adhd-screener`, `pnpm typecheck`, `pnpm build`

## 136. Burnout Assessment Workspace

- [x] 136.1 写 Burnout assessment 逻辑与 UI 测试
  - 文件：`sites/toolars/src/lib/tools/burnout-assessment.test.ts`, `sites/toolars/src/app/tools/burnout-assessment/burnout-assessment-workspace.test.tsx`
  - covers：workspace R71-S4, R71-S5
  - verify：`pnpm test -- burnout-assessment`

- [x] 136.2 实现本地 Burnout assessment 工作台
  - 文件：`sites/toolars/src/lib/tools/burnout-assessment.ts`, `sites/toolars/src/app/tools/burnout-assessment/**`
  - verify：`pnpm test -- burnout-assessment`, `pnpm typecheck`, `pnpm build`

## 137. Core Modal Keyboard Focus And Stacking QA

- [x] 137.1 写 Core action modal keyboard/focus 回归测试
  - 文件：`sites/toolars/src/components/core/core-action-modal.test.tsx`
  - covers：workspace R72-S1, R72-S2, R72-S3
  - verify：`pnpm test -- core-action-modal`

- [x] 137.2 实现共享 Core modal 焦点恢复、Escape 关闭和单 active dialog guard
  - 文件：`sites/toolars/src/components/core/core-action-modal.tsx`
  - verify：`pnpm test -- core-action-modal`, `pnpm typecheck`, `pnpm build`

## 138. Settings Confirmation Dialog Keyboard Focus

- [x] 138.1 写 Settings confirmation dialog keyboard/focus 回归测试
  - 文件：`sites/toolars/src/app/settings/settings-view.test.tsx`, `sites/toolars/src/app/settings/security/security-settings-view.test.tsx`, `sites/toolars/src/app/settings/connected-apps/connected-apps-settings-view.test.tsx`
  - covers：workspace R73-S1, R73-S2, R73-S3
  - verify：`pnpm test -- settings-view security-settings-view connected-apps-settings-view`

- [x] 138.2 实现共享 settings dialog focus hook 并接入三类确认弹层
  - 文件：`sites/toolars/src/components/core/use-dialog-focus.ts`, `sites/toolars/src/app/settings/settings-view.tsx`, `sites/toolars/src/app/settings/security/security-settings-view.tsx`, `sites/toolars/src/app/settings/connected-apps/connected-apps-settings-view.tsx`
  - verify：`pnpm test -- settings-view security-settings-view connected-apps-settings-view`, `pnpm typecheck`, `pnpm build`

## 139. AI Consent Dialog Keyboard Focus And Consent Approval

- [x] 139.1 写 AI consent dialog keyboard/focus 回归测试
  - 文件：`sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.test.tsx`
  - covers：workspace R74-S1, R74-S2, R74-S3
  - verify：`pnpm test -- pdf-toolkit-workspace pdf-summary-workflow`

- [x] 139.2 实现共享 AI consent dialog 并接入 PDF Toolkit / PDF Summary workflow
  - 文件：`sites/toolars/src/components/core/ai-consent-dialog.tsx`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.tsx`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.tsx`, `sites/toolars/src/app/globals.css`
  - verify：`pnpm test -- pdf-toolkit-workspace pdf-summary-workflow`, `pnpm typecheck`, `pnpm build`

## 140. Command Center Mobile Density And Focus Trap

- [x] 140.1 写 Command Center focus trap / focus restore 回归测试
  - 文件：`sites/toolars/src/components/search/command-center.test.tsx`
  - covers：workspace R75-S1, R75-S2
  - verify：`pnpm test -- command-center`

- [x] 140.2 实现 Command Center Tab trap、close focus restore 与移动端密度修正
  - 文件：`sites/toolars/src/components/search/command-center.tsx`, `sites/toolars/src/app/globals.css`
  - covers：workspace R75-S1, R75-S2, R75-S3
  - verify：`pnpm test -- command-center`, `pnpm typecheck`, `pnpm build`, in-app Browser mobile QA at 390px

## 141. File Upload Overlay And Command Center Long-Result Stress

- [x] 141.1 写 PDF upload overlay 与 Command Center long-result stress 回归测试
  - 文件：`sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx`, `sites/toolars/src/components/search/command-center.test.tsx`, `sites/toolars/src/lib/command-search.test.ts`
  - covers：workspace R76-S1, R76-S2, R76-S3
  - verify：`pnpm test -- command-search command-center pdf-toolkit-workspace`

- [x] 141.2 实现本地 PDF upload dialog、Command Center 默认长结果窗口与移动端 stress QA
  - 文件：`sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.tsx`, `sites/toolars/src/components/search/command-center.tsx`, `sites/toolars/src/lib/command-search.ts`, `sites/toolars/src/app/globals.css`
  - covers：workspace R76-S1, R76-S2, R76-S3, R76-S4
  - verify：`pnpm test -- command-search command-center pdf-toolkit-workspace`, `pnpm typecheck`, `pnpm build`, in-app Browser overlay/long-result QA

## 142. AI Provider Routing And Consent Audit Persistence

- [x] 142.1 写 AI provider routing、consent audit storage、PDF Summary 与 Privacy & AI 回归测试
  - 文件：`sites/toolars/src/lib/ai/provider-routing.test.ts`, `sites/toolars/src/lib/ai/consent-audit-storage.test.ts`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.test.tsx`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx`
  - covers：workspace R77-S1, R77-S2, R77-S3, R77-S4
  - verify：`pnpm test -- pdf-summary-workflow privacy-ai-settings provider-routing consent-audit-storage`

- [x] 142.2 实现本地 AI provider route、versioned consent audit persistence 与 Privacy & AI audit rendering
  - 文件：`sites/toolars/src/lib/ai/provider-routing.ts`, `sites/toolars/src/lib/ai/consent-audit-storage.ts`, `sites/toolars/src/components/core/ai-consent-dialog.tsx`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.tsx`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.tsx`, `sites/toolars/src/app/globals.css`
  - covers：workspace R77-S1, R77-S2, R77-S3, R77-S4
  - verify：`pnpm test -- pdf-summary-workflow privacy-ai-settings provider-routing consent-audit-storage`, `pnpm typecheck`, `pnpm build`, in-app Browser consent/audit QA

## 143. Server AI Audit Ledger And Run Metadata

- [x] 143.1 写 server consent audit API、PDF Summary POST 与 Privacy server ledger 回归测试
  - 文件：`sites/toolars/src/app/api/ai/consent-audit/route.test.ts`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.test.tsx`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx`
  - covers：workspace R78-S1, R78-S2, R78-S3
  - verify：`pnpm test -- app/api/ai/consent-audit pdf-summary-workflow privacy-ai-settings`

- [x] 143.2 实现 server audit ledger、run metadata helper、API route、PDF Summary POST 与 Privacy server ledger UI
  - 文件：`sites/toolars/src/lib/ai/server-consent-audit-ledger.ts`, `sites/toolars/src/lib/ai/consent-audit-run-metadata.ts`, `sites/toolars/src/app/api/ai/consent-audit/route.ts`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.tsx`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.tsx`
  - covers：workspace R78-S1, R78-S2, R78-S3
  - verify：`pnpm test -- app/api/ai/consent-audit pdf-summary-workflow privacy-ai-settings`, `pnpm typecheck`, `pnpm build`, in-app Browser consent/server-ledger QA

## 144. Real PDF File Upload Lifecycle

- [x] 144.1 写 PDF File API upload lifecycle 与 PDF Toolkit queue/delete 回归测试
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-lifecycle.test.ts`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx`
  - covers：workspace R79-S1, R79-S2, R79-S3, R79-S4
  - verify：`pnpm test -- pdf-upload-lifecycle pdf-toolkit-workspace`

- [x] 144.2 实现真实 file input、local scan、session retention、ready queue、delete state 与 mobile overflow 修复
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-lifecycle.ts`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.tsx`, `sites/toolars/src/app/globals.css`
  - covers：workspace R79-S1, R79-S2, R79-S3, R79-S4
  - verify：`pnpm test -- pdf-upload-lifecycle pdf-toolkit-workspace`, `pnpm typecheck`, `pnpm build`, in-app Browser upload overlay desktop/mobile QA

## 145. Privacy AI History Export And Deletion Audit

- [x] 145.1 写 AI consent audit DELETE、local clear 与 Privacy export/delete 回归测试
  - 文件：`sites/toolars/src/app/api/ai/consent-audit/route.test.ts`, `sites/toolars/src/lib/ai/consent-audit-storage.test.ts`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx`
  - covers：workspace R80-S1, R80-S2, R80-S3
  - verify：`pnpm test -- app/api/ai/consent-audit privacy-ai-settings consent-audit-storage`

- [x] 145.2 实现 server deletion ledger、local audit clear、Privacy JSON export 与 deletion audit UI
  - 文件：`sites/toolars/src/lib/ai/server-consent-audit-ledger.ts`, `sites/toolars/src/app/api/ai/consent-audit/route.ts`, `sites/toolars/src/lib/ai/consent-audit-storage.ts`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.tsx`
  - covers：workspace R80-S1, R80-S2, R80-S3
  - verify：`pnpm test -- app/api/ai/consent-audit privacy-ai-settings consent-audit-storage`, `pnpm typecheck`, `pnpm build`, Playwright Privacy export/delete QA

## 146. Workspace Scoped Durable AI Audit Store

- [x] 146.1 写 server ledger JSON store 与 workspace scoped API 回归测试
  - 文件：`sites/toolars/src/lib/ai/server-consent-audit-ledger.test.ts`, `sites/toolars/src/app/api/ai/consent-audit/route.test.ts`
  - covers：workspace R81-S1, R81-S2
  - verify：`pnpm test -- app/api/ai/consent-audit server-consent-audit-ledger`

- [x] 146.2 实现 JSON-backed server audit store、workspace header scope 与 build-safe Node route
  - 文件：`sites/toolars/src/lib/ai/server-consent-audit-ledger.ts`, `sites/toolars/src/app/api/ai/consent-audit/route.ts`
  - covers：workspace R81-S1, R81-S2, R81-S3
  - verify：`pnpm test -- app/api/ai/consent-audit server-consent-audit-ledger privacy-ai-settings pdf-summary-workflow`, `pnpm typecheck`, `pnpm build`, HTTP workspace scope smoke

## 147. Anonymous Workspace Identity Audit Headers

- [x] 147.1 写 anonymous workspace identity、PDF Summary header 与 Privacy header 回归测试
  - 文件：`sites/toolars/src/lib/workspace/workspace-identity.test.ts`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.test.tsx`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.test.tsx`
  - covers：workspace R82-S1, R82-S2, R82-S3
  - verify：`pnpm test -- workspace-identity pdf-summary-workflow privacy-ai-settings`

- [x] 147.2 实现匿名 workspace identity localStorage 与 audit API header 接入
  - 文件：`sites/toolars/src/lib/workspace/workspace-identity.ts`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.tsx`, `sites/toolars/src/app/settings/privacy-ai/privacy-ai-settings-view.tsx`
  - covers：workspace R82-S1, R82-S2, R82-S3
  - verify：`pnpm test -- workspace-identity pdf-summary-workflow privacy-ai-settings app/api/ai/consent-audit server-consent-audit-ledger`, `pnpm typecheck`, `pnpm build`, Playwright request-header QA

## 148. Account-Bound Anonymous Workspace Ledger

- [x] 148.1 写 anonymous identity account binding、server ledger account binding 与 API PATCH 回归测试
  - 文件：`sites/toolars/src/lib/workspace/workspace-identity.test.ts`, `sites/toolars/src/lib/ai/server-consent-audit-ledger.test.ts`, `sites/toolars/src/app/api/ai/consent-audit/route.test.ts`
  - covers：workspace R83-S1, R83-S2
  - verify：`pnpm test -- workspace-identity server-consent-audit-ledger app/api/ai/consent-audit`

- [x] 148.2 实现匿名 workspace identity 到 future account 的本地绑定、account audit header、server ledger binding 与 account-scope GET
  - 文件：`sites/toolars/src/lib/workspace/workspace-identity.ts`, `sites/toolars/src/lib/ai/server-consent-audit-ledger.ts`, `sites/toolars/src/app/api/ai/consent-audit/route.ts`
  - covers：workspace R83-S1, R83-S2
  - verify：`pnpm test -- workspace-identity server-consent-audit-ledger app/api/ai/consent-audit`, `pnpm typecheck`

## 149. PDF Upload Temp Store And Summary Handoff

- [x] 149.1 写 PDF upload server temp store、API route、Toolkit handoff 和 Summary handoff 回归测试
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.test.ts`, `sites/toolars/src/app/api/pdf/uploads/route.test.ts`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.test.tsx`
  - covers：workspace R84-S1, R84-S2, R84-S3, R84-S4
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads pdf-toolkit-workspace pdf-summary-workflow`

- [x] 149.2 实现 JSON-backed PDF temp object store、metadata scan worker、`/api/pdf/uploads` POST/GET/DELETE、Toolkit server registration 与 Summary file handoff
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.ts`, `sites/toolars/src/app/api/pdf/uploads/route.ts`, `sites/toolars/src/lib/tools/pdf-upload-lifecycle.ts`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.tsx`, `sites/toolars/src/app/workflows/pdf-summary/pdf-summary-workflow.tsx`
  - covers：workspace R84-S1, R84-S2, R84-S3, R84-S4
  - verify：`pnpm test -- workspace-identity server-consent-audit-ledger app/api/ai/consent-audit pdf-upload-server-store app/api/pdf/uploads pdf-toolkit-workspace pdf-summary-workflow`, `pnpm typecheck`, `pnpm build`, browser handoff QA

## 150. Signed PDF Handoff And Retention Sweep

- [x] 150.1 写 signed handoff URL、tamper rejection、expired sweep 与 deletion audit 回归测试
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.test.ts`, `sites/toolars/src/app/api/pdf/uploads/route.test.ts`
  - covers：workspace R85-S1, R85-S2, R85-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads`

- [x] 150.2 实现 PDF temp object signed handoff、HMAC 校验、retention sweep 和 deletion audit ledger
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.ts`, `sites/toolars/src/app/api/pdf/uploads/route.ts`
  - covers：workspace R85-S1, R85-S2, R85-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads`, `pnpm typecheck`, `pnpm build`

## 151. PDF Signed Object URL And Storage Retry UI

- [x] 151.1 写 signed object URL、handoff response 与 storage retry UI 回归测试
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.test.ts`, `sites/toolars/src/app/api/pdf/uploads/route.test.ts`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.test.tsx`
  - covers：workspace R86-S1, R86-S2, R86-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads pdf-toolkit-workspace`

- [x] 151.2 实现 PDF temp object signed object URL、upload lifecycle storage state 与 Toolkit retry handoff UI
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.ts`, `sites/toolars/src/lib/tools/pdf-upload-lifecycle.ts`, `sites/toolars/src/app/tools/pdf-toolkit/pdf-toolkit-workspace.tsx`
  - covers：workspace R86-S1, R86-S2, R86-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads pdf-toolkit-workspace`, `pnpm typecheck`, `pnpm build`

## 152. PDF Temp Object Content Read Route

- [x] 152.1 写 signed object content resolver 与 `/api/pdf/uploads/object` 回归测试
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.test.ts`, `sites/toolars/src/app/api/pdf/uploads/route.test.ts`
  - covers：workspace R87-S1, R87-S2, R87-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads`

- [x] 152.2 实现本地 PDF temp content store、signed object resolver 与 object GET route
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.ts`, `sites/toolars/src/app/api/pdf/uploads/route.ts`, `sites/toolars/src/app/api/pdf/uploads/object/route.ts`
  - covers：workspace R87-S1, R87-S2, R87-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads`, `pnpm typecheck`, `pnpm build`

## 153. PDF Temp Content Cleanup And Object Read Audit

- [x] 153.1 写 temp content cleanup 与 object read audit 回归测试
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.test.ts`, `sites/toolars/src/app/api/pdf/uploads/route.test.ts`
  - covers：workspace R88-S1, R88-S2, R88-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads`

- [x] 153.2 实现 user delete / expired sweep content cleanup、object access audit ledger 与 API 回包
  - 文件：`sites/toolars/src/lib/tools/pdf-upload-server-store.ts`, `sites/toolars/src/app/api/pdf/uploads/route.ts`, `sites/toolars/src/app/api/pdf/uploads/object/route.ts`
  - covers：workspace R88-S1, R88-S2, R88-S3
  - verify：`pnpm test -- pdf-upload-server-store app/api/pdf/uploads`, `pnpm typecheck`, `pnpm build`
