# Toolars Acceptance Criteria

版本: v0.1
日期: 2026-06-12

## 1. 产品验收

- 首页显示 Toolars 品牌、Command Search、Explore/Workflows/Collections/My Tools nav、Submit tool、Sign in。
- 首页包含 Toolars Picks、Popular tools、Popular workflows、信任模块和 AI Developer Lab 入口。
- PDF directory 显示 PDF 子分类、筛选、Featured workflows、至少 10 个 PDF 工具卡、Recommended path。
- AI Developer Lab directory 显示 merged inventory 标签、22 个代表工具、playbooks、Lab workflows。
- JSON Repair workspace 可以从示例输入生成 repaired output。

## 2. 信任与商业标识

- 每个工具卡显示 type、processing、pricing 中至少两个关键信息。
- Local 工具必须标明 local/on-device。
- AI 工具必须标明 AI consent。
- Freemium/Paid 不得伪装成 Free。

## 3. 工程验收

- `pnpm test` 通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `git diff --stat` 只包含本次 docs/spec/sites 变更和既有用户删除状态。

## 4. 视觉验收

- 桌面首屏布局与 `design/01-toolars-home-desktop.png` 保持同一信息架构。
- JSON Repair 工作台布局与 `design/19-toolars-json-repair-workspace-desktop.png` 保持同一模块顺序。
- 移动 JSON Repair 布局与 `design/45-toolars-json-repair-workspace-mobile.png` 一致: 顶部品牌/菜单/搜索，内容单列堆叠。
- 不出现卡片套卡片、紫色主调、大面积渐变或装饰性光斑。

## 5. 可访问性

- 主要按钮和输入有可读 label。
- Command Search 可由键盘打开。
- JSON Repair 文本输入和输出区域可被屏幕阅读器识别。
- 焦点状态可见。
