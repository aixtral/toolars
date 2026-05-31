# visual-qa

## Requirement R1: Representative Pages Have Visual Evidence

### Description

Design changes must be verified with browser-backed evidence, not just code
review.

### Scenarios

#### Scenario R1-S1: Representative Routes Render Cleanly

**Given** the local dev server is running on port 9088  
**When** browser QA opens home, tools directory, calculator detail, AI directory,
and blog article routes  
**Then** pages render without console errors, obvious overlap, or missing primary
content.

#### Scenario R1-S2: Mobile First Viewport Remains Usable

**Given** mobile width is a target design breakpoint  
**When** the first viewport renders  
**Then** search, primary actions, and labels fit without horizontal overflow or
text clipping.
