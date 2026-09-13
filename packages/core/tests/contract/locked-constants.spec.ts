// Contract test: locked storage key + custom event names (ADR-004 §"Kilitli
// yüzeyler" items 2 and 5). These are load-bearing for existing customer
// integrations — renaming any of them is a breaking (major) change.
import { describe, it, expect } from 'vitest';
import { STORAGE_KEY, COOKIE_KEY, STORAGE_VERSION, EVENT_NAMES } from '../../src/types';

describe('Storage schema contract (STABLE-API §5)', () => {
  it('STORAGE_KEY is locked', () => {
    expect(STORAGE_KEY).toBe('blakfy_a11y_prefs');
  });

  it('COOKIE_KEY matches STORAGE_KEY by design', () => {
    expect(COOKIE_KEY).toBe('blakfy_a11y_prefs');
  });

  it('STORAGE_VERSION is the locked v1 schema version', () => {
    expect(STORAGE_VERSION).toBe('1.0.0');
  });
});

describe('Custom event names contract (STABLE-API §... / ADR-004 item 2)', () => {
  it('has exactly the 4 locked event names, no more, no fewer', () => {
    expect(Object.keys(EVENT_NAMES).sort()).toEqual(['CHANGE', 'CLOSE', 'OPEN', 'READY']);
  });

  it('event name strings are locked', () => {
    expect(EVENT_NAMES).toEqual({
      READY: 'blakfy:a11y:ready',
      CHANGE: 'blakfy:a11y:change',
      OPEN: 'blakfy:a11y:open',
      CLOSE: 'blakfy:a11y:close',
    });
  });
});
