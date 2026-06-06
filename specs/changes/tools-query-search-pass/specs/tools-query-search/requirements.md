# Tools Query Search

## Requirement R1: Default Directory Remains Stable

### Description
The tools directory must keep its current crawlable default experience when no search query is present.

### Scenarios

#### Scenario R1-S1: Empty query shows default directory
**Given** a visitor opens `/tools`  
**When** no `search` query parameter is present  
**Then** the page shows the default first 12 directory tools and an empty search box.

## Requirement R2: Query URL Filters Visible Results

### Description
The tools directory must render search-driven results when a `search` query parameter is present.

### Scenarios

#### Scenario R2-S1: Search query shows ranked result
**Given** a visitor opens `/tools?search=inflation`  
**When** the directory renders  
**Then** the search box contains `inflation` and the tool grid includes `Inflation Calculator`.

#### Scenario R2-S2: No matches has an explicit empty state
**Given** a visitor opens `/tools?search=definitely-not-a-tool`  
**When** no tools match the query  
**Then** the page shows an empty state and does not silently fall back to unrelated default results.
