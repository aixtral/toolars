# i18n Requirements

## Requirement I1: English-First Public Product

### Description

v1 launches with English-first public copy and metadata.

### Scenarios

#### Scenario I1-S1: English default

**Given** a visitor opens `/tools/bmi-calculator`  
**When** the page loads  
**Then** English title, description, form labels, result labels, formula, and FAQ
are shown.

## Requirement I2: Future Locale Architecture

### Description

The architecture must support phase-two locale migration without redesigning
the route and registry model.

### Scenarios

#### Scenario I2-S1: Locale metadata can be added

**Given** phase two adds Spanish content  
**When** locale metadata is attached to a tool definition  
**Then** canonical and hreflang helpers can render localized equivalents.

#### Scenario I2-S2: RTL is not blocked

**Given** Arabic is added in phase two  
**When** the layout direction becomes RTL  
**Then** navigation, forms, and result panels remain structurally valid.

