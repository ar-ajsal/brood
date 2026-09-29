const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testPage(url) {
  console.log(`\n========================================`);
  console.log(`TESTING PAGE: ${url}`);
  console.log(`========================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text(), location: msg.location() });
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.toString()}`);
  });

  const networkRequests = [];
  page.on('request', req => {
    const reqUrl = req.url();
    if (reqUrl.includes('/api/cart') || reqUrl.includes('checkout') || reqUrl.includes('index.php')) {
      networkRequests.push({ method: req.method(), url: reqUrl, postData: req.postData() });
      console.log(`[NETWORK REQ] ${req.method()} ${reqUrl}`);
      if (req.postData()) console.log(`  Payload:`, req.postData());
    }
  });

  page.on('response', async res => {
    const resUrl = res.url();
    if (resUrl.includes('/api/cart') || resUrl.includes('index.php')) {
      let bodyText = '';
      try { bodyText = await res.text(); } catch (e) {}
      console.log(`[NETWORK RES] ${res.status()} ${resUrl}`);
      console.log(`  Response:`, bodyText.slice(0, 300));
    }
  });

  await page.goto(url, { waitUntil: 'networkidle2' });

  // 1. Inspect DOM
  const domInfo = await page.evaluate(() => {
    const addBtn = document.querySelector('.button-add-to-cart');
    const buyBtn = document.querySelector('.button-buy-now');
    const variantInput = document.querySelector('#selected-variant-id');
    const qtyInput = document.querySelector('#input-quantity');
    return {
      hasShopifyCart: typeof window.ShopifyCart !== 'undefined',
      addBtnFound: !!addBtn,
      addBtnText: addBtn ? addBtn.innerText : null,
      buyBtnFound: !!buyBtn,
      buyBtnText: buyBtn ? buyBtn.innerText : null,
      selectedVariantId: variantInput ? variantInput.value : null,
      quantity: qtyInput ? qtyInput.value : null,
    };
  });
  console.log('DOM Inspection:', domInfo);

  // 2. Click "Add to Cart"
  console.log('\n--- Clicking "Add to Cart" ---');
  await page.evaluate(() => {
    const btn = document.querySelector('.button-add-to-cart');
    if (btn) btn.click();
    else console.log('ERROR: .button-add-to-cart not found');
  });

  await new Promise(r => setTimeout(r, 2000));

  // Check drawer state
  const drawerStateAfterAdd = await page.evaluate(() => {
    const drawer = document.querySelector('#shopify-cart-drawer');
    const overlay = document.querySelector('#shopify-cart-overlay');
    const count = document.querySelector('#cart-drawer-count');
    const items = document.querySelector('#shopify-cart-items');
    return {
      drawerTransform: drawer ? drawer.style.transform : null,
      overlayOpacity: overlay ? overlay.style.opacity : null,
      countText: count ? count.innerText : null,
      itemsCount: items ? items.children.length : 0,
      localStorageCartId: localStorage.getItem('shopify_cart_id')
    };
  });
  console.log('Drawer State After Add to Cart:', drawerStateAfterAdd);

  // 3. Click "Buy Now"
  console.log('\n--- Clicking "Buy Now" ---');
  await page.evaluate(() => {
    const btn = document.querySelector('.button-buy-now');
    if (btn) btn.click();
    else console.log('ERROR: .button-buy-now not found');
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('Final Page URL:', page.url());

  await browser.close();
}

async function run() {
  await testPage('http://localhost:3000/products/luxury-sunglasses');
  await testPage('http://localhost:3000/products/classic-watch');
}

run().catch(console.error);
