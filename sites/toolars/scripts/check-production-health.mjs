import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultBaseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";
const supabasePublicConfig = "NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
const freeTrialModeConfig = "NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE/TOOLARS_FREE_TRIAL_MODE";
const aiProviderConfig = "TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY";
const billingProviderConfig = "TOOLARS_BILLING_PROVIDER_ENDPOINT/TOOLARS_BILLING_PROVIDER_API_KEY";

export function parseProductionHealthArgs(argv) {
  const parsed = {
    baseUrl: stripTrailingSlash(defaultBaseUrl),
    requireAiProvider: false,
    requireBillingProvider: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    } else if (arg === "--base-url") {
      parsed.baseUrl = stripTrailingSlash(requireValue(argv, index));
      index += 1;
    } else if (arg === "--require-ai-provider") {
      parsed.requireAiProvider = true;
    } else if (arg === "--require-billing-provider") {
      parsed.requireBillingProvider = true;
    } else {
      throw new Error(`Unknown production health option: ${arg}`);
    }
  }

  return parsed;
}

export function evaluateProductionHealth(payload, options = {}) {
  const blockers = [];
  const warnings = [];

  if (payload?.auth?.supabase !== "configured") {
    blockers.push(supabasePublicConfig);
  }

  if (payload?.mode?.freeTrial !== true) {
    blockers.push(freeTrialModeConfig);
  }

  if (options.requireAiProvider && payload?.providers?.aiProvider !== "configured") {
    blockers.push(aiProviderConfig);
  }

  if (options.requireBillingProvider && payload?.providers?.billingProvider !== "configured") {
    blockers.push(billingProviderConfig);
  }

  for (const item of payload?.missing ?? []) {
    if (!blockers.includes(item)) warnings.push(item);
  }

  return {
    ok: blockers.length === 0,
    blockers: unique(blockers),
    warnings: unique(warnings)
  };
}

export function formatProductionHealthReport(result) {
  const lines = [`Toolars production health gate`, `Status: ${result.ok ? "pass" : "fail"}`];

  lines.push("Blockers:");
  if (result.blockers.length === 0) {
    lines.push("- none");
  } else {
    lines.push(...result.blockers.map((item) => `- ${item}`));
  }

  lines.push("Warnings:");
  if (result.warnings.length === 0) {
    lines.push("- none");
  } else {
    lines.push(...result.warnings.map((item) => `- ${item}`));
  }

  return lines.join("\n");
}

async function fetchProductionHealth(baseUrl) {
  const response = await fetch(`${baseUrl}/api/system/production-health`, {
    headers: { accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`/api/system/production-health returned HTTP ${response.status}`);
  }

  return response.json();
}

async function runCli() {
  try {
    const options = parseProductionHealthArgs(process.argv.slice(2));
    const payload = await fetchProductionHealth(options.baseUrl);
    const result = evaluateProductionHealth(payload, options);
    console.log(formatProductionHealthReport(result));
    process.exitCode = result.ok ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
}

function requireValue(args, index) {
  const value = args[index + 1];
  if (!value) throw new Error(`${args[index]} requires a value`);
  return value;
}

function unique(values) {
  return [...new Set(values)];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
