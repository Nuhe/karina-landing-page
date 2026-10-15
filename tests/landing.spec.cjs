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
    assert.match(html, /No todos buscamos lo mismo/);
    assert.match(html, /¿Por qué no hay precios en esta página/);
    assert.doesNotMatch(html, /id="opiniones"|<article class="quote |\[TESTIMONIO/);
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
      assert.ok(await page.locator('.hero, .nav, #planes, #beneficios, #proceso, #faq').evaluateAll(elements => elements.every(element => element.scrollWidth <= innerWidth)), `presentation/guidance overflow at ${width}`);
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
      const summaries = page.locator('#faqList summary');
      await summaries.nth(0).click();
      assert.equal(await page.locator('#faqList details').nth(0).getAttribute('open'), '');
      await summaries.nth(1).click();
      assert.equal(await page.locator('#faqList details[open]').count(), 1);
      assert.deepEqual(errors, [], `browser errors at ${width}`);
      await page.evaluate(() => scrollTo(0, 0));
      if (width !== 768) {
        const screenshot = `/tmp/karina-blue-guidance-${width}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(`Screenshot: ${screenshot}`);
      }
      await context.close();
      console.log(`PASS: ${width}px presentation, anchors, navigation, FAQ, reduced motion, console`);
    }
    const motion = await browser.newContext({ viewport: { width: 375, height: 1000 } });
    const motionPage = await motion.newPage();
    await motionPage.goto(url);
    await motionPage.locator('#navToggle').focus();
    await motionPage.keyboard.press('Enter');
    await motionPage.keyboard.press('Tab');
    assert.equal(await motionPage.evaluate(() => document.activeElement.getAttribute('href')), '#planes');
    await motion.close();
    console.log('PASS: immediate keyboard navigation with normal motion');
    const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 1000 } });
    const page = await noScript.newPage();
    await page.goto(url);
    assert.ok(await page.locator('#planes h2').isVisible());
    assert.equal(await page.locator('#planes h2').evaluate(element => getComputedStyle(element.closest('.reveal')).opacity), '1');
    assert.ok(await page.locator('#navLinks').isVisible(), 'navigation remains available without JavaScript');
    await page.locator('#faqList summary').first().click();
    assert.equal(await page.locator('#faqList details[open]').count(), 1);
    await noScript.close();
    console.log('PASS: JavaScript-disabled content, navigation and FAQ');
  } finally {
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
