#!/usr/bin/env node
// Export every `.slide` element of an HTML carousel as a PNG.
// Usage: node export_slides.js <carousel.html> [out-dir] [width] [height]
// Defaults: out-dir = ./slides, 1080x1350 (Instagram 4:5).
// Needs Playwright (`npm i -D playwright`). Set CHROMIUM_PATH to use a
// preinstalled Chromium instead of Playwright's own download.

const path = require('path');
const fs = require('fs');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright not found. Install it with: npm i -D playwright');
  process.exit(1);
}

(async () => {
  const [, , htmlArg, outArg = 'slides', wArg = '1080', hArg = '1350'] = process.argv;
  if (!htmlArg) {
    console.error('Usage: node export_slides.js <carousel.html> [out-dir] [width] [height]');
    process.exit(1);
  }
  const html = path.resolve(htmlArg);
  const out = path.resolve(outArg);
  const width = Number(wArg);
  const height = Number(hArg);
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto('file://' + html);
  // Wait for web fonts: a slide shot before the Arabic font loads falls back
  // to the system font with no error.
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.$$('.slide');
  if (!slides.length) {
    console.error('No .slide elements found.');
    process.exit(1);
  }
  for (let i = 0; i < slides.length; i++) {
    const box = await slides[i].boundingBox();
    if (Math.round(box.width) !== width || Math.round(box.height) !== height) {
      console.warn(`slide ${i + 1}: ${box.width}x${box.height}, expected ${width}x${height}`);
    }
    const file = path.join(out, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: file });
    console.log(file);
  }
  await browser.close();
})();
