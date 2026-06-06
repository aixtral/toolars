import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export interface ForbiddenPublicCalculatorImport {
  file: string;
  module: string;
  line: number;
  source: string;
}

const publicCalculatorRoots = [
  'app/tools',
  'components/calculators',
  'components/tools',
  'data/calculators',
  'lib/calculators',
];

const forbiddenRuntimeImports = [
  '@/lib/auth',
  '@/lib/supabase',
  '@/lib/billing',
  '@/lib/ai',
];

function isSourceFile(pathname: string) {
  return pathname.endsWith('.ts') || pathname.endsWith('.tsx');
}

function isTestPath(pathname: string) {
  return pathname.includes('/__tests__/') || pathname.endsWith('.test.tsx');
}

function walkSourceFiles(root: string): string[] {
  if (!existsSync(root)) return [];

  const stat = statSync(root);
  if (stat.isFile()) return isSourceFile(root) && !isTestPath(root) ? [root] : [];

  return readdirSync(root)
    .flatMap((entry) => walkSourceFiles(join(root, entry)))
    .filter((pathname) => isSourceFile(pathname) && !isTestPath(pathname));
}

function importedForbiddenModule(line: string) {
  return forbiddenRuntimeImports.find((moduleName) => {
    const escapedModule = moduleName.replaceAll('/', '\\/');
    const pattern = new RegExp(`(?:from\\s+|import\\s*\\()?['"]${escapedModule}(?:\\/|['"])`);
    return pattern.test(line);
  });
}

export function findForbiddenPublicCalculatorImports(
  siteRoot = process.cwd(),
): ForbiddenPublicCalculatorImport[] {
  return publicCalculatorRoots.flatMap((root) => {
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
