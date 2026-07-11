import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const defaultBaseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";
const defaultStartupTimeoutMs = 30_000;

export function parseWithProductionServerArgs(argv) {
  const separatorIndex = argv.indexOf("--");
  if (separatorIndex < 0 || separatorIndex === argv.length - 1) {
    throw new Error("Usage: node scripts/with-production-server.mjs [--base-url URL] [--startup-timeout-ms MS] -- <command> [...args]");
  }

  const wrapperArgs = argv.slice(0, separatorIndex);
  const commandArgs = argv.slice(separatorIndex + 1);
  let baseUrl = defaultBaseUrl;
  let startupTimeoutMs = defaultStartupTimeoutMs;

  for (let index = 0; index < wrapperArgs.length; index += 1) {
    const arg = wrapperArgs[index];
    if (arg === "--base-url") {
      baseUrl = requireValue(wrapperArgs, index);
      index += 1;
    } else if (arg === "--startup-timeout-ms") {
      startupTimeoutMs = Number(requireValue(wrapperArgs, index));
      index += 1;
    } else {
      throw new Error(`Unknown with-production-server option: ${arg}`);
    }
  }

  if (!Number.isFinite(startupTimeoutMs) || startupTimeoutMs <= 0) {
    throw new Error("--startup-timeout-ms must be a positive number");
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    startupTimeoutMs,
    command: commandArgs[0],
    args: commandArgs.slice(1)
  };
}

export function createProductionServerCommand(baseUrl) {
  const url = new URL(baseUrl);
  const port = url.port || (url.protocol === "https:" ? "443" : "80");

  return {
    command: "pnpm",
    args: ["exec", "next", "start", "-p", port]
  };
}

async function runWithProductionServer(options) {
  const alreadyRunning = await isServerHealthy(options.baseUrl);
  const server = alreadyRunning ? null : startProductionServer(options.baseUrl);

  if (alreadyRunning) {
    console.log(`Using existing server at ${options.baseUrl}`);
  } else {
    await waitForServer(options.baseUrl, server, options.startupTimeoutMs);
  }

  try {
    return await runWrappedCommand(options);
  } finally {
    if (server) {
      await stopProcess(server);
    }
  }
}

function startProductionServer(baseUrl) {
  const serverCommand = createProductionServerCommand(baseUrl);
  const child = spawn(serverCommand.command, serverCommand.args, {
    cwd: siteRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  return child;
}

async function waitForServer(baseUrl, server, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(`Production server exited before becoming ready with code ${server.exitCode}`);
    }
    if (await isServerHealthy(baseUrl)) {
      return;
    }
    await delay(250);
  }

  throw new Error(`Timed out waiting for production server at ${baseUrl}`);
}

async function isServerHealthy(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/sitemap.xml`, {
      headers: { "accept-language": "en-US,en;q=0.9" }
    });
    return response.ok;
  } catch {
    return false;
  }
}

function runWrappedCommand({ baseUrl, command, args }) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: siteRoot,
      env: {
        ...process.env,
        TOOLARS_BASE_URL: baseUrl
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    child.stdout.on("data", (chunk) => process.stdout.write(chunk));
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", (error) => {
      console.error(error);
      resolve(1);
    });
  });
}

function stopProcess(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null) {
      resolve();
      return;
    }

    const timer = setTimeout(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
    }, 2_000);

    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    child.kill("SIGTERM");
  });
}

function requireValue(args, index) {
  const value = args[index + 1];
  if (!value) throw new Error(`${args[index]} requires a value`);
  return value;
}

async function runCli() {
  try {
    const options = parseWithProductionServerArgs(process.argv.slice(2));
    process.exitCode = await runWithProductionServer(options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
