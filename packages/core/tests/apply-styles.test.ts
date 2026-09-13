// @blakfy/a11y-core — apply-styles.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { applyPreferences, detectOSPreferences } from '../src/apply-styles';
import { DEFAULT_PREFS, type Preferences } from '../src/types';

beforeEach(() => {
  const html = document.documentElement;
  html.removeAttribute('data-a11y-fontscale');
  html.removeAttribute('data-a11y-contrast');
  html.removeAttribute('data-a11y-focus');
  html.removeAttribute('data-a11y-links');
  html.removeAttribute('data-a11y-motion');
  html.removeAttribute('data-a11y-dyslexia');
  html.removeAttribute('data-a11y-reading');
});

describe('applyPreferences — lineHeight selector (#14)', () => {
  it('covers headings, links, labels and table cells for medium/large', () => {
    applyPreferences({ ...DEFAULT_PREFS, lineHeight: 'large' });
    const css = document.getElementById('blakfy-a11y-host')?.textContent ?? '';
    expect(css).toContain('line-height: 2.4 !important');
    for (const sel of [
      'html h1',
      'html h2',
      'html h3',
      'html h4',
      'html h5',
      'html h6',
      'html a',
      'html label',
      'html td',
      'html th',
      'html p',
      'html li',
      'html dd',
      'html dt',
      'html span',
      'html div',
    ]) {
      expect(css).toContain(sel);
    }
  });

  it('does not touch textAlign selector/logic', () => {
    applyPreferences({ ...DEFAULT_PREFS, lineHeight: 'large', textAlign: 'center' });
    const css = document.getElementById('blakfy-a11y-host')?.textContent ?? '';
    expect(css).toContain('text-align: center !important');
  });
});

describe('applyPreferences', () => {
  it('writes all 7 data-attrs with default contract strings', () => {
    applyPreferences(DEFAULT_PREFS);
    const html = document.documentElement;
    expect(html.getAttribute('data-a11y-fontscale')).toBe('100');
    expect(html.getAttribute('data-a11y-contrast')).toBe('normal');
    expect(html.getAttribute('data-a11y-focus')).toBe('default');
    expect(html.getAttribute('data-a11y-links')).toBe('default');
    expect(html.getAttribute('data-a11y-motion')).toBe('auto');
    expect(html.getAttribute('data-a11y-dyslexia')).toBe('false');
    expect(html.getAttribute('data-a11y-reading')).toBe('false');
  });

  it('writes "enhanced"/"underline" when toggles are on', () => {
    const prefs: Preferences = {
      fontScale: 125,
      contrast: 'high',
      focusRing: true,
      linkUnderline: true,
      motion: 'reduce',
      dyslexiaFont: true,
      readingMode: true,
    };
    applyPreferences(prefs);
    const html = document.documentElement;
    expect(html.getAttribute('data-a11y-fontscale')).toBe('125');
    expect(html.getAttribute('data-a11y-contrast')).toBe('high');
    expect(html.getAttribute('data-a11y-focus')).toBe('enhanced');
    expect(html.getAttribute('data-a11y-links')).toBe('underline');
    expect(html.getAttribute('data-a11y-motion')).toBe('reduce');
    expect(html.getAttribute('data-a11y-dyslexia')).toBe('true');
    expect(html.getAttribute('data-a11y-reading')).toBe('true');
  });
});

describe('detectOSPreferences', () => {
  it('returns a valid shape', () => {
    const os = detectOSPreferences();
    expect(typeof os.reducedMotion).toBe('boolean');
    expect(['normal', 'more', 'less']).toContain(os.contrast);
    expect(['light', 'dark', 'no-preference']).toContain(os.colorScheme);
  });
});
