# Site Graph Metadata

## Requirement R1: Root Commercial Metadata

### Description
The root layout must publish stable site-level metadata that gives crawlers and social preview systems a consistent default identity for toolars.

### Scenarios

#### Scenario R1-S1: Root metadata exposes site identity
**Given** a crawler requests the home page  
**When** it inspects document head metadata  
**Then** it can find Open Graph site name, website type, public URL, and a Twitter summary card.

#### Scenario R1-S2: Root metadata has canonical base
**Given** Next.js generates metadata for a public page  
**When** relative canonical or Open Graph URLs are resolved  
**Then** they resolve against `https://toolars.com`.

## Requirement R2: Site-Level Structured Data

### Description
The root layout must render JSON-LD that identifies toolars as both an organization and a searchable website.

### Scenarios

#### Scenario R2-S1: Organization schema is rendered
**Given** a crawler reads any public toolars page  
**When** it extracts `application/ld+json` scripts  
**Then** one script identifies `toolars` as an `Organization` with the canonical site URL.

#### Scenario R2-S2: WebSite search action is rendered
**Given** a crawler reads any public toolars page  
**When** it extracts `application/ld+json` scripts  
**Then** one script identifies `toolars` as a `WebSite` with a `SearchAction` targeting `/tools?search={search_term_string}`.
