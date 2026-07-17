# Toolars 生产环境变量确认单（Release P0 Blocker）

日期: 2026-07-16
状态: 待 owner 确认 — 当前唯一发布硬阻塞
用法: 由有托管平台（Vercel）后台权限的人逐项确认/填写，完成后按末节跑 `release:health` 取证。
依据: `sites/toolars/.env.example`、`plans/release-go-no-go-checklist.md`、`docs/architecture/PHASE1-FREE-SUPABASE-LAUNCH-PLAN.md`。

## 1. 必填变量（缺任何一个 = No-Go）

在托管方后台（预发 + 生产两套）设置，不能只存在于本地 `.env.local`。

| 变量 | 值/来源 | 确认 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 真实 canonical 生产域（非 `toolars-two.vercel.app` 临时域）。必须与 OAuth redirect、sitemap、robots、OpenGraph、JSON-LD、CDN/域名配置一致 | [ ] |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → Data API | [ ] |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 同上（legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` 仅迁移期兼容） | [ ] |
| `SUPABASE_SECRET_KEY` | 服务端特权任务用；绝不出现在 `NEXT_PUBLIC_*` 或客户端 bundle | [ ] |
| `TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY` | `openssl rand -base64 48` 生成；生产 PDF 上传**不允许**本地 fallback | [ ] |
| `TOOLARS_UPLOAD_HANDOFF_SECRET` | 同上，独立生成一个 | [ ] |
| `TOOLARS_AUTH_SESSION_SECRET` | legacy 签名 session fallback（Phase 1 主线是 Supabase Auth，此项目前仅作迁移/旧路由兜底，go/no-go 仍要求显式确认） | [ ] |

## 2. 持久化：生产走 Supabase，不设 TOOLARS_DATA_DIR

Vercel serverless 没有持久磁盘（文件系统只读，`/tmp` 调用间失效），`TOOLARS_DATA_DIR` 在生产无意义，文件型 store 仅是本地/legacy 兜底（生产健康检查将其标记为 `legacy-disabled`）。生产持久化已在代码内建 Supabase 驱动（`src/lib/supabase/toolars-private-data.ts`：Postgres 表 + Storage bucket）。

- [ ] 生产 Supabase 项目已按顺序应用 3 个 migration：`supabase/migrations/202607060001_phase1_foundation.sql`、`202607110001_workspace_runtime.sql`、`202607120001_secure_private_runtime.sql`。
- [ ] Supabase Storage 已建私有 bucket `toolars-pdf-temp`（PDF 上传加密对象）。
- [ ] 已知免费档限制并确认可接受：项目**一周不活跃会暂停**（预发环境注意）；数据库 500MB；Storage 1GB 且单文件上限 50MB（与应用自身 PDF 50MB 上限恰好同界）。
- [ ] owner 确认 PDF 上传数据保留策略（go/no-go 人工确认项）。

## 3. 五个决策项（零代码，但必须显式拍板）

0. **托管计划**: Vercel Hobby 计划 ToS 明确限制非商业用途（"restricts users to non-commercial, personal use only"）。Toolars 是商业化产品，上线应使用 Pro（$20/seat/月起），或明确记录接受该风险。
1. **认证模式**: Phase 1 主线 = Supabase Auth（Google 登录）。legacy `GOOGLE_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI` 是否配置？不配置则视为接受 legacy fallback 不可用。
2. **Free Trial Mode**: `NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE=enabled`（默认，隐藏 Pricing/Billing）还是 `disabled` 并配好 `TOOLARS_BILLING_PROVIDER_ENDPOINT/API_KEY` + 付费文案？当前建议保持 enabled。
3. **AI provider**: `TOOLARS_AI_PROVIDER_ENDPOINT/API_KEY` 不配置时 AI 路由返回 "not configured"（`release:health` 仅 warning）。接受还是配置？
4. **可观测性**: Sentry（`SENTRY_DSN`/`SENTRY_ORG`/`SENTRY_PROJECT`/`NEXT_PUBLIC_SENTRY_DSN`）与 PostHog（`NEXT_PUBLIC_POSTHOG_KEY/HOST`）上线是否启用？不启用则为 no-op，无代码影响。

另：`TOOLARS_ADMIN_USER_IDS` 需设为 owner/运营 ID 列表，否则 admin 审核台无人可用。

## 4. 草稿 locale 确认（一条即可）

- [ ] 确认 `ar/fr/hi/ja/pt/ru` 6 个草稿 locale 保持非公开：无公开路由、无 sitemap 条目、无 hreflang、语言切换器不展示（现状已由 smoke 验证，选此项=零工作量）。若要毕业，走 launch-locale checklist 另立流程。

## 4.5 刷新 CI 临时部署（顺带完成，解锁 deployed-smoke 强制门禁）

CI 的 "Temporary production certified tool smoke" 步骤对固定域 `toolars-two.vercel.app` 跑认证 smoke。该部署已过期：新 dedicated route 返回 404（实测 `/en/tools/percentage-calculator` 404），旧 DOM 导致部分场景超时。2026-07-16 起该步骤对 PR 降级为信息项（`continue-on-error`），main 推送保持阻断。

- [ ] 将 `toolars-two.vercel.app` 重新部署到当前 main（或把仓库 Actions 变量 `TOOLARS_TEMP_PRODUCTION_ORIGIN` 指向新临时部署）。
- [ ] 部署刷新后跑一次 main 分支 CI 确认该步骤恢复绿色；如长期用 preview 部署替代固定域，另立 workflow 改造任务。

## 5. 验证步骤（确认完 1–4 后执行）

```bash
# 预发
pnpm run --silent release:health -- --base-url "$TOOLARS_PREPRODUCTION_URL"
# 生产
pnpm run --silent release:health -- --base-url "$TOOLARS_PRODUCTION_URL"
```

- 要求两次均 `Status: pass`；Supabase 公共配置与 Free Trial Mode 是 blocker 级，AI/Billing provider 仅 warning。
- 将两次输出原文附到 release candidate（贴在本文件末节或 PR 描述）。
- 另需 owner 提供 `TOOLARS_PREPRODUCTION_URL` / `TOOLARS_PRODUCTION_URL` 两个值本身（2026-07-10 全仓搜索只有占位符）。

## 6. 部署后 smoke 与回滚（go/no-go 清单摘录）

- 部署后立刻走查：首页、分类页、博客页、一个本地化工具详情、PDF 上传链路、`/api/system/production-health`、sitemap、语言切换器。
- 盯日志关键字：`MISSING_MESSAGE`、auth session secret 错误、PDF 加密/handoff 错误、存储路径 fallback 警告、OAuth 503、AI provider not-configured、billing preview fallback。
- 记录 deploy SHA、上一个稳定 SHA、发布时间、环境变量快照负责人；保留上一稳定部署以便立即回滚。
- 回滚触发条件：生产 env 校验失败、PDF 数据无法解密读取、上线 locale 破坏公开导航、生成产物误入发布资产。

## 7. 证据存档

- [ ] 预发 `release:health` 输出（粘贴处）
- [ ] 生产 `release:health` 输出（粘贴处）
- [ ] owner 签字确认上述变量已在托管方后台设置（非仅本地文件）
