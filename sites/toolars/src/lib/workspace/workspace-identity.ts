export const WORKSPACE_IDENTITY_STORAGE_KEY = "toolars.workspace-identity:v1";
export const WORKSPACE_IDENTITY_CHANGED_EVENT = "toolars:workspace-identity-changed";

export interface ToolarsWorkspaceIdentity {
  accountBinding?: ToolarsWorkspaceAccountBinding;
  createdAt: string;
  source: "anonymous-local";
  version: 1;
  workspaceId: string;
}

export interface ToolarsWorkspaceAccountBinding {
  accountEmail?: string;
  accountId: string;
  boundAt: string;
  source: "future-login";
}

interface WorkspaceIdentityOptions {
  now?: () => string;
  randomSuffix?: () => string;
  storage?: Storage | null;
}

interface WorkspaceAccountBindingOptions {
  accountEmail?: string;
  accountId: string;
  now?: () => string;
  storage?: Storage | null;
}

export function loadWorkspaceIdentity(storage: Storage | null = getLocalStorage()): ToolarsWorkspaceIdentity | null {
  if (!storage) return null;

  const rawIdentity = storage.getItem(WORKSPACE_IDENTITY_STORAGE_KEY);
  if (!rawIdentity) return null;

  try {
    const parsed = JSON.parse(rawIdentity) as Partial<ToolarsWorkspaceIdentity>;
    if (!isWorkspaceIdentity(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getOrCreateWorkspaceIdentity(options: WorkspaceIdentityOptions = {}): ToolarsWorkspaceIdentity {
  const storage = options.storage === undefined ? getLocalStorage() : options.storage;
  const existingIdentity = loadWorkspaceIdentity(storage);
  if (existingIdentity) return existingIdentity;

  const identity = createWorkspaceIdentity(options);
  storage?.setItem(WORKSPACE_IDENTITY_STORAGE_KEY, JSON.stringify(identity));
  return identity;
}

export function bindWorkspaceIdentityToAccount(options: WorkspaceAccountBindingOptions): ToolarsWorkspaceIdentity {
  const storage = options.storage === undefined ? getLocalStorage() : options.storage;
  const identity = getOrCreateWorkspaceIdentity({ storage });
  const accountBinding: ToolarsWorkspaceAccountBinding = {
    accountId: sanitizeAccountId(options.accountId),
    boundAt: options.now?.() ?? new Date().toISOString(),
    source: "future-login"
  };

  if (options.accountEmail?.trim()) {
    accountBinding.accountEmail = options.accountEmail.trim();
  }

  const boundIdentity = {
    ...identity,
    accountBinding
  } satisfies ToolarsWorkspaceIdentity;

  storage?.setItem(WORKSPACE_IDENTITY_STORAGE_KEY, JSON.stringify(boundIdentity));
  notifyWorkspaceIdentityChanged(boundIdentity);
  return boundIdentity;
}

export function subscribeWorkspaceIdentityChanges(onChange: (identity: ToolarsWorkspaceIdentity) => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleIdentityChange = (event: Event) => {
    const changedIdentity = (event as CustomEvent<ToolarsWorkspaceIdentity>).detail;
    if (changedIdentity) onChange(changedIdentity);
  };

  window.addEventListener(WORKSPACE_IDENTITY_CHANGED_EVENT, handleIdentityChange);
  return () => window.removeEventListener(WORKSPACE_IDENTITY_CHANGED_EVENT, handleIdentityChange);
}

export function buildWorkspaceAuditHeaders(identity = getOrCreateWorkspaceIdentity()) {
  const headers: Record<string, string> = {
    "x-toolars-workspace-id": identity.workspaceId
  };

  if (identity.accountBinding?.accountId) {
    headers["x-toolars-account-id"] = identity.accountBinding.accountId;
  }
  if (identity.accountBinding?.accountEmail) {
    headers["x-toolars-account-email"] = identity.accountBinding.accountEmail;
  }

  return headers;
}

export function buildWorkspaceScopedJsonHeaders(identity = getOrCreateWorkspaceIdentity()) {
  return {
    "Content-Type": "application/json",
    ...buildWorkspaceAuditHeaders(identity)
  };
}

function createWorkspaceIdentity({ now = () => new Date().toISOString(), randomSuffix = createRandomSuffix }: WorkspaceIdentityOptions) {
  const createdAt = now();
  const compactCreatedAt = sanitizeWorkspacePart(createdAt.replace(/\D/g, "").slice(0, 14)) || "local";
  const suffix = sanitizeWorkspacePart(randomSuffix()).slice(0, 12) || "anon";

  return {
    createdAt,
    source: "anonymous-local",
    version: 1,
    workspaceId: `toolars_ws_${compactCreatedAt}_${suffix}`
  } satisfies ToolarsWorkspaceIdentity;
}

function createRandomSuffix() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().slice(0, 8);
  }

  return Math.random().toString(36).slice(2, 10);
}

function sanitizeWorkspacePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
}

function sanitizeAccountId(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80) || "account-local";
}

function notifyWorkspaceIdentityChanged(identity: ToolarsWorkspaceIdentity) {
  if (typeof window === "undefined" || typeof CustomEvent === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToolarsWorkspaceIdentity>(WORKSPACE_IDENTITY_CHANGED_EVENT, {
      detail: identity
    })
  );
}

function getLocalStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isWorkspaceIdentity(identity: Partial<ToolarsWorkspaceIdentity>): identity is ToolarsWorkspaceIdentity {
  const accountBinding = identity.accountBinding;
  return Boolean(
    identity.createdAt &&
      identity.source === "anonymous-local" &&
      identity.version === 1 &&
      identity.workspaceId &&
      /^toolars_ws_[a-zA-Z0-9_-]+_[a-zA-Z0-9_-]+$/.test(identity.workspaceId) &&
      (!accountBinding || isWorkspaceAccountBinding(accountBinding))
  );
}

function isWorkspaceAccountBinding(binding: Partial<ToolarsWorkspaceAccountBinding>): binding is ToolarsWorkspaceAccountBinding {
  return Boolean(binding.accountId && binding.boundAt && binding.source === "future-login");
}
