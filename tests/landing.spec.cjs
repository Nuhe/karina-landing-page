const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/home/kam/workspace/smd-adventures/node_modules/playwright'));
}

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const server = http.createServer((request, response) => {
  if (request.url !== '/') {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(html);
});

(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/`;
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
    for (const width of [320, 375, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto(url);
      assert.equal(await page.locator('.hero').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(30, 90, 156)');
      assert.ok(await page.locator('.hero, .nav').evaluateAll(elements => elements.every(element => element.scrollWidth <= innerWidth)), `hero/navigation overflow at ${width}`);
      assert.equal(await page.locator('.hero h1').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
      assert.equal(await page.locator('#submitBtn').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(30, 90, 156)');
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(anchors => anchors.filter(anchor => !document.getElementById(anchor.hash.slice(1))).map(anchor => anchor.hash)), []);
      assert.ok(await page.locator('.demo-notice').isVisible());
      if (width > 900) assert.equal(await page.locator('.nav__cta-mobile').isVisible(), false);
      assert.ok((await page.locator('.hero h1').boundingBox()).y < (await page.locator('.hero__card').boundingBox()).y || width > 900);
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
      if (width < 900) {
        await page.locator('#navToggle').focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#planes');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'navToggle');
      }
      assert.deepEqual(errors, [], `browser errors at ${width}`);
      await page.evaluate(() => scrollTo(0, 0));
      if (width !== 768) {
        const screenshot = `/tmp/karina-blue-presentation-${width}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(`Screenshot: ${screenshot}`);
      }
      await context.close();
      console.log(`PASS: ${width}px hero palette, anchors, navigation, reduced motion, console`);
    }
  } finally {
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
