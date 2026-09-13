// Regression coverage for #54: _inferBaseURL's fallback path (filename
// regex match, used only when document.currentScript capture failed) must
// not trust an arbitrary origin just because a <script src> matches the
// widget filename pattern.
import { describe, it, expect, afterEach } from 'vitest';
import { _inferBaseURL } from '../src/mount';

function _addScript(src: string): HTMLScriptElement {
  const s = document.createElement('script');
  s.src = src;
  document.body.appendChild(s);
  return s;
}

describe('_inferBaseURL origin allowlist (#54)', () => {
  afterEach(() => {
    document.querySelectorAll('script[src]').forEach((s) => s.remove());
  });

  it('ignores a hostile script src matching the filename pattern but on an untrusted origin', () => {
    _addScript('https://evil.example.com/widget.js');
    expect(_inferBaseURL()).toBe('');
  });

  it('resolves a legitimate jsDelivr-hosted script src', () => {
    _addScript('https://cdn.jsdelivr.net/npm/@blakfy/accessibility-widget@1/dist/widget.js');
    expect(_inferBaseURL()).toBe(
      'https://cdn.jsdelivr.net/npm/@blakfy/accessibility-widget@1/dist',
    );
  });

  it('resolves a legitimate unpkg-hosted script src', () => {
    _addScript('https://unpkg.com/@blakfy/accessibility-widget@1/dist/widget.js');
    expect(_inferBaseURL()).toBe('https://unpkg.com/@blakfy/accessibility-widget@1/dist');
  });
});
