// Preferences round-trip E2E.
// For each of the 7 preferences (6 switches + 1 font-scale group):
//   - flip via UI
//   - assert <html> data-a11y-* attribute updates
//   - assert localStorage + cookie persist
//   - reload, assert preference survives
import { test, expect } from '@playwright/test';
import { FIXTURE, openPanel, waitForMount } from './_helpers';

test.beforeEach(async ({ page }) => {
  await page.goto(FIXTURE);
  await waitForMount(page);
  // Reset to defaults so previous tests don't leak.
  await page.evaluate(() => (window as any).BlakfyA11y.reset());
});

async function getHtmlAttrs(
  page: import('@playwright/test').Page,
): Promise<Record<string, string | null>> {
  return page.evaluate(() => {
    const html = document.documentElement;
    return {
      fontscale: html.getAttribute('data-a11y-fontscale'),
      contrast: html.getAttribute('data-a11y-contrast'),
      focus: html.getAttribute('data-a11y-focus'),
      links: html.getAttribute('data-a11y-links'),
      motion: html.getAttribute('data-a11y-motion'),
      dyslexia: html.getAttribute('data-a11y-dyslexia'),
      reading: html.getAttribute('data-a11y-reading'),
    };
  });
}

test('fontScale → data-a11y-fontscale + persists', async ({ page }) => {
  await openPanel(page);
  // fontScale is a stepper (100 → 110 → 125): one "artır" (+) click from
  // the 100 default lands on 110.
  await page
    .locator('blakfy-a11y-root')
    .locator('.stepper-row', { hasText: 'Yazı Ölçeği' })
    .locator('button.stepper-btn[aria-label="artır"]')
    .click();
  expect((await getHtmlAttrs(page)).fontscale).toBe('110');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).fontscale).toBe('110');
});

function switchByName(page: import('@playwright/test').Page, name: string) {
  return page.locator('blakfy-a11y-root').getByRole('switch', { name });
}

test('contrast switch → data-a11y-contrast="high" + persists', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Yüksek Kontrast').click();
  expect((await getHtmlAttrs(page)).contrast).toBe('high');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).contrast).toBe('high');
});

test('focusRing → data-a11y-focus="enhanced" + persists', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Belirgin Odak Halkası').click();
  expect((await getHtmlAttrs(page)).focus).toBe('enhanced');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).focus).toBe('enhanced');
});

test('linkUnderline → data-a11y-links="underline" + persists', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Bağlantı Altçizgisi').click();
  expect((await getHtmlAttrs(page)).links).toBe('underline');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).links).toBe('underline');
});

test('motion → data-a11y-motion="reduce" + persists', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Hareketi Azalt').click();
  expect((await getHtmlAttrs(page)).motion).toBe('reduce');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).motion).toBe('reduce');
});

test('dyslexiaFont → data-a11y-dyslexia="true" + persists', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Disleksi Dostu Yazı Tipi').click();
  expect((await getHtmlAttrs(page)).dyslexia).toBe('true');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).dyslexia).toBe('true');
});

test('readingMode → data-a11y-reading="true" + persists', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Okuma Modu').click();
  expect((await getHtmlAttrs(page)).reading).toBe('true');
  await page.reload();
  await waitForMount(page);
  expect((await getHtmlAttrs(page)).reading).toBe('true');
});

test('localStorage + cookie both record changes', async ({ page }) => {
  await openPanel(page);
  await switchByName(page, 'Yüksek Kontrast').click();
  const ls = await page.evaluate(() => window.localStorage.getItem('blakfy_a11y_prefs'));
  const ck = await page.evaluate(() => document.cookie);
  expect(ls).not.toBeNull();
  expect(ls!).toContain('"contrast":"high"');
  expect(ck).toContain('blakfy_a11y_prefs=');
});
