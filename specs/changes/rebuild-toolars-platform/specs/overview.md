# Specs Overview: rebuild-toolars-platform

## Capabilities

- `source-inventory`: 记录 VitalCalc 与 Aixtral Lab 的源工具资产和迁移策略。
- `tool-platform`: 定义 Toolars registry、目录、Command Search 和 shell 架构。
- `workspace`: 定义 JSON Repair 首批工作台与后续工作台模板。

## Acceptance Summary

- 新站代码位于 `sites/toolars/`。
- 第一批工具 registry 必须覆盖 PDF 核心工具和 AI Developer Lab 代表工具。
- JSON Repair 必须是本地工具，无上传，无 AI consent。
- AI 工具必须通过 metadata 标记 `ai-consent`，UI 不得把它们表现成本地工具。
- 首页、PDF directory、AI Lab directory 和 JSON Repair workspace 必须映射到现有高保真图。
