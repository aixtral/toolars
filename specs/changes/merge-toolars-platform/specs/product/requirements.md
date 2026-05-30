# Product Requirements

## Requirement P1: New Main Repository

### Description

toolars must be the new primary repository and product home for the merged
platform.

### Scenarios

#### Scenario P1-S1: Repository role is clear

**Given** a contributor opens the repository  
**When** they read `README.md` or `AGENTS.md`  
**Then** they understand that `toolars` is the new main repo and source projects
are migration inputs only.

#### Scenario P1-S2: Directory ownership is clear

**Given** a contributor adds application code  
**When** they choose a destination path  
**Then** they place code under `site/`, not repository root, `docs/`, or
`design/`.

## Requirement P2: Unified Product Scope

### Description

v1 must include the free calculator platform and account-gated AI SaaS platform
under one IA and brand.

### Scenarios

#### Scenario P2-S1: User discovers both tool types

**Given** a visitor lands on the home page  
**When** they use search or category cards  
**Then** they can discover both calculators and AI tools.

#### Scenario P2-S2: AI and calculator experiences share one brand

**Given** a visitor moves from a calculator page to an AI directory page  
**When** the new page renders  
**Then** typography, color, header, search, and component behavior remain
consistent.

## Requirement P3: English-First Launch

### Description

Public copy and SEO content launch in English first while preserving future
i18n architecture.

### Scenarios

#### Scenario P3-S1: Default route is English

**Given** a visitor opens a public route  
**When** no locale prefix is present  
**Then** English copy and metadata are shown.

#### Scenario P3-S2: Future locale paths are not blocked

**Given** phase two adds translated content  
**When** locale route handling is introduced  
**Then** public page architecture can support es/fr/zh/ja/ru/ar/pt/hi/zh-tw
without rewriting the core registry.

