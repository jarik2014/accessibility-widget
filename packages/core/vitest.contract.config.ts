// TODO: Phase 4 — contract tests that validate the locked surface in
// docs/STABLE-API.md. See docs/ADR/004-locked-contracts.md.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/contract/**/*.spec.ts'],
    // No contract specs yet (see the Phase 4 TODO above) — don't fail
    // CI on an empty, intentional suite. Remove once real specs land.
    passWithNoTests: true,
  },
});
