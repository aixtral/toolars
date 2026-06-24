import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = path.resolve(scriptDir, "..");
const defaultRepoRoot = path.resolve(defaultSiteRoot, "../..");

export async function createToolInventoryAudit(options = {}) {
  const roots = resolveRoots(options);
  const registry = loadTypeScriptExports(path.join(roots.siteRoot, "src/data/registry.ts"));
  const aixtralConfig = loadTypeScriptExports(path.join(roots.aixtralLabRoot, "src/lib/tool-config.ts"));

  const registryTools = registry.tools ?? [];
  const publicTools = registry.publicTools ?? registryTools;
  const registryCategories = registry.categories ?? [];
  const getPublicToolsByCategory =
    typeof registry.getPublicToolsByCategory === "function" ? registry.getPublicToolsByCategory : null;
  const aixtralTools = aixtralConfig.TOOLS ?? [];

  const vitalcalcRootTools = await listFileSlugs(path.join(roots.vitalcalcRoot, "src/pages/tools"), ".astro");
  const aixtralImplementations = await listFileSlugs(path.join(roots.aixtralLabRoot, "src/lib/tools"), ".ts", {
    excludeTests: true
  });
  const toolarsLibs = await listFileSlugs(path.join(roots.siteRoot, "src/lib/tools"), ".ts", {
    excludeTests: true
  });
  const toolarsLibTests = await listFileSlugs(path.join(roots.siteRoot, "src/lib/tools"), ".test.ts");
  const routeCoverage = await scanDedicatedToolRoutes(path.join(roots.siteRoot, "src/app/[locale]/tools"));

  const registrySlugs = new Set(registryTools.map((tool) => tool.slug));
  const publicToolSlugs = publicTools.map((tool) => tool.slug);
  const registryBySlug = new Map(registryTools.map((tool) => [tool.slug, tool]));
  const vitalcalcSlugs = new Set(vitalcalcRootTools);
  const aixtralConfigSlugs = new Set(aixtralTools.map((tool) => tool.slug));
  const aixtralImplementationSlugs = new Set(aixtralImplementations);
  const toolarsLibSlugs = new Set(toolarsLibs);
  const toolarsLibTestSlugs = new Set(toolarsLibTests);
  const dedicatedRouteSlugs = new Set(routeCoverage.routes);
  const dedicatedWorkspaceSlugs = new Set(routeCoverage.workspaces);
  const workspaceTestSlugs = new Set(routeCoverage.workspaceTests);

  const allSlugs = sortStrings([
    ...registrySlugs,
    ...vitalcalcSlugs,
    ...aixtralConfigSlugs,
    ...aixtralImplementationSlugs,
    ...toolarsLibSlugs,
    ...dedicatedRouteSlugs
  ]);

  const entries = allSlugs.map((slug) => {
    const registryTool = registryBySlug.get(slug);
    const coverage = {
      registry: registrySlugs.has(slug),
      vitalcalcSource: vitalcalcSlugs.has(slug),
      aixtralConfig: aixtralConfigSlugs.has(slug),
      aixtralImplementation: aixtralImplementationSlugs.has(slug),
      dedicatedRoute: dedicatedRouteSlugs.has(slug),
      dedicatedWorkspace: dedicatedWorkspaceSlugs.has(slug),
      genericRoute: routeCoverage.hasGenericRoute,
      toolarsLib: toolarsLibSlugs.has(slug),
      toolarsLibTest: toolarsLibTestSlugs.has(slug),
      workspaceTest: workspaceTestSlugs.has(slug)
    };

    return {
      slug,
      name: registryTool?.name ?? null,
      registrySource: registryTool?.source ?? null,
      registryCategory: registryTool?.category ?? null,
      registryGroup: registryTool?.group ?? null,
      status: getEntryStatus(coverage, registryTool),
      coverage
    };
  });

  const registryByCategory = countBy(registryTools, (tool) => tool.category);
  const publicByCategory = Object.fromEntries(
    registryCategories.map((category) => [category.label, getPublicCategoryTools(category.label, publicTools, getPublicToolsByCategory).length])
  );
  const categoryCountMismatches = registryCategories
    .map((category) => {
      const actual = getPublicCategoryTools(category.label, publicTools, getPublicToolsByCategory).length;
      return {
        label: category.label,
        declared: category.count,
        actual
      };
    })
    .filter((item) => item.declared !== item.actual);

  const gaps = {
    categoryCountMismatches,
    vitalcalc: {
      missingFromRegistry: diff(vitalcalcRootTools, registryTools.filter((tool) => tool.source === "vitalcalc").map((tool) => tool.slug)),
      registryMissingSource: diff(
        registryTools.filter((tool) => tool.source === "vitalcalc").map((tool) => tool.slug),
        vitalcalcRootTools
      )
    },
    aixtralLab: {
      configMissingFromRegistry: diff(aixtralTools.map((tool) => tool.slug), registryTools.filter((tool) => tool.source === "aixtral-lab").map((tool) => tool.slug)),
      registryMissingFromConfig: diff(registryTools.filter((tool) => tool.source === "aixtral-lab").map((tool) => tool.slug), aixtralTools.map((tool) => tool.slug)),
      implementationMissingFromRegistry: diff(aixtralImplementations, registryTools.filter((tool) => tool.source === "aixtral-lab").map((tool) => tool.slug)),
      configWithoutImplementation: diff(aixtralTools.map((tool) => tool.slug), aixtralImplementations),
      implementationMissingFromConfig: diff(aixtralImplementations, aixtralTools.map((tool) => tool.slug))
    },
    toolars: {
      publicMissingDedicatedRoutes: diff(publicToolSlugs, routeCoverage.routes),
      publicMissingDedicatedWorkspaces: diff(publicToolSlugs, routeCoverage.workspaces),
      publicMissingToolarsLib: diff(publicToolSlugs, toolarsLibs),
      publicMissingToolarsLibTests: diff(publicToolSlugs, toolarsLibTests),
      publicMissingWorkspaceTests: diff(publicToolSlugs, routeCoverage.workspaceTests),
      registryMissingDedicatedRoutes: diff(registryTools.map((tool) => tool.slug), routeCoverage.routes),
      registryMissingDedicatedWorkspaces: diff(registryTools.map((tool) => tool.slug), routeCoverage.workspaces),
      registryMissingToolarsLib: diff(registryTools.map((tool) => tool.slug), toolarsLibs),
      registryMissingToolarsLibTests: diff(registryTools.map((tool) => tool.slug), toolarsLibTests),
      registryMissingWorkspaceTests: diff(registryTools.map((tool) => tool.slug), routeCoverage.workspaceTests),
      dedicatedRoutesMissingRegistry: diff(routeCoverage.routes, registryTools.map((tool) => tool.slug)),
      toolarsLibMissingRegistry: diff(toolarsLibs, registryTools.map((tool) => tool.slug))
    }
  };

  return {
    generatedAt: new Date().toISOString(),
    roots,
    summary: {
      launchReadiness: "internal-alpha",
      toolars: {
        registryTools: registryTools.length,
        publicTools: publicTools.length,
        registryBySource: countBy(registryTools, (tool) => tool.source),
        registryByGroup: countBy(registryTools, (tool) => tool.group),
        registryByCategory,
        publicByCategory,
        declaredCategories: registryCategories.length,
        dedicatedToolRoutes: routeCoverage.routes.length,
        dedicatedWorkspaces: routeCoverage.workspaces.length,
        toolarsLibImplementations: toolarsLibs.length,
        toolarsLibTests: toolarsLibTests.length,
        genericToolRoute: routeCoverage.hasGenericRoute
      },
      sources: {
        vitalcalc: {
          rootToolPages: vitalcalcRootTools.length
        },
        aixtralLab: {
          configTools: aixtralTools.length,
          implementedTools: aixtralImplementations.length,
          configByCategory: countBy(aixtralTools, (tool) => tool.category)
        }
      },
      gaps: {
        categoryCountMismatches: categoryCountMismatches.length,
        publicMissingDedicatedWorkspaces: gaps.toolars.publicMissingDedicatedWorkspaces.length,
        publicMissingToolarsLib: gaps.toolars.publicMissingToolarsLib.length,
        registryMissingDedicatedWorkspaces: gaps.toolars.registryMissingDedicatedWorkspaces.length,
        registryMissingToolarsLib: gaps.toolars.registryMissingToolarsLib.length,
        aixtralConfigMissingFromRegistry: gaps.aixtralLab.configMissingFromRegistry.length,
        aixtralConfigWithoutImplementation: gaps.aixtralLab.configWithoutImplementation.length
      }
    },
    gaps,
    entries
  };
}

export function formatAuditSummary(audit) {
  const lines = [
    "Toolars launch readiness: internal-alpha",
    `Registry tools: ${audit.summary.toolars.registryTools}`,
    `Public tools: ${audit.summary.toolars.publicTools}`,
    `Registry by source: ${formatObject(audit.summary.toolars.registryBySource)}`,
    `VitalCalc source pages: ${audit.summary.sources.vitalcalc.rootToolPages}`,
    `Aixtral Lab config/tools implemented: ${audit.summary.sources.aixtralLab.configTools}/${audit.summary.sources.aixtralLab.implementedTools}`,
    `Dedicated workspaces: ${audit.summary.toolars.dedicatedWorkspaces}`,
    `Category count mismatches: ${audit.gaps.categoryCountMismatches.length}`,
    `Public tools missing workspace/lib: ${audit.gaps.toolars.publicMissingDedicatedWorkspaces.length}/${audit.gaps.toolars.publicMissingToolarsLib.length}`,
    `Aixtral config missing from registry: ${audit.gaps.aixtralLab.configMissingFromRegistry.length}`,
    `Registry tools missing Toolars lib: ${audit.gaps.toolars.registryMissingToolarsLib.length}`
  ];

  return `${lines.join("\n")}\n`;
}

export function resolveRoots(options = {}) {
  const siteRoot = path.resolve(options.siteRoot ?? process.env.TOOLARS_SITE_ROOT ?? defaultSiteRoot);
  const repoRoot = path.resolve(siteRoot, "../..");

  return {
    siteRoot,
    vitalcalcRoot: path.resolve(
      options.vitalcalcRoot ?? process.env.TOOLARS_VITALCALC_ROOT ?? path.join(repoRoot, "../aixtral-calm/vitalcalc")
    ),
    aixtralLabRoot: path.resolve(
      options.aixtralLabRoot ?? process.env.TOOLARS_AIXTRAL_LAB_ROOT ?? path.join(repoRoot, "../aixtral-lab")
    )
  };
}

function loadTypeScriptExports(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Required TypeScript data file not found: ${filePath}`);
  }

  const typescript = require("typescript");
  const source = require("node:fs").readFileSync(filePath, "utf8");
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020
    }
  }).outputText;

  const module = { exports: {} };
  const localRequire = createRequire(filePath);
  vm.runInNewContext(
    output,
    {
      module,
      exports: module.exports,
      require: localRequire,
      console
    },
    { filename: filePath }
  );

  return module.exports;
}

async function listFileSlugs(dir, suffix, options = {}) {
  const files = await safeReadDir(dir);

  return sortStrings(
    files
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .filter((name) => name.endsWith(suffix))
      .filter((name) => (options.excludeTests ? !name.includes(".test.") : true))
      .map((name) => name.slice(0, -suffix.length))
  );
}

async function scanDedicatedToolRoutes(toolsDir) {
  const entries = await safeReadDir(toolsDir);
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const dedicatedDirs = dirs.filter((name) => name !== "[slug]");
  const routes = [];
  const workspaces = [];
  const workspaceTests = [];

  for (const slug of dedicatedDirs) {
    const routeDir = path.join(toolsDir, slug);
    if (existsSync(path.join(routeDir, "page.tsx"))) {
      routes.push(slug);
    }
    if (existsSync(path.join(routeDir, `${slug}-workspace.tsx`))) {
      workspaces.push(slug);
    }
    if (existsSync(path.join(routeDir, `${slug}-workspace.test.tsx`))) {
      workspaceTests.push(slug);
    }
  }

  return {
    routes: sortStrings(routes),
    workspaces: sortStrings(workspaces),
    workspaceTests: sortStrings(workspaceTests),
    hasGenericRoute: existsSync(path.join(toolsDir, "[slug]/page.tsx"))
  };
}

async function safeReadDir(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function getEntryStatus(coverage, registryTool) {
  if (!coverage.registry) {
    return "missing-from-toolars";
  }

  if (
    coverage.dedicatedRoute &&
    coverage.dedicatedWorkspace &&
    coverage.toolarsLib &&
    coverage.toolarsLibTest &&
    coverage.workspaceTest &&
    isSourceBacked(coverage, registryTool)
  ) {
    return "source-backed-workspace";
  }

  if (!coverage.dedicatedRoute || !coverage.dedicatedWorkspace) {
    return "generic-route-only";
  }

  return "incomplete-toolars-implementation";
}

function isSourceBacked(coverage, registryTool) {
  if (registryTool?.source === "vitalcalc") {
    return coverage.vitalcalcSource;
  }
  if (registryTool?.source === "aixtral-lab") {
    return coverage.aixtralConfig && coverage.aixtralImplementation;
  }
  return registryTool?.source === "toolars";
}

function diff(left, right) {
  const rightSet = new Set(right);
  return sortStrings([...new Set(left)].filter((item) => !rightSet.has(item)));
}

function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function getPublicCategoryTools(label, publicTools, getPublicToolsByCategory) {
  if (getPublicToolsByCategory) {
    return getPublicToolsByCategory(label);
  }
  if (label === "All") {
    return publicTools;
  }

  return publicTools.filter((tool) => tool.category === label);
}

function sortStrings(items) {
  return [...new Set(items)].sort((a, b) => a.localeCompare(b));
}

function formatObject(object) {
  return Object.entries(object)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
}

async function runCli() {
  const args = process.argv.slice(2);
  const writeIndex = args.indexOf("--write");
  const writePath = writeIndex >= 0 ? args[writeIndex + 1] : null;
  const audit = await createToolInventoryAudit();

  if (writePath) {
    const target = path.resolve(defaultSiteRoot, writePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  }

  if (args.includes("--json")) {
    process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
  } else {
    process.stdout.write(formatAuditSummary(audit));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
