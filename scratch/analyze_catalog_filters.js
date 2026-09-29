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
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                productType
                vendor
                tags
                options {
                  name
                  values
                }
                variants(first: 20) {
                  edges {
                    node {
                      title
                      availableForSale
                      price { amount }
                      selectedOptions { name value }
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  }).then(r => r.json());

  console.log('Catalog analysis:');
  const prods = res.data?.products?.edges?.map(e => e.node) || [];
  prods.forEach(p => {
    console.log(`- ${p.title} (${p.handle}):`);
    console.log(`  type: ${p.productType}`);
    console.log(`  vendor: ${p.vendor}`);
    console.log(`  tags: ${JSON.stringify(p.tags)}`);
    console.log(`  options: ${JSON.stringify(p.options)}`);
  });
}

run();
