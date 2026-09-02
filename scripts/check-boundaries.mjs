#!/usr/bin/env node
/**
 * Enforces the layered architecture (see README → Architecture):
 *   - src/pages/** and src/components/** may NOT touch the CMS. They read content
 *     only through src/lib/content.
 *   - cms/** may NOT import from src/**.
 *   - Only src/lib/content/** may import from @keystatic/* or keystatic.config.
 *
 * Pure Node, no dependencies, understands .astro/.ts/.tsx/.js/.mjs.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const exts = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.jsx']);

/** @type {{dir: string, forbidden: RegExp[], label: string}[]} */
const rules = [
  {
    dir: 'src/pages',
    label: 'src/pages',
    forbidden: [/@keystatic\//, /virtual:keystatic/, /keystatic\.config/, /(?:^|['"(/])cms\//],
  },
  {
    dir: 'src/components',
    label: 'src/components',
    forbidden: [/@keystatic\//, /virtual:keystatic/, /keystatic\.config/, /(?:^|['"(/])cms\//],
  },
  {
    dir: 'src/layouts',
    label: 'src/layouts',
    forbidden: [/@keystatic\//, /virtual:keystatic/, /keystatic\.config/, /(?:^|['"(/])cms\//],
  },
  {
    dir: 'cms',
    label: 'cms',
    forbidden: [/from\s+['"][^'"]*\/src\//, /from\s+['"]\.\.\/\.\.\/src\//, /from\s+['"]@\/(?!keystatic)/],
  },
];

function walk(dir) {
  /** @type {string[]} */
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) files.push(...walk(full));
    else if ([...exts].some((e) => entry.endsWith(e))) files.push(full);
  }
  return files;
}

const importLine = /^\s*(?:import|export)\b[^\n]*?from\s*['"][^'"]+['"]|^\s*import\s*['"][^'"]+['"]/gm;

let violations = 0;

for (const rule of rules) {
  for (const file of walk(join(root, rule.dir))) {
    const src = readFileSync(file, 'utf8');
    const matches = src.match(importLine) ?? [];
    for (const line of matches) {
      for (const pattern of rule.forbidden) {
        if (pattern.test(line)) {
          violations += 1;
          console.error(
            `✖ ${relative(root, file)}\n  ${line.trim()}\n  → ${rule.label} must not import this (crosses a layer boundary).\n`,
          );
        }
      }
    }
  }
}

if (violations > 0) {
  console.error(`Boundary check failed with ${violations} violation(s).`);
  process.exit(1);
}

console.log('✓ Layer boundaries intact.');
