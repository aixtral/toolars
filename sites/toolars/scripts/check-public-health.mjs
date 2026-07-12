import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultBaseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";

export function parsePublicHealthArgs(argv) {
  const parsed = { baseUrl: stripTrailingSlash(defaultBaseUrl) };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") continue;
    if (arg === "--base-url") {
      const value = argv[index + 1];
      if (!value) throw new Error("--base-url requires a value");
      parsed.baseUrl = stripTrailingSlash(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown public health option: ${arg}`);
  }

  return parsed;
}

export function evaluatePublicHealth(payload) {
  if (payload?.status === "ok") return { ok: true, reason: null };

  return { ok: false, reason: 'Expected public health status "ok"' };
}

async function runCli() {
  try {
    const { baseUrl } = parsePublicHealthArgs(process.argv.slice(2));
    const response = await fetch(`${baseUrl}/api/system/production-health`, {
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`/api/system/production-health returned HTTP ${response.status}`);
    }

    const result = evaluatePublicHealth(await response.json());
    if (!result.ok) throw new Error(result.reason);

    console.log(`Public health: pass (${baseUrl})`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
