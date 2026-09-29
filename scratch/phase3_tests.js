const puppeteer = require('puppeteer-core');

const BASE = 'http://localhost:3000';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  async function test(name, fn) {
    try {
      const result = await fn(browser);
      results.push({ name, status: 'PASS', detail: result });
      console.log(`PASS  ${name}: ${JSON.stringify(result)}`);
    } catch (e) {
      results.push({ name, status: 'FAIL', detail: e.message });
      console.log(`FAIL  ${name}: ${e.message}`);
    }
  }

  // TEST 1 — PDP premium-sneakers
  await test('T01 PDP premium-sneakers', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      price: document.getElementById('pdp-price')?.textContent?.trim() || '',
      hasATC: !!document.getElementById('pdp-add-to-cart'),
      hasBuyNow: !!document.getElementById('pdp-buy-now'),
      variantRadios: document.querySelectorAll('.luxury-variant-radio').length,
      hasGallery: !!document.getElementById('pdp-main-viewport'),
    }));
    await p.close();
    if (!ev.h1 || !ev.hasATC) throw new Error('Missing h1 or ATC button');
    return ev;
  });

  // TEST 2 — PDP luxury-sunglasses
  await test('T02 PDP luxury-sunglasses', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/products/luxury-sunglasses`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      price: document.getElementById('pdp-price')?.textContent?.trim() || '',
      hasATC: !!document.getElementById('pdp-add-to-cart'),
    }));
    await p.close();
    if (!ev.h1 || !ev.hasATC) throw new Error('Missing h1 or ATC');
    return ev;
  });

  // TEST 3 — PDP classic-watch
  await test('T03 PDP classic-watch', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/products/classic-watch`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      hasATC: !!document.getElementById('pdp-add-to-cart'),
    }));
    await p.close();
    if (!ev.h1 || !ev.hasATC) throw new Error('Missing h1 or ATC');
    return ev;
  });

  // TEST 4 — Accordions
  await test('T04 Accordions', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => {
      const triggers = Array.from(document.querySelectorAll('.prestige-acc-trigger span:first-child'))
        .map(el => el.textContent.trim());
      const items = document.querySelectorAll('.prestige-acc-item');
      return { count: items.length, labels: triggers };
    });
    await p.close();
    if (ev.count < 2) throw new Error(`Only ${ev.count} accordion items`);
    return ev;
  });

  // TEST 5 — Lightbox structure
  await test('T05 Lightbox structure', async (b) => {
    const p = await b.newPage();
    await p.setViewport({ width: 1280, height: 900 });
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      hasZoomBtn: !!document.getElementById('pdp-zoom-btn'),
      hasLightbox: !!document.getElementById('pdp-lightbox'),
      hasPrev: !!document.getElementById('pdp-lightbox-prev'),
      hasNext: !!document.getElementById('pdp-lightbox-next'),
      hasCounter: !!document.getElementById('pdp-lightbox-counter'),
      mainSlides: document.querySelectorAll('.prestige-main-slide').length,
    }));
    await p.close();
    if (!ev.hasLightbox) throw new Error('Missing lightbox');
    return ev;
  });

  // TEST 6 — Mobile overflow 375px
  await test('T06 Mobile overflow 375px', async (b) => {
    const p = await b.newPage();
    await p.setViewport({ width: 375, height: 812 });
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    }));
    await p.close();
    if (!ev.noOverflow) throw new Error(`Overflow: scrollWidth=${ev.scrollWidth} > innerWidth=${ev.innerWidth}`);
    return ev;
  });

  // TEST 7 — Mobile overflow 390px
  await test('T07 Mobile overflow 390px', async (b) => {
    const p = await b.newPage();
    await p.setViewport({ width: 390, height: 844 });
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    }));
    await p.close();
    if (!ev.noOverflow) throw new Error(`Overflow: scrollWidth=${ev.scrollWidth} > innerWidth=${ev.innerWidth}`);
    return ev;
  });

  // TEST 8 — Mobile gallery at 375px
  await test('T08 Mobile gallery 375px', async (b) => {
    const p = await b.newPage();
    await p.setViewport({ width: 375, height: 812 });
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      mobileItems: document.querySelectorAll('.prestige-mobile-media-item').length,
      desktopVisible: document.querySelector('.prestige-desktop-gallery')
        ? window.getComputedStyle(document.querySelector('.prestige-desktop-gallery')).display
        : 'n/a',
      mobileVisible: document.querySelector('.prestige-mobile-gallery-stacked')
        ? window.getComputedStyle(document.querySelector('.prestige-mobile-gallery-stacked')).display
        : 'n/a',
    }));
    await p.close();
    if (ev.mobileItems === 0) throw new Error('No mobile gallery items in DOM');
    return ev;
  });

  // TEST 9 — Recently Viewed
  await test('T09 Recently Viewed tracking', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const rv1 = await p.evaluate(() => localStorage.getItem('brood_recently_viewed'));
    await p.goto(`${BASE}/products/luxury-sunglasses`, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const rv2 = await p.evaluate(() => localStorage.getItem('brood_recently_viewed'));
    await p.close();
    const arr = JSON.parse(rv2 || '[]');
    if (!arr.includes('luxury-sunglasses')) throw new Error(`luxury-sunglasses not in ${rv2}`);
    return { after_sneakers: rv1, after_sunglasses: rv2 };
  });

  // TEST 10 — Regression: /shop
  await test('T10 Regression /shop', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/shop`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      cards: document.querySelectorAll('.prestige-card-wrap, .product-item').length,
      hasError: document.body.textContent.includes('Cannot find module'),
    }));
    await p.close();
    if (ev.hasError) throw new Error('Module error on /shop');
    if (ev.cards === 0) throw new Error('No product cards on /shop');
    return ev;
  });

  // TEST 11 — Regression: /wishlist
  await test('T11 Regression /wishlist', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/wishlist`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => ({
      hasError: document.body.textContent.includes('Cannot find module'),
      hasContent: document.body.innerHTML.length > 500,
    }));
    await p.close();
    if (ev.hasError) throw new Error('Module error on /wishlist');
    return ev;
  });

  // TEST 12 — False claims removed
  await test('T12 No false claims', async (b) => {
    const p = await b.newPage();
    await p.goto(`${BASE}/products/premium-sneakers`, { waitUntil: 'networkidle2', timeout: 15000 });
    const ev = await p.evaluate(() => {
      const html = document.body.innerHTML;
      return {
        authenticated: html.includes('100% Guaranteed Authentic'),
        freeExpress: html.includes('Complimentary Express Shipping'),
        returns14: html.includes('14-Day Effortless Returns'),
        concierge: html.includes('24/7 concierge'),
        hasFalseClaims: html.includes('100% Guaranteed Authentic') || html.includes('Complimentary Express Shipping') || html.includes('14-Day Effortless Returns') || html.includes('24/7 concierge'),
      };
    });
    await p.close();
    if (ev.hasFalseClaims) throw new Error(`False claims still present: ${JSON.stringify(ev)}`);
    return ev;
  });

  await browser.close();

  console.log('\n======= PHASE 3 TEST SUMMARY =======');
  let passed = 0, failed = 0;
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${r.name}: ${r.status}`);
    if (r.status === 'PASS') passed++; else failed++;
  }
  console.log(`\nTotal: ${passed} PASS, ${failed} FAIL out of ${results.length} tests`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
