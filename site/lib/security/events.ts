export type SecurityEventCategory = 'ai' | 'billing';
export type SecurityEventOutcome = 'denied' | 'invalid' | 'rate_limited' | 'failed';

export interface SecurityEvent {
  id: string;
  createdAt: string;
  requestId: string;
  route: string;
  category: SecurityEventCategory;
  action: string;
  outcome: SecurityEventOutcome;
  status: number;
  metadata: Record<string, string | number | boolean>;
}

export interface RecordSecurityEventInput {
  request: Request;
  route: string;
  category: SecurityEventCategory;
  action: string;
  outcome: SecurityEventOutcome;
  status: number;
  metadata?: Record<string, unknown>;
}

const metadataAllowlist = new Set([
  'accessState',
  'bodyLimitBytes',
  'duplicate',
  'errorCount',
  'eventId',
  'eventName',
  'planId',
  'providerObjectId',
  'selectedPlatformCount',
  'userId',
]);

const securityEvents: SecurityEvent[] = [];

function randomId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}_${random.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`;
}

function requestIdFromRequest(request: Request) {
  const requestId = request.headers.get('x-request-id')?.trim();
  return requestId ? requestId.slice(0, 128) : randomId('req');
}

function sanitizeMetadata(metadata: Record<string, unknown> | undefined) {
  const safeMetadata: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (!metadataAllowlist.has(key)) continue;
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      safeMetadata[key] = typeof value === 'string' ? value.slice(0, 160) : value;
    }
  }

  return safeMetadata;
}

export function recordSecurityEvent(input: RecordSecurityEventInput) {
  const event: SecurityEvent = {
    id: randomId('sec'),
    createdAt: new Date().toISOString(),
    requestId: requestIdFromRequest(input.request),
    route: input.route,
    category: input.category,
    action: input.action,
    outcome: input.outcome,
    status: input.status,
    metadata: sanitizeMetadata(input.metadata),
  };

  securityEvents.push(event);

  if (process.env.NODE_ENV !== 'test') {
    console.warn('[toolars.security]', JSON.stringify(event));
  }

  return event;
}

export function readSecurityEvents() {
  return [...securityEvents];
}

export function resetSecurityEvents() {
  securityEvents.length = 0;
}
