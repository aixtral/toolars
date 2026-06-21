export const AI_CONSENT_AUDIT_STORAGE_KEY = "toolars.ai-consent-audit:v1";

export interface AiConsentAuditEvent {
  approvedAt: string;
  contentSummary: string;
  providerLabel: string;
  providerRouteId: string;
  stepId: string;
  workflowSlug: string;
  workflowTitle: string;
}

export interface AiConsentAuditLog {
  events: AiConsentAuditEvent[];
  version: 1;
}

const emptyAuditLog: AiConsentAuditLog = {
  events: [],
  version: 1
};

export function loadAiConsentAuditLog(storage: Storage | null = getLocalStorage()): AiConsentAuditLog {
  if (!storage) return emptyAuditLog;

  const rawLog = storage.getItem(AI_CONSENT_AUDIT_STORAGE_KEY);
  if (!rawLog) return emptyAuditLog;

  try {
    const parsed = JSON.parse(rawLog) as Partial<AiConsentAuditLog>;
    if (parsed.version !== 1 || !Array.isArray(parsed.events)) return emptyAuditLog;
    return {
      events: parsed.events.filter(isAiConsentAuditEvent),
      version: 1
    };
  } catch {
    return emptyAuditLog;
  }
}

export function appendAiConsentAuditEvent(event: AiConsentAuditEvent, storage: Storage | null = getLocalStorage()) {
  if (!storage) return emptyAuditLog;

  const nextLog: AiConsentAuditLog = {
    events: [...loadAiConsentAuditLog(storage).events, event],
    version: 1
  };

  storage.setItem(AI_CONSENT_AUDIT_STORAGE_KEY, JSON.stringify(nextLog));
  return nextLog;
}

export function clearAiConsentAuditLog(storage: Storage | null = getLocalStorage()): AiConsentAuditLog {
  if (!storage) return emptyAuditLog;

  storage.removeItem(AI_CONSENT_AUDIT_STORAGE_KEY);
  return emptyAuditLog;
}

function getLocalStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isAiConsentAuditEvent(event: unknown): event is AiConsentAuditEvent {
  if (!event || typeof event !== "object") return false;

  const candidate = event as Partial<AiConsentAuditEvent>;
  return Boolean(
    candidate.approvedAt &&
      candidate.contentSummary &&
      candidate.providerLabel &&
      candidate.providerRouteId &&
      candidate.stepId &&
      candidate.workflowSlug &&
      candidate.workflowTitle
  );
}
