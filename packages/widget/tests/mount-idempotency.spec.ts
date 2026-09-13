// @blakfy/accessibility-widget — mount-idempotency.test.ts
//
// Regression coverage for #44: a second mount() call while already mounted
// must be a true no-op — no duplicate listeners, no ghost widget instance.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { _resetDiagnostics } from '@blakfy/a11y-core';
import { mount, _getActiveUnmount } from '../src/mount';

function _resetWindowState(): void {
  if (typeof window === 'undefined') return;
  if (window.history) {
    window.history.replaceState(null, '', '/');
  }
  if (typeof document !== 'undefined') {
    document.cookie = 'blakfy_a11y_prefs=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
  try {
    window.localStorage.removeItem('blakfy_a11y_prefs');
  } catch {
    /* ignore */
  }
  const html = document.documentElement;
  for (const a of Array.from(html.attributes)) {
    if (a.name.startsWith('data-a11y-')) html.removeAttribute(a.name);
  }
  const off = _getActiveUnmount();
  if (off) off();
  document.querySelectorAll('blakfy-a11y-root').forEach((n) => n.remove());
}

describe('mount() idempotency (#44)', () => {
  beforeEach(() => {
    _resetDiagnostics();
    _resetWindowState();
  });

  afterEach(() => {
    _resetWindowState();
    _resetDiagnostics();
  });

  it('does not create a second host element on a double mount()', () => {
    mount();
    mount();
    expect(document.querySelectorAll('blakfy-a11y-root').length).toBe(1);
  });

  it('the second mount() returns the same unmount reference as the first', () => {
    const first = mount();
    const second = mount();
    expect(second.unmount).toBe(first.unmount);
  });

  it('a single unmount() after a double mount() fully tears down (no active mount left)', () => {
    const first = mount();
    mount();
    first.unmount();
    expect(_getActiveUnmount()).toBeNull();
    expect(document.querySelectorAll('blakfy-a11y-root').length).toBe(0);
  });
});
