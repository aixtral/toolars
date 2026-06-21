# Proposal: rebuild-toolars-platform

## 业务上下文

Toolars 要整合 VitalCalc 和 Aixtral Lab 两个工具网站，成为新的全领域工具工作台。设计师已经提供 57 张高保真图与设计方案，当前仓库需要从设计交付空间进入可验证开发空间。

## 问题陈述

当前 `toolars` 仓库没有可运行的新站代码，且旧 `site/`、旧 docs 和旧 specs 在工作树中处于删除状态。两个源项目的能力分散在 Astro 计算器站和 Next.js AI/开发者工具站中，不能直接合并 UI，否则会破坏新设计的 Tool Market、Command Search、Workspace 和 AI consent 架构。

## 范围

### 包含

- 补全 PRD、设计规格、技术架构、实施计划、验收标准。
- 建立 CDC spec 四工件。
- 在 `sites/toolars/` 启动 Next.js + TypeScript + Vitest 重建。
- 第一批实现 registry、command search、JSON Repair pure function 和首批页面骨架。

### 不包含

- 不迁移旧 UI。
- 不接入真实 AI provider、账号、支付和数据库。
- 不为所有 178 个源工具逐个创建独立高保真页面。

## 业务价值

| 指标 | 当前 | 目标 |
|---|---|---|
| 新站可运行性 | 无应用代码 | `sites/toolars` 可测试、可构建、可预览 |
| 工具资产归一 | 两个项目分散 | 一个 typed registry |
| 视觉一致性 | 原型与新仓库分离 | 路由映射到设计稿 |
| 开发纪律 | 无新站测试 | 首批逻辑先 Red 再 Green |

## 受影响干系人

- 用户: 获得搜索优先、可连续处理任务的统一工具站。
- 设计: 高保真图成为实现合同。
- 工程: 有清晰模块边界、测试和后续迁移顺序。

## Stakeholder OK

来源: 用户在 2026-06-12 明确要求“严格基于 toolars 中的设计稿及设计方案，按照 CDC 流程，完善产品需求、设计方案、技术方案，并开始重新开发 toolars 工具站”。
