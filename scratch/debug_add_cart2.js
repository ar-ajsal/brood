const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const tempDir = path.join(os.tmpdir(), 'pup_debug_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Intercept cart requests
  page.on('response', async res => {
    if (res.url().includes('/api/cart') && res.request().method() === 'POST') {
      console.log('>>> Cart POST response status:', res.status());
      try {
        const txt = await res.text();
        console.log('>>> Cart POST response body:', txt.slice(0, 300));
      } catch(e) {
        console.log('>>> Could not read cart response body:', e.message);
      }
    }
  });
  
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warn' || msg.text().includes('cart') || msg.text().includes('Cart')) {
      console.log(`PAGE ${type.toUpperCase()}:`, msg.text());
    }
  });
  
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  // Set localStorage with wishlist item
  await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('shopify_wishlist', JSON.stringify([{ id: 'gid://shopify/Product/9901399269593', handle: 'classic-watch' }]));
  });

  // Reload to trigger wishlist load
  await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const state = await page.evaluate(() => {
    const btn = document.querySelector('.wishlist-add-to-cart-btn');
    const cartDrawer = document.getElementById('shopify-cart-drawer');
    return {
      hasBtn: !!btn,
      variantId: btn ? btn.getAttribute('data-variant-id') : null,
      hasShopifyCart: !!window.ShopifyCart,
      hasCartDrawer: !!cartDrawer,
      currentCart: window.ShopifyCart ? window.ShopifyCart.currentCart : null,
      cartId: window.ShopifyCart ? window.ShopifyCart.getCartId() : null
    };
  });
  console.log('Pre-click state:', JSON.stringify(state, null, 2));

  // Click button
  await page.click('.wishlist-add-to-cart-btn');
  console.log('Button clicked, waiting 8s...');
  await new Promise(r => setTimeout(r, 8000));
  
  const postState = await page.evaluate(() => {
    return {
      currentCart: window.ShopifyCart ? window.ShopifyCart.currentCart : null,
      drawerOpen: (() => {
        const d = document.getElementById('shopify-cart-drawer');
        return d ? d.style.transform : 'no drawer';
      })()
    };
  });
  console.log('Post-click state:', JSON.stringify(postState, null, 2));

  await browser.close();
}

test().catch(console.error);
