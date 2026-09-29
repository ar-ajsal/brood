const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const domainMatch = env.match(/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=(.*)/);
const tokenMatch = env.match(/NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=(.*)/);
const domain = domainMatch[1].trim();
const token = tokenMatch[1].trim();

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

async function testSyntax(label, q) {
  const res = await runQuery(`
    query($q: String) {
      products(first: 10, query: $q) {
        edges {
          node {
            title
            productType
            availableForSale
            priceRange { minVariantPrice { amount } }
          }
        }
      }
    }
  `, { q: q || null });
  const items = res.data?.products?.edges?.map(e => `${e.node.title} (₹${e.node.priceRange.minVariantPrice.amount})`) || [];
  console.log(`${label} -> [${q}] => ${items.length} items: ${items.join(', ')}`);
}

async function run() {
  await testSyntax('Search watch + price <= 10000 (should be 0)', 'watch variants.price:<=10000');
  await testSyntax('Search watch + price >= 10000 (should be 1)', 'watch variants.price:>=10000');
  await testSyntax('Footwear + In stock', 'product_type:Footwear available_for_sale:true');
  await testSyntax('Footwear + Size 40', 'product_type:Footwear 40');
  await testSyntax('Eyewear + In stock', 'product_type:Eyewear available_for_sale:true');
  await testSyntax('Watches + In stock', 'product_type:Watches available_for_sale:true');
}

run().catch(console.error);
