#!/usr/bin/env node
// #50: bundleSizeGz in diagnostics() is a literal placeholder in source
// (mount.ts: `123454321 /* __BUNDLE_SIZE_GZ__ */`) because a build cannot
// know its own final gzipped size while it's still producing that output.
// This script runs AFTER all three build targets finish: for each dist
// file, gzip the file as currently written, then text-replace the literal
// placeholder number with the real byte count.
//
// Known approximation (documented per the issue, not fixed further here):
// patching the file changes its own byte length by a few bytes (the
// placeholder "123454321" and the real number differ in digit count), so
// the patched-in value is the gzip size of the PRE-patch file, not the
// exact final one. A true self-referential exact value would need a
// two-pass build; this single-pass approximation is within rounding.
import { gzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

const PLACEHOLDER = '123454321';
const TARGETS = ['widget.js', 'widget.esm.js', 'widget-element.js'];

let patchedAny = false;

for (const file of TARGETS) {
  const path = resolve(distDir, file);
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    continue; // this build target wasn't produced (e.g. partial build)
  }
  if (!text.includes(PLACEHOLDER)) continue;

  const gzSize = gzipSync(Buffer.from(text, 'utf8')).length;
  const patched = text.split(PLACEHOLDER).join(String(gzSize));
  writeFileSync(path, patched, 'utf8');
  patchedAny = true;
  console.log(`patch-bundle-size: ${file} → bundleSizeGz = ${gzSize}`);
}

if (!patchedAny) {
  console.warn('patch-bundle-size: no dist files with the placeholder found — nothing patched.');
}
