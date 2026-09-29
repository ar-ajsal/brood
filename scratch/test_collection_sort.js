const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const domain = env.match(/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=(.*)/)[1].trim();
const token = env.match(/NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=(.*)/)[1].trim();

async function run() {
  const res = await fetch('https://' + domain + '/api/2024-01/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({
      query: `
        query($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
          collection(handle: $handle) {
            title
            products(first: 10, sortKey: $sortKey, reverse: $reverse) {
              edges {
                node {
                  title
                  priceRange { minVariantPrice { amount } }
                }
              }
            }
          }
        }
      `,
      variables: { handle: "frontpage", sortKey: "PRICE", reverse: true }
    })
  }).then(r => r.json());

  console.log('Collection query with sort:', JSON.stringify(res, null, 2));
}

run();
