# Toolars Design Spec

版本: v0.1
日期: 2026-06-12
设计合同: `design/Toolars-design-proposal.md` 与 57 张高保真 PNG

## 1. 设计原则

- 工具站第一屏必须是可用的工具发现界面，不做营销 landing。
- 白底、细边框、低阴影、信息密度高但分组清楚。
- Emerald 是主动作色，Cobalt 只用于工作台关键动作和链接。
- 避免卡片套卡片、紫色大渐变、模糊 AI 魔法感。
- AI 能力必须清楚标识，不能和本地工具混淆。

## 2. 视觉 Tokens

| Token | 值 | 用法 |
|---|---|---|
| Canvas | `#ffffff` | 页面主背景 |
| Canvas soft | `#f8fafc` | 工作区淡背景 |
| Surface | `#f9fafb` | 轻面板 |
| Border | `#e5e7eb` | 默认边框 |
| Ink | `#111827` | 主文字 |
| Ink secondary | `#374151` | 次级文字 |
| Ink muted | `#6b7280` | 辅助文字 |
| Emerald 600 | `#059669` | 主 CTA、active nav、Local |
| Emerald 50 | `#ecfdf5` | Local badge 背景 |
| Cobalt | `#2563eb` | 工作台执行动作 |
| Amber | `#f59e0b` | 警告、AI consent |
| Danger | `#ef4444` | 错误状态 |

排版使用 Geist/Inter；页面标题 28-32px，区块标题 16-20px，工具标题 14-16px，正文 13-15px，标签 11-12px。控件默认圆角 8px，大面板 10-12px。

## 3. Shell 约束

| Shell | 适用页面 | 规则 |
|---|---|---|
| `tools` | Explore、PDF directory、AI Developer Lab、tool listing | 左侧保留 Categories、Tool type、Processing、Pricing、Platform |
| `workflows` | Workflows 首页与 builder | 左侧显示 workflow categories 和 run/template context |
| `collections` | Collections 首页与详情 | 左侧显示 collection categories、saved/public/team context |
| `workspace` | My Tools | 登录后个人导航、最近输出、收藏、用量 |
| `billing` | Pricing、Billing settings | Plan、Usage、Payment、Invoices |
| `settings` | Account settings | Profile、Privacy & AI、Storage、Team、API keys、Security |
| `admin` | Admin Review | Review queues、admin header |
| `none` | Submit、States、聚焦工作台 | 全宽任务页或状态板 |

## 4. 核心组件

### Command Search

必须支持工具名、自然语言任务和跨域关键词。结果分组至少包含 Tools、Workflows、Collections、Actions。空状态不能造成布局跳动。

### Tool Card

标准字段: icon、title、description、tags、type badge、processing badge、pricing badge、Open、favorite。Hover 只做边框/轻阴影/轻位移，不改变卡片尺寸。

### Workspace Panel

标准三区: Input、Result、Enhance/Next steps。JSON Repair 等开发者工具可使用左上下文 + 中央处理 + 右侧下一步三列布局；PDF Toolkit 保留更完整的文件工作台结构。

### AI Consent

任何 AI 发送动作前都必须出现 consent gate 或等价内联 consent 状态。文案必须说明: 数据何时发送、发送到哪里、何时删除、用户如何取消。

## 5. 路由到设计稿映射

| 新站路由 | 设计稿 |
|---|---|
| `/` | `01-toolars-home-desktop.png`, `04-toolars-home-mobile.png` |
| `/explore/pdf` | `02-toolars-pdf-directory-desktop.png`, `31-toolars-pdf-directory-mobile.png` |
| `/explore/ai-developer` | `17-toolars-ai-developer-lab-directory-desktop.png`, `33-toolars-ai-developer-lab-mobile.png` |
| `/tools/json-repair` | `19-toolars-json-repair-workspace-desktop.png`, `45-toolars-json-repair-workspace-mobile.png` |
| `/tools/pdf-toolkit` | `03-toolars-pdf-ai-workspace-desktop.png`, `32-toolars-pdf-toolkit-mobile.png` |
| `/workflows` | `05-toolars-workflows-index-desktop.png`, `35-toolars-workflows-index-mobile.png` |
| `/collections` | `06-toolars-collections-index-desktop.png`, `36-toolars-collections-index-mobile.png` |

生产路由使用根路径；旧原型 `/toolars/*` 可在后续迁移阶段作为 redirect 兼容。

## 6. 移动规则

- 390px 宽度不得产生页面级横向滚动。
- Header 显示品牌、Menu、命令搜索；隐藏桌面 nav 和 auth actions。
- 目录筛选折叠为 chips 或抽屉；工具卡单列。
- 工作台三列在移动端按上下顺序排列: context、input、output、next steps。
