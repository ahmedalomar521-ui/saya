// HTML -> PNG 1080x1920 with Playwright. Needs NODE_PATH to playwright; CHROMIUM_PATH optional.
const {chromium} = require('playwright');
(async () => {
  const [, , html, out] = process.argv;
  const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined});
  const p = await b.newPage({viewport: {width: 1080, height: 1920}});
  await p.goto('file://' + html);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({path: out, clip: {x: 0, y: 0, width: 1080, height: 1920}});
  await b.close();
})();
