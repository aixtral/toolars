# Toolars PRD

版本: v0.1
日期: 2026-06-12
状态: 重建启动版
视觉来源: `design/*.png`, `design/Toolars-design-proposal.md`

## 1. 产品目标

Toolars 是一个全领域混合工具平台，产品承诺是:

> All tools. One workspace.

它不是把两个旧站简单拼接，而是把 VitalCalc 的传统健康/金融/日常工具流量资产，和 Aixtral Lab 的 AI/开发者工具专业资产，统一进一个搜索优先、工作台优先、信任标识清晰的工具站。

## 2. 源项目事实

| 来源 | 当前事实 | 迁移策略 |
|---|---:|---|
| `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc` | Astro 工具目录；当前 `src/pages/tools` 有 86 个根工具页，粗分 Finance 30、Health 36、Other 20；包含已有 Toolars 高保真原型数据 | 迁移工具清单、计算公式、SEO 经验和本地处理承诺；不迁移旧 UI |
| `/Users/stanvl/Documents/dev/ai-repo/aixtral-lab` | Next.js AI/开发者工具站；`src/lib/tool-config.ts` 有 92 个工具，含 37 Developer、15 Frontend/Design、14 Text/Productivity、10 AI Security、6 RAG/MCP/Agent、5 LLM Cost、5 Prompt Engineering | 迁移工具清单、纯函数、测试资产和专业工具族；UI 重建为 Toolars AI Developer Lab |
| `/Users/stanvl/Documents/dev/ai-repo/toolars/design` | 57 张桌面/移动高保真图，加核心状态板 | 作为视觉与产品架构合同 |

## 3. 目标用户

- 知识工作者: PDF、总结、邮件、翻译、表格处理。
- 创作者和运营: 图片处理、社媒文案、视频笔记、配色、二维码。
- 开发者和产品人员: JSON、CSS、正则、编码转换、LLM 成本、MCP、Prompt 安全。
- 普通用户: 金融计算、健康计算、单位换算、日常工具。

## 4. 核心用户路径

1. 用户知道工具名时，通过 Command Search 直接打开工具。
2. 用户只知道任务时，输入自然语言任务，Toolars 推荐传统工具、AI 工具或工作流。
3. 用户进入工具工作台后，在同一个页面完成输入、处理、输出、复制/下载、下一步推荐。
4. 用户使用 AI 处理前，必须看到 AI consent gate，明确数据会被发送给模型。
5. 用户可保存工具、输出或集合；匿名阶段优先本地保存，账号阶段同步到云端。

## 5. MVP 范围

首批重建必须完成:

- Route-aware Shell: `tools`, `workflows`, `collections`, `workspace`, `billing`, `settings`, `admin`, `none`。
- Command Center: `Cmd/Ctrl+K`、搜索、分组、空状态、快捷动作。
- Explore 首页: Toolars Picks、Popular tools、Popular workflows、信任模块、AI Developer Lab 入口。
- PDF directory: 搜索、筛选、子分类、Featured workflows、Recommended path。
- AI Developer Lab directory: 22 个代表工具、playbooks、Lab workflows。
- JSON Repair workspace: 本地输入、修复、输出、复制、Next steps。
- 数据 registry: tools、workflows、collections、source inventory metadata。
- 设计/产品/技术文档和 CDC spec。

## 6. MVP 不包含

- 不为 92 个 Aixtral Lab 长尾工具手写独立页面。
- 不为 86 个 VitalCalc 工具逐个手写定制 UI。
- 不在第一批接入真实账号、支付、文件上传存储、AI provider 调用。
- 不复用旧站视觉、混合旧 Tailwind 样式或旧 Astro 页面结构。

## 7. 商业化规则

- 免费: 本地传统工具、基础目录、基础 JSON/PDF/计算器工具。
- Freemium: AI enhance、保存集合、历史输出、批量处理、专业导出。
- Paid/Pro: API hooks、团队集合、审计日志、AI credits、MCP/Prompt/成本工作流高级能力。

## 8. 成功指标

| 指标 | MVP 目标 |
|---|---|
| 工具发现 | 首页和目录可以通过搜索找到 PDF Toolkit、JSON Repair、Prompt Injection Scanner、LLM Cost Calculator、MCP Server Builder |
| 信任表达 | Local、Cloud、AI consent、Free/Freemium 标签出现在工具卡和工作台 |
| 工作台闭环 | JSON Repair 可以从示例输入生成格式化输出 |
| 响应式 | 390px 宽度无页面级横向滚动 |
| 工程可验证性 | Registry、Command Search、JSON Repair 均有 Vitest 测试 |

## 9. Product Design brief 回放

- 要做什么: 重建 Toolars 工具站，将传统工具、AI 工具和工作流统一成一个可扩展工具工作台。
- 视觉来源: `design/01-57` 高保真图和 `design/Toolars-design-proposal.md`，不生成新视觉方向。
- 交互深度: 第一阶段核心路径完整可交互；未接后端的账号/支付/AI 以真实前端状态和清楚限制表达。
