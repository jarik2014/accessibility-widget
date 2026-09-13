#!/usr/bin/env node
// Guards against #24-style drift (see #35): asserts docs/STABLE-API.md §4's
// CSS variable table matches the actual light-mode defaults declared in
// packages/widget/src/styles/widget.css's `:host { ... }` block. Run in CI
// (see .github/workflows/ci.yml) and locally via `pnpm check:stable-api`.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const cssPath = join(ROOT, 'packages/widget/src/styles/widget.css');
const docPath = join(ROOT, 'docs/STABLE-API.md');

const css = readFileSync(cssPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

// Extract the first `:host { ... }` block (light-mode defaults).
const hostMatch = css.match(/:host\s*\{([^}]*)\}/);
if (!hostMatch) {
  console.error('check-stable-api-sync: could not find :host {} block in widget.css');
  process.exit(1);
}
const hostBlock = hostMatch[1];

const cssVars = new Map();
for (const m of hostBlock.matchAll(/(--blakfy-a11y-[a-z-]+)\s*:\s*([^;]+);/g)) {
  const varName = m[1];
  if (varName.startsWith('--__')) continue;
  cssVars.set(varName, m[2].trim());
}

// Extract the §4 table rows: `| \`--var\` | \`value\` | ... | ... |`
// The "Default" cell may carry extra prose (" (light) / ... (dark)",
// " — dark override ..."); only the FIRST backtick-quoted token in that
// cell is checked — that is always the light-mode default.
const docVars = new Map();
const tableRowRe = /^\|\s*`(--blakfy-a11y-[a-z-]+)`\s*\|\s*(.+?)\s*\|/gm;
for (const m of doc.matchAll(tableRowRe)) {
  const varName = m[1];
  const defaultCell = m[2];
  const firstValue = defaultCell.match(/`([^`]+)`/);
  if (firstValue) docVars.set(varName, firstValue[1].trim());
}

const mismatches = [];
for (const [name, cssValue] of cssVars) {
  const docValue = docVars.get(name);
  if (docValue === undefined) {
    mismatches.push(`${name}: declared in widget.css but MISSING from STABLE-API.md §4`);
    continue;
  }
  // Normalize rgba spacing (prettier vs. doc prose may differ on "28, 28, 46" vs "28,28,46")
  const normalize = (s) => s.replace(/\s+/g, '');
  if (normalize(cssValue) !== normalize(docValue)) {
    mismatches.push(`${name}: widget.css="${cssValue}" but STABLE-API.md="${docValue}"`);
  }
}
for (const name of docVars.keys()) {
  if (!cssVars.has(name)) {
    mismatches.push(`${name}: documented in STABLE-API.md §4 but NOT declared in widget.css :host`);
  }
}

if (mismatches.length > 0) {
  console.error('check-stable-api-sync: STABLE-API.md §4 has drifted from widget.css:\n');
  for (const m of mismatches) console.error(`  - ${m}`);
  console.error(
    '\nUpdate docs/STABLE-API.md §4 (and tests/contract/css-vars.spec.ts) in the same PR as any widget.css --blakfy-a11y-* value change.',
  );
  process.exit(1);
}

console.log(
  `check-stable-api-sync: OK — ${cssVars.size} CSS variables match between widget.css and STABLE-API.md §4.`,
);
