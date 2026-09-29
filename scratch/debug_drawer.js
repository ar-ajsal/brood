const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testDrawer() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    const btn = document.getElementById('shop-filter-toggle-btn');
    const drawer = document.getElementById('shopify-filter-drawer');
    const overlay = document.getElementById('shopify-filter-overlay');
    const applyBtn = document.getElementById('shopify-filter-apply-btn');
    return {
      hasBtn: !!btn,
      hasDrawer: !!drawer,
      hasOverlay: !!overlay,
      hasApplyBtn: !!applyBtn,
      btnRect: btn ? btn.getBoundingClientRect() : null,
      drawerLeft: drawer ? window.getComputedStyle(drawer).left : null
    };
  });
  console.log('DOM Info:', info);

  // Click using evaluate or page.click
  console.log('Dispatching click on shop-filter-toggle-btn...');
  await page.evaluate(() => {
    document.getElementById('shop-filter-toggle-btn').click();
  });
  await new Promise(r => setTimeout(r, 500));

  const afterClick = await page.evaluate(() => {
    const drawer = document.getElementById('shopify-filter-drawer');
    const overlay = document.getElementById('shopify-filter-overlay');
    return {
      drawerLeft: drawer ? drawer.style.left : null,
      drawerComputedLeft: drawer ? window.getComputedStyle(drawer).left : null,
      overlayDisplay: overlay ? overlay.style.display : null
    };
  });
  console.log('After Click:', afterClick);

  await browser.close();
}

testDrawer().catch(console.error);
