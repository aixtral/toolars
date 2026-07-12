import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");

export function createLaunchReadinessPlan({
  full = false,
  browser = full,
  visual = full,
  skipProductionHealth = false,
  skipSourceInventory = false,
  baseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088",
  outputRoot = defaultOutputRoot()
} = {}) {
  const auditsRoot = path.join(outputRoot, "audits");
  const gates = [
    gate("unit-tests", "Vitest unit and workspace tests", "pnpm", ["test"]),
    gate("typecheck", "TypeScript typecheck", "pnpm", ["run", "typecheck"]),
    gate("production-build", "Next.js production build", "pnpm", ["run", "build"]),
    ...(skipProductionHealth ? [] : [
      browserGate("production-health", "Production health gate", "node", [
        "scripts/check-production-health.mjs",
        "--base-url",
        baseUrl
      ], baseUrl, {
        TOOLARS_BASE_URL: baseUrl
      })
    ]),
    ...(skipSourceInventory ? [] : [
      gate("tool-inventory-audit", "Tool inventory audit", "node", [
        "scripts/audit-tool-inventory.mjs",
        "--write",
        path.join(auditsRoot, "tool-inventory.json")
      ])
    ]),
    browserGate("certified-tool-smoke", "Certified tool browser smoke", "node", [
      "scripts/certified-tool-smoke.mjs",
      "--write",
      path.join(auditsRoot, "certified-tool-smoke.json"),
      "--output-dir",
      path.join(outputRoot, "browser", "certified-tools")
    ], baseUrl, {
      TOOLARS_BASE_URL: baseUrl
    }),
    gate("button-behavior-audit", "Button behavior audit", "node", ["scripts/audit-button-behavior.mjs"]),
    gate("i18n-audit", "I18n residue audit", "node", [
      "scripts/audit-i18n.mjs",
      "--write",
      path.join(auditsRoot, "i18n.json"),
      "--fail-on-blockers"
    ]),
    gate("i18n-quality-audit", "I18n quality audit", "node", [
      "scripts/audit-i18n-quality.mjs",
      "--write",
      path.join(auditsRoot, "i18n-quality.json"),
      "--fail-on-needs-work"
    ])
  ];

  if (browser) {
    gates.push(
      browserGate("public-tool-workspace-smoke", "Public tool workspace browser smoke", "node", [
        "scripts/public-tool-workspace-smoke.mjs",
        "--write",
        path.join(auditsRoot, "public-tool-workspace-smoke.json"),
        "--output-dir",
        path.join(outputRoot, "browser", "public-workspaces")
      ], baseUrl, {
        TOOLARS_BASE_URL: baseUrl
      }),
      browserGate("route-crawl", "Launch sitemap route crawl", "node", ["scripts/launch-route-crawl.mjs"], baseUrl, {
        TOOLARS_BASE_URL: baseUrl,
        TOOLARS_ROUTE_CRAWL_OUTPUT_DIR: path.join(outputRoot, "browser", "route-crawl")
      }),
      browserGate("language-ux-smoke", "Language switcher browser smoke", "node", ["scripts/language-ux-smoke.mjs"], baseUrl, {
        TOOLARS_BASE_URL: baseUrl,
        TOOLARS_LANGUAGE_UX_OUTPUT_DIR: path.join(outputRoot, "browser", "language-ux")
      }),
      browserGate("draft-locale-smoke", "Draft locale non-public smoke", "node", ["scripts/draft-locale-non-public-smoke.mjs"], baseUrl, {
        TOOLARS_BASE_URL: baseUrl,
        TOOLARS_DRAFT_LOCALE_SMOKE_OUTPUT_DIR: path.join(outputRoot, "browser", "draft-locales")
      })
    );
  }

  if (visual) {
    gates.push(
      browserGate("visual-release-gate", "Visual release gate", "node", ["scripts/visual-release-gate.mjs"], baseUrl, {
        TOOLARS_BASE_URL: baseUrl,
        TOOLARS_RELEASE_GATE_OUTPUT_DIR: path.join(outputRoot, "visual-release-gate")
      })
    );
  }

  return gates;
}

export function runLaunchReadinessPlan(
  plan,
  {
    runner = defaultRunner,
    startedAt = new Date().toISOString(),
    finishedAt,
    onGateStart,
    onGateResult
  } = {}
) {
  const results = [];

  for (const gate of plan) {
    const started = Date.now();
    onGateStart?.(gate);
    const result = runner(gate);
    const elapsedMs = Date.now() - started;
    const ok = result.status === 0;
    const reportResult = {
      id: gate.id,
      label: gate.label,
      ok,
      status: result.status,
      elapsedMs,
      commandLine: commandLine(gate),
      stdoutTail: tail(result.stdout ?? ""),
      stderrTail: tail(result.stderr ?? "")
    };
    results.push(reportResult);
    onGateResult?.(reportResult);
  }

  const summary = {
    total: results.length,
    passed: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length
  };

  return {
    status: summary.failed === 0 ? "pass" : "fail",
    startedAt,
    finishedAt: finishedAt ?? new Date().toISOString(),
    summary,
    results
  };
}

export function formatLaunchReadinessMarkdown(report) {
  const rows = report.results
    .map((result) => `| ${result.id} | ${result.ok ? "pass" : "fail"} | ${result.elapsedMs} | \`${result.commandLine}\` |`)
    .join("\n");
  const failedDetails = report.results
    .filter((result) => !result.ok)
    .map((result) => {
      const output = [result.stdoutTail, result.stderrTail].filter(Boolean).join("\n");
      return `\n## ${result.id}\n\n\`\`\`text\n${output || "No captured output."}\n\`\`\``;
    })
    .join("\n");

  return `# Toolars Launch Readiness Report

Status: ${report.status}
Started: ${report.startedAt}
Finished: ${report.finishedAt}
Passed: ${report.summary.passed}/${report.summary.total}

| Gate | Status | Elapsed ms | Command |
| --- | --- | ---: | --- |
${rows}
${failedDetails}
`;
}

function gate(id, label, command, args, env = {}) {
  return {
    id,
    label,
    command,
    args,
    cwd: siteRoot,
    env
  };
}

function browserGate(id, label, command, args, baseUrl, env = {}) {
  return gate(
    id,
    label,
    "node",
    ["scripts/with-production-server.mjs", "--base-url", baseUrl, "--", command, ...args],
    env
  );
}

function defaultRunner(gate) {
  return spawnSync(gate.command, gate.args, {
    cwd: gate.cwd,
    env: {
      ...process.env,
      ...gate.env
    },
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 60
  });
}

function commandLine(gate) {
  return [gate.command, ...gate.args].map(shellToken).join(" ");
}

function shellToken(token) {
  if (/^[A-Za-z0-9_./:@=-]+$/.test(token)) return token;
  return JSON.stringify(token);
}

function tail(value, maxLines = 80) {
  return String(value).trim().split(/\r?\n/).slice(-maxLines).join("\n");
}

function defaultOutputRoot() {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(repoRoot, "output", "launch-readiness", runId);
}

export function parseLaunchReadinessArgs(argv) {
  const args = new Set(argv);
  const valueAfter = (name) => {
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  const parsed = {
    full: args.has("--full"),
    baseUrl: valueAfter("--base-url") ?? process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088",
    outputRoot: valueAfter("--output")
  };

  if (args.has("--browser")) parsed.browser = true;
  if (args.has("--visual")) parsed.visual = true;
  if (args.has("--skip-production-health")) parsed.skipProductionHealth = true;
  if (args.has("--skip-source-inventory")) parsed.skipSourceInventory = true;

  return parsed;
}

function runCli() {
  const options = parseLaunchReadinessArgs(process.argv.slice(2));
  const outputRoot = options.outputRoot ? path.resolve(options.outputRoot) : defaultOutputRoot();
  mkdirSync(outputRoot, { recursive: true });

  const plan = createLaunchReadinessPlan({ ...options, outputRoot });
  const report = runLaunchReadinessPlan(plan, {
    onGateStart: (gate) => {
      console.log(`running ${gate.id}: ${commandLine(gate)}`);
    },
    onGateResult: (result) => {
      const status = result.ok ? "pass" : "fail";
      console.log(`${status} ${result.id} ${result.elapsedMs}ms`);
      if (result.stdoutTail) console.log(result.stdoutTail);
      if (result.stderrTail) console.error(result.stderrTail);
    }
  });

  writeFileSync(path.join(outputRoot, "launch-readiness-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(path.join(outputRoot, "launch-readiness-report.md"), formatLaunchReadinessMarkdown(report));
  console.log(`Launch readiness report: ${outputRoot}`);

  if (report.status !== "pass") {
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
