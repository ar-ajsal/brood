const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  // Set localStorage
  await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('shopify_wishlist', JSON.stringify([{ id: 'gid://shopify/Product/123', handle: 'classic-watch' }]));
  });

  await page.goto('http://localhost:3000/wishlist', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.wishlist-add-to-cart-btn', { timeout: 5000 });

  const btnDetails = await page.evaluate(() => {
    const btn = document.querySelector('.wishlist-add-to-cart-btn');
    return {
      exists: !!btn,
      variantId: btn ? btn.getAttribute('data-variant-id') : null,
      outerHTML: btn ? btn.outerHTML : null,
      hasShopifyCart: !!window.ShopifyCart
    };
  });
  console.log('Button details:', btnDetails);

  // Click the button
  console.log('Clicking button...');
  const res = await page.evaluate(async () => {
    const btn = document.querySelector('.wishlist-add-to-cart-btn');
    btn.click();
    await new Promise(r => setTimeout(r, 2000));
    return {
      currentCart: window.ShopifyCart ? window.ShopifyCart.currentCart : null,
      cartId: window.ShopifyCart ? window.ShopifyCart.getCartId() : null
    };
  });
  console.log('Result after click:', JSON.stringify(res, null, 2));

  await browser.close();
}

test().catch(console.error);
