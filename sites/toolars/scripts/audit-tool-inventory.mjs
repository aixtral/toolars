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
const aixtralSourceSlugAliases = {
  "http-status-codes": "http-status-reference"
};

export async function createToolInventoryAudit(options = {}) {
  const roots = resolveRoots(options);
  const registry = loadTypeScriptExports(path.join(roots.siteRoot, "src/data/registry.ts"));
  const localeData = loadTypeScriptExports(path.join(roots.siteRoot, "src/data/locales.ts"));
  const aixtralConfig = loadTypeScriptExports(path.join(roots.aixtralLabRoot, "src/lib/tool-config.ts"));

  const registryTools = registry.tools ?? [];
  const publicTools = registry.publicTools ?? registryTools;
  const registryCategories = registry.categories ?? [];
  const getPublicToolsByCategory =
    typeof registry.getPublicToolsByCategory === "function" ? registry.getPublicToolsByCategory : null;
  const aixtralTools = aixtralConfig.TOOLS ?? [];
  const aixtralConfigSlugs = sortStrings(aixtralTools.map((tool) => normalizeAixtralSourceSlug(tool.slug)));

  const vitalcalcRootTools = await listFileSlugs(path.join(roots.vitalcalcRoot, "src/pages/tools"), ".astro");
  const aixtralImplementations = normalizeAixtralSourceSlugs(
    await listFileSlugs(path.join(roots.aixtralLabRoot, "src/lib/tools"), ".ts", {
      excludeTests: true
    })
  );
  const toolarsLibs = await listFileSlugs(path.join(roots.siteRoot, "src/lib/tools"), ".ts", {
    excludeTests: true
  });
  const toolarsLibTests = await listFileSlugs(path.join(roots.siteRoot, "src/lib/tools"), ".test.ts");
  const routeCoverage = await scanDedicatedToolRoutes(path.join(roots.siteRoot, "src/app/[locale]/tools"));
  const vitalcalcBlogByLocale = await scanVitalcalcBlogByLocale(path.join(roots.vitalcalcRoot, "src/pages"));
  const vitalcalcBlogSlugs = sortStrings(Object.values(vitalcalcBlogByLocale).flat());
  const toolarsBlogSlugs = await scanToolarsBlogSlugs(roots.siteRoot);
  const localeMatrix = await createSourceLocaleMatrix(roots, localeData);
  const hardcodedUserFacingStrings = await scanHardcodedUserFacingStrings(roots.siteRoot);

  const registrySlugs = new Set(registryTools.map((tool) => tool.slug));
  const publicToolSlugs = publicTools.map((tool) => tool.slug);
  const registryBySlug = new Map(registryTools.map((tool) => [tool.slug, tool]));
  const vitalcalcSlugs = new Set(vitalcalcRootTools);
  const aixtralConfigSlugSet = new Set(aixtralConfigSlugs);
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
      aixtralConfig: aixtralConfigSlugSet.has(slug),
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

  const sources = {
    vitalcalc: {
      rootToolPages: vitalcalcRootTools.length,
      rootToolSlugs: vitalcalcRootTools,
      blogLocales: Object.keys(vitalcalcBlogByLocale),
      blogByLocale: vitalcalcBlogByLocale,
      blogSlugs: vitalcalcBlogSlugs
    },
    aixtralLab: {
      configTools: aixtralTools.length,
      implementedTools: aixtralImplementations.length,
      configByCategory: countBy(aixtralTools, (tool) => tool.category),
      configSlugs: aixtralConfigSlugs,
      implementedSlugs: aixtralImplementations,
      slugAliases: aixtralSourceSlugAliases
    },
    toolars: {
      blogSlugs: toolarsBlogSlugs,
      messageLocales: localeMatrix.toolarsMessages,
      locales: localeMatrix.toolarsLocales
    },
    locales: localeMatrix
  };

  const gaps = {
    categoryCountMismatches,
    blog: {
      missingVitalcalcSlugs: diff(vitalcalcBlogSlugs, toolarsBlogSlugs),
      toolarsSlugsMissingFromVitalcalc: diff(toolarsBlogSlugs, vitalcalcBlogSlugs)
    },
    locales: {
      missingRegisteredLocales: diff(localeMatrix.sourceLocales, localeMatrix.toolarsLocales),
      missingLaunchLocales: diff(localeMatrix.sourceLocales, localeMatrix.toolarsLaunchLocales),
      toolarsMessagesMissingFromLocales: diff(localeMatrix.toolarsMessages, localeMatrix.toolarsLocales),
      toolarsLocalesMissingMessages: diff(localeMatrix.toolarsLocales, localeMatrix.toolarsMessages)
    },
    i18n: {
      hardcodedUserFacingStrings
    },
    vitalcalc: {
      missingFromRegistry: diff(vitalcalcRootTools, registryTools.filter((tool) => tool.source === "vitalcalc").map((tool) => tool.slug)),
      registryMissingSource: diff(
        registryTools.filter((tool) => tool.source === "vitalcalc").map((tool) => tool.slug),
        vitalcalcRootTools
      )
    },
    aixtralLab: {
      configMissingFromRegistry: diff(aixtralConfigSlugs, registryTools.filter((tool) => tool.source === "aixtral-lab").map((tool) => tool.slug)),
      registryMissingFromConfig: diff(registryTools.filter((tool) => tool.source === "aixtral-lab").map((tool) => tool.slug), aixtralConfigSlugs),
      implementationMissingFromRegistry: diff(aixtralImplementations, registryTools.filter((tool) => tool.source === "aixtral-lab").map((tool) => tool.slug)),
      configWithoutImplementation: diff(aixtralConfigSlugs, aixtralImplementations),
      implementationMissingFromConfig: diff(aixtralImplementations, aixtralConfigSlugs)
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
    sources,
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
          rootToolPages: sources.vitalcalc.rootToolPages,
          blogLocales: sources.vitalcalc.blogLocales.length,
          blogSlugs: sources.vitalcalc.blogSlugs.length
        },
        aixtralLab: {
          configTools: sources.aixtralLab.configTools,
          implementedTools: sources.aixtralLab.implementedTools,
          configByCategory: sources.aixtralLab.configByCategory
        },
        locales: {
          sourceLocales: sources.locales.sourceLocales.length,
          toolarsLocales: sources.locales.toolarsLocales.length,
          toolarsLaunchLocales: sources.locales.toolarsLaunchLocales.length,
          toolarsDraftLocales: sources.locales.toolarsDraftLocales.length,
          toolarsMessageLocales: sources.locales.toolarsMessages.length,
          missingLaunchLocales: gaps.locales.missingLaunchLocales.length
        }
      },
      gaps: {
        categoryCountMismatches: categoryCountMismatches.length,
        missingVitalcalcBlogSlugs: gaps.blog.missingVitalcalcSlugs.length,
        missingLaunchLocales: gaps.locales.missingLaunchLocales.length,
        hardcodedUserFacingStrings: gaps.i18n.hardcodedUserFacingStrings.count,
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
    `VitalCalc source blog locales/slugs: ${audit.summary.sources.vitalcalc.blogLocales}/${audit.summary.sources.vitalcalc.blogSlugs}`,
    `Aixtral Lab config/tools implemented: ${audit.summary.sources.aixtralLab.configTools}/${audit.summary.sources.aixtralLab.implementedTools}`,
    `Source locales / Toolars registered locales: ${audit.summary.sources.locales.sourceLocales}/${audit.summary.sources.locales.toolarsLocales}`,
    `Toolars launch/draft/message locales: ${audit.summary.sources.locales.toolarsLaunchLocales}/${audit.summary.sources.locales.toolarsDraftLocales}/${audit.summary.sources.locales.toolarsMessageLocales}`,
    `Dedicated workspaces: ${audit.summary.toolars.dedicatedWorkspaces}`,
    `Category count mismatches: ${audit.gaps.categoryCountMismatches.length}`,
    `VitalCalc blog slugs missing from Toolars: ${audit.gaps.blog.missingVitalcalcSlugs.length}`,
    `Source locales missing from Toolars launch: ${audit.gaps.locales.missingLaunchLocales.length}`,
    `Hardcoded user-facing UI strings: ${audit.gaps.i18n.hardcodedUserFacingStrings.count}`,
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

function normalizeAixtralSourceSlug(slug) {
  return aixtralSourceSlugAliases[slug] ?? slug;
}

function normalizeAixtralSourceSlugs(slugs) {
  return sortStrings(slugs.map((slug) => normalizeAixtralSourceSlug(slug)));
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

async function scanVitalcalcBlogByLocale(pagesDir) {
  const blogByLocale = {};

  await addVitalcalcBlogLocale(blogByLocale, "en", path.join(pagesDir, "blog"));

  const entries = await safeReadDir(pagesDir);
  for (const entry of entries) {
    if (!entry.isDirectory() || !isLocaleLike(entry.name)) {
      continue;
    }

    await addVitalcalcBlogLocale(blogByLocale, normalizeSourceLocale(entry.name), path.join(pagesDir, entry.name, "blog"));
  }

  return Object.fromEntries(Object.entries(blogByLocale).sort(([a], [b]) => a.localeCompare(b)));
}

async function addVitalcalcBlogLocale(blogByLocale, locale, blogDir) {
  if (!existsSync(blogDir)) {
    return;
  }

  blogByLocale[locale] = sortStrings([...(blogByLocale[locale] ?? []), ...(await listAstroContentSlugs(blogDir))]);
}

async function listAstroContentSlugs(dir) {
  return (await listFileSlugs(dir, ".astro")).filter((slug) => !["404", "index"].includes(slug));
}

async function createSourceLocaleMatrix(roots, localeData) {
  const aixtralMessageFiles = await listJsonBasenames(path.join(roots.aixtralLabRoot, "messages"));
  const toolarsMessageFiles = await listJsonBasenames(path.join(roots.siteRoot, "messages"));
  const vitalcalcPageInfo = await scanVitalcalcPageLocaleInfo(path.join(roots.vitalcalcRoot, "src/pages"));
  const toolarsLocaleDefinitions = localeData.LOCALES ?? [];
  const toolarsLocales = sortStrings(toolarsLocaleDefinitions.map((locale) => locale.code));
  const toolarsLaunchLocales = sortStrings(
    toolarsLocaleDefinitions.filter((locale) => locale.phase === "launch").map((locale) => locale.code)
  );
  const toolarsDraftLocales = sortStrings(
    toolarsLocaleDefinitions.filter((locale) => locale.phase !== "launch").map((locale) => locale.code)
  );
  const aixtralMessages = normalizeLocaleList(aixtralMessageFiles);
  const toolarsMessages = normalizeLocaleList(toolarsMessageFiles);
  const sourceLocales = sortStrings([...aixtralMessages, ...vitalcalcPageInfo.locales]);

  return {
    aixtralMessageFiles,
    aixtralMessages,
    vitalcalcPageDirs: vitalcalcPageInfo.rawLocales,
    vitalcalcPages: vitalcalcPageInfo.locales,
    toolarsMessageFiles,
    toolarsMessages,
    toolarsLocales,
    toolarsLaunchLocales,
    toolarsDraftLocales,
    sourceLocales
  };
}

async function scanToolarsBlogSlugs(siteRoot) {
  const files = await collectToolarsBlogSourceFiles(path.join(siteRoot, "src/data/blog.ts"));
  const slugs = [];

  for (const filePath of files) {
    slugs.push(...(await extractBlogSlugsFromSourceFile(filePath)));
  }

  return sortStrings(slugs);
}

async function collectToolarsBlogSourceFiles(entryPath, seen = new Set()) {
  if (!existsSync(entryPath) || seen.has(entryPath)) {
    return [];
  }

  seen.add(entryPath);

  const source = await fs.readFile(entryPath, "utf8");
  const files = [entryPath];
  const typescript = require("typescript");
  const sourceFile = typescript.createSourceFile(
    entryPath,
    source,
    typescript.ScriptTarget.Latest,
    true,
    typescript.ScriptKind.TS
  );

  for (const statement of sourceFile.statements) {
    if (!typescript.isImportDeclaration(statement) || !typescript.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }

    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith(".") || !/(article|blog)/i.test(specifier)) {
      continue;
    }

    const importedFile = resolveLocalTypeScriptImport(entryPath, specifier);
    if (importedFile) {
      files.push(...(await collectToolarsBlogSourceFiles(importedFile, seen)));
    }
  }

  return sortStrings(files);
}

async function extractBlogSlugsFromSourceFile(filePath) {
  if (filePath.endsWith(".json")) {
    return extractBlogSlugsFromJson(await fs.readFile(filePath, "utf8"));
  }

  const typescript = require("typescript");
  const source = await fs.readFile(filePath, "utf8");
  const sourceFile = typescript.createSourceFile(
    filePath,
    source,
    typescript.ScriptTarget.Latest,
    true,
    typescript.ScriptKind.TS
  );
  const slugs = [];

  const visit = (node) => {
    if (
      typescript.isPropertyAssignment(node) &&
      node.name.getText(sourceFile) === "slug" &&
      typescript.isStringLiteral(node.initializer)
    ) {
      slugs.push(node.initializer.text);
    }

    typescript.forEachChild(node, visit);
  };

  visit(sourceFile);

  return slugs;
}

function extractBlogSlugsFromJson(source) {
  const slugs = [];
  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") {
      return;
    }
    if (typeof value.slug === "string") {
      slugs.push(value.slug);
    }
    Object.values(value).forEach(visit);
  };

  visit(JSON.parse(source));
  return slugs;
}

function resolveLocalTypeScriptImport(fromFile, specifier) {
  const resolvedBase = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [resolvedBase, `${resolvedBase}.ts`, `${resolvedBase}.tsx`, `${resolvedBase}.json`, path.join(resolvedBase, "index.ts")];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

async function listJsonBasenames(dir) {
  const files = await safeReadDir(dir);

  return sortStrings(
    files
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.slice(0, -".json".length))
  );
}

async function scanVitalcalcPageLocaleInfo(pagesDir) {
  const rawLocales = new Set();

  if (existsSync(path.join(pagesDir, "blog")) || existsSync(path.join(pagesDir, "tools"))) {
    rawLocales.add("en");
  }

  const entries = await safeReadDir(pagesDir);
  for (const entry of entries) {
    if (!entry.isDirectory() || !isLocaleLike(entry.name)) {
      continue;
    }

    const localeDir = path.join(pagesDir, entry.name);
    if (existsSync(path.join(localeDir, "blog")) || existsSync(path.join(localeDir, "tools"))) {
      rawLocales.add(entry.name);
    }
  }

  const rawLocaleList = sortStrings([...rawLocales]);

  return {
    rawLocales: rawLocaleList,
    locales: normalizeLocaleList(rawLocaleList)
  };
}

async function scanHardcodedUserFacingStrings(siteRoot) {
  const scanRoots = ["src/app/[locale]", "src/components"];
  const files = sortStrings(
    (
      await Promise.all(
        scanRoots.map((scanRoot) =>
          collectFiles(path.join(siteRoot, scanRoot), (filePath) => filePath.endsWith(".tsx") && !filePath.includes(".test."))
        )
      )
    ).flat()
  );
  const typescript = require("typescript");
  const fileFindings = [];

  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    const sourceFile = typescript.createSourceFile(
      filePath,
      source,
      typescript.ScriptTarget.Latest,
      true,
      typescript.ScriptKind.TSX
    );
    const findings = [];

    const addFinding = (node, kind, rawText) => {
      const text = normalizeHardcodedText(rawText);
      if (!isLikelyUserFacingText(text)) {
        return;
      }

      const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      findings.push({
        line: position.line + 1,
        kind,
        text
      });
    };

    const visit = (node) => {
      if (typescript.isJsxText(node)) {
        addFinding(node, "jsx-text", node.getFullText(sourceFile));
      }

      if (
        typescript.isJsxAttribute(node) &&
        hardcodedAttributeNames.has(node.name.getText(sourceFile)) &&
        node.initializer &&
        typescript.isStringLiteral(node.initializer)
      ) {
        addFinding(node.initializer, `attribute:${node.name.getText(sourceFile)}`, node.initializer.text);
      }

      typescript.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (findings.length > 0) {
      fileFindings.push({
        file: toPosixPath(path.relative(siteRoot, filePath)),
        count: findings.length,
        samples: findings.slice(0, 5)
      });
    }
  }

  return {
    scanner: "typescript-jsx-text-v1",
    scannedRoots: scanRoots,
    scannedFiles: files.length,
    count: fileFindings.reduce((total, file) => total + file.count, 0),
    files: fileFindings
  };
}

async function collectFiles(dir, predicate) {
  const entries = await safeReadDir(dir);
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath, predicate)));
    } else if (entry.isFile() && predicate(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
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

function normalizeLocaleList(locales) {
  return sortStrings(locales.map((locale) => normalizeSourceLocale(locale)));
}

function normalizeSourceLocale(locale) {
  const normalized = locale.toLowerCase();
  if (normalized === "zh" || normalized === "zh-cn") {
    return "zh-hans";
  }
  if (normalized === "zh-tw") {
    return "zh-hant";
  }
  return normalized;
}

function isLocaleLike(value) {
  return /^[a-z]{2}(?:-[a-z]{2})?$/i.test(value);
}

const hardcodedAttributeNames = new Set(["aria-label", "alt", "label", "placeholder", "title"]);

function normalizeHardcodedText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function isLikelyUserFacingText(text) {
  if (!text || text.length < 2) {
    return false;
  }
  if (/^[\d\s.,:%()+\-/*]+$/.test(text)) {
    return false;
  }
  if (isAllowedNonTranslatableText(text)) {
    return false;
  }
  if (/^(true|false|null|undefined)$/i.test(text)) {
    return false;
  }
  return /[A-Za-z\u00C0-\uFFFF]/.test(text);
}

function isAllowedNonTranslatableText(text) {
  if (allowedHardcodedTokens.has(text)) {
    return true;
  }
  if (/^&[a-z]+;$/i.test(text)) {
    return true;
  }
  if (/^[A-Z]{2,4}$/.test(text)) {
    return true;
  }
  if (/^\+?\d*(?:[.,]\d+)?\+?\s?(?:B|KB|MB|GB|TB|bytes|tokens|mg|kcal|px)\)?$/i.test(text)) {
    return true;
  }
  return false;
}

const allowedHardcodedTokens = new Set(["Toolars", "PDF", "SVG"]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
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
