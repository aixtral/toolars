# auth-session-cookie-handoff

## Requirement R1: Server APIs derive account context from verified Supabase sessions

### Description

Protected server APIs must derive Toolars account context from a verified
Supabase Auth user and workspace membership, not from client-submitted preview
headers in production.

### Scenarios

#### Scenario R1-S1: Production request with verified Supabase user is accepted
**Given** production preview auth is disabled  
**And** a request contains valid Supabase Auth cookies  
**And** Supabase verifies the user and returns an active workspace membership  
**When** `/api/ai/repurpose` resolves the request session  
**Then** the session includes `userId`, `email`, `workspaceId`, `role`, and
`planId` from Supabase-backed data.

#### Scenario R1-S2: Missing Supabase user is denied
**Given** production preview auth is disabled  
**And** Supabase cannot verify a user from request cookies  
**When** a protected API resolves the request session  
**Then** it returns `null` and the API responds with `401`.

#### Scenario R1-S3: Missing or invalid workspace membership is denied
**Given** Supabase verifies a user  
**And** the user has no valid workspace membership  
**When** a protected API resolves the request session  
**Then** it returns `null` and the API responds with `401`.

## Requirement R2: App route guard supports Supabase cookies

### Description

The `/app/**` proxy must allow users who have a valid Supabase Auth cookie and
must redirect anonymous users to login with the original path preserved.

### Scenarios

#### Scenario R2-S1: Authenticated Supabase-cookie app request is allowed
**Given** a request to `/app/repurpose` includes Supabase Auth cookies  
**When** the proxy verifies the cookie-backed user  
**Then** the request is allowed to continue and any refreshed auth cookies are
written to the response.

#### Scenario R2-S2: Anonymous app request is redirected
**Given** a request to `/app/settings?tab=billing` has no valid Supabase or
preview auth state  
**When** the proxy handles the request  
**Then** it redirects to `/login?next=/app/settings%3Ftab%3Dbilling`.

## Requirement R3: Preview auth remains local/staging only

### Description

Preview query, cookie, and header auth remain useful for local development and
draft review, but production must never trust them as account identity.

### Scenarios

#### Scenario R3-S1: Local preview API request is still accepted
**Given** the runtime is development or explicit local preview auth is enabled  
**And** a request includes `x-toolars-preview-user: true`  
**When** a protected API resolves the session  
**Then** it returns a deterministic preview `ToolarsSession`.

#### Scenario R3-S2: Production preview API headers are ignored
**Given** the runtime is production  
**And** the request includes preview account headers  
**When** a protected API resolves the session  
**Then** preview headers are ignored and the request must rely on Supabase
session resolution instead.

#### Scenario R3-S3: Production preview app query is ignored
**Given** the runtime is production  
**And** the request path is `/app/repurpose?preview=pro`  
**When** the proxy handles the request  
**Then** it redirects to login unless a valid Supabase Auth cookie is present.

## Requirement R4: Public calculators stay isolated

### Description

The auth handoff must not add auth, Supabase, billing, usage, or AI runtime
dependencies to public calculator engines and pages.

### Scenarios

#### Scenario R4-S1: Calculator code has no account runtime imports
**Given** public calculator pages and shared calculator modules are crawlable
and anonymous  
**When** the change is reviewed  
**Then** calculator code does not import auth, Supabase, billing, usage, plans,
or AI runtime modules.
