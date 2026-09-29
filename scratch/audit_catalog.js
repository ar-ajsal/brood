const fs = require('fs');
const path = require('path');

// Read .env.local
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

async function runAudit() {
  console.log('=== SHOPIFY CATALOG AUDIT ===\n');

  // 1. Audit Collections
  const collectionsQuery = `
    query {
      collections(first: 50) {
        edges {
          node {
            id
            handle
            title
            description
            products(first: 20) {
              edges {
                node {
                  handle
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const collectionsRes = await queryShopify(collectionsQuery);
  console.log('--- COLLECTIONS ---');
  if (collectionsRes.data?.collections?.edges) {
    collectionsRes.data.collections.edges.forEach(e => {
      const c = e.node;
      console.log(`[Collection] Handle: "${c.handle}" | Title: "${c.title}" | Products (${c.products.edges.length}):`);
      c.products.edges.forEach(p => console.log(`   - Product: ${p.node.title} (${p.node.handle})`));
    });
  } else {
    console.log('No collections found or error:', collectionsRes);
  }

  // 2. Audit Products
  const productsQuery = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            vendor
            productType
            tags
            availableForSale
            totalInventory
            options {
              name
              values
            }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price { amount currencyCode }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            collections(first: 10) {
              edges {
                node {
                  handle
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const productsRes = await queryShopify(productsQuery);
  console.log('\n--- PRODUCTS ---');
  if (productsRes.data?.products?.edges) {
    productsRes.data.products.edges.forEach((e, idx) => {
      const p = e.node;
      console.log(`\n#${idx + 1}: ${p.title} (handle: ${p.handle})`);
      console.log(`  ID: ${p.id}`);
      console.log(`  Vendor: "${p.vendor}"`);
      console.log(`  Product Type: "${p.productType}"`);
      console.log(`  Tags: ${JSON.stringify(p.tags)}`);
      console.log(`  Available for sale: ${p.availableForSale} | Total Inventory: ${p.totalInventory}`);
      console.log(`  Collections: ${p.collections.edges.map(c => c.node.handle).join(', ')}`);
      console.log(`  Options: ${JSON.stringify(p.options)}`);
      console.log(`  Variants (${p.variants.edges.length}):`);
      p.variants.edges.forEach(v => {
        const vn = v.node;
        console.log(`    - Variant: "${vn.title}" | Price: ${vn.price.amount} ${vn.price.currencyCode} | Available: ${vn.availableForSale} (Qty: ${vn.quantityAvailable}) | Options: ${JSON.stringify(vn.selectedOptions)}`);
      });
    });
  } else {
    console.log('No products found or error:', productsRes);
  }
}

runAudit().catch(console.error);
