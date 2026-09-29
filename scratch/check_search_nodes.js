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
        query {
          search(query: "watch", types: PRODUCT, first: 10) {
            totalCount
            edges {
              node {
                ... on Product {
                  title
                }
              }
            }
          }
        }
      `
    })
  }).then(r => r.json());

  console.log('Search results for watch:', JSON.stringify(res.data?.search, null, 2));
}

run();
