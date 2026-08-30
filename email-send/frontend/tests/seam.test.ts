import { readdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import ts from "typescript";
import { expect, test } from "vitest";

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const configPath = ts.findConfigFile(".", ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("tsconfig.json not found");
const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config, ts.sys, ".");

const appFiles = walk("app").filter((f) => f.endsWith(".tsx"));
const program = ts.createProgram(
  [...appFiles, ...parsed.fileNames],
  parsed.options,
);

const dataDir = resolve("lib/data") + sep;

test("no page imports the data modules directly", () => {
  const offenders: string[] = [];
  for (const file of appFiles) {
    const source = program.getSourceFile(resolve(file));
    if (!source) throw new Error(`could not load ${file} into the program`);
    ts.forEachChild(source, function visit(node) {
      const moduleSpecifier =
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : undefined;
      if (moduleSpecifier) {
        const resolved = ts.resolveModuleName(
          moduleSpecifier,
          resolve(file),
          parsed.options,
          ts.sys,
        ).resolvedModule?.resolvedFileName;
        if (resolved && resolve(resolved).startsWith(dataDir)) {
          offenders.push(`${file} -> ${moduleSpecifier}`);
        }
      }
      ts.forEachChild(node, visit);
    });
  }
  expect(offenders).toEqual([]);
});
