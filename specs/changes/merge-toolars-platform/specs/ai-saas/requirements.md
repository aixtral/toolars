# AI SaaS Requirements

## Requirement A1: Account-Gated AI App

### Description

AI tools require account/subscription access and live under a consistent app
shell.

### Scenarios

#### Scenario A1-S1: Unauthenticated user opens AI app

**Given** a visitor is not logged in  
**When** they open `/app/repurpose`  
**Then** they are redirected or prompted to sign in.

#### Scenario A1-S2: App pages share shell

**Given** an authenticated user navigates AI app pages  
**When** they open repurpose, templates, brand voice, history, analytics, or
settings  
**Then** the app shell and navigation remain consistent.

## Requirement A2: Repurpose Workflow

### Description

The AI Content Repurposer must support URL/Text input, platforms, tone, brand
voice, model, streaming output, copy/save/regenerate, and cancel.

### Scenarios

#### Scenario A2-S1: Generate from text

**Given** an authenticated user enters text  
**When** they select platforms and a tone and click Generate  
**Then** streaming output cards appear for selected platforms.

#### Scenario A2-S2: Cancel generation

**Given** a generation is streaming  
**When** the user clicks Cancel  
**Then** generation stops, partial output is preserved, and status is marked
canceled.

## Requirement A3: Current AI SaaS Pages Exist

### Description

All currently implemented AI SaaS page concepts must have toolars equivalents.

### Scenarios

#### Scenario A3-S1: AI page inventory exists

**Given** the v1 app is reviewed  
**When** app routes are checked  
**Then** Repurpose, Template Library, Brand Voice, History, Analytics, Settings,
Login, Register, and Pricing pages exist.

#### Scenario A3-S2: Platform support is complete

**Given** a user selects output platforms  
**When** the platform list is rendered  
**Then** it includes Twitter Thread, LinkedIn, Newsletter, Medium, Reddit,
Instagram, YouTube, Facebook, Hacker News, Indie Hackers, WeChat, Xiaohongshu,
Jike, and Zhihu.

