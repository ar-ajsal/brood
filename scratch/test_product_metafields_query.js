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

async function testProductMetafieldsQuery() {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        metafields(identifiers: [
          { namespace: "custom", key: "material" },
          { namespace: "custom", key: "color" },
          { namespace: "custom", key: "upper_material" },
          { namespace: "custom", key: "sole_material" },
          { namespace: "custom", key: "toe_style" },
          { namespace: "custom", key: "fit" },
          { namespace: "custom", key: "frame_color" },
          { namespace: "custom", key: "lens_color" },
          { namespace: "custom", key: "frame_material" },
          { namespace: "custom", key: "lens_material" },
          { namespace: "custom", key: "polarization" },
          { namespace: "custom", key: "movement" },
          { namespace: "custom", key: "case_material" },
          { namespace: "custom", key: "strap_material" },
          { namespace: "custom", key: "dial_color" },
          { namespace: "custom", key: "water_resistance" },
          { namespace: "custom", key: "dimensions" },
          { namespace: "custom", key: "closure" },
          { namespace: "custom", key: "stone_type" },
          { namespace: "shopify", key: "color-pattern" }
        ]) {
          key
          namespace
          value
          type
        }
      }
    }
  `;

  const handles = ['premium-sneakers', 'luxury-sunglasses', 'classic-watch'];
  for (const h of handles) {
    const res = await queryShopify(query, { handle: h });
    console.log(`Product: ${h}`);
    if (res.errors) {
      console.error('Errors:', res.errors);
    } else {
      const nonNull = (res.data?.product?.metafields || []).filter(Boolean);
      console.log(`  Active Metafields (${nonNull.length}):`, nonNull);
    }
  }
}

testProductMetafieldsQuery().catch(console.error);
