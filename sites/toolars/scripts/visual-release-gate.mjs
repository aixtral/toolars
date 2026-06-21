import { mkdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { selectReleaseGateDefinitions } from "./visual-release-gate-config.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputRoot = process.env.TOOLARS_RELEASE_GATE_OUTPUT_DIR
  ? path.resolve(process.env.TOOLARS_RELEASE_GATE_OUTPUT_DIR)
  : path.join(repoRoot, "output", "visual-release-gate", runId);
const gates = selectReleaseGateDefinitions();

mkdirSync(outputRoot, { recursive: true });

for (const gate of gates) {
  const gateRoot = path.join(outputRoot, gate.id);
  const captureRoot = path.join(gateRoot, "capture");
  const diffRoot = path.join(gateRoot, "diff");
  const ids = gate.ids.join(",");

  console.log(`visual release gate ${gate.id}: ${gate.ids.length} screens, max ratio ${(gate.maxRatio * 100).toFixed(2)}%`);

  runNodeScript("visual-verify-design-pack.mjs", {
    TOOLARS_VISUAL_IDS: ids,
    TOOLARS_VISUAL_OUTPUT_DIR: captureRoot
  });
  runNodeScript("visual-diff-design-pack.mjs", {
    TOOLARS_PIXELMATCH_IDS: ids,
    TOOLARS_PIXELMATCH_MAX_RATIO: String(gate.maxRatio),
    TOOLARS_PIXELMATCH_OUTPUT_DIR: diffRoot,
    TOOLARS_VISUAL_REPORT: path.join(captureRoot, "visual-design-pack-report.json")
  });
}

console.log(`Visual release gate complete: ${outputRoot}`);

function runNodeScript(scriptName, env) {
  const result = spawnSync(process.execPath, [path.join(scriptDir, scriptName)], {
    cwd: siteRoot,
    env: {
      ...process.env,
      ...env
    },
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
