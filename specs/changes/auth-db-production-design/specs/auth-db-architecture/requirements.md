# Auth DB Architecture

## Requirement R1: Production Auth Boundary

### Description

Toolars must replace preview-only AI app access with a production auth design
that uses server-validated Supabase sessions while keeping public calculators
free and crawlable.

### Scenarios

#### Scenario R1-S1: AI app uses real account sessions

**Given** a visitor opens an `/app/*` AI route  
**When** production auth is enabled  
**Then** access is based on a server-validated Supabase user, not preview query
parameters.

#### Scenario R1-S2: Public calculators stay anonymous

**Given** a visitor opens `/tools/[slug]`  
**When** they calculate a result  
**Then** no Supabase session, database read, or subscription lookup is required
for the basic calculator flow.

## Requirement R2: Account Database Schema

### Description

The production database design must define first-pass tables for user profile,
workspace, subscription, usage, AI workflow, brand voice, saved calculator, and
audit data.

### Scenarios

#### Scenario R2-S1: User-owned AI data is modeled

**Given** an authenticated user creates an AI repurpose job  
**When** the job is persisted  
**Then** the schema can store the job, generated outputs, selected platforms,
model, tone, brand voice, status, and usage accounting.

#### Scenario R2-S2: Pro calculator features are modeled separately

**Given** an anonymous user can calculate without login  
**When** they choose cross-device save, advanced export, or batch tooling  
**Then** the schema has account-backed tables for saved results and export jobs
without changing the public calculator engine boundary.

## Requirement R3: RLS And Service Boundaries

### Description

The design must specify row-level ownership policies for exposed tables and
identify which operations require a server-only secret/service role.

### Scenarios

#### Scenario R3-S1: RLS is enabled for user data

**Given** a public-schema table stores account data  
**When** the design describes access rules  
**Then** it requires Row Level Security and user/workspace ownership policies.

#### Scenario R3-S2: Service role is never browser-exposed

**Given** billing webhooks, provider callbacks, or admin reconciliation need
elevated writes  
**When** the operation is designed  
**Then** it is routed through server-only code and never uses service keys in
client components.

## Requirement R4: Migration And Verification Plan

### Description

The design must sequence the migration from preview auth to production auth in
small, testable implementation passes.

### Scenarios

#### Scenario R4-S1: Preview auth can be retired safely

**Given** current tests depend on preview sessions  
**When** production auth implementation begins  
**Then** the plan preserves preview fixtures for local tests while preventing
production bypasses.

#### Scenario R4-S2: Future implementation has clear gates

**Given** a developer starts a Supabase implementation pass  
**When** they read the design  
**Then** they can identify required tests, env vars, migrations, RLS checks,
and security review gates.
