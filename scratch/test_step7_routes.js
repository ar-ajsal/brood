const fs = require('fs');
const path = require('path');

async function testStep7() {
  console.log('=== TESTING STEP 7A COLLECTION ARCHITECTURE & ROUTES ===\n');

  const routesToTest = [
    { path: '/collections/shoes', expectedTitle: 'SHOES', expectProducts: true },
    { path: '/collections/sneakers', expectedTitle: 'SNEAKERS', expectProducts: true },
    { path: '/collections/watches', expectedTitle: 'WATCHES', expectProducts: true },
    { path: '/collections/eyewear', expectedTitle: 'EYEWEAR', expectProducts: true },
    { path: '/collections/sunglasses', expectedTitle: 'SUNGLASSES', expectProducts: true },
    { path: '/collections/new-arrivals', expectedTitle: 'NEW ARRIVALS', expectProducts: true },
    { path: '/collections/sale', expectedTitle: 'SALE', expectProducts: false },
    { path: '/collections/bags', expectedTitle: 'BAGS', expectProducts: false },
    { path: '/collections/jewellery', expectedTitle: 'JEWELLERY', expectProducts: false },
    { path: '/collections/accessories', expectedTitle: 'FASHION ACCESSORIES', expectProducts: false },
    { path: '/collections/leather-goods', expectedTitle: 'SMALL LEATHER GOODS', expectProducts: false },
    { path: '/collections/lifestyle', expectedTitle: 'LIFESTYLE ACCESSORIES', expectProducts: false },
    { path: '/collections/unmapped-xyz', expectedTitle: 'COLLECTION NOT FOUND', expectStatus: 404 },
  ];

  let passCount = 0;

  for (const r of routesToTest) {
    const url = `http://localhost:3000${r.path}`;
    try {
      const res = await fetch(url);
      const html = await res.text();
      const status = res.status;

      if (r.expectStatus && status !== r.expectStatus) {
        console.error(`FAIL: ${r.path} expected status ${r.expectStatus}, got ${status}`);
        continue;
      }

      if (!r.expectStatus && status !== 200) {
        console.error(`FAIL: ${r.path} expected status 200, got ${status}`);
        continue;
      }

      if (r.expectedTitle && !html.includes(r.expectedTitle)) {
        console.error(`FAIL: ${r.path} HTML does not contain expected title "${r.expectedTitle}"`);
        continue;
      }

      if (r.expectProducts && !html.includes('product-thumb')) {
        console.error(`FAIL: ${r.path} expected product cards but found none`);
        continue;
      }

      console.log(`PASS: ${r.path} (status: ${status}, title matched: "${r.expectedTitle}")`);
      passCount++;
    } catch (e) {
      console.error(`ERROR querying ${r.path}:`, e.message);
    }
    // Small delay between requests to avoid overloading local dev compilation
    await new Promise(res => setTimeout(res, 200));
  }

  // Regression check: Cart API
  const cartRes = await fetch('http://localhost:3000/api/cart');
  console.log(`Cart API check status: ${cartRes.status} (expected 400 or 404 without cartId)`);

  // Regression check: Products API with category filter
  const filterShoesRes = await fetch('http://localhost:3000/api/products?category=shoes');
  const filterShoesData = await filterShoesRes.json();
  console.log(`Filter shoes count: ${filterShoesData.products?.length} (expected 1: Premium Sneakers)`);

  const filterWatchesRes = await fetch('http://localhost:3000/api/products?category=watches');
  const filterWatchesData = await filterWatchesRes.json();
  console.log(`Filter watches count: ${filterWatchesData.products?.length} (expected 1: Classic Watch)`);

  const filterEyewearRes = await fetch('http://localhost:3000/api/products?category=eyewear');
  const filterEyewearData = await filterEyewearRes.json();
  console.log(`Filter eyewear count: ${filterEyewearData.products?.length} (expected 1: Luxury Sunglasses)`);

  console.log(`\nResults: ${passCount}/${routesToTest.length} route architecture tests passed!`);
}

testStep7().catch(console.error);
