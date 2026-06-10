# Tasks: customer-usage-summary-read-model

按依赖顺序执行。每个 task 完成后打勾并提交一次。

## 0. 准备

- [x] 0.1 创建 feature 分支 `feat/customer-usage-summary-read-model`
- [x] 0.2 确认测试基线可运行

## 1. Usage summary read model

- [x] 1.1 写 `site/lib/usage/__tests__/summary.test.ts`
  - 用例：R1-S1, R1-S2
  - covers：R1-S1, R1-S2
- [x] 1.2 实现 `site/lib/usage/summary.ts`
  - 关键：纯函数，不依赖 React / Next.js / Supabase / browser
- [x] 1.3 跑 focused usage tests
- [x] 1.4 commit：`feat(usage): add customer usage summary read model (task 1.4)`

## 2. Usage summary API

- [x] 2.1 写 `site/app/api/usage/summary/route.test.ts`
  - 用例：R2-S1, R2-S2
  - covers：R2-S1, R2-S2
- [x] 2.2 实现 `site/app/api/usage/summary/route.ts`
  - 关键：GET only, session required, read snapshot only, dependency injection for tests
- [x] 2.3 跑 focused API tests
- [x] 2.4 commit：`feat(api): expose usage summary endpoint (task 2.4)`

## 3. Billing UI integration

- [x] 3.1 更新 `site/components/billing/__tests__/billing.test.tsx`
  - 用例：R3-S1
  - covers：R3-S1
- [x] 3.2 更新 `site/components/billing/billing-cards.tsx`
  - 关键：render AI / exports / batch usage from summary
- [x] 3.3 更新 `site/app/app/repurpose/page.tsx`
  - 关键：server-read current usage summary for authenticated session
- [x] 3.4 跑 focused billing / app tests
- [x] 3.5 commit：`feat(billing): show customer usage summary in app (task 3.5)`

## 4. 复核与发布准备

- [x] 4.1 跑 `pnpm --dir site lint`
- [x] 4.2 跑 `pnpm --dir site type-check`
- [x] 4.3 跑 `pnpm --dir site test`
- [x] 4.4 跑 calculator isolation coverage for R4-S1
- [x] 4.5 更新 `progress.md` 和本 tasks 状态
- [x] 4.6 commit：`chore(spec): close customer usage summary pass (task 4.6)`
- [x] 4.7 push branch and open draft PR
