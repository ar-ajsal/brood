const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const domain = env.match(/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=(.*)/)[1].trim();
const token = env.match(/NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=(.*)/)[1].trim();

function buildShopifyFilterQuery(filters) {
  const parts = [];
  if (filters.q && filters.q.trim()) {
    parts.push(filters.q.trim());
  }
  const categoryMap = {
    shoes: 'Footwear',
    footwear: 'Footwear',
    sneakers: 'Footwear',
    boots: 'Footwear',
    watches: 'Watches',
    watch: 'Watches',
    timepieces: 'Watches',
    eyewear: 'Eyewear',
    sunglasses: 'Eyewear',
    glasses: 'Eyewear',
    bags: 'Bags',
    bag: 'Bags',
    jewellery: 'Jewellery',
    jewelry: 'Jewellery',
    accessories: 'Accessories'
  };
  const rawCat = (filters.category || '').toLowerCase().trim();
  if (rawCat) {
    const productType = categoryMap[rawCat] || filters.category.trim();
    parts.push(`product_type:${productType.includes(' ') ? `"${productType}"` : productType}`);
  }
  if (filters.availability === 'in_stock' || filters.availability === 'true' || filters.availability === '1') {
    parts.push('available_for_sale:true');
  }
  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
    const min = parseFloat(String(filters.minPrice));
    if (!isNaN(min)) parts.push(`variants.price:>=${min}`);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
    const max = parseFloat(String(filters.maxPrice));
    if (!isNaN(max)) parts.push(`variants.price:<=${max}`);
  }
  if (filters.vendor && filters.vendor.trim()) {
    const v = filters.vendor.trim();
    parts.push(`vendor:${v.includes(' ') ? `"${v}"` : v}`);
  }
  if (filters.size && filters.size.trim()) {
    parts.push(filters.size.trim());
  }
  if (filters.color && filters.color.trim()) {
    parts.push(filters.color.trim());
  }
  if (filters.tag && filters.tag.trim()) {
    const t = filters.tag.trim();
    parts.push(`tag:${t.includes(' ') ? `"${t}"` : t}`);
  }
  return parts.join(' ');
}

async function testFilter(label, filters) {
  const queryStr = buildShopifyFilterQuery(filters);
  const res = await fetch('https://' + domain + '/api/2024-01/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({
      query: `
        query($q: String, $queryStr: String!) {
          products(first: 10, query: $q) {
            edges {
              node {
                title
                productType
                vendor
                priceRange { minVariantPrice { amount } }
              }
            }
          }
          search(query: $queryStr, types: PRODUCT, first: 0) {
            totalCount
          }
        }
      `,
      variables: { q: queryStr || null, queryStr: queryStr || "" }
    })
  }).then(r => r.json());

  const items = res.data?.products?.edges?.map(e => e.node.title) || [];
  const count = res.data?.search?.totalCount;
  console.log(`${label} [query="${queryStr}"] => (${items.length} items, totalCount=${count}): ${items.join(', ') || 'NONE'}`);
}

async function run() {
  await testFilter('1. All Products', {});
  await testFilter('2. Search "watch"', { q: 'watch' });
  await testFilter('3. Search "sunglasses"', { q: 'sunglasses' });
  await testFilter('4. Filter shoes', { category: 'shoes' });
  await testFilter('5. Filter watches', { category: 'watches' });
  await testFilter('6. Filter eyewear', { category: 'eyewear' });
  await testFilter('7. Filter size 42', { size: '42' });
  await testFilter('8. Filter shoes + size 40', { category: 'shoes', size: '40' });
  await testFilter('9. Filter price 5000-8000', { minPrice: 5000, maxPrice: 8000 });
  await testFilter('10. Filter vendor brood', { vendor: 'brood' });
  await testFilter('11. Filter vendor My Store', { vendor: 'My Store' });
  await testFilter('12. In stock only', { availability: 'in_stock' });
  await testFilter('13. Empty search result', { q: 'nonexistent999' });
}

run().catch(console.error);
