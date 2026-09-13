// Contract tests that validate the locked surface in docs/STABLE-API.md.
// See docs/adr/004-locked-contracts.md.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/contract/**/*.spec.ts'],
  },
});
