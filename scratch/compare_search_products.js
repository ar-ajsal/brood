const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const domain = env.match(/NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=(.*)/)[1].trim();
const token = env.match(/NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=(.*)/)[1].trim();

async function run() {
  for (const q of ['watch', 'title:*watch*', 'sunglasses', 'title:*sunglasses*', 'tag:watch']) {
    const res = await fetch('https://' + domain + '/api/2024-01/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({
        query: `
          query($q: String!) {
            search(query: $q, types: PRODUCT, first: 5) {
              totalCount
              edges { node { ... on Product { title } } }
            }
            products(first: 5, query: $q) {
              edges { node { title } }
            }
          }
        `,
        variables: { q }
      })
    }).then(r => r.json());

    const sTitles = res.data?.search?.edges?.map(e => e.node.title) || [];
    const pTitles = res.data?.products?.edges?.map(e => e.node.title) || [];
    console.log(`Query "${q}":\n  Search (count=${res.data?.search?.totalCount}): ${sTitles.join(', ')}\n  Products: ${pTitles.join(', ')}`);
  }
}

run();
