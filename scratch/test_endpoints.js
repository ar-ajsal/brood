async function testEndpoint(url) {
  try {
    const res = await fetch('http://localhost:3000' + url);
    const text = await res.text();
    console.log(`\n=== ${url} [Status: ${res.status}] ===`);

    if (url.startsWith('/api/')) {
      try {
        const json = JSON.parse(text);
        console.log('JSON count:', json.products ? json.products.length : 0);
        console.log('Titles:', json.products ? json.products.map(p => p.title).join(', ') : 'none');
      } catch {
        console.log('API returned non-JSON:', text.slice(0, 200));
      }
      return;
    }

    // Inspect HTML
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    const countMatch = text.match(/<span id="shop-product-count">(.*?)<\/span>/);
    const headingMatch = text.match(/<h3 class="home-featured-main-title">(.*?)<\/h3>/);
    const hasFilterBtn = text.includes('id="shop-filter-toggle-btn"');
    const hasFilterDrawer = text.includes('id="shopify-filter-drawer"');
    const hasActiveChips = text.includes('class="active-filter-chips-bar"');
    const hasEmptyState = text.includes('class="shop-empty-search-state"');
    const productCards = (text.match(/class="[^"]*product-item[^"]*"/g) || []).length;

    console.log('Title:', titleMatch ? titleMatch[1] : 'none');
    console.log('Heading:', headingMatch ? headingMatch[1] : 'none');
    console.log('Count:', countMatch ? countMatch[1] : 'none');
    console.log('Products rendered:', productCards);
    console.log('Has Filter Btn:', hasFilterBtn, '| Has Drawer:', hasFilterDrawer, '| Has Chips:', hasActiveChips, '| Has Empty State:', hasEmptyState);
  } catch (err) {
    console.error(`Failed ${url}:`, err.message);
  }
}

async function run() {
  await testEndpoint('/shop');
  await testEndpoint('/search?q=watch');
  await testEndpoint('/search?q=sunglasses');
  await testEndpoint('/search?q=nonexistentxyz');
  await testEndpoint('/shop?category=shoes');
  await testEndpoint('/shop?category=shoes&size=40');
  await testEndpoint('/shop?availability=in_stock');
  await testEndpoint('/shop?min_price=5000&max_price=8000');
  await testEndpoint('/shop?vendor=brood');
  await testEndpoint('/shop?vendor=My%20Store');
  await testEndpoint('/collections/shoes?size=40');
  await testEndpoint('/api/products?q=watch');
  await testEndpoint('/api/products?category=shoes&size=42');
}

run();
