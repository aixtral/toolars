# Production Env Release Gate

## Requirement R1: Production Cannot Enable Preview Auth

### Description

Preview auth must never be active when the runtime environment is production.

### Scenarios

#### Scenario R1-S1: Production flag fails release gate

**Given** `NODE_ENV=production` and `TOOLARS_ENABLE_PREVIEW_AUTH=true`  
**When** the production env release gate runs  
**Then** it throws a clear error before the app is built or started.

#### Scenario R1-S2: Production preview sessions are ignored

**Given** `NODE_ENV=production` and `TOOLARS_ENABLE_PREVIEW_AUTH=true`  
**When** auth helpers inspect preview query params or preview headers  
**Then** they return no session.

## Requirement R2: Non-Production Preview Auth Remains Available

### Description

Local preview and tests should still be able to use preview sessions without a
real auth provider.

### Scenarios

#### Scenario R2-S1: Local preview sessions continue to work

**Given** `NODE_ENV` is not production  
**When** preview query params or headers are provided  
**Then** auth helpers create preview sessions.

#### Scenario R2-S2: Explicit local disable blocks preview sessions

**Given** a non-production environment with `TOOLARS_ENABLE_PREVIEW_AUTH=false`  
**When** preview query params or headers are provided  
**Then** auth helpers return no session.
