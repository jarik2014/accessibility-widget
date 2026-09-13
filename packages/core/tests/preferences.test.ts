// @blakfy/a11y-core — preferences.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPreferences,
  setPreferences,
  resetPreferences,
  getPreferencesRecord,
} from '../src/preferences';
import { COOKIE_KEY, DEFAULT_PREFS, STORAGE_KEY } from '../src/types';

function _clearCookies(): void {
  const all = document.cookie ? document.cookie.split(';') : [];
  for (const c of all) {
    const eq = c.indexOf('=');
    const name = eq > -1 ? c.substring(0, eq).trim() : c.trim();
    if (!name) continue;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

beforeEach(() => {
  localStorage.clear();
  _clearCookies();
  const html = document.documentElement;
  html.removeAttribute('data-a11y-fontscale');
  html.removeAttribute('data-a11y-contrast');
  html.removeAttribute('data-a11y-focus');
  html.removeAttribute('data-a11y-links');
  html.removeAttribute('data-a11y-motion');
  html.removeAttribute('data-a11y-dyslexia');
  html.removeAttribute('data-a11y-reading');
});

describe('preferences', () => {
  it('getPreferences returns defaults when nothing stored', () => {
    expect(getPreferences()).toEqual(DEFAULT_PREFS);
  });

  it('setPreferences persists and is readable on next get', () => {
    setPreferences({ fontScale: 125, contrast: 'high' }, 'tr');
    const result = getPreferences();
    expect(result.fontScale).toBe(125);
    expect(result.contrast).toBe('high');
  });

  it('setPreferences writes to both localStorage and cookie', () => {
    setPreferences({ fontScale: 110 }, 'en');
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    expect(document.cookie).toContain(COOKIE_KEY);
  });

  it('resetPreferences restores defaults', () => {
    setPreferences({ fontScale: 125, dyslexiaFont: true }, 'en');
    resetPreferences('en');
    expect(getPreferences()).toEqual(DEFAULT_PREFS);
  });

  it('handles corrupt JSON in localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(getPreferences()).toEqual(DEFAULT_PREFS);
  });

  it('falls back to cookie when localStorage is empty', () => {
    const record = {
      prefs: { ...DEFAULT_PREFS, fontScale: 110 as const },
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      locale: 'en',
    };
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(record))};path=/`;
    expect(getPreferences().fontScale).toBe(110);
  });

  it('getPreferencesRecord returns the stored record', () => {
    setPreferences({ fontScale: 110 }, 'tr');
    const rec = getPreferencesRecord();
    expect(rec).not.toBeNull();
    expect(rec?.locale).toBe('tr');
    expect(rec?.prefs.fontScale).toBe(110);
  });

  it('getPreferencesRecord returns null when no record exists', () => {
    expect(getPreferencesRecord()).toBeNull();
  });
});

describe('storage failure diagnostics (#20)', () => {
  it('warns STORAGE_UNAVAILABLE when localStorage.setItem throws', async () => {
    const { getIssues, _resetDiagnostics } = await import('../src/diagnostics');
    _resetDiagnostics();
    const spy = vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    try {
      setPreferences({ fontScale: 110 });
      const issues = getIssues();
      expect(
        issues.some(
          (i) =>
            i.code === 'STORAGE_UNAVAILABLE' &&
            i.level === 'warn' &&
            (i.extra as { storage?: string } | undefined)?.storage === 'localStorage',
        ),
      ).toBe(true);
    } finally {
      spy.mockRestore();
      _resetDiagnostics();
    }
  });

  it('warns STORAGE_UNAVAILABLE when document.cookie write throws', async () => {
    const { getIssues, _resetDiagnostics } = await import('../src/diagnostics');
    _resetDiagnostics();
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get() {
        return '';
      },
      set() {
        throw new DOMException('cookie write blocked');
      },
    });
    try {
      setPreferences({ fontScale: 110 });
      const issues = getIssues();
      expect(
        issues.some(
          (i) =>
            i.code === 'STORAGE_UNAVAILABLE' &&
            i.level === 'warn' &&
            (i.extra as { storage?: string } | undefined)?.storage === 'cookie',
        ),
      ).toBe(true);
    } finally {
      if (descriptor) Object.defineProperty(document, 'cookie', descriptor);
      _resetDiagnostics();
    }
  });

  it('does not warn on the normal success path', async () => {
    const { getIssues, _resetDiagnostics } = await import('../src/diagnostics');
    _resetDiagnostics();
    setPreferences({ fontScale: 110 });
    const issues = getIssues();
    expect(issues.some((i) => i.code === 'STORAGE_UNAVAILABLE')).toBe(false);
  });
});
