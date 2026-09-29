const puppeteer = require('puppeteer-core');
const os = require('os');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runWishlistTests() {
  console.log('Launching browser for STEP 6 (Wishlist) verification...');
  const tempDir = path.join(os.tmpdir(), 'puppeteer_wishlist_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    // optional debug
  });

  try {
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Open /shop ---');
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });
    
    // Clear localStorage to start clean
    await page.evaluate(() => {
      localStorage.removeItem('shopify_wishlist');
      if (window.ShopifyWishlist) {
        window.ShopifyWishlist.updateBadges();
        window.ShopifyWishlist.updateAllButtons();
      }
    });

    const initialCount = await page.evaluate(() => {
      return window.ShopifyWishlist ? window.ShopifyWishlist.getCount() : -1;
    });
    console.log('Initial Wishlist count:', initialCount);
    if (initialCount !== 0) throw new Error('Initial wishlist count is not 0');

    // -------------------------------------------------------------------------
    console.log('\n--- 2. Add one product to wishlist on /shop ---');
    const firstProductHandle = await page.evaluate(() => {
      const btn = document.querySelector('.wishlist-heart-btn[data-handle]');
      if (btn) {
        btn.click();
        return btn.getAttribute('data-handle');
      }
      return null;
    });
    console.log('Toggled product handle:', firstProductHandle);
    if (!firstProductHandle) throw new Error('Could not find wishlist heart button on /shop');

    await new Promise(r => setTimeout(r, 200));

    // -------------------------------------------------------------------------
    console.log('\n--- 3. Confirm heart becomes active ---');
    const isHeartActive = await page.evaluate((h) => {
      const btn = document.querySelector(`.wishlist-heart-btn[data-handle="${h}"]`);
      const svg = btn?.querySelector('svg.heart-icon');
      const isFilled = svg?.getAttribute('fill') === '#e53e3e';
      const hasClass = btn?.classList.contains('is-active') || btn?.classList.contains('active');
      return { isFilled, hasClass };
    }, firstProductHandle);
    console.log('Heart active status:', isHeartActive);
    if (!isHeartActive.hasClass || !isHeartActive.isFilled) {
      throw new Error(`Heart did not become active! ${JSON.stringify(isHeartActive)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 4. Confirm wishlist count changes ---');
    const countAfterAdd = await page.evaluate(() => {
      const count = window.ShopifyWishlist.getCount();
      const badge = document.querySelector('#wishlist-total');
      const badgeText = badge ? badge.getAttribute('title') || badge.textContent : '';
      return { count, badgeText };
    });
    console.log('Count after add:', countAfterAdd);
    if (countAfterAdd.count !== 1) throw new Error('Wishlist count did not update to 1');

    // -------------------------------------------------------------------------
    console.log('\n--- 5. Refresh page ---');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 300));

    // -------------------------------------------------------------------------
    console.log('\n--- 6. Confirm wishlist persists across reload ---');
    const persistedStatus = await page.evaluate((h) => {
      const count = window.ShopifyWishlist ? window.ShopifyWishlist.getCount() : -1;
      const btn = document.querySelector(`.wishlist-heart-btn[data-handle="${h}"]`);
      const hasClass = btn?.classList.contains('is-active') || btn?.classList.contains('active');
      return { count, hasClass };
    }, firstProductHandle);
    console.log('Persisted status after reload:', persistedStatus);
    if (persistedStatus.count !== 1 || !persistedStatus.hasClass) {
      throw new Error('Wishlist did not persist across page reload');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 7. Open another page (Home /) ---');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

    // -------------------------------------------------------------------------
    console.log('\n--- 8. Confirm heart remains active on homepage ---');
    const homeHeartStatus = await page.evaluate((h) => {
      const count = window.ShopifyWishlist.getCount();
      const btn = document.querySelector(`.wishlist-heart-btn[data-handle="${h}"]`);
      const hasClass = btn?.classList.contains('is-active') || btn?.classList.contains('active');
      return { count, hasClass };
    }, firstProductHandle);
    console.log('Homepage heart status:', homeHeartStatus);
    if (homeHeartStatus.count !== 1 || !homeHeartStatus.hasClass) {
      throw new Error('Heart state is not synchronized on homepage');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 9. Open /wishlist ---');
    await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });

    // Wait for client-side live Shopify hydration
    await page.waitForSelector('.wishlist-item', { timeout: 10000 });

    // -------------------------------------------------------------------------
    console.log('\n--- 10. Confirm correct live Shopify product appears ---');
    const wishlistItems = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.wishlist-item')).map(el => {
        return {
          handle: el.getAttribute('data-wishlist-item'),
          title: el.querySelector('.product-name')?.textContent?.trim(),
          price: el.querySelector('.price-new')?.textContent?.trim(),
          hasImage: !!el.querySelector('img')?.getAttribute('src'),
          hasAddCart: !!el.querySelector('.wishlist-add-to-cart-btn')
        };
      });
      const pageCount = document.getElementById('wishlist-page-count')?.textContent?.trim();
      return { items, pageCount };
    });
    console.log('Wishlist page items:', wishlistItems);
    if (wishlistItems.items.length !== 1 || wishlistItems.items[0].handle !== firstProductHandle) {
      throw new Error(`Wishlist product mismatch: ${JSON.stringify(wishlistItems)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 11. Remove product from /wishlist ---');
    await page.evaluate((h) => {
      const removeBtn = document.querySelector(`[data-wishlist-item="${h}"] .wishlist-remove-btn`);
      if (removeBtn) removeBtn.click();
    }, firstProductHandle);

    await new Promise(r => setTimeout(r, 600));

    // -------------------------------------------------------------------------
    console.log('\n--- 12. Confirm count updates and empty state appears ---');
    const afterRemoveStatus = await page.evaluate(() => {
      const count = window.ShopifyWishlist.getCount();
      const emptyBox = document.getElementById('wishlist-empty-box');
      const emptyVisible = emptyBox && emptyBox.style.display !== 'none';
      const remainingItems = document.querySelectorAll('.wishlist-item').length;
      return { count, emptyVisible, remainingItems };
    });
    console.log('After remove status:', afterRemoveStatus);
    if (afterRemoveStatus.count !== 0 || !afterRemoveStatus.emptyVisible || afterRemoveStatus.remainingItems !== 0) {
      throw new Error(`Remove product failed: ${JSON.stringify(afterRemoveStatus)}`);
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 13. Add a product from Product Page (/products/classic-watch) ---');
    await page.goto('http://localhost:3000/products/classic-watch', { waitUntil: 'networkidle2' });
    const pdpAdded = await page.evaluate(() => {
      const btn = document.getElementById('button-add-to-wishlist');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('PDP wishlist button clicked:', pdpAdded);
    if (!pdpAdded) throw new Error('Could not find #button-add-to-wishlist on PDP');

    await new Promise(r => setTimeout(r, 300));
    const pdpCount = await page.evaluate(() => window.ShopifyWishlist.getCount());
    console.log('Wishlist count after PDP add:', pdpCount);
    if (pdpCount !== 1) throw new Error('Wishlist count did not update to 1 on PDP');

    // -------------------------------------------------------------------------
    console.log('\n--- 14. Add wishlist item to Cart via /wishlist "Add to Bag" ---');
    await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.wishlist-add-to-cart-btn', { timeout: 10000 });

    await page.evaluate(() => {
      const btn = document.querySelector('.wishlist-add-to-cart-btn');
      if (btn) btn.click();
    });

    await page.waitForFunction(() => {
      return window.ShopifyCart && window.ShopifyCart.currentCart && window.ShopifyCart.currentCart.totalQuantity > 0;
    }, { timeout: 15000 });

    const cartTotalQty = await page.evaluate(() => window.ShopifyCart.currentCart.totalQuantity);
    console.log('Cart add response totalQuantity:', cartTotalQty);

    // -------------------------------------------------------------------------
    console.log('\n--- 15. Confirm Cart Drawer opens with item ---');
    await page.waitForSelector('#shopify-cart-drawer', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));
    const cartOpen = await page.evaluate(() => {
      const drawer = document.getElementById('shopify-cart-drawer');
      const items = document.querySelectorAll('#shopify-cart-items .shopify-cart-item-row');
      return {
        open: drawer && drawer.style.transform === 'translateX(0px)',
        itemCount: items.length
      };
    });
    console.log('Cart drawer status after wishlist add:', cartOpen);
    if (cartTotalQty < 1 || !cartOpen.open) {
      throw new Error('Cart integration failed from wishlist');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 16. Confirm Buy Now still works ---');
    await page.goto('http://localhost:3000/products/luxury-sunglasses', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.button-buy-now', { timeout: 10000 });
    await page.evaluate(() => {
      const btn = document.querySelector('.button-buy-now');
      if (btn) btn.click();
    });

    await page.waitForFunction(() => {
      const c = window.ShopifyCart && window.ShopifyCart.currentCart;
      return (c && c.checkoutUrl) || window.location.href.includes('shopify.com') || window.location.href.includes('/cart/c/');
    }, { timeout: 15000 });

    const checkoutUrl = await page.evaluate(() => {
      return (window.ShopifyCart && window.ShopifyCart.currentCart && window.ShopifyCart.currentCart.checkoutUrl) || window.location.href;
    });
    console.log('Buy Now checkoutUrl:', checkoutUrl.slice(0, 50) + '...');
    if (!checkoutUrl.includes('shopify.com') && !checkoutUrl.includes('wearbrood.com') && !checkoutUrl.includes('/cart/c/')) {
      throw new Error('Buy Now checkoutUrl invalid');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 17. Test Empty Wishlist State ---');
    // Clear storage
    await page.evaluate(() => {
      localStorage.removeItem('shopify_wishlist');
      if (window.ShopifyWishlist) window.ShopifyWishlist.saveItems([]);
    });
    await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });
    const emptyCheck = await page.evaluate(() => {
      const emptyBox = document.getElementById('wishlist-empty-box');
      const hasContinue = !!emptyBox?.querySelector('a[href="/shop"]');
      const text = emptyBox?.textContent;
      return { visible: emptyBox && emptyBox.style.display !== 'none', hasContinue, text: text?.slice(0, 50) };
    });
    console.log('Empty wishlist state check:', emptyCheck);
    if (!emptyCheck.visible || !emptyCheck.hasContinue) {
      throw new Error('Empty wishlist state failed');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 18. Mobile Viewport Test (375x667) ---');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });
    const mobileHeartClick = await page.evaluate(() => {
      const btn = document.querySelector('.wishlist-heart-btn');
      if (btn) {
        btn.click();
        return { clicked: true, count: window.ShopifyWishlist.getCount() };
      }
      return { clicked: false, count: 0 };
    });
    console.log('Mobile heart click result:', mobileHeartClick);
    if (!mobileHeartClick.clicked || mobileHeartClick.count !== 1) {
      throw new Error('Mobile heart button interaction failed');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 19. Duplicate Prevention Test (add -> remove) ---');
    const toggleAgain = await page.evaluate(() => {
      const btn = document.querySelector('.wishlist-heart-btn');
      if (btn) {
        btn.click(); // click again should REMOVE, not duplicate
        return { count: window.ShopifyWishlist.getCount() };
      }
      return { count: -1 };
    });
    console.log('Count after toggling second time (duplicate prevention):', toggleAgain.count);
    if (toggleAgain.count !== 0) {
      throw new Error('Toggling second time did not remove product (duplicate prevention failed)');
    }

    // -------------------------------------------------------------------------
    console.log('\n--- 20. Regression Checks: Search, Filters, Sorting ---');
    // Search
    await page.goto('http://localhost:3000/search?q=watch', { waitUntil: 'networkidle2' });
    const searchCards = await page.evaluate(() => document.querySelectorAll('#shop-product-grid .product-item').length);
    console.log('Regression: Search cards found:', searchCards);
    if (searchCards < 1) throw new Error('Search regression failed');

    // Filter
    await page.goto('http://localhost:3000/shop?category=shoes', { waitUntil: 'networkidle2' });
    const filterCards = await page.evaluate(() => document.querySelectorAll('#shop-product-grid .product-item').length);
    console.log('Regression: Filtered shoes cards found:', filterCards);
    if (filterCards !== 1) throw new Error('Filter regression failed');

    console.log('\n======================================================');
    console.log('ALL STEP 6 WISHLIST TEST FLOWS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    await browser.close();
  }
}

runWishlistTests().catch(err => {
  console.error('STEP 6 WISHLIST TEST ERROR:', err);
  process.exit(1);
});
