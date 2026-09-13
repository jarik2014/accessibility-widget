// @blakfy/accessibility-widget — version.ts
// Single source of truth for this package's version fallback, used when
// __VERSION__ (Vite's build-time `define`, see vite.config.ts) is absent —
// e.g. under vitest or raw tsc. Reads the same package.json the `define`
// itself derives from, so the two can never drift apart.
import pkg from '../package.json' with { type: 'json' };

export const PACKAGE_VERSION_FALLBACK = pkg.version;
