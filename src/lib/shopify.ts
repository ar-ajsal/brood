import { MockProduct, MockImage, MockVariant } from '@/data/mock/products';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  descriptionHtml: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  options: {
    name: string;
    values: string[];
  }[];
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
      };
    }[];
  };
};

async function shopifyFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<{ data: T } | never> {
  try {
    if (!domain || !storefrontAccessToken) {
      throw new Error('Shopify credentials missing in environment variables.');
    }
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', // Disable cache for dev/live updates
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return { data: body.data };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}

function mapShopifyToMockProduct(shopifyProduct: ShopifyProductNode): MockProduct {
  const images: MockImage[] = shopifyProduct.images.edges.map(({ node }) => ({
    src: node.url,
    alt: node.altText || shopifyProduct.title,
    width: node.width,
    height: node.height,
  }));

  const variants: MockVariant[] = shopifyProduct.variants.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    available: node.availableForSale,
    price: parseFloat(node.price.amount),
    compareAtPrice: node.compareAtPrice ? parseFloat(node.compareAtPrice.amount) : undefined,
  }));

  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const compareAtPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
    : undefined;
  
  const currencyCode = shopifyProduct.priceRange.minVariantPrice.currencyCode;

  let badge: 'new' | 'sale' | undefined = undefined;
  if (shopifyProduct.tags.includes('new')) badge = 'new';
  else if (shopifyProduct.tags.includes('sale') || compareAtPrice) badge = 'sale';

  const category = shopifyProduct.productType || 'Apparel';
  const categoryHandle = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Parse details/materials from tags (e.g. "detail:Italian Leather")
  const details = shopifyProduct.tags
    .filter(t => t.startsWith('detail:'))
    .map(t => t.replace('detail:', '').trim());
  const materials = shopifyProduct.tags
    .filter(t => t.startsWith('material:'))
    .map(t => t.replace('material:', '').trim());

  const sizes = shopifyProduct.options.find(o => o.name === 'Size')?.values;
  const colorOptions = shopifyProduct.options.find(o => o.name === 'Color')?.values;
  const colors = colorOptions?.map(c => ({
    name: c,
    hex: c.toLowerCase() === 'black' ? '#111' : '#c0c0c8', // Fallback mapping
    available: true,
  }));

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    vendor: shopifyProduct.vendor,
    category,
    categoryHandle,
    price,
    compareAtPrice,
    currencyCode,
    images,
    variants,
    colors,
    sizes,
    badge,
    availableForSale: shopifyProduct.availableForSale,
    description: shopifyProduct.description,
    details: details.length > 0 ? details : ['Premium construction'],
    materials: materials.length > 0 ? materials : undefined,
    tags: shopifyProduct.tags,
  };
}

const PRODUCT_FRAGMENT = `
  fragment ProductNode on Product {
    id
    handle
    title
    vendor
    productType
    descriptionHtml
    description
    availableForSale
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function getProducts(query = '', first = 24): Promise<MockProduct[]> {
  const shopifyQuery = `
    query getProducts($query: String, $first: Int!) {
      products(first: $first, query: $query, sortKey: UPDATED_AT, reverse: true) {
        edges {
          node {
            ...ProductNode
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `;
  const { data } = await shopifyFetch<any>({ query: shopifyQuery, variables: { query, first } });
  return data.products.edges.map((edge: any) => mapShopifyToMockProduct(edge.node));
}

export async function getProductByHandle(handle: string): Promise<MockProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductNode
      }
    }
    ${PRODUCT_FRAGMENT}
  `;
  const { data } = await shopifyFetch<any>({ query, variables: { handle } });
  return data.product ? mapShopifyToMockProduct(data.product) : null;
}

export async function getProductsByCategory(handle: string): Promise<MockProduct[]> {
  const query = `product_type:${handle}`;
  return getProducts(query);
}

export async function searchProducts(query: string): Promise<MockProduct[]> {
  return getProducts(query);
}

// Minimal mock category extraction since Shopify collections API would require another query
export async function getCategories() {
  const products = await getProducts();
  const cats = new Map();
  products.forEach(p => {
    if (!cats.has(p.categoryHandle)) {
      cats.set(p.categoryHandle, { handle: p.categoryHandle, title: p.category, count: 0 });
    }
    cats.get(p.categoryHandle).count++;
  });
  return Array.from(cats.values());
}

export function formatPrice(amount: number, currencyCode = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

// CART API

export async function createCart() {
  const query = `
    mutation createCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  const { data } = await shopifyFetch<any>({ query });
  return data.cartCreate.cart;
}

export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const { data } = await shopifyFetch<any>({ query, variables: { cartId } });
  return data.cart;
}

export async function addToCartMutation(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `;
  await shopifyFetch<any>({ query, variables: { cartId, lines } });
}

export async function removeFromCartMutation(cartId: string, lineIds: string[]) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
      }
    }
  `;
  await shopifyFetch<any>({ query, variables: { cartId, lineIds } });
}

export async function updateCartLinesMutation(cartId: string, lines: { id: string; quantity: number }[]) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `;
  await shopifyFetch<any>({ query, variables: { cartId, lines } });
}

