const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const domain = env.match(/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=(.*)/)[1].trim();
const token = env.match(/NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=(.*)/)[1].trim();

async function runQuery(query, variables) {
  const res = await fetch('https://' + domain + '/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return res.json();
}

async function testCounts() {
  const queries = [
    '',
    'watch',
    'sunglasses',
    'product_type:Footwear',
    'available_for_sale:true',
    'variants.price:>=10000',
    'vendor:brood',
    'vendor:"My Store"',
    'nonexistentterm123'
  ];

  for (const q of queries) {
    const res = await runQuery(`
      query($query: String!) {
        search(query: $query, types: PRODUCT, first: 0) {
          totalCount
        }
      }
    `, { query: q });
    console.log(`Query "${q}" => totalCount:`, res.data?.search?.totalCount);
  }
}

testCounts().catch(console.error);
