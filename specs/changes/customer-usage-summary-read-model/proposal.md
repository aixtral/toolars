# Proposal: customer-usage-summary-read-model

## 业务上下文

Toolars 已完成 AI 生成、PDF/CSV 导出、批量工具的 plan gate 和 usage meter 基础能力，也已接入 Lemon Squeezy checkout / portal handoff。下一步需要让登录用户在产品界面和 API 中看到当前周期的 Pro 用量状态，避免付费能力只存在于后端 gate 中。

## 问题陈述

当前 `/app/repurpose` 的 billing card 使用静态 plan limit 展示剩余 AI generations，没有读取真实 usage snapshot；导出和批量额度也没有客户可见的统一摘要。用户无法判断本月剩余额度，客服和后续 plan upsell 也缺少稳定读模型。

## 范围

### 包含

- 新增 usage summary 纯函数，把 plan limit 与 usage snapshot 合成为客户可见摘要。
- 新增只读 API `GET /api/usage/summary`，供前端和未来 dashboard 消费用量。
- 更新 billing usage card，展示 AI generations、exports、batch runs 的 used / remaining / limit。
- 在 `/app/repurpose` 中读取当前用户本月 usage snapshot 并展示真实摘要。
- 保持 calculator 免费页和 public SEO 页面不依赖 account / billing / usage。

### 不包含（YAGNI）

- 不新增数据库表；沿用现有 usage repository / Supabase adapter。
- 不实现 webhook 后的订阅同步；该能力由后续 subscription sync spec 处理。
- 不新增图表、历史月份报表或团队 seat 分摊。
- 不迁移第二阶段多语言内容。

## 业务价值

| 指标 | 当前 | 目标 |
|---|---|---|
| Paid capability transparency | 用户只能看到静态 AI limit | 用户可看到当前周期 AI / export / batch 剩余量 |
| Support burden | 额度问题需要后端排查 | 用户和客服可用同一 summary 口径 |
| Upgrade readiness | Pro gate 缺少可见反馈 | UI 可基于剩余额度做 upsell / renewal copy |

## 受影响干系人

- 用户：能理解本月 Pro 额度使用情况。
- 产品：获得统一 usage summary copy 与 future dashboard 基础。
- 系统：复用现有 usage repository，避免 gate 逻辑和 UI 口径漂移。
