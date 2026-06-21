# Tool Platform Requirements

## Requirement R1: Typed Registry

### Description

The new site must have a typed registry that powers directories, command search, cards, workflows, and collections.

### Scenario R1-S1: Required representative tools

**Given** the registry is loaded
**When** tests inspect tool slugs
**Then** it includes `pdf-toolkit`, `json-repair`, `prompt-injection-scanner`, `llm-cost-calculator`, and `mcp-server-builder`.

### Scenario R1-S2: Trust metadata

**Given** any registered tool
**When** its card is rendered
**Then** it has type, processing, pricing, tags, and source metadata sufficient to display trust badges.

## Requirement R2: Command Search

### Description

Command Search is both search and task routing.

### Scenario R2-S1: Tool-name search

**Given** the user searches `json`
**When** command results are computed
**Then** JSON Repair appears in the top results.

### Scenario R2-S2: Natural-language task

**Given** the user searches `summarize pdf`
**When** command results are computed
**Then** a PDF summary workflow or PDF Toolkit result appears.

### Scenario R2-S3: Lab workflow search

**Given** the user searches `mcp`
**When** command results are computed
**Then** MCP Server Builder and MCP Tool Launch appear.

## Requirement R3: Shell Variants

### Description

Page families must use the correct shell instead of forcing all routes into a generic tool sidebar.

### Scenario R3-S1: AI Developer Lab

**Given** the user opens `/explore/ai-developer`
**When** the page renders
**Then** it uses a tools shell with Lab filters and AI Developer Lab content.

## Requirement R4: Command Center Modal

### Description

Command Center must turn the search affordance in the shell into a real task-routing modal.

### Scenario R4-S1: Open from shell

**Given** any Toolars page is loaded
**When** the user clicks the command search trigger or presses Cmd/Ctrl+K
**Then** a modal opens with a focused search input and suggested results.

### Scenario R4-S2: Search routed results

**Given** Command Center is open
**When** the user searches `json`
**Then** JSON Repair appears as a navigable result linking to `/tools/json-repair`.

### Scenario R4-S3: Empty state

**Given** Command Center is open
**When** the user searches a task with no match
**Then** it shows an empty state with guidance instead of a blank result panel.

### Scenario R4-S4: Close behavior

**Given** Command Center is open
**When** the user presses Escape
**Then** the modal closes and the page remains available.
