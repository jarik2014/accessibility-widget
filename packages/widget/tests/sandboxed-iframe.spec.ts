// @blakfy/accessibility-widget — sandboxed-iframe.test.ts
//
// Regression coverage for #15: detect a cross-origin sandboxed iframe embed
// (e.g. Wix "Embed a Widget") and surface a SANDBOXED_IFRAME diagnostics warning.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { _resetDiagnostics, getIssues } from '@blakfy/a11y-core';
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

describe('sandboxed cross-origin iframe detection (#15)', () => {
  beforeEach(() => {
    _resetDiagnostics();
    _resetWindowState();
  });

  afterEach(() => {
    _resetWindowState();
    _resetDiagnostics();
  });

  it('does not warn when not inside an iframe (window.top === window.self)', () => {
    mount();
    const issues = getIssues();
    expect(issues.some((i) => i.code === 'SANDBOXED_IFRAME')).toBe(false);
  });

  it('warns SANDBOXED_IFRAME when window.top access throws (cross-origin sandbox)', () => {
    const originalTop = window.top;
    Object.defineProperty(window, 'top', {
      configurable: true,
      get() {
        return {
          get location(): never {
            throw new DOMException(
              'Blocked a frame with origin from accessing a cross-origin frame.',
            );
          },
        };
      },
    });
    try {
      mount();
      const issues = getIssues();
      expect(issues.some((i) => i.code === 'SANDBOXED_IFRAME' && i.level === 'warn')).toBe(true);
    } finally {
      Object.defineProperty(window, 'top', { configurable: true, value: originalTop });
    }
  });

  it('does not warn for a same-origin iframe (window.top.location is readable)', () => {
    const originalTop = window.top;
    Object.defineProperty(window, 'top', {
      configurable: true,
      get() {
        return { location: window.location };
      },
    });
    try {
      mount();
      const issues = getIssues();
      expect(issues.some((i) => i.code === 'SANDBOXED_IFRAME')).toBe(false);
    } finally {
      Object.defineProperty(window, 'top', { configurable: true, value: originalTop });
    }
  });
});
