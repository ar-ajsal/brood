const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const domainMatch = env.match(/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=(.*)/);
const tokenMatch = env.match(/NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=(.*)/);
const domain = domainMatch[1].trim();
const token = tokenMatch[1].trim();

async function count(q) {
  const res = await fetch('https://' + domain + '/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({
      query: 'query getCount($q: String!) { search(query: $q, types: PRODUCT, first: 0) { totalCount } }',
      variables: { q: q || '' }
    })
  });
  const j = await res.json();
  console.log(`[${q}] => totalCount:`, j.data?.search?.totalCount);
}

async function run() {
  await count('');
  await count('watch');
  await count('sunglasses');
  await count('tag:shoes');
  await count('available_for_sale:true');
  await count('variants.price:<=10000');
  await count('variants.price:>=10000');
}

run().catch(console.error);
