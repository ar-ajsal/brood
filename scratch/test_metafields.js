const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    value = value.trim().replace(/^['"](.*)['"]$/, '$1');
    env[match[1]] = value;
  }
});

const domain = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN;

async function queryShopify(query, variables = {}) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function testMetafields() {
  const query = `
    query {
      products(first: 3) {
        edges {
          node {
            handle
            title
            metafields(identifiers: [
              { namespace: "custom", key: "color" },
              { namespace: "custom", key: "material" },
              { namespace: "custom", key: "size" },
              { namespace: "custom", key: "movement" },
              { namespace: "custom", key: "strap_material" },
              { namespace: "custom", key: "case_material" },
              { namespace: "custom", key: "lens_color" },
              { namespace: "custom", key: "frame_material" },
              { namespace: "shopify", key: "color-pattern" }
            ]) {
              key
              namespace
              value
              type
            }
          }
        }
      }
    }
  `;
  const res = await queryShopify(query);
  console.log(JSON.stringify(res, null, 2));
}

testMetafields().catch(console.error);
