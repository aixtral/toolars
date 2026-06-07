import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export interface ForbiddenAiProviderImport {
  file: string;
  module: string;
  line: number;
  source: string;
}

const scanRoots = [
  'app',
  'components',
  'data',
  'lib/calculators',
  'lib/search',
  'lib/seo',
  'lib/storage',
];

const allowedProviderPaths = ['lib/ai/providers'];

const forbiddenModules = ['ai', '@ai-sdk/'];

function isSourceFile(pathname: string) {
  return pathname.endsWith('.ts') || pathname.endsWith('.tsx');
}

function isIgnored(pathname: string) {
  return (
    pathname.includes('/__tests__/') ||
    pathname.endsWith('.test.ts') ||
    pathname.endsWith('.test.tsx') ||
    allowedProviderPaths.some((allowedPath) => pathname.includes(`/${allowedPath}/`))
  );
}

function walkSourceFiles(root: string): string[] {
  if (!existsSync(root)) return [];

  const stat = statSync(root);
  if (stat.isFile()) return isSourceFile(root) && !isIgnored(root) ? [root] : [];

  return readdirSync(root).flatMap((entry) => walkSourceFiles(join(root, entry)));
}

function importedForbiddenModule(line: string) {
  if (!line.includes('import') && !line.includes('from ')) return undefined;

  return forbiddenModules.find((moduleName) => {
    const escapedModule = moduleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(?:from\\s+['"]${escapedModule}(?:['"]|\\/)|import\\s*\\(\\s*['"]${escapedModule}(?:['"]|\\/)|import\\s+['"]${escapedModule}(?:['"]|\\/))`,
    );
    return pattern.test(line);
  });
}

export function findForbiddenAiProviderImports(
  siteRoot = process.cwd(),
): ForbiddenAiProviderImport[] {
  return scanRoots.flatMap((root) => {
    const absoluteRoot = join(siteRoot, root);

    return walkSourceFiles(absoluteRoot).flatMap((file) => {
      const relativeFile = relative(siteRoot, file);
      const lines = readFileSync(file, 'utf8').split('\n');

      return lines.flatMap((line, index) => {
        const moduleName = importedForbiddenModule(line);
        if (!moduleName) return [];

        return {
          file: relativeFile,
          module: moduleName,
          line: index + 1,
          source: line.trim(),
        };
      });
    });
  });
}
