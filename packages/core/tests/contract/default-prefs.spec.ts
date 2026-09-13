// Contract test: DEFAULT_PREFS shape must stay stable (STABLE-API.md §2 /
// ADR-004 "locked contracts"). Adding a new preference key is fine — this
// test enumerates every key that currently exists so a REMOVAL or RENAME
// is caught, not so an addition is blocked. Update LOCKED_PREF_KEYS
// deliberately when a preference is intentionally added/removed, in the
// same PR that changes DEFAULT_PREFS.
import { describe, it, expect } from 'vitest';
import { DEFAULT_PREFS } from '../../src/types';

const LOCKED_PREF_KEYS = [
  'fontScale',
  'contrast',
  'focusRing',
  'linkUnderline',
  'motion',
  'dyslexiaFont',
  'readingMode',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'readingWidth',
  'highlightHeadings',
  'saturation',
  'cursorSize',
  'hideImages',
  'readAloud',
  'readingMask',
  'magnifier',
  'stopAutoplay',
] as const;

describe('DEFAULT_PREFS contract (STABLE-API §2)', () => {
  it('has exactly the locked set of preference keys, no more, no fewer', () => {
    expect(Object.keys(DEFAULT_PREFS).sort()).toEqual([...LOCKED_PREF_KEYS].sort());
  });

  it('default values match the locked spec', () => {
    expect(DEFAULT_PREFS).toEqual({
      fontScale: 100,
      contrast: 'normal',
      focusRing: false,
      linkUnderline: false,
      motion: 'auto',
      dyslexiaFont: false,
      readingMode: false,
      lineHeight: 'normal',
      letterSpacing: 'normal',
      textAlign: 'default',
      readingWidth: 'default',
      highlightHeadings: false,
      saturation: 'normal',
      cursorSize: 'default',
      hideImages: false,
      readAloud: false,
      readingMask: false,
      magnifier: false,
      stopAutoplay: false,
    });
  });
});
