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
    assert.doesNotMatch(html.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), /matricul/i);
    assert.doesNotMatch(html, /\[(?:NOMBRE|ZONA|DOMINIO|WHATSAPP|PLAN|VALOR|EMAIL|FORM_ENDPOINT)|wa\.me|mailto:|tel:/);
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
      assert.equal(await page.locator('.hero h1').evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
      assert.equal(await page.locator('#submitBtn').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(30, 90, 156)');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
      assert.ok(await page.locator('.form, .field select, #submitBtn').evaluateAll(elements => elements.every(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth && element.scrollWidth <= element.clientWidth;
      })), `form and controls must fit without clipping at ${width}`);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(anchors => anchors.filter(anchor => !document.getElementById(anchor.hash.slice(1))).map(anchor => anchor.hash)), []);
      assert.ok(await page.locator('.demo-notice').isVisible());
      assert.equal(await page.locator('.advisor-visual__list li').count(), 3, 'advisor guide keeps three decision criteria');
      assert.equal(await page.locator('.advisor-visual__card').evaluate(element => getComputedStyle(element).transform), 'none', 'decision guide stays upright and readable');
      assert.equal(await page.locator('.advisor-visual__orbit, .advisor-visual__monogram').count(), 0, 'hero uses a decision guide rather than decorative monograms');
      assert.ok(await page.locator('.advisor-visual__list li').evaluateAll(elements => elements.every(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth && element.scrollWidth <= element.clientWidth;
      })), `decision criteria fit at ${width}`);
      const aboutHeading = await page.locator('#beneficios .head').boundingBox();
      const aboutPrinciples = await page.locator('#beneficios .grid').boundingBox();
      const faqHeading = await page.locator('#faq .head').boundingBox();
      const faqItems = await page.locator('#faqList').boundingBox();
      if (width > 900) {
        assert.ok(aboutHeading.x + aboutHeading.width <= aboutPrinciples.x, 'desktop advisor narrative sits beside principles');
        assert.ok(faqHeading.x + faqHeading.width <= faqItems.x, 'desktop questions have an editorial side heading');
      } else {
        assert.ok(aboutHeading.y + aboutHeading.height <= aboutPrinciples.y, 'mobile advisor narrative precedes principles');
        assert.ok(faqHeading.y + faqHeading.height <= faqItems.y, 'mobile question heading precedes accordion');
      }

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
      await page.waitForFunction(() => {
        const details = [...document.querySelectorAll('#faqList details')];
        return details[1].open && details.filter(detail => detail.open).length === 1;
      }, undefined, { timeout: 1000 });
      assert.equal(await page.locator('#faqList details[open]').count(), 1);
      await page.locator('#submitBtn').click();
      assert.equal(await page.locator('.field.is-invalid').count(), 2, 'all invalid fields receive feedback');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'f-plan');
      await page.locator('#f-plan').selectOption('familiar');
      await page.locator('#f-priority').selectOption('cartilla');
      const requests = [];
      page.on('request', request => requests.push(request.url()));
      await page.locator('#submitBtn').click();
      assert.match(await page.locator('#formStatus').innerText(), /No se enviaron ni guardaron datos/);
      assert.deepEqual(requests, [], 'demo submission cannot make requests');
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      assert.deepEqual(await context.cookies(), []);
      assert.equal(await page.locator('input, textarea').count(), 0, 'demo does not solicit personal or medical data');
      assert.deepEqual(errors, [], `browser errors at ${width}`);
      await page.evaluate(() => scrollTo(0, 0));
      if (width !== 768) {
        const screenshot = `/tmp/karina-polish-${width}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(`Screenshot: ${screenshot}`);
      }
      await context.close();
      console.log(`PASS: ${width}px layout, anchors, navigation, FAQ, demo form, reduced motion, privacy, console`);
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
    assert.ok(await page.locator('#submitBtn').isDisabled(), 'form cannot navigate or transmit without JavaScript');
    await page.locator('#faqList summary').first().click();
    assert.equal(await page.locator('#faqList details[open]').count(), 1);
    await noScript.close();
    console.log('PASS: JavaScript-disabled content, navigation, FAQ and safe form');
  } finally {
    if (browser) await browser.close();
    if (server.listening) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
