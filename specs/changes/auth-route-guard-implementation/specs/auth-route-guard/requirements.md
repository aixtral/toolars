# Auth Route Guard

## Requirement R1: App Pages Are Guarded Before Render

### Description

Every `/app/**` page must pass through a shared server-side route guard before
the page renders.

### Scenarios

#### Scenario R1-S1: Anonymous app visitor is redirected

**Given** a visitor requests `/app/templates` without a preview or production
session  
**When** the request reaches the app  
**Then** Toolars redirects to `/login?next=/app/templates`.

#### Scenario R1-S2: Public tools are not gated

**Given** a visitor requests `/tools/bmi-calculator`  
**When** the request reaches the app  
**Then** Toolars does not redirect through the app auth guard.

## Requirement R2: Preview Review Remains Ergonomic But Explicit

### Description

Non-production preview review must remain possible without introducing a
production bypass.

### Scenarios

#### Scenario R2-S1: Preview query opens app page

**Given** preview auth is enabled  
**When** a visitor requests `/app/repurpose?preview=pro`  
**Then** the app route guard allows the page and stores a short-lived preview
session cookie for app navigation.

#### Scenario R2-S2: Preview cookie allows sibling app pages

**Given** a valid preview session cookie exists  
**When** the visitor requests `/app/history`  
**Then** the app route guard allows the page.

#### Scenario R2-S3: Production disables preview by default

**Given** `NODE_ENV=production` and `TOOLARS_ENABLE_PREVIEW_AUTH` is not `true`  
**When** a visitor requests `/app/repurpose?preview=pro`  
**Then** Toolars redirects to login instead of trusting preview state.

## Requirement R3: Redirects Preserve Intent

### Description

Auth redirects should carry the original app path so the future auth provider
can return users to their intended workspace page.

### Scenarios

#### Scenario R3-S1: Redirect includes next path

**Given** a visitor requests `/app/settings?tab=billing` without a session  
**When** Toolars redirects to login  
**Then** the `next` query contains `/app/settings?tab=billing`.

