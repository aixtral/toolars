# AI Runtime Security

## Requirement R1: Request Body Is Bounded

### Description

The AI repurpose route must reject oversized bodies before parsing JSON.

### Scenarios

#### Scenario R1-S1: Oversized request is rejected

**Given** an authenticated preview request has a JSON body larger than the
configured limit  
**When** it reaches `POST /api/ai/repurpose`  
**Then** the route returns `413` without generating output.

## Requirement R2: Payload Shape Is Runtime Validated

### Description

The route must treat client JSON as unknown and return validation errors
instead of throwing when field types are malformed.

### Scenarios

#### Scenario R2-S1: Malformed source value is rejected

**Given** `sourceValue` is not a string  
**When** the route validates the payload  
**Then** the route returns `400` with a supported validation error.

#### Scenario R2-S2: Long source value is rejected

**Given** `sourceValue` exceeds the configured source length limit  
**When** the route validates the payload  
**Then** the route returns `400` with a source length error.

## Requirement R3: Platform Selection Is Normalized Before Plan Gate

### Description

Duplicate platforms must not multiply generated outputs or plan-gate counts.

### Scenarios

#### Scenario R3-S1: Duplicate platforms are de-duplicated

**Given** a request includes `twitter-thread` twice and `linkedin-post` once  
**When** generation succeeds  
**Then** the job contains two outputs and the usage gate counts two platforms.

## Requirement R4: Preview Usage Has A Server-Side Runtime Guard

### Description

Until persistent usage exists, preview users need a small server-side in-memory
guard so route tests and local preview do not always evaluate usage as zero.

### Scenarios

#### Scenario R4-S1: Repeated preview requests hit a burst limit

**Given** the same preview user sends more than the allowed number of AI
requests in a window  
**When** the next request reaches the route  
**Then** the route returns `429`.

#### Scenario R4-S2: Usage is incremented after successful generation

**Given** a Pro preview user successfully generates once  
**When** the response returns usage metadata  
**Then** remaining generations are based on recorded preview usage rather than
a hard-coded zero value.

