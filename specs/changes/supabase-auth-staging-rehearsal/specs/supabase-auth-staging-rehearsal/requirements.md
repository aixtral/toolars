# supabase-auth-staging-rehearsal

## Requirement R1: Login creates a real Supabase session

### Description

The `/login` page must submit email/password credentials to Supabase Auth and
redirect to the requested protected path only after sign-in succeeds.

### Scenarios

#### Scenario R1-S1: Successful sign-in redirects to the protected next path
**Given** a visitor opens `/login?next=/app/repurpose`  
**And** Supabase Auth accepts the email/password credentials  
**When** the visitor submits the login form  
**Then** the browser is redirected to `/app/repurpose`.

#### Scenario R1-S2: Sign-in error is shown without redirect
**Given** Supabase Auth rejects the email/password credentials  
**When** the visitor submits the login form  
**Then** the login page shows the error and does not redirect.

#### Scenario R1-S3: Unsafe next paths are rejected
**Given** a visitor opens `/login?next=https://evil.example/path`  
**When** the page computes the post-login redirect  
**Then** it falls back to `/app/repurpose`.

## Requirement R2: Staging rehearsal proves the real auth cookie path

### Description

An env-gated Playwright rehearsal must verify that staging redirects anonymous
users, accepts a real Supabase login, and renders the protected AI workspace
without preview query/header state.

### Scenarios

#### Scenario R2-S1: Anonymous staging request redirects to login
**Given** `TOOLARS_RUN_STAGING_AUTH_REHEARSAL=true` and a staging base URL  
**When** Playwright opens `/app/repurpose` without auth cookies  
**Then** the browser lands on `/login?next=/app/repurpose`.

#### Scenario R2-S2: Authenticated staging request renders the AI workspace
**Given** staging test credentials are configured  
**When** Playwright signs in through `/login?next=/app/repurpose`  
**Then** `/app/repurpose` renders the AI workspace header and not the AuthGate.

#### Scenario R2-S3: Missing staging credentials skip without false pass
**Given** the staging rehearsal env flag is not enabled  
**When** the normal local e2e suite runs  
**Then** the staging rehearsal is skipped and does not claim a staging pass.

## Requirement R3: Public calculator access remains anonymous

### Description

Adding real login must not gate public calculators or add auth dependencies to
calculator engines and public calculator pages.

### Scenarios

#### Scenario R3-S1: Public calculator pages remain no-login
**Given** a visitor opens a public calculator page  
**When** the page renders  
**Then** it remains crawlable and usable without a Supabase session.
