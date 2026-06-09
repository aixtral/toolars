# Auth DB Production

## Requirement R1: Supabase Runtime Boundary

### Description

Toolars must expose Supabase runtime setup through typed server/browser/service
helpers, with clear public-vs-secret environment handling.

### Scenarios

#### Scenario R1-S1: Public env is browser-safe

**Given** Supabase public environment variables are present  
**When** the browser or server client factory reads configuration  
**Then** only `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are returned.

#### Scenario R1-S2: Service key is server-only

**Given** a server-only workflow needs elevated Supabase access  
**When** the service client factory reads configuration  
**Then** it requires a service role key and never includes that key in public
client configuration.

## Requirement R2: Production Session Facade

### Description

AI route handlers need a stable Toolars session facade that can use validated
Supabase identity and workspace membership while preserving local preview test
fixtures.

### Scenarios

#### Scenario R2-S1: Supabase user maps to Toolars session

**Given** a server-validated Supabase user and a workspace membership record  
**When** Toolars resolves the current account session  
**Then** it returns user ID, email, workspace ID, role, plan ID, and
`isAuthenticated: true`.

#### Scenario R2-S2: Missing workspace denies app session

**Given** a validated Supabase user has no workspace membership  
**When** Toolars resolves the current account session  
**Then** it returns `null` so protected AI routes remain closed.

#### Scenario R2-S3: Preview auth stays local only

**Given** preview headers or query params are sent in production  
**When** session helpers run  
**Then** they return `null` and cannot grant paid AI access.

## Requirement R3: Account Workspace Schema

### Description

Toolars must add a first-pass Supabase SQL migration for profile and workspace
ownership so future billing, AI history, usage, and Pro persistence can attach
to a durable account boundary.

### Scenarios

#### Scenario R3-S1: New auth users get account rows

**Given** Supabase Auth creates a new user  
**When** the migration trigger runs  
**Then** Toolars creates a `profiles` row, a personal `workspaces` row, and an
owner `workspace_members` row.

#### Scenario R3-S2: Account tables have RLS

**Given** account tables exist in the public schema  
**When** the migration is inspected  
**Then** `profiles`, `workspaces`, and `workspace_members` have RLS enabled and
workspace/member policies scoped to authenticated users.

## Requirement R4: Public Calculator Isolation

### Description

Public calculators must remain free, crawlable, and independent from auth,
database, billing, and AI provider code.

### Scenarios

#### Scenario R4-S1: Calculator modules avoid account imports

**Given** a public calculator page, calculator component, registry, or pure
calculator engine  
**When** dependency checks run  
**Then** no file imports Supabase, auth, billing, or AI provider modules for
basic calculator rendering and calculation.
