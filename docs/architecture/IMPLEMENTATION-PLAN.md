# Toolars Implementation Plan

版本: v0.1
日期: 2026-06-12

## 1. 当前阶段

CDC router 对本轮大目标先路由为 Spike，因为需要跨项目分析；`cdc-workflow gate --mode standard --root .` 已通过。文档与首批实现准备完成后，执行阶段按 Standard/TDD 工作流推进。

## 2. 第一批开发切片

1. 初始化 `sites/toolars` Next.js + TypeScript + Vitest。
2. 写 Red tests:
   - registry 必须包含 PDF Toolkit、JSON Repair、Prompt Injection Scanner、LLM Cost Calculator、MCP Server Builder。
   - command search 能搜索 `json`、`summarize pdf`、`mcp`。
   - JSON Repair 能修复设计稿示例中的 unquoted keys、single quotes、trailing comma。
3. 实现 registry、command search、JSON repair pure function。
4. 实现 Shell、Explore 首页、PDF directory、AI Developer Lab directory、JSON Repair workspace。
5. 运行 tests/typecheck/build。
6. 启动 dev server，做桌面和 390px 移动视觉/交互冒烟。

## 3. 第二批

- PDF Toolkit workspace: 文件列表、操作选择、结果状态、AI consent panel。
- Prompt Injection Scanner、LLM Cost Calculator、MCP Server Builder 三个代表工作台。
- Tool detail template 和 featured tool detail pages。
- Workflows index 和三个 Lab workflow。

## 4. 第三批

- Collections index/detail。
- My Tools、Settings、Billing、Pricing。
- Submit Tool、Admin Review、States board。
- 抽取 VitalCalc 计算器公式为 pure modules。

## 5. 验证命令

```bash
cd sites/toolars
pnpm test
pnpm typecheck
pnpm build
```

前端视觉验证:

- `/`
- `/explore/pdf`
- `/explore/ai-developer`
- `/tools/json-repair`
- 390px 移动宽度无横向滚动

## 6. TDD 例外

文档、CDC spec、package/config/test setup 属于非生产代码或项目初始化，可在 Red 前创建。所有工具逻辑和 UI 生产代码必须先有失败测试。
