const puppeteer = require('puppeteer-core');
const os = require('os');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runStep5Tests() {
  console.log('Launching browser for STEP 5 verification...');
  const tempDir = path.join(os.tmpdir(), 'puppeteer_isolated_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on('pageerror', err => {
    // ignore cross-origin font/analytics errors from static assets
    if (!err.toString().includes('thehoshi.to') && !err.toString().includes('cdn.tailwindcss.com')) {
      errors.push(err.toString());
    }
  });

  try {
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing /shop PLP ---');
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });
    const shopState = await page.evaluate(() => {
      const cards = document.querySelectorAll('#shop-product-grid .product-item');
      const count = document.getElementById('shop-product-count')?.textContent?.trim();
      const filterBtn = !!document.getElementById('shop-filter-toggle-btn');
      const sortSelect = !!document.getElementById('shop-sort-select');
      return { cardCount: cards.length, countText: count, filterBtn, sortSelect };
    });
    console.log('Shop State:', shopState);
    if (shopState.cardCount !== 3 || !shopState.filterBtn || !shopState.sortSelect) {
      throw new Error(`Shop verification failed: ${JSON.stringify(shopState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Search for "watch" via Header Search ---');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.evaluate(() => {
        const input = document.getElementById('hoshi-search-input') || document.querySelector('input[name="search"]');
        if (input) input.value = 'watch';
        if (typeof window.executeSearch === 'function') {
          window.executeSearch();
        } else {
          window.location.href = '/search?q=watch';
        }
      })
    ]);
    const watchState = await page.evaluate(() => {
      const url = window.location.href;
      const heading = document.querySelector('.home-featured-main-title')?.textContent?.trim();
      const count = document.getElementById('shop-product-count')?.textContent?.trim();
      const titles = Array.from(document.querySelectorAll('#shop-product-grid .product-name')).map(el => el.textContent?.trim());
      return { url, heading, count, titles };
    });
    console.log('Search "watch" Result:', watchState);
    if (!watchState.url.includes('/search') || !watchState.titles.includes('Classic Watch')) {
      throw new Error(`Watch search failed: ${JSON.stringify(watchState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Search for "sunglasses" ---');
    await page.goto('http://localhost:3000/search?q=sunglasses', { waitUntil: 'networkidle2' });
    const sunglassesState = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('#shop-product-grid .product-name')).map(el => el.textContent?.trim());
      const count = document.getElementById('shop-product-count')?.textContent?.trim();
      return { titles, count };
    });
    console.log('Search "sunglasses" Result:', sunglassesState);
    if (!sunglassesState.titles.includes('Luxury Sunglasses')) {
      throw new Error(`Sunglasses search failed: ${JSON.stringify(sunglassesState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Filter Products (Footwear / Shoes) on /shop ---');
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });

    // Open filter drawer
    console.log('Opening filter drawer...');
    await page.click('#shop-filter-toggle-btn');
    await new Promise(r => setTimeout(r, 400));

    const drawerVisible = await page.evaluate(() => {
      const drawer = document.getElementById('shopify-filter-drawer');
      return drawer && drawer.style.left === '0px';
    });
    console.log('Filter drawer open:', drawerVisible);

    // Select "Footwear / Shoes"
    await page.evaluate(() => {
      const shoeRadio = document.querySelector('input[name="filter_category"][value="shoes"]');
      if (shoeRadio) shoeRadio.checked = true;
    });

    // Click Apply
    console.log('Applying category filter...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.evaluate(() => document.getElementById('shopify-filter-apply-btn')?.click())
    ]);

    const filteredState = await page.evaluate(() => {
      const url = window.location.href;
      const count = document.getElementById('shop-product-count')?.textContent?.trim();
      const titles = Array.from(document.querySelectorAll('#shop-product-grid .product-name')).map(el => el.textContent?.trim());
      const chip = document.querySelector('.filter-chip-item')?.textContent?.trim();
      return { url, count, titles, chip };
    });
    console.log('Filtered State:', filteredState);
    if (!filteredState.url.includes('category=shoes') || !filteredState.titles.includes('Premium Sneakers')) {
      throw new Error(`Filtering failed: ${JSON.stringify(filteredState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 5. Combine Filter + Sort ---');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.evaluate(() => {
        const sortSelect = document.getElementById('shop-sort-select');
        if (sortSelect) {
          sortSelect.value = 'price-asc';
          sortSelect.dispatchEvent(new Event('change'));
        }
      })
    ]);

    const filterSortState = await page.evaluate(() => {
      const url = window.location.href;
      const sort = document.getElementById('shop-sort-select')?.value;
      const titles = Array.from(document.querySelectorAll('#shop-product-grid .product-name')).map(el => el.textContent?.trim());
      return { url, sort, titles };
    });
    console.log('Filter + Sort State:', filterSortState);
    if (!filterSortState.url.includes('category=shoes') || !filterSortState.url.includes('sort=price-asc')) {
      throw new Error(`Combine filter+sort failed: ${JSON.stringify(filterSortState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 6. Clear Filters ---');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.evaluate(() => {
        const clearBtn = document.querySelector('.active-filter-chips-bar a[href*="/shop"]');
        if (clearBtn) clearBtn.click();
      })
    ]);

    const clearedState = await page.evaluate(() => {
      const url = window.location.href;
      const cards = document.querySelectorAll('#shop-product-grid .product-item');
      const chips = document.querySelector('.active-filter-chips-bar');
      return { url, cardCount: cards.length, hasChips: !!chips };
    });
    console.log('Cleared State:', clearedState);
    if (clearedState.cardCount !== 3 || clearedState.hasChips) {
      throw new Error(`Clear filters failed: ${JSON.stringify(clearedState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 7. Open a Filtered Product Page ---');
    await page.goto('http://localhost:3000/shop?category=watches', { waitUntil: 'networkidle2' });
    const productLink = await page.evaluate(() => {
      const link = document.querySelector('#shop-product-grid a[href*="/products/"]');
      return link ? link.getAttribute('href') : null;
    });
    console.log('Navigating to product:', productLink);
    await page.goto('http://localhost:3000' + productLink, { waitUntil: 'networkidle2' });
    const pdpTitle = await page.evaluate(() => (document.querySelector('h1.product-name, .product-name, h2')?.textContent?.trim() || ''));
    console.log('PDP Title:', pdpTitle);
    if (!pdpTitle.includes('Watch')) {
      throw new Error(`Product page navigation failed: ${pdpTitle}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 8. Add Product to Cart Regression Test ---');
    // Clear cart in localStorage to start clean
    await page.evaluate(() => localStorage.removeItem('shopify_cart_id'));

    const addPromise = page.waitForResponse(
      res => res.url().includes('/api/cart') && res.request().method() === 'POST',
      { timeout: 15000 }
    );
    await page.evaluate(() => {
      const btn = document.querySelector('.button-add-to-cart');
      if (btn) btn.click();
    });
    const addRes = await addPromise;
    const addJson = await addRes.json();
    console.log('Cart add response totalQuantity:', addJson.cart?.totalQuantity);

    await new Promise(r => setTimeout(r, 600));
    const cartOpen = await page.evaluate(() => {
      const drawer = document.getElementById('shopify-cart-drawer');
      const items = document.querySelectorAll('#shopify-cart-items .shopify-cart-item-row');
      return {
        open: drawer && (drawer.style.transform === 'translateX(0px)' || drawer.style.transform === 'translateX(0)' || !drawer.style.transform.includes('100%')),
        itemCount: items.length
      };
    });
    console.log('Cart drawer status after add:', cartOpen);
    if (addJson.cart?.totalQuantity < 1 || !cartOpen.open) {
      throw new Error(`Add to cart regression failure!`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 9. Buy Now Regression Test ---');
    await page.goto('http://localhost:3000/products/classic-watch', { waitUntil: 'networkidle2' });
    const buyPromise = page.waitForResponse(
      res => res.url().includes('/api/cart') && res.request().method() === 'POST',
      { timeout: 15000 }
    );
    await page.evaluate(() => {
      const btn = document.querySelector('.button-buy-now');
      if (btn) btn.click();
    });
    const buyRes = await buyPromise;
    const buyJson = await buyRes.json();
    console.log('Buy Now cart checkoutUrl:', buyJson.cart?.checkoutUrl?.slice(0, 60) + '...');
    if (!buyJson.cart?.checkoutUrl || (!buyJson.cart.checkoutUrl.includes('shopify.com') && !buyJson.cart.checkoutUrl.includes('wearbrood.com') && !buyJson.cart.checkoutUrl.includes('/cart/c/'))) {
      throw new Error('Buy Now checkoutUrl missing or invalid');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 10. Refresh Filtered Page & State Persistence ---');
    await page.goto('http://localhost:3000/shop?category=shoes&size=40', { waitUntil: 'networkidle2' });
    await page.reload({ waitUntil: 'networkidle2' });
    const persistedState = await page.evaluate(() => {
      const url = window.location.href;
      const count = document.getElementById('shop-product-count')?.textContent?.trim();
      const cards = document.querySelectorAll('#shop-product-grid .product-item');
      return { url, count, cardCount: cards.length };
    });
    console.log('Persisted Reload State:', persistedState);
    if (!persistedState.url.includes('category=shoes') || persistedState.cardCount !== 1) {
      throw new Error(`Persistence after reload failed: ${JSON.stringify(persistedState)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 11. Browser Back / Forward Navigation ---');
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });
    await page.goto('http://localhost:3000/search?q=watch', { waitUntil: 'networkidle2' });
    await page.goBack({ waitUntil: 'networkidle2' });
    const backUrl = page.url();
    console.log('After Back URL:', backUrl);
    if (!backUrl.endsWith('/shop')) {
      throw new Error(`Browser back failed: ${backUrl}`);
    }
    await page.goForward({ waitUntil: 'networkidle2' });
    const forwardUrl = page.url();
    console.log('After Forward URL:', forwardUrl);
    if (!forwardUrl.includes('/search?q=watch')) {
      throw new Error(`Browser forward failed: ${forwardUrl}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 12. Mobile Filter UI Experience ---');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });

    // Open filter drawer on mobile
    await page.evaluate(() => document.getElementById('shop-filter-toggle-btn')?.click());
    await new Promise(r => setTimeout(r, 400));
    const mobileDrawerOpen = await page.evaluate(() => {
      const d = document.getElementById('shopify-filter-drawer');
      return d && d.style.left === '0px';
    });
    console.log('Mobile Filter Drawer open:', mobileDrawerOpen);

    // Close filter drawer on mobile
    await page.evaluate(() => document.getElementById('shopify-filter-close')?.click());
    await new Promise(r => setTimeout(r, 400));
    const mobileDrawerClosed = await page.evaluate(() => {
      const d = document.getElementById('shopify-filter-drawer');
      return d && d.style.left === '-380px';
    });
    console.log('Mobile Filter Drawer closed:', mobileDrawerClosed);
    if (!mobileDrawerOpen || !mobileDrawerClosed) {
      throw new Error('Mobile drawer open/close failed');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 13. Load More / Pagination with Filters ---');
    // Test Load More API endpoint with filters
    const loadMoreCheck = await page.evaluate(async () => {
      const res = await fetch('/api/products?first=1&category=shoes');
      const data = await res.json();
      return {
        count: data.products?.length,
        title: data.products?.[0]?.title,
        hasNextPage: data.pageInfo?.hasNextPage,
        hasCards: !!data.htmlCards
      };
    });
    console.log('Load More with filters check:', loadMoreCheck);
    if (loadMoreCheck.count !== 1 || !loadMoreCheck.title.includes('Sneakers')) {
      throw new Error(`Load more with filters API failed: ${JSON.stringify(loadMoreCheck)}`);
    }

    console.log('\n======================================================');
    console.log('ALL 13 BROWSER TEST FLOWS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    await browser.close();
  }
}

runStep5Tests().catch(err => {
  console.error('STEP 5 BROWSER TEST ERROR:', err);
  process.exit(1);
});
