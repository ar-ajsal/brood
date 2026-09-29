const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/shop');
  
  await page.evaluate(() => {
    window.ShopifyWishlist.add({ handle: 'luxury-sunglasses', id: 'gid://shopify/Product/15396059119769' });
  });

  await page.reload({ waitUntil: 'networkidle2' });

  const res = await page.evaluate(() => {
    const btn = document.querySelector('.wishlist-heart-btn[data-handle="luxury-sunglasses"]');
    return {
      hasBtn: !!btn,
      classes: btn ? btn.className : null,
      has: window.ShopifyWishlist ? window.ShopifyWishlist.has('luxury-sunglasses') : false,
      items: window.ShopifyWishlist ? window.ShopifyWishlist.getItems() : []
    };
  });

  console.log('RELOAD EVAL:', res);
  await browser.close();
})();
