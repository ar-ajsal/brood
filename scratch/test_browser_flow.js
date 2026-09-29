const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTests() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore external third-party CORS / font errors from the static CDN clone
      if (!text.includes('thehoshi.to') && !text.includes('cdn.tailwindcss.com')) {
        consoleErrors.push(text);
      }
      console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${text.slice(0, 150)}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.toString()}`);
    consoleErrors.push(err.toString());
  });

  console.log('\n======================================================');
  console.log('TEST 1: /products/luxury-sunglasses -> ADD TO CART');
  console.log('======================================================');
  await page.goto('http://localhost:3000/products/luxury-sunglasses', { waitUntil: 'networkidle2' });

  // Clear any existing cart in localStorage to start clean
  await page.evaluate(() => localStorage.removeItem('shopify_cart_id'));

  const initialDom = await page.evaluate(() => {
    const addBtn = document.querySelector('.button-add-to-cart');
    const buyBtn = document.querySelector('.button-buy-now');
    const vInput = document.querySelector('#selected-variant-id');
    return {
      hasShopifyCart: typeof window.ShopifyCart !== 'undefined',
      addBtn: !!addBtn,
      buyBtn: !!buyBtn,
      variantId: vInput ? vInput.value : null
    };
  });
  console.log('Initial DOM:', initialDom);

  // Click Add to Cart and wait for POST /api/cart response
  console.log('Clicking "Add to Cart"...');
  const cartResponsePromise = page.waitForResponse(
    res => res.url().includes('/api/cart') && res.request().method() === 'POST',
    { timeout: 15000 }
  );

  await page.evaluate(() => {
    document.querySelector('.button-add-to-cart').click();
  });

  const cartRes = await cartResponsePromise;
  const cartData = await cartRes.json();
  console.log('Cart API Response Status:', cartRes.status());
  console.log('Cart ID:', cartData?.cart?.id);
  console.log('Total Quantity:', cartData?.cart?.totalQuantity);
  console.log('Item count in cart:', cartData?.cart?.lines?.edges?.length);

  // Allow drawer transition
  await new Promise(r => setTimeout(r, 600));

  const drawerState = await page.evaluate(() => {
    const drawer = document.getElementById('shopify-cart-drawer');
    const overlay = document.getElementById('shopify-cart-overlay');
    const drawerCount = document.getElementById('cart-drawer-count')?.textContent;
    const headerCount = document.querySelector('.cart-count-badge')?.textContent;
    const itemRows = document.querySelectorAll('.shopify-cart-item-row');
    const firstItemTitle = itemRows[0]?.querySelector('a[href*="/products/"]')?.textContent;
    const firstItemQty = itemRows[0]?.querySelector('span')?.textContent;
    return {
      drawerOpen: drawer?.style?.transform === 'translateX(0px)' || drawer?.style?.transform === 'translateX(0)',
      overlayVisible: overlay?.style?.opacity === '1',
      drawerCount,
      headerCount,
      itemRowCount: itemRows.length,
      firstItemTitle,
      firstItemQty,
      localStorageCartId: localStorage.getItem('shopify_cart_id')
    };
  });
  console.log('Drawer State:', drawerState);

  console.log('\n======================================================');
  console.log('TEST 2: QUANTITY UPDATE IN CART DRAWER (+)');
  console.log('======================================================');
  const updateResPromise = page.waitForResponse(
    res => res.url().includes('/api/cart') && res.request().method() === 'POST',
    { timeout: 15000 }
  );

  await page.evaluate(() => {
    const plusBtn = document.querySelector('.shopify-cart-qty-btn[data-action="increase"]');
    if (plusBtn) plusBtn.click();
    else console.error('Plus button not found in drawer');
  });

  const updateRes = await updateResPromise;
  const updateData = await updateRes.json();
  console.log('Update Cart API Response Status:', updateRes.status());
  console.log('Total Quantity after increase:', updateData?.cart?.totalQuantity);

  await new Promise(r => setTimeout(r, 500));

  const qtyAfterIncrease = await page.evaluate(() => {
    return document.querySelector('.shopify-cart-item-row span')?.textContent;
  });
  console.log('Rendered Qty after increase:', qtyAfterIncrease);

  console.log('\n======================================================');
  console.log('TEST 3: CART PERSISTENCE ON PAGE REFRESH');
  console.log('======================================================');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const refreshedState = await page.evaluate(() => {
    const drawerCount = document.getElementById('cart-drawer-count')?.textContent;
    const headerCount = document.querySelector('.cart-count-badge')?.textContent;
    return {
      cartIdInStorage: localStorage.getItem('shopify_cart_id'),
      drawerCount,
      headerCount
    };
  });
  console.log('State after reload:', refreshedState);

  console.log('\n======================================================');
  console.log('TEST 4: /products/classic-watch -> BUY NOW');
  console.log('======================================================');
  await page.goto('http://localhost:3000/products/classic-watch', { waitUntil: 'networkidle2' });

  console.log('Clicking "Buy Now"...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(e => console.log('Navigation event:', e.message)),
    page.evaluate(() => {
      document.querySelector('.button-buy-now').click();
    })
  ]);

  const finalUrl = page.url();
  console.log('Final URL after Buy Now:', finalUrl);
  const redirectedToCheckout = finalUrl.includes('shopify.com') || finalUrl.includes('checkout');
  console.log('Redirected to Shopify checkout:', redirectedToCheckout);

  console.log('\n======================================================');
  console.log('TEST 5: VARIANT SELECTION & OUT OF STOCK TEST');
  console.log('======================================================');
  await page.goto('http://localhost:3000/products/premium-sneakers', { waitUntil: 'networkidle2' });

  const variantTest = await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('.luxury-variant-radio'));
    const initialVariantId = document.querySelector('#selected-variant-id')?.value;
    const initialBtnDisabled = document.querySelector('.button-add-to-cart')?.disabled;
    const initialBtnText = document.querySelector('.button-add-to-cart')?.innerText;

    // Switch to another variant if available
    let switched = false;
    let newVariantId = null;
    if (radios.length > 1) {
      radios[1].checked = true;
      radios[1].dispatchEvent(new Event('change', { bubbles: true }));
      switched = true;
      newVariantId = document.querySelector('#selected-variant-id')?.value;
    }

    return {
      radioCount: radios.length,
      initialVariantId,
      initialBtnDisabled,
      initialBtnText,
      switched,
      newVariantId,
      afterSwitchDisabled: document.querySelector('.button-add-to-cart')?.disabled
    };
  });
  console.log('Variant Test Result:', variantTest);

  console.log('\n======================================================');
  console.log('ALL TESTS COMPLETED');
  console.log('Console Errors caught:', consoleErrors.length);
  console.log('======================================================');

  await browser.close();
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
