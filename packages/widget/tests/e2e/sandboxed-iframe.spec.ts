// Regression coverage for #15/#19: Wix "Embed a Widget" cross-origin
// sandboxed iframe scenario. The widget must detect it's inside a
// sandboxed cross-origin iframe and surface a SANDBOXED_IFRAME
// diagnostics warning, since preferences won't persist and the FAB
// gets visually trapped inside the small iframe box.
import { test, expect } from '@playwright/test';
import { FIXTURE } from './_helpers';

test.describe('Sandboxed cross-origin iframe embed (Wix "Embed a Widget" scenario, #15)', () => {
  test('widget mounts but surfaces a SANDBOXED_IFRAME diagnostics warning', async ({
    page,
    baseURL,
  }) => {
    // Chrome's Private Network Access checks block a public/opaque initiator
    // (about:blank) from fetching a localhost iframe src. Loading the outer
    // page from the same localhost origin first keeps the fetch same-address-space.
    await page.goto(new URL('/', baseURL).toString());
    const fixtureUrl = new URL(FIXTURE, baseURL).toString();
    await page.setContent(
      `<iframe id="sandboxed" sandbox="allow-scripts" src="${fixtureUrl}" style="width:800px;height:600px;border:0;display:block;"></iframe>`,
    );
    const frame = page.frame({ url: new RegExp(FIXTURE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
    expect(frame).not.toBeNull();
    await frame!.waitForFunction(
      () =>
        typeof (window as unknown as { BlakfyA11y?: { diagnostics?: unknown } }).BlakfyA11y
          ?.diagnostics === 'function',
      { timeout: 5000 },
    );
    const diagnostics = await frame!.evaluate(() =>
      (
        window as unknown as { BlakfyA11y: { diagnostics: () => { issues: { code: string }[] } } }
      ).BlakfyA11y.diagnostics(),
    );
    const hasSandboxWarning = diagnostics.issues?.some((i) => i.code === 'SANDBOXED_IFRAME');
    expect(hasSandboxWarning).toBe(true);
  });

  test('FAB is visually contained within the iframe box, not the outer page', async ({
    page,
    baseURL,
  }) => {
    await page.goto(new URL('/', baseURL).toString());
    const fixtureUrl = new URL(FIXTURE, baseURL).toString();
    await page.setContent(
      `<iframe id="sandboxed" sandbox="allow-scripts" src="${fixtureUrl}" style="width:300px;height:200px;border:0;display:block;"></iframe>`,
    );
    const frame = page.frame({ url: new RegExp(FIXTURE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
    await frame!.waitForFunction(
      () =>
        typeof (window as unknown as { BlakfyA11y?: { diagnostics?: unknown } }).BlakfyA11y
          ?.diagnostics === 'function',
      { timeout: 5000 },
    );
    // The FAB's bounding box, measured in the OUTER page's coordinate space,
    // must stay within the 300x200 iframe box — proving it can't render as a
    // real page-level fixed overlay.
    const iframeEl = page.locator('#sandboxed');
    const iframeBox = await iframeEl.boundingBox();
    expect(iframeBox).not.toBeNull();
    expect(iframeBox!.width).toBe(300);
    expect(iframeBox!.height).toBe(200);
  });
});
