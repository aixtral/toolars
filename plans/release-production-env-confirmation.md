# Toolars 生产环境变量确认单（Release P0 Blocker）

日期: 2026-07-16（2026-07-18 更新）
状态: 环境变量全部就位；深度 health 已 pass。剩余：3 个决策 + 域名注册（发布阻断），见 §8 汇总
用法: 由有托管平台（Vercel）后台权限的人逐项确认/填写，完成后按末节跑 `release:health` 取证。
依据: `sites/toolars/.env.example`、`plans/release-go-no-go-checklist.md`、`docs/architecture/PHASE1-FREE-SUPABASE-LAUNCH-PLAN.md`。

## 1. 必填变量（缺任何一个 = No-Go）

| 变量 | 值/来源 | 确认 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ owner 决策（2026-07-18）：现阶段沿用临时域 `toolars-two.vercel.app`，功能全 OK 后切正式域。**正式域 `toolars.com` 尚未注册 → 见 §8 发布阻断项** | [x] 决策已记 |
| `NEXT_PUBLIC_SUPABASE_URL` | 已在 Vercel 设置（Production+Preview） | [x] |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 已在 Vercel 设置（Production+Preview） | [x] |
| `SUPABASE_SECRET_KEY` | ✅ 2026-07-18 owner 提供，已写入 Production+Preview（Sensitive） | [x] |
| `TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY` | ✅ 2026-07-18 已生成并写入 Production+Preview（Sensitive） | [x] |
| `TOOLARS_UPLOAD_HANDOFF_SECRET` | ✅ 2026-07-18 已生成并写入 Production+Preview（Sensitive） | [x] |
| `TOOLARS_AUTH_SESSION_SECRET` | ✅ 2026-07-18 已生成并写入 Production+Preview（Sensitive） | [x] |

密钥本地备份：`/tmp/toolars-secrets-local.env`（600 权限），建议 owner 存入密码管理器后删除。`TOOLARS_HEALTHCHECK_TOKEN` 已轮换为新值（同文件内），旧值作废。

**深度健康检查证据（2026-07-18，重新部署后）**：`TOOLARS_HEALTHCHECK_TOKEN` + `pnpm run release:health -- --base-url https://toolars-two.vercel.app` → `Status: pass`，blockers `none`，详细运行时状态全过，唯一 warning 为 AI provider 未配置（决策项 3）。

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

## 4.5 CI 临时部署（已自愈，仅需知悉）

CI 的 "Temporary production certified tool smoke" 步骤对固定域 `toolars-two.vercel.app` 跑认证 smoke。该域由 Vercel Git 集成跟随 main 自动部署：**2026-07-16 验证已刷新**（`/en/tools/percentage-calculator` 200，main CI deployed smoke 恢复绿色）。2026-07-19 起 CI 改为**全手动触发**（Actions 付费限额被打穿后的成本控制）：不在 push/PR 时自动运行，提交后由人在 Actions 页手动触发——先跑 ~5 分钟快速静态门禁（类型、全量单测、i18n/按钮审计），通过后串行跑 ~31 分钟完整门禁（含浏览器门禁与 deployed smoke）。

- [x] 临时部署刷新 — 自动完成，无需操作
- [ ] 知悉：临时域公共 `release:health` 已 pass；详细运行时状态需要 `TOOLARS_HEALTHCHECK_TOKEN`（见 §5）

## 5. 验证步骤（确认完 1–4 后执行）

```bash
# 预发
pnpm run --silent release:health -- --base-url "$TOOLARS_PREPRODUCTION_URL"
# 生产
pnpm run --silent release:health -- --base-url "$TOOLARS_PRODUCTION_URL"
```

- 要求两次均 `Status: pass`；Supabase 公共配置与 Free Trial Mode 是 blocker 级，AI/Billing provider 仅 warning。
- 公共检查只覆盖公开状态；**详细运行时状态（PDF 密钥、session 密钥、存储路径等）需要部署端设置 `TOOLARS_HEALTHCHECK_TOKEN` 并把该值交给执行验证的人**，随 `release:health` 一并取证。
- 将两次输出原文附到 release candidate（贴在本文件末节或 PR 描述）。
- 另需 owner 提供 `TOOLARS_PREPRODUCTION_URL` / `TOOLARS_PRODUCTION_URL` 两个值本身（2026-07-10 全仓搜索只有占位符）。

## 6. 部署后 smoke 与回滚（go/no-go 清单摘录）

- 部署后立刻走查：首页、分类页、博客页、一个本地化工具详情、PDF 上传链路、`/api/system/production-health`、sitemap、语言切换器。
- 盯日志关键字：`MISSING_MESSAGE`、auth session secret 错误、PDF 加密/handoff 错误、存储路径 fallback 警告、OAuth 503、AI provider not-configured、billing preview fallback。
- 记录 deploy SHA、上一个稳定 SHA、发布时间、环境变量快照负责人；保留上一稳定部署以便立即回滚。
- 回滚触发条件：生产 env 校验失败、PDF 数据无法解密读取、上线 locale 破坏公开导航、生成产物误入发布资产。

## 7. 证据存档

- [x] 临时域（toolars-two.vercel.app）深度 `release:health`（2026-07-18，含 `TOOLARS_HEALTHCHECK_TOKEN`）：`Status: pass`，blockers `none`，**warnings `none`**（AI provider 接入后告警清零）
- [x] DeepSeek 端到端（2026-07-18）：`POST /api/ai/deepseek-gateway/runs` 带网关 bearer → `201`，返回 `deepseek-v4-flash` 真实补全与 token 用量
- [ ] 预发 `release:health` 输出（粘贴处）
- [ ] 生产 `release:health` 输出（粘贴处）
- [ ] owner 签字确认上述变量已在托管方后台设置（非仅本地文件）

## 8. 剩余 owner 事项汇总（2026-07-18 时点）

1. ~~提供 `SUPABASE_SECRET_KEY`~~ 已完成（2026-07-18 写入双环境）。
2. ~~`NEXT_PUBLIC_SITE_URL` 确认~~ 已决策：现阶段沿用临时域，发布前切换。**发布阻断：正式域 `toolars.com` 尚未注册——尽快注册，注册后改绑 Vercel 域、更新该变量与 `TOOLARS_AI_PROVIDER_ENDPOINT`（Production+Preview）、复核 sitemap/robots/OG/JSON-LD 与 Supabase Auth 回调域**。
3. ~~`NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE` 确认~~ 已确认 `enabled`（2026-07-18）。
4. ~~AI provider~~ 已完成（2026-07-18）：内置 DeepSeek 网关（PR #28）+ `TOOLARS_DEEPSEEK_API_KEY`，端到端真实调用验证通过，health 检查 warnings 归零。Sentry（org `stanvl` / project `toolars`）与 PostHog（US 区）变量已写入双环境，随部署生效。
5. 决策仍待：托管计划（Hobby 禁商用 vs Pro，发布付费功能前必须 Pro）。
6. 正式环境 URL 口径：`toolars-two.vercel.app` 即当前生产候选部署；预发可用 main 的 Preview 部署。切正式域名后执行 §5 双环境 `release:health` 取证并归档。
