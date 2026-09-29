export interface ShopifyImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice?: ShopifyPrice | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  } | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  options: ShopifyOption[];
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  metafields?: Array<ShopifyMetafield | null>;
}

export interface ShopifyMetafield {
  key: string;
  namespace: string;
  value: string;
  type: string;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  image?: ShopifyImage | null;
  products: {
    pageInfo?: ShopifyPageInfo;
    edges: Array<{
      cursor?: string;
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyPrice;
  };
  merchandise: {
    id: string;
    title: string;
    price: ShopifyPrice;
    compareAtPrice?: ShopifyPrice | null;
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: ShopifyImage;
        }>;
      };
    };
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    image?: ShopifyImage | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
}


export type ShopifySortKey =
  | 'TITLE'
  | 'PRODUCT_TYPE'
  | 'VENDOR'
  | 'CREATED_AT'
  | 'BEST_SELLING'
  | 'PRICE'
  | 'ID'
  | 'RELEVANCE';

export interface SortOptionConfig {
  value: string;
  label: string;
  sortKey: ShopifySortKey;
  reverse: boolean;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'featured', label: 'Featured', sortKey: 'BEST_SELLING', reverse: false },
  { value: 'newest', label: 'Newest Arrivals', sortKey: 'CREATED_AT', reverse: true },
  { value: 'price-asc', label: 'Price: Low to High', sortKey: 'PRICE', reverse: false },
  { value: 'price-desc', label: 'Price: High to Low', sortKey: 'PRICE', reverse: true },
  { value: 'title-asc', label: 'Title: A-Z', sortKey: 'TITLE', reverse: false },
  { value: 'title-desc', label: 'Title: Z-A', sortKey: 'TITLE', reverse: true },
];

export function parseSortParam(sortParam?: string | null): {
  activeSort: string;
  sortKey: ShopifySortKey;
  reverse: boolean;
} {
  const match = SORT_OPTIONS.find((opt) => opt.value === sortParam);
  if (match) {
    return { activeSort: match.value, sortKey: match.sortKey, reverse: match.reverse };
  }
  return { activeSort: 'featured', sortKey: 'BEST_SELLING', reverse: false };
}

export interface PlannedCollectionConfig {
  handle: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'active' | 'upcoming';
}

export const CATALOG_COLLECTION_REGISTRY: Record<string, PlannedCollectionConfig> = {
  men: {
    handle: 'men',
    title: "Men's Collection",
    subtitle: 'Precision-crafted footwear, horology, and refined essentials tailored for men.',
    category: 'Men',
    status: 'active',
  },
  women: {
    handle: 'women',
    title: "Women's Collection",
    subtitle: 'Contemporary luxury footwear, designer eyewear, and elegant accessories for women.',
    category: 'Women',
    status: 'active',
  },
  shoes: {
    handle: 'shoes',
    title: 'Shoes',
    subtitle: 'Handcrafted luxury footwear designed for timeless elegance.',
    category: 'Footwear',
    status: 'active',
  },
  sneakers: {
    handle: 'sneakers',
    title: 'Sneakers',
    subtitle: 'Contemporary luxury sneakers blending high fashion and daily comfort.',
    category: 'Footwear',
    status: 'active',
  },
  watches: {
    handle: 'watches',
    title: 'Watches',
    subtitle: 'Precision-engineered luxury timepieces and horological craftsmanship.',
    category: 'Watches',
    status: 'active',
  },
  eyewear: {
    handle: 'eyewear',
    title: 'Eyewear',
    subtitle: 'Designer sunglasses and optical frames with UV protection.',
    category: 'Eyewear',
    status: 'active',
  },
  sunglasses: {
    handle: 'sunglasses',
    title: 'Sunglasses',
    subtitle: 'Curated luxury sunglasses with superior UV protection.',
    category: 'Eyewear',
    status: 'active',
  },
  bags: {
    handle: 'bags',
    title: 'Bags',
    subtitle: 'Exclusive designer handbags, totes, and leather bags.',
    category: 'Bags',
    status: 'upcoming',
  },
  jewellery: {
    handle: 'jewellery',
    title: 'Jewellery',
    subtitle: 'Refined precious jewellery and statement accessories.',
    category: 'Jewellery',
    status: 'upcoming',
  },
  accessories: {
    handle: 'accessories',
    title: 'Fashion Accessories',
    subtitle: 'Curated luxury fashion accessories to complement your wardrobe.',
    category: 'Accessories',
    status: 'upcoming',
  },
  'leather-goods': {
    handle: 'leather-goods',
    title: 'Small Leather Goods',
    subtitle: 'Artisanal leather wallets, cardholders, and fine accessories.',
    category: 'Leather Goods',
    status: 'upcoming',
  },
  lifestyle: {
    handle: 'lifestyle',
    title: 'Lifestyle Accessories',
    subtitle: 'Distinctive luxury lifestyle pieces and design objects.',
    category: 'Lifestyle',
    status: 'upcoming',
  },
  'new-arrivals': {
    handle: 'new-arrivals',
    title: 'New Arrivals',
    subtitle: 'Discover the latest luxury pieces freshly added to our collection.',
    category: 'All',
    status: 'active',
  },
  sale: {
    handle: 'sale',
    title: 'Sale',
    subtitle: 'Limited-time privileges on select authentic luxury pieces.',
    category: 'All',
    status: 'active',
  },
};

export interface CategorySpecAttribute {
  name: string;
  metafieldNamespace: string;
  metafieldKey: string;
  description: string;
}

export const CATEGORY_FACTUAL_ATTRIBUTES: Record<string, CategorySpecAttribute[]> = {
  Footwear: [
    { name: 'Size', metafieldNamespace: 'custom', metafieldKey: 'size', description: 'Standard sizing' },
    { name: 'Color', metafieldNamespace: 'custom', metafieldKey: 'color', description: 'Primary and secondary colorway' },
    { name: 'Material', metafieldNamespace: 'custom', metafieldKey: 'material', description: 'General composition' },
    { name: 'Upper Material', metafieldNamespace: 'custom', metafieldKey: 'upper_material', description: 'Upper construction material' },
    { name: 'Sole Material', metafieldNamespace: 'custom', metafieldKey: 'sole_material', description: 'Outsole/midsole material' },
    { name: 'Toe Style', metafieldNamespace: 'custom', metafieldKey: 'toe_style', description: 'Toe profile' },
    { name: 'Fit', metafieldNamespace: 'custom', metafieldKey: 'fit', description: 'Fit profile' },
  ],
  Eyewear: [
    { name: 'Frame Color', metafieldNamespace: 'custom', metafieldKey: 'frame_color', description: 'Frame finish and color' },
    { name: 'Lens Color', metafieldNamespace: 'custom', metafieldKey: 'lens_color', description: 'Lens tint and color' },
    { name: 'Frame Material', metafieldNamespace: 'custom', metafieldKey: 'frame_material', description: 'Acetate, titanium, metal' },
    { name: 'Lens Material', metafieldNamespace: 'custom', metafieldKey: 'lens_material', description: 'Glass, polycarbonate, CR-39' },
    { name: 'Polarization', metafieldNamespace: 'custom', metafieldKey: 'polarization', description: 'Polarized lens technology' },
  ],
  Watches: [
    { name: 'Movement', metafieldNamespace: 'custom', metafieldKey: 'movement', description: 'Automatic, quartz, manual wind' },
    { name: 'Case Material', metafieldNamespace: 'custom', metafieldKey: 'case_material', description: 'Stainless steel, ceramic, titanium' },
    { name: 'Strap Material', metafieldNamespace: 'custom', metafieldKey: 'strap_material', description: 'Leather, stainless steel, rubber' },
    { name: 'Dial Color', metafieldNamespace: 'custom', metafieldKey: 'dial_color', description: 'Dial face color and finish' },
    { name: 'Water Resistance', metafieldNamespace: 'custom', metafieldKey: 'water_resistance', description: 'Depth rating (e.g. 50m / 5ATM)' },
  ],
  Bags: [
    { name: 'Material', metafieldNamespace: 'custom', metafieldKey: 'material', description: 'Calfskin, canvas, nylon' },
    { name: 'Color', metafieldNamespace: 'custom', metafieldKey: 'color', description: 'Color finish' },
    { name: 'Dimensions', metafieldNamespace: 'custom', metafieldKey: 'dimensions', description: 'Height, width, depth' },
    { name: 'Closure', metafieldNamespace: 'custom', metafieldKey: 'closure', description: 'Zipper, magnetic snap, clasp' },
  ],
  Jewellery: [
    { name: 'Material', metafieldNamespace: 'custom', metafieldKey: 'material', description: '18k Gold, Sterling Silver, Platinum' },
    { name: 'Color', metafieldNamespace: 'custom', metafieldKey: 'color', description: 'Metal color tone' },
    { name: 'Stone Type', metafieldNamespace: 'custom', metafieldKey: 'stone_type', description: 'Diamond, gemstone, cubic zirconia' },
  ],
};

export function renderSortOptions(activeSort = 'featured'): string {
  return SORT_OPTIONS.map(
    (opt) =>
      `<option value="${opt.value}" ${opt.value === activeSort ? 'selected="selected"' : ''}>${escapeHtml(opt.label)}</option>`
  ).join('\n');
}

export function formatPrice(amount: string | number, currencyCode = 'INR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currencyCode} 0.00`;

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return `${currencyCode} ${num.toFixed(2)}`;
  }
}

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ status: number; body?: T; errors?: any[] }> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error('Shopify credentials (domain or token) are not configured in environment.');
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const endpoint = `https://${cleanDomain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // Always fresh data on refresh
  });

  const body = await response.json();

  if (!response.ok || body.errors) {
    return {
      status: response.status,
      body,
      errors: body.errors || [{ message: `HTTP Error ${response.status}: ${response.statusText}` }],
    };
  }

  return {
    status: response.status,
    body,
  };
}

export const PRODUCTS_QUERY = `
  query getProducts(
    $first: Int!
    $after: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          handle
          description
          descriptionHtml
          vendor
          productType
          tags
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          options {
            id
            name
            values
          }
          variants(first: 20) {
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
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const TOTAL_COUNT_QUERY = `
  query getTotalProductCount($query: String!) {
    search(query: $query, types: PRODUCT, first: 0) {
      totalCount
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 20) {
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
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
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

export const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `
  query getCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            tags
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            options {
              id
              name
              values
            }
            variants(first: 20) {
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
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
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

export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              product {
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query getCart($id: ID!) {
    cart(id: $id) {
      ...CartFragment
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export interface GetProductsParams {
  first?: number;
  after?: string | null;
  sortKey?: ShopifySortKey;
  reverse?: boolean;
  query?: string | null;
}

export async function getProducts(
  paramsOrFirst: number | GetProductsParams = 20
): Promise<{
  products: ShopifyProduct[];
  pageInfo: ShopifyPageInfo;
  totalCount: number;
  error?: string;
}> {
  let first = 20;
  let after: string | null | undefined = null;
  let sortKey: ShopifySortKey | undefined = undefined;
  let reverse = false;
  let query: string | null | undefined = null;

  if (typeof paramsOrFirst === 'number') {
    first = paramsOrFirst;
  } else {
    first = paramsOrFirst.first ?? 20;
    after = paramsOrFirst.after;
    sortKey = paramsOrFirst.sortKey;
    reverse = paramsOrFirst.reverse ?? false;
    query = paramsOrFirst.query;
  }

  try {
    const res = await shopifyFetch<any>({
      query: PRODUCTS_QUERY,
      variables: { first, after, sortKey, reverse, query: query || null },
    });

    if (res.errors && res.errors.length > 0) {
      return {
        products: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
        error: res.errors[0]?.message || 'Shopify API returned an error.',
      };
    }

    const data = res.body?.data?.products;
    const edges = data?.edges || [];
    const products: ShopifyProduct[] = edges.map((e: any) => e.node);
    const pageInfo: ShopifyPageInfo = data?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return {
      products,
      pageInfo,
      totalCount: products.length,
    };
  } catch (err: any) {
    return {
      products: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
      error: err.message || 'Failed to connect to Shopify Storefront API.',
    };
  }
}

export async function getTotalProductCount(query = ""): Promise<number> {
  try {
    const res = await shopifyFetch<any>({
      query: TOTAL_COUNT_QUERY,
      variables: { query: query || "" },
    });
    if (typeof res.body?.data?.search?.totalCount === 'number') {
      return res.body.data.search.totalCount;
    }
    // Fallback if search totalCount is unavailable
    const fallbackRes = await shopifyFetch<any>({
      query: `
        query getFallbackProductCount($q: String) {
          products(first: 250, query: $q) {
            edges {
              cursor
            }
          }
        }
      `,
      variables: { q: query || null },
    });
    return fallbackRes.body?.data?.products?.edges?.length || 0;
  } catch {
    return 0;
  }
}

export async function getProductByHandle(handle: string): Promise<{ product: ShopifyProduct | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    });

    if (res.errors && res.errors.length > 0) {
      return { product: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const product: ShopifyProduct | null = res.body?.data?.product || null;
    return { product };
  } catch (err: any) {
    return { product: null, error: err.message || 'Failed to connect to Shopify Storefront API.' };
  }
}

export async function getCollections(first = 20): Promise<{ collections: ShopifyCollection[]; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: COLLECTIONS_QUERY,
      variables: { first },
    });

    if (res.errors && res.errors.length > 0) {
      return { collections: [], error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const edges = res.body?.data?.collections?.edges || [];
    const collections: ShopifyCollection[] = edges.map((e: any) => e.node);
    return { collections };
  } catch (err: any) {
    return { collections: [], error: err.message || 'Failed to connect to Shopify Storefront API.' };
  }
}

export async function getCollectionByHandle(
  handle: string,
  first = 50
): Promise<{ collection: ShopifyCollection | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: COLLECTION_BY_HANDLE_QUERY,
      variables: { handle, first },
    });

    if (res.errors && res.errors.length > 0) {
      return { collection: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const collection: ShopifyCollection | null = res.body?.data?.collection || null;
    return { collection };
  } catch (err: any) {
    return { collection: null, error: err.message || 'Failed to connect to Shopify Storefront API.' };
  }
}

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<{ cart: ShopifyCart | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: CREATE_CART_MUTATION,
      variables: { input: { lines } },
    });

    const userErrors = res.body?.data?.cartCreate?.userErrors || [];
    if (userErrors.length > 0) {
      return { cart: null, error: userErrors[0]?.message || 'Failed to create cart.' };
    }

    if (res.errors && res.errors.length > 0) {
      return { cart: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const cart = res.body?.data?.cartCreate?.cart || null;
    return { cart };
  } catch (err: any) {
    return { cart: null, error: err.message || 'Failed to create cart.' };
  }
}

export async function getCart(cartId: string): Promise<{ cart: ShopifyCart | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: GET_CART_QUERY,
      variables: { id: cartId },
    });

    if (res.errors && res.errors.length > 0) {
      return { cart: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const cart = res.body?.data?.cart || null;
    return { cart };
  } catch (err: any) {
    return { cart: null, error: err.message || 'Failed to retrieve cart.' };
  }
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ cart: ShopifyCart | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: ADD_TO_CART_MUTATION,
      variables: { cartId, lines },
    });

    const userErrors = res.body?.data?.cartLinesAdd?.userErrors || [];
    if (userErrors.length > 0) {
      return { cart: null, error: userErrors[0]?.message || 'Failed to add item to cart.' };
    }

    if (res.errors && res.errors.length > 0) {
      return { cart: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const cart = res.body?.data?.cartLinesAdd?.cart || null;
    return { cart };
  } catch (err: any) {
    return { cart: null, error: err.message || 'Failed to add item to cart.' };
  }
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<{ cart: ShopifyCart | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: UPDATE_CART_MUTATION,
      variables: { cartId, lines },
    });

    const userErrors = res.body?.data?.cartLinesUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      return { cart: null, error: userErrors[0]?.message || 'Failed to update cart.' };
    }

    if (res.errors && res.errors.length > 0) {
      return { cart: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const cart = res.body?.data?.cartLinesUpdate?.cart || null;
    return { cart };
  } catch (err: any) {
    return { cart: null, error: err.message || 'Failed to update cart.' };
  }
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<{ cart: ShopifyCart | null; error?: string }> {
  try {
    const res = await shopifyFetch<any>({
      query: REMOVE_FROM_CART_MUTATION,
      variables: { cartId, lineIds },
    });

    const userErrors = res.body?.data?.cartLinesRemove?.userErrors || [];
    if (userErrors.length > 0) {
      return { cart: null, error: userErrors[0]?.message || 'Failed to remove item from cart.' };
    }

    if (res.errors && res.errors.length > 0) {
      return { cart: null, error: res.errors[0]?.message || 'Shopify API error.' };
    }

    const cart = res.body?.data?.cartLinesRemove?.cart || null;
    return { cart };
  } catch (err: any) {
    return { cart: null, error: err.message || 'Failed to remove item from cart.' };
  }
}

/**
 * Render single product card for homepage grid using EXACT template markup.
 */
export function renderTemplateProductCard(product: ShopifyProduct): string {
  const minPrice = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const formattedPrice = formatPrice(minPrice.amount, minPrice.currencyCode);
  const formattedComparePrice =
    comparePrice && parseFloat(comparePrice.amount) > parseFloat(minPrice.amount)
      ? formatPrice(comparePrice.amount, comparePrice.currencyCode)
      : null;

  let discountBadge = '';
  if (comparePrice && parseFloat(comparePrice.amount) > parseFloat(minPrice.amount)) {
    const cur = parseFloat(minPrice.amount);
    const orig = parseFloat(comparePrice.amount);
    const pct = Math.round(((orig - cur) / orig) * 100);
    discountBadge = `<span class="home-low-price-default-discount">-${pct}%</span>`;
  }

  const primaryImage =
    product.images.edges[0]?.node?.url ||
    'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';

  const productLink = `/products/${product.handle}`;

  return `
    <div class="product-layout col-lg-3 col-md-3 col-sm-6 col-md-6 home-low-price-default-item">
      ${discountBadge}
      <div class="product-thumb group flex flex-col h-full bg-surface-light dark:bg-surface-dark transition-all duration-300">
        <div class="image relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-sm mb-1.5">
          <a href="${productLink}" class="block w-full h-full">
            <img src="${primaryImage}"
                 alt="${escapeHtml(product.title)}"
                 title="${escapeHtml(product.title)}"
                 loading="lazy"
                 decoding="async"
                 class="w-full h-full object-cover bg-white transition-transform duration-700 group-hover:scale-105" />
          </a>
          <button type="button" 
                  class="wishlist-heart-btn" 
                  data-wishlist-btn 
                  data-handle="${escapeHtml(product.handle)}" 
                  data-product-id="${escapeHtml(product.id)}" 
                  title="Add to Wishlist" 
                  aria-label="Add to Wishlist" 
                  style="position:absolute;top:8px;right:8px;z-index:20;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.92);backdrop-filter:blur(4px);border:1px solid rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);box-shadow:0 2px 5px rgba(0,0,0,0.08);color:#222;">
            <svg class="heart-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;transition:all 0.2s ease;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <div class="hidden md:block absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 dark:bg-black/80 backdrop-blur-sm py-2">
            <div class="button-group product-button-wrapper" style="display:flex;align-items:center;justify-content:center;gap:6px;">
              <a href="${productLink}" class="btn cart" style="display:inline-flex;align-items:center;justify-content:center;" title="View Details">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </a>
              <button type="button" class="btn add-wishlist wishlist-heart-btn" data-wishlist-btn data-handle="${escapeHtml(product.handle)}" data-product-id="${escapeHtml(product.id)}" style="display:inline-flex;align-items:center;justify-content:center;cursor:pointer;" title="Add to Wishlist">
                <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="caption text-center flex flex-col px-0.5">
          <div class="name-container h-[26px] mb-0.5 overflow-hidden">
            <h4 class="m-0 p-0">
              <a class="product-name font-bold text-[10px] md:text-sm text-gray-800 dark:text-gray-300 uppercase tracking-[0.05em] leading-[1.3] hover:text-primary transition-colors line-clamp-2 block" 
                 href="${productLink}" 
                 title="${escapeHtml(product.title)}">
                ${escapeHtml(product.title)}
              </a>
            </h4>
          </div>

          <div class="price-wrapper mt-0.5">
            <div class="price">
              <div class="price-left">
                <div>
                  <span class="price-new">${formattedPrice}</span>
                  ${formattedComparePrice ? `<span class="price-old">${formattedComparePrice}</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render single Prestige Allure-inspired product card for shop, collection, search, and PDP recommendations.
 * Grid responsive breakdown:
 * - Desktop: 4 columns (col-md-3, col-lg-3)
 * - Tablet: 3 columns (col-sm-4)
 * - Mobile: 2 columns (col-xs-6)
 */
export function renderShopProductCard(product: ShopifyProduct): string {
  const minPrice = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const formattedPrice = formatPrice(minPrice.amount, minPrice.currencyCode);
  const hasCompare = !!(comparePrice && parseFloat(comparePrice.amount) > parseFloat(minPrice.amount));
  const formattedComparePrice = hasCompare
    ? formatPrice(comparePrice!.amount, comparePrice!.currencyCode)
    : null;

  const isSoldOut = !product.availableForSale;
  const isNew = Array.isArray(product.tags) && product.tags.some((t) => {
    const lt = t.trim().toLowerCase();
    return lt === 'new' || lt === 'new arrival' || lt === 'new-arrival';
  });

  let badgeHtml = '';
  if (isSoldOut) {
    badgeHtml = `<span class="prestige-card-badge badge--soldout prestige-badge-soldout" aria-label="Sold out">Sold Out</span>`;
  } else if (hasCompare) {
    const cur = parseFloat(minPrice.amount);
    const orig = parseFloat(comparePrice!.amount);
    const pct = Math.round(((orig - cur) / orig) * 100);
    badgeHtml = `<span class="prestige-card-badge badge--sale prestige-badge-sale" aria-label="On sale: -${pct}%">${pct > 0 ? `-${pct}%` : 'Sale'}</span>`;
  } else if (isNew) {
    badgeHtml = `<span class="prestige-card-badge badge--new prestige-badge-new" aria-label="New arrival">New</span>`;
  }

  const primaryImage =
    product.images?.edges?.[0]?.node?.url ||
    'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';
  
  let secondaryImage = product.images?.edges?.[1]?.node?.url || null;
  if (!secondaryImage && product.variants?.edges) {
    const altVar = product.variants.edges.find((e) => e.node?.image?.url && e.node.image.url !== primaryImage);
    if (altVar?.node?.image?.url) {
      secondaryImage = altVar.node.image.url;
    }
  }

  const productLink = `/products/${product.handle}`;

  const variants = product.variants?.edges?.map((e) => e.node) || [];
  const realOptions = (product.options || []).filter(
    (o) => o.name !== 'Title' || (o.values.length > 1 || o.values[0] !== 'Default Title')
  );
  const isSingleVariant = variants.length <= 1 || realOptions.length === 0;
  const defaultVariant = variants.find((v) => v.availableForSale) || variants[0];
  const defaultVariantId = defaultVariant ? defaultVariant.id : '';

  // Real Color Swatches
  const colorOption = (product.options || []).find(
    (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
  );
  let swatchesHtml = '';
  if (colorOption && colorOption.values && colorOption.values.length > 0) {
    const COLOR_HEX_MAP: Record<string, string> = {
      black: '#111111',
      white: '#fcfcfc',
      grey: '#888888',
      gray: '#888888',
      navy: '#0f1c3f',
      blue: '#1e3a8a',
      brown: '#6e473b',
      tan: '#d2b48c',
      beige: '#f5f5dc',
      gold: '#d4af37',
      silver: '#c0c0c0',
      green: '#1b4332',
      red: '#b91c1c',
      yellow: '#eab308',
      orange: '#ea580c',
      pink: '#f472b6',
    };

    const maxVisible = 5;
    const visibleValues = colorOption.values.slice(0, maxVisible);
    const extraCount = colorOption.values.length - maxVisible;

    const dots = visibleValues
      .map((val) => {
        const hex = COLOR_HEX_MAP[val.toLowerCase().trim()] || val.toLowerCase().trim();
        return `<span class="prestige-card-swatch" style="background-color: ${hex};" title="${escapeHtml(val)}" aria-label="${escapeHtml(val)}"></span>`;
      })
      .join('');
    const extraPill = extraCount > 0 ? `<span class="prestige-card-swatch-more">+${extraCount}</span>` : '';
    swatchesHtml = `<div class="prestige-card-swatches" aria-label="Color options">${dots}${extraPill}</div>`;
  }

  // Quick Add UI:
  // If product is sold out: no quick add button.
  // If single variant: plus button directly triggers addItem(variantId).
  // If multi-variant: plus button toggles compact drawer with option pills (e.g. shoe sizes).
  let quickAddHtml = '';
  if (!isSoldOut) {
    if (isSingleVariant) {
      quickAddHtml = `
        <button type="button" 
                class="prestige-quick-add-btn" 
                data-quick-add-single 
                data-variant-id="${escapeHtml(defaultVariantId)}" 
                data-handle="${escapeHtml(product.handle)}" 
                title="Quick Add to Bag" 
                aria-label="Quick Add to Bag">
          <svg class="plus-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      `;
    } else {
      const optionName = realOptions[0]?.name || 'Size';
      quickAddHtml = `
        <button type="button" 
                class="prestige-quick-add-btn" 
                data-quick-add-toggle 
                data-handle="${escapeHtml(product.handle)}" 
                title="Select ${escapeHtml(optionName)}" 
                aria-label="Select ${escapeHtml(optionName)}">
          <svg class="plus-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <div class="prestige-quick-variants-drawer" id="quick-variants-${escapeHtml(product.handle)}">
          <div class="prestige-quick-variants-header">
            <span class="prestige-quick-variants-title">Select ${escapeHtml(optionName)}</span>
            <button type="button" class="prestige-quick-variants-close" data-quick-variants-close aria-label="Close variant selector">&times;</button>
          </div>
          <div class="prestige-quick-variants-pills">
            ${variants
              .map((v) => {
                const optVal = v.selectedOptions?.[0]?.value || v.title;
                if (!v.availableForSale) {
                  return `<button type="button" class="prestige-variant-pill disabled" disabled title="Out of stock">${escapeHtml(optVal)}</button>`;
                }
                return `<button type="button" class="prestige-variant-pill" data-quick-add-variant="${escapeHtml(v.id)}" data-handle="${escapeHtml(product.handle)}" title="Add ${escapeHtml(optVal)} to cart">${escapeHtml(optVal)}</button>`;
              })
              .join('\n')}
          </div>
        </div>
      `;
    }
  }

  return `
    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product-item prestige-card-col" data-handle="${escapeHtml(product.handle)}">
      <div class="product-thumb prestige-product-card group" data-handle="${escapeHtml(product.handle)}" data-product-id="${escapeHtml(product.id)}">
        <div class="image prestige-card-media">
          ${badgeHtml}
          
          <button type="button" 
                  class="prestige-wishlist-btn wishlist-heart-btn" 
                  data-wishlist-btn 
                  data-handle="${escapeHtml(product.handle)}" 
                  data-product-id="${escapeHtml(product.id)}" 
                  title="Add to Wishlist" 
                  aria-label="Add to Wishlist">
            <svg class="heart-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <a href="${productLink}" class="prestige-card-image-link" aria-label="${escapeHtml(product.title)}">
            <img src="${primaryImage}" 
                 alt="${escapeHtml(product.title)}" 
                 title="${escapeHtml(product.title)}" 
                 loading="lazy" 
                 decoding="async" 
                 class="prestige-card-img prestige-primary-img ${secondaryImage ? 'has-secondary' : ''}" />
            ${
              secondaryImage
                ? `
            <img src="${secondaryImage}" 
                 alt="${escapeHtml(product.title)}" 
                 title="${escapeHtml(product.title)}" 
                 loading="lazy" 
                 decoding="async" 
                 class="prestige-card-img prestige-secondary-img" />
            `
                : ''
            }
          </a>

          ${quickAddHtml}
        </div>

        <div class="caption prestige-card-info">
          <div class="prestige-card-vendor">${escapeHtml(product.vendor || product.productType || 'BROOD')}</div>
          <h3 class="name prestige-card-title m-0 p-0">
            <a class="product-name font-bold text-[11px] md:text-sm text-gray-800 dark:text-gray-300 uppercase tracking-[0.05em] leading-[1.3] line-clamp-2 block" href="${productLink}" title="${escapeHtml(product.title)}">
              ${escapeHtml(product.title)}
            </a>
          </h3>
          <div class="price price-wrapper prestige-card-price-row mt-1">
            <span class="price-new prestige-price-current font-bold">${formattedPrice}</span>
            ${formattedComparePrice ? `<span class="price-old prestige-price-compare text-xs text-gray-400 line-through ml-2">${formattedComparePrice}</span>` : ''}
          </div>
          ${swatchesHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render carousel item using the template's swiper-slide format.
 */
export function renderTemplateCarouselItem(product: ShopifyProduct): string {
  const minPrice = product.priceRange.minVariantPrice;
  const formattedPrice = formatPrice(minPrice.amount, minPrice.currencyCode);
  const primaryImage =
    product.images.edges[0]?.node?.url ||
    'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';
  const productLink = `/products/${product.handle}`;

  return `
    <div class="product-layout swiper-slide">
      <div class="product-thumb">
        <div class="image" style="position:relative;">
          <a href="${productLink}">
            <img src="${primaryImage}" alt="${escapeHtml(product.title)}" title="${escapeHtml(product.title)}" class="img-responsive" />
          </a>
          <button type="button" 
                  class="wishlist-heart-btn" 
                  data-wishlist-btn 
                  data-handle="${escapeHtml(product.handle)}" 
                  data-product-id="${escapeHtml(product.id)}" 
                  title="Add to Wishlist" 
                  aria-label="Add to Wishlist" 
                  style="position:absolute;top:8px;right:8px;z-index:20;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.92);backdrop-filter:blur(4px);border:1px solid rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:all 0.2s;box-shadow:0 2px 5px rgba(0,0,0,0.08);color:#222;">
            <svg class="heart-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="caption">
          <h4 class="name"><a href="${productLink}">${escapeHtml(product.title)}</a></h4>
          <p class="price"><span class="price-new">${formattedPrice}</span></p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Pagination / Load More UI.
 */
export function renderPaginationUi(
  pageInfo: ShopifyPageInfo,
  currentCount: number,
  totalCount: number
): string {
  if (pageInfo.hasNextPage && pageInfo.endCursor) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
        <button id="shop-load-more-btn" data-cursor="${escapeHtml(pageInfo.endCursor)}" class="btn" style="display: inline-flex; align-items: center; justify-content: center; padding: 12px 32px; background: #111; color: #fff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 3px; cursor: pointer; border: none; transition: background 0.2s;">
          <span>Load More Products</span>
          <svg class="w-4 h-4 ml-2 animate-spin hidden" id="shop-load-more-spinner" fill="none" viewBox="0 0 24 24" style="width: 14px; height: 14px; margin-left: 8px; display: none;">
            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </button>
        <p style="font-size: 11px; color: #888; margin: 4px 0 0;">
          Showing <span id="shop-shown-count">${currentCount}</span> of <span id="shop-total-count">${totalCount}</span> products
        </p>
      </div>
    `;
  }

  return `
    <p class="text-xs text-gray-400 py-3 uppercase tracking-wider font-semibold" style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin: 0;">
      You've reached the end of the catalog (${totalCount} ${totalCount === 1 ? 'product' : 'products'})
    </p>
  `;
}

/**
 * Render Product Skeleton Cards for loading state.
 */
export function renderProductSkeletonCards(count = 4): string {
  return Array.from({ length: count })
    .map(
      () => `
      <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product-item animate-pulse" style="padding: 6px;">
        <div style="aspect-ratio: 1/1; background: #f0f0f0; border-radius: 2px; margin-bottom: 8px;"></div>
        <div style="height: 12px; background: #f0f0f0; border-radius: 2px; margin-bottom: 6px; width: 75%; margin-left: auto; margin-right: auto;"></div>
        <div style="height: 12px; background: #f0f0f0; border-radius: 2px; width: 45%; margin-left: auto; margin-right: auto;"></div>
      </div>
    `
    )
    .join('\n');
}

/**
 * Render Collection Page HTML dynamically into the existing shop template.
 */
export function renderCollectionHtml(
  templateHtml: string,
  collection: ShopifyCollection,
  allCollections?: ShopifyCollection[],
  activeSort = 'featured',
  filters: ShopFilterParams = {}
): string {
  let html = templateHtml;

  // 1. Page title & SEO
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(collection.title)} - TheHoshi</title>`);
  const metaDesc = collection.description || `Shop authentic ${collection.title} collection from TheHoshi.`;
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${escapeHtml(metaDesc)}" />`
  );

  // 2. Heading and Subtitle
  html = html.replace('<!-- PLP_HEADING -->', escapeHtml(collection.title.toUpperCase()));
  html = html.replace(
    '<!-- PLP_SUBTITLE -->',
    escapeHtml(collection.description || `Explore our exclusive ${collection.title} collection.`)
  );

  // Filter products in collection according to active filters (e.g. size, price, availability, vendor)
  let products = collection.products?.edges?.map((e) => e.node) || [];

  if (filters.availability === 'in_stock') {
    products = products.filter((p) => p.availableForSale);
  }
  if (filters.minPrice) {
    const min = parseFloat(String(filters.minPrice));
    if (!isNaN(min)) {
      products = products.filter((p) => parseFloat(p.priceRange.minVariantPrice.amount) >= min);
    }
  }
  if (filters.maxPrice) {
    const max = parseFloat(String(filters.maxPrice));
    if (!isNaN(max)) {
      products = products.filter((p) => parseFloat(p.priceRange.minVariantPrice.amount) <= max);
    }
  }
  if (filters.vendor) {
    const v = filters.vendor.toLowerCase();
    products = products.filter((p) => p.vendor?.toLowerCase() === v);
  }
  if (filters.size) {
    products = products.filter((p) =>
      p.variants.edges.some((v) =>
        v.node.selectedOptions.some((so) => so.value === filters.size)
      )
    );
  }

  // 3. Product Count & Sort Options
  const activeCount = getActiveFilterCount(filters);
  const countLabel = `${products.length} ${products.length === 1 ? 'Product' : 'Products'}`;
  html = html.replace('<!-- PRODUCT_COUNT -->', countLabel);
  html = html.replace('<!-- SORT_OPTIONS -->', renderSortOptions(activeSort));
  html = html.replace('<!-- FILTER_BUTTON -->', renderFilterButton(activeCount));
  html = html.replace(
    '<!-- ACTIVE_FILTERS -->',
    renderActiveFilterChips(filters, activeSort, `/collections/${collection.handle}`)
  );

  // 4. Products in Collection
  if (products.length === 0) {
    html = html.replace(
      '<!-- SHOPIFY_SHOP_PRODUCTS -->',
      renderEmptyState(`No products currently match your selection in ${collection.title}.`)
    );
    html = html.replace('<!-- SHOPIFY_PAGINATION -->', '');
  } else {
    const cards = products.map((p) => renderShopProductCard(p)).join('\n');
    html = html.replace('<!-- SHOPIFY_SHOP_PRODUCTS -->', cards);

    const pageInfo = collection.products?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
    };
    html = html.replace(
      '<!-- SHOPIFY_PAGINATION -->',
      renderPaginationUi(pageInfo, products.length, products.length)
    );
  }

  // 5. Update Drawer Menu items if allCollections provided
  if (allCollections && allCollections.length > 0) {
    const menuItems = [
      `<div class="border-b border-gray-100"><a href="/shop" class="block text-gray-700" style="padding: 10px 16px; font-size: 14px; font-weight: 600;">All Products</a></div>`,
      ...allCollections
        .filter((c) => c.handle !== 'frontpage')
        .map(
          (c) => `
        <div class="border-b border-gray-100">
          <a href="/collections/${c.handle}" class="block text-gray-700 ${c.handle === collection.handle ? 'font-bold text-primary' : ''}" style="padding: 10px 16px; font-size: 14px;">${escapeHtml(c.title)}</a>
        </div>
      `
        ),
    ].join('\n');

    html = html.replace(
      /(<div class="flex-1 overflow-y-auto py-2" id="hoshi-menu-tree">)[\s\S]*?(<\/aside>)/i,
      `$1\n${menuItems}\n    </div>\n</div>\n$2`
    );
  }

  html = html.replace(
    '</body>',
    `${renderFilterDrawerHtml(filters)}\n${renderCartDrawerHtml()}\n</body>`
  );

  return html;
}

/**
 * Render entire Product Detail HTML dynamically with Prestige Allure visual style.
 */
export function renderProductDetailHtml(
  templateHtml: string,
  product: ShopifyProduct,
  relatedProducts: ShopifyProduct[] = []
): string {
  const minPrice = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const formattedPrice = formatPrice(minPrice.amount, minPrice.currencyCode);
  const hasCompare = !!(comparePrice && parseFloat(comparePrice.amount) > parseFloat(minPrice.amount));
  const formattedComparePrice = hasCompare
    ? formatPrice(comparePrice!.amount, comparePrice!.currencyCode)
    : null;

  const discountPct = hasCompare
    ? Math.round(
        ((parseFloat(comparePrice!.amount) - parseFloat(minPrice.amount)) /
          parseFloat(comparePrice!.amount)) *
          100
      )
    : 0;

  let html = templateHtml;

  // 1. Page title & SEO
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(product.title)} - BROOD</title>`);
  const metaDesc = product.description || `Discover authentic ${product.title} from Brood. Premium craftsmanship and express worldwide delivery.`;
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${escapeHtml(metaDesc)}" />`
  );

  // 2. Images & Gallery
  const rawImages = product.images.edges;
  const images =
    rawImages.length > 0
      ? rawImages
      : [
          {
            node: {
              url: 'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg',
              altText: product.title,
            },
          },
        ];

  // 3. Variants & Options
  const variants = product.variants.edges.map((e) => e.node);
  const defaultVariant = variants.find((v) => v.availableForSale) || variants[0];
  const realOptions = (product.options || []).filter(
    (o) => o.name !== 'Title' || (o.values.length > 1 || o.values[0] !== 'Default Title')
  );

  let optionsHtml = '';
  if (realOptions.length > 0) {
    optionsHtml = realOptions
      .map((opt) => {
        const defaultVal =
          defaultVariant?.selectedOptions?.find((so) => so.name === opt.name)?.value ||
          opt.values[0];
        return `
        <div class="prestige-opt-group">
          <div class="prestige-opt-label">
            <span>${escapeHtml(opt.name)}</span>
            <span class="prestige-selected-val" id="selected-val-${escapeHtml(opt.name)}" style="font-weight:700;color:#111;">${escapeHtml(defaultVal)}</span>
          </div>
          <div class="prestige-opt-pills">
            ${opt.values
              .map((val) => {
                const isChecked = val === defaultVal;
                const hasStock = variants.some(
                  (v) =>
                    v.selectedOptions?.some((so) => so.name === opt.name && so.value === val) &&
                    v.availableForSale
                );
                return `
                <label class="prestige-opt-item luxury-option-item">
                  <input type="radio" 
                         class="luxury-variant-radio ${isChecked ? 'active' : ''}" 
                         name="option[${escapeHtml(opt.name)}]" 
                         data-option-name="${escapeHtml(opt.name)}" 
                         value="${escapeHtml(val)}" 
                         ${isChecked ? 'checked="checked"' : ''}
                         ${!hasStock ? 'disabled' : ''} />
                  <span class="prestige-opt-btn option-btn-content ${!hasStock ? 'disabled' : ''}">${escapeHtml(val)}</span>
                </label>
              `;
              })
              .join('\n')}
          </div>
        </div>
      `;
      })
      .join('\n');
  }

  // 4. Description Content
  const descriptionContent =
    product.descriptionHtml && product.descriptionHtml.trim().length > 0
      ? product.descriptionHtml
      : product.description
      ? `<p style="line-height:1.7;color:#444;">${escapeHtml(product.description)}</p>`
      : `<p style="color:#888;">Crafted with superior materials and uncompromising precision. Brood brings you authentic luxury design.</p>`;

  const isShoe =
    product.productType?.toLowerCase().includes('shoe') ||
    product.productType?.toLowerCase().includes('sneaker') ||
    product.tags?.some((t) => t.toLowerCase().includes('shoes') || t.toLowerCase().includes('footwear'));

  const metafields = (product.metafields || []).filter(
    (m): m is ShopifyMetafield => !!(m && m.value && m.value.trim().length > 0)
  );
  const metafieldRows = metafields
    .map((m) => {
      const label = m.key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(m.value)}</td></tr>`;
    })
    .join('\n');
  const sku = defaultVariant?.id ? defaultVariant.id.split('/').pop() || '' : '';

  // 5. Build Complete Prestige Allure PDP Markup
  const pdpMarkup = `
    <div class="prestige-pdp-container" data-current-handle="${escapeHtml(product.handle)}">
      <!-- Breadcrumb Navigation -->
      <nav class="prestige-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span class="bc-sep">/</span>
        <a href="/shop">Shop</a>
        ${
          product.productType
            ? `<span class="bc-sep">/</span><a href="/collections/${product.productType
                .toLowerCase()
                .replace(/\s+/g, '-')}">${escapeHtml(product.productType)}</a>`
            : ''
        }
        <span class="bc-sep">/</span>
        <span class="bc-current">${escapeHtml(product.title)}</span>
      </nav>

      <!-- Main Editorial 2-Column Layout -->
      <div class="prestige-pdp-layout">
        <!-- Left: Product Media Gallery -->
        <div class="prestige-gallery-col">
          <!-- Desktop Sticky Media Gallery -->
          <div class="prestige-gallery-sticky prestige-desktop-gallery">
            <div class="prestige-main-viewport" id="pdp-main-viewport">
              ${images
                .map(
                  (edge, idx) => `
                <div class="prestige-main-slide ${idx === 0 ? 'is-active' : ''}" data-slide-idx="${idx}">
                  <div class="prestige-zoom-wrap" data-img-src="${escapeHtml(edge.node.url)}">
                    <img src="${escapeHtml(edge.node.url)}" 
                         alt="${escapeHtml(edge.node.altText || product.title)}" 
                         loading="${idx === 0 ? 'eager' : 'lazy'}" 
                         decoding="async" 
                         class="prestige-pdp-main-img" />
                  </div>
                </div>
              `
                )
                .join('\n')}

              <button type="button" class="prestige-zoom-trigger" id="pdp-zoom-btn" title="View Fullscreen" aria-label="View Fullscreen">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>

            ${
              images.length > 1
                ? `
            <div class="prestige-thumbs-strip" id="pdp-thumbs-strip">
              ${images
                .map(
                  (edge, idx) => `
                <button type="button" 
                        class="prestige-thumb-item ${idx === 0 ? 'is-active' : ''}" 
                        data-thumb-target="${idx}" 
                        aria-label="View image ${idx + 1}">
                  <img src="${escapeHtml(edge.node.url)}" alt="Thumbnail ${idx + 1}" loading="lazy" />
                </button>
              `
                )
                .join('\n')}
            </div>
            `
                : ''
            }
          </div>

          <!-- Mobile Stacked Media Gallery (Touch-friendly 4:5 stacked media) -->
          <div class="prestige-mobile-gallery-stacked" id="pdp-mobile-stacked">
            ${images
              .map(
                (edge, idx) => `
              <div class="prestige-mobile-media-item" data-media-idx="${idx}" data-img-src="${escapeHtml(edge.node.url)}" role="button" tabindex="0" aria-label="View image ${idx + 1} fullscreen">
                <img src="${escapeHtml(edge.node.url)}" 
                     alt="${escapeHtml(edge.node.altText || product.title)}" 
                     loading="${idx === 0 ? 'eager' : 'lazy'}" 
                     decoding="async" 
                     class="prestige-pdp-mobile-img" />
                <span class="prestige-mobile-zoom-pill" aria-label="Tap to view fullscreen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                </span>
              </div>
            `
              )
              .join('\n')}
          </div>
        </div>

        <!-- Right: Sticky Product Info -->
        <div class="prestige-info-col">
          <div class="prestige-info-sticky">
            <div class="prestige-info-meta">
              <span class="prestige-vendor-tag">${escapeHtml(product.vendor || 'BROOD')}</span>
              <span class="prestige-stock-badge ${product.availableForSale ? 'in-stock' : 'out-of-stock'}">
                <span class="stock-dot"></span>
                ${product.availableForSale ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 class="product-name prestige-product-title">${escapeHtml(product.title)}</h1>

            <div class="prestige-price-box">
              <span class="prestige-current-price" id="pdp-price">${formattedPrice}</span>
              ${formattedComparePrice ? `<span class="prestige-compare-price">${formattedComparePrice}</span>` : ''}
              ${hasCompare ? `<span class="prestige-discount-pill">-${discountPct}%</span>` : ''}
            </div>

            <!-- Variants Section -->
            <div class="prestige-variants-section" id="pdp-variants-wrapper">
              <input type="hidden" name="variant_id" id="selected-variant-id" value="${defaultVariant ? defaultVariant.id : ''}" />
              <script id="shopify-variants-data" type="application/json">${JSON.stringify(variants)}</script>
              ${optionsHtml}
            </div>

            <!-- Quantity Stepper -->
            <div class="prestige-qty-section">
              <span class="prestige-qty-heading">Quantity</span>
              <div class="prestige-qty-controls">
                <button type="button" class="prestige-qty-btn" id="pdp-qty-down" aria-label="Decrease quantity">−</button>
                <input type="text" id="input-quantity" name="quantity" class="prestige-qty-field" value="1" readonly />
                <button type="button" class="prestige-qty-btn" id="pdp-qty-up" aria-label="Increase quantity">+</button>
              </div>
            </div>

            <!-- Action Buttons Stack -->
            <div class="prestige-actions-stack">
              <button type="button" 
                      class="prestige-btn-primary button-add-to-cart" 
                      id="pdp-add-to-cart" 
                      data-action="add-to-cart"
                      ${!product.availableForSale ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                <span>${product.availableForSale ? 'Add to Bag' : 'Out of Stock'}</span>
              </button>

              <button type="button" 
                      class="prestige-btn-secondary button-buy-now" 
                      id="pdp-buy-now" 
                      data-action="buy-now"
                      ${!product.availableForSale ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                <span>Buy Now</span>
              </button>

              <button type="button" 
                      class="prestige-btn-wishlist wishlist-heart-btn" 
                      id="button-add-to-wishlist" 
                      data-wishlist-btn 
                      data-handle="${escapeHtml(product.handle)}" 
                      data-product-id="${escapeHtml(product.id)}" 
                      aria-label="Add to Wishlist">
                <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="wishlist-label">Add to Wishlist</span>
              </button>
            </div>

            <!-- Factual Service Highlights -->
            <div class="prestige-trust-features">
              <div class="trust-feat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                <div>
                  <strong>Worldwide Delivery</strong>
                  <span>Tracked shipping calculated at checkout</span>
                </div>
              </div>
              <div class="trust-feat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div>
                  <strong>Secure Checkout</strong>
                  <span>Encrypted payment processing powered by Shopify</span>
                </div>
              </div>
            </div>

            <!-- Prestige Accordion Information Stack -->
            <div class="prestige-accordion-stack">
              <details class="prestige-acc-item" open>
                <summary class="prestige-acc-trigger">
                  <span>Description</span>
                  <span class="acc-icon">+</span>
                </summary>
                <div class="prestige-acc-content prose max-w-none">
                  ${descriptionContent}
                </div>
              </details>

              <details class="prestige-acc-item">
                <summary class="prestige-acc-trigger">
                  <span>Details & Specifications</span>
                  <span class="acc-icon">+</span>
                </summary>
                <div class="prestige-acc-content">
                  <table class="prestige-specs-table">
                    <tbody>
                      <tr><th>Vendor</th><td>${escapeHtml(product.vendor || 'Brood')}</td></tr>
                      ${product.productType ? `<tr><th>Category</th><td>${escapeHtml(product.productType)}</td></tr>` : ''}
                      ${product.tags && product.tags.length > 0 ? `<tr><th>Tags</th><td>${escapeHtml(product.tags.join(', '))}</td></tr>` : ''}
                      <tr><th>Availability</th><td>${product.availableForSale ? 'Available in Stock' : 'Currently Unavailable'}</td></tr>
                      ${sku ? `<tr><th>SKU / ID</th><td>${escapeHtml(sku)}</td></tr>` : ''}
                      ${metafieldRows}
                    </tbody>
                  </table>
                </div>
              </details>

              <details class="prestige-acc-item">
                <summary class="prestige-acc-trigger">
                  <span>Shipping & Delivery</span>
                  <span class="acc-icon">+</span>
                </summary>
                <div class="prestige-acc-content">
                  <p>Shipping methods, rates, and estimated delivery dates are calculated in real time during checkout based on your delivery address.</p>
                </div>
              </details>

              <details class="prestige-acc-item">
                <summary class="prestige-acc-trigger">
                  <span>Customer Care</span>
                  <span class="acc-icon">+</span>
                </summary>
                <div class="prestige-acc-content">
                  <p>Need assistance with sizing, specifications, or placing an order? Our customer support is available to assist you. Contact us anytime via our contact page.</p>
                </div>
              </details>

              ${
                isShoe
                  ? `
              <details class="prestige-acc-item">
                <summary class="prestige-acc-trigger">
                  <span>Size & Fit Guide</span>
                  <span class="acc-icon">+</span>
                </summary>
                <div class="prestige-acc-content">
                  <p style="margin-bottom:10px;">Standard European sizing guide for footwear:</p>
                  <table class="prestige-size-table">
                    <thead><tr><th>EU Size</th><th>UK</th><th>US</th><th>Foot Length (cm)</th></tr></thead>
                    <tbody>
                      <tr><td>40</td><td>6.5</td><td>7.5</td><td>25.5 cm</td></tr>
                      <tr><td>41</td><td>7.5</td><td>8.5</td><td>26.2 cm</td></tr>
                      <tr><td>42</td><td>8.0</td><td>9.0</td><td>26.8 cm</td></tr>
                      <tr><td>43</td><td>9.0</td><td>10.0</td><td>27.5 cm</td></tr>
                      <tr><td>44</td><td>9.5</td><td>10.5</td><td>28.2 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </details>
              `
                  : ''
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products ("You May Also Like") -->
      ${
        relatedProducts.length > 0
          ? `
      <section class="prestige-recommendations-section">
        <div class="prestige-section-header">
          <span class="prestige-section-subtitle">Curated Collection</span>
          <h2 class="prestige-section-heading">You May Also Like</h2>
        </div>
        <div class="row product-grid-box">
          ${relatedProducts
            .slice(0, 4)
            .map((p) => renderShopProductCard(p))
            .join('\n')}
        </div>
      </section>
      `
          : ''
      }

      <!-- Recently Viewed Section -->
      <section class="prestige-recently-viewed-section" id="prestige-recent-section" style="display:none;">
        <div class="prestige-section-header">
          <span class="prestige-section-subtitle">Recently Viewed</span>
          <h2 class="prestige-section-heading">Continue Exploring</h2>
        </div>
        <div class="row product-grid-box" id="prestige-recent-grid"></div>
      </section>

      <!-- Fullscreen Lightbox Modal with Multi-image Navigation & Counter -->
      <div class="prestige-lightbox" id="pdp-lightbox" aria-hidden="true" role="dialog" aria-label="Product Media Lightbox">
        <button type="button" class="prestige-lightbox-close" id="pdp-lightbox-close" aria-label="Close fullscreen view">&times;</button>
        <button type="button" class="prestige-lightbox-nav prev" id="pdp-lightbox-prev" aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="prestige-lightbox-content">
          <img src="" id="pdp-lightbox-img" alt="Product fullscreen preview" />
        </div>
        <button type="button" class="prestige-lightbox-nav next" id="pdp-lightbox-next" aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div class="prestige-lightbox-counter" id="pdp-lightbox-counter">1 / 1</div>
      </div>
    </div>
  `;

  // Inject into template
  if (html.includes('<!-- BROOD_PRESTIGE_PDP_CONTENT -->')) {
    html = html.replace('<!-- BROOD_PRESTIGE_PDP_CONTENT -->', pdpMarkup);
  } else {
    html = html.replace(
      /(<div class="default-product-info-column">)[\s\S]*?(<\/section>\s*<\/div>)/i,
      pdpMarkup
    );
  }

  const pdpClientScript = `
    <script>
    (function() {
      // 1. Gallery Image Collection & Switching
      var mainSlides = document.querySelectorAll('.prestige-main-slide');
      var thumbBtns = document.querySelectorAll('.prestige-thumb-item');
      var mobileItems = document.querySelectorAll('.prestige-mobile-media-item');

      var allImageUrls = [];
      mainSlides.forEach(function(s) {
        var im = s.querySelector('img');
        if (im && im.src) allImageUrls.push(im.src);
      });
      if (allImageUrls.length === 0) {
        mobileItems.forEach(function(m) {
          var im = m.querySelector('img');
          if (im && im.src) allImageUrls.push(im.src);
        });
      }

      function setActiveSlide(idx) {
        mainSlides.forEach(function(s) {
          s.classList.toggle('is-active', s.getAttribute('data-slide-idx') === String(idx));
        });
        thumbBtns.forEach(function(b) {
          b.classList.toggle('is-active', b.getAttribute('data-thumb-target') === String(idx));
        });
      }

      thumbBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var idx = btn.getAttribute('data-thumb-target');
          if (idx !== null) setActiveSlide(parseInt(idx, 10));
        });
      });

      // Desktop Cursor Zoom (Magnifying Pan)
      document.querySelectorAll('.prestige-zoom-wrap').forEach(function(wrap) {
        var img = wrap.querySelector('.prestige-pdp-main-img');
        if (!img) return;

        wrap.addEventListener('mousemove', function(e) {
          if (window.innerWidth <= 768) return;
          var rect = wrap.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          img.style.transformOrigin = x + '% ' + y + '%';
          img.style.transform = 'scale(1.75)';
        });

        wrap.addEventListener('mouseleave', function() {
          img.style.transform = 'scale(1)';
          img.style.transformOrigin = 'center center';
        });

        wrap.addEventListener('click', function() {
          var activeSlide = wrap.closest('.prestige-main-slide');
          var idx = activeSlide ? parseInt(activeSlide.getAttribute('data-slide-idx') || '0', 10) : 0;
          openLightbox(idx);
        });
      });

      mobileItems.forEach(function(item) {
        item.addEventListener('click', function() {
          var idx = parseInt(item.getAttribute('data-media-idx') || '0', 10);
          openLightbox(idx);
        });
        item.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var idx = parseInt(item.getAttribute('data-media-idx') || '0', 10);
            openLightbox(idx);
          }
        });
      });

      // 2. Lightbox Zoom Modal
      var zoomBtn = document.getElementById('pdp-zoom-btn');
      var lightbox = document.getElementById('pdp-lightbox');
      var lightboxImg = document.getElementById('pdp-lightbox-img');
      var lightboxClose = document.getElementById('pdp-lightbox-close');
      var lightboxPrev = document.getElementById('pdp-lightbox-prev');
      var lightboxNext = document.getElementById('pdp-lightbox-next');
      var lightboxCounter = document.getElementById('pdp-lightbox-counter');
      var currentLightboxIdx = 0;

      function updateLightbox(idx) {
        if (!allImageUrls.length) return;
        if (idx < 0) idx = allImageUrls.length - 1;
        if (idx >= allImageUrls.length) idx = 0;
        currentLightboxIdx = idx;
        if (lightboxImg) lightboxImg.src = allImageUrls[currentLightboxIdx];
        if (lightboxCounter) {
          lightboxCounter.textContent = (currentLightboxIdx + 1) + ' / ' + allImageUrls.length;
        }
      }

      function openLightbox(idx) {
        if (!lightbox) return;
        var startIdx = typeof idx === 'number' ? idx : 0;
        var activeSlide = document.querySelector('.prestige-main-slide.is-active');
        if (typeof idx !== 'number' && activeSlide) {
          startIdx = parseInt(activeSlide.getAttribute('data-slide-idx') || '0', 10);
        }
        updateLightbox(startIdx);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        if (lightbox) {
          lightbox.classList.remove('is-open');
          lightbox.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }

      if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
          e.stopPropagation();
          updateLightbox(currentLightboxIdx - 1);
        });
      }
      if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
          e.stopPropagation();
          updateLightbox(currentLightboxIdx + 1);
        });
      }
      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox || e.target.classList.contains('prestige-lightbox-content')) closeLightbox();
        });

        // Touch swipe support for lightbox
        var touchStartX = 0;
        lightbox.addEventListener('touchstart', function(e) {
          if (e.changedTouches && e.changedTouches[0]) {
            touchStartX = e.changedTouches[0].clientX;
          }
        }, { passive: true });
        lightbox.addEventListener('touchend', function(e) {
          if (e.changedTouches && e.changedTouches[0]) {
            var diffX = e.changedTouches[0].clientX - touchStartX;
            if (diffX > 40) updateLightbox(currentLightboxIdx - 1);
            else if (diffX < -40) updateLightbox(currentLightboxIdx + 1);
          }
        }, { passive: true });
      }

      document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') updateLightbox(currentLightboxIdx - 1);
        if (e.key === 'ArrowRight') updateLightbox(currentLightboxIdx + 1);
      });

      // 3. Variant Selection Logic
      var variantsEl = document.getElementById('shopify-variants-data');
      var variants = variantsEl ? JSON.parse(variantsEl.textContent || '[]') : [];
      var variantInput = document.getElementById('selected-variant-id');
      var priceDisplay = document.getElementById('pdp-price');
      var addBtn = document.getElementById('pdp-add-to-cart');
      var buyBtn = document.getElementById('pdp-buy-now');

      function getSelectedOptions() {
        var selected = {};
        var checked = document.querySelectorAll('.luxury-variant-radio:checked');
        checked.forEach(function(r) {
          var optName = r.getAttribute('data-option-name');
          if (optName) {
            selected[optName] = r.value;
            var labelSpan = document.getElementById('selected-val-' + optName);
            if (labelSpan) labelSpan.textContent = r.value;
          }
        });
        return selected;
      }

      function updateVariant() {
        if (!variants.length) return;
        var selectedOptions = getSelectedOptions();
        var matched = variants.find(function(v) {
          if (!v.selectedOptions || v.selectedOptions.length === 0) return true;
          return v.selectedOptions.every(function(so) {
            return selectedOptions[so.name] === so.value;
          });
        });

        if (matched) {
          if (variantInput) variantInput.value = matched.id;
          if (priceDisplay && matched.price) {
            var num = parseFloat(matched.price.amount);
            try {
              priceDisplay.textContent = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: matched.price.currencyCode || 'INR',
                maximumFractionDigits: 2
              }).format(num);
            } catch(e) {
              priceDisplay.textContent = '₹ ' + num.toFixed(2);
            }
          }

          var addBtns = document.querySelectorAll('.button-add-to-cart, #pdp-add-to-cart');
          var buyBtns = document.querySelectorAll('.button-buy-now, #pdp-buy-now');

          if (!matched.availableForSale) {
            addBtns.forEach(function(btn) {
              btn.disabled = true;
              btn.style.opacity = '0.4';
              btn.style.cursor = 'not-allowed';
              var s = btn.querySelector('span') || btn;
              s.textContent = 'Out of Stock';
            });
            buyBtns.forEach(function(btn) {
              btn.disabled = true;
              btn.style.opacity = '0.4';
              btn.style.cursor = 'not-allowed';
            });
          } else {
            addBtns.forEach(function(btn) {
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.cursor = 'pointer';
              var s = btn.querySelector('span') || btn;
              s.textContent = 'Add to Bag';
            });
            buyBtns.forEach(function(btn) {
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.cursor = 'pointer';
            });
          }
        }
      }

      document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('luxury-variant-radio')) {
          updateVariant();
        }
      });

      // 4. Quantity Stepper
      var qtyUp = document.getElementById('pdp-qty-up');
      var qtyDown = document.getElementById('pdp-qty-down');
      var qtyInput = document.getElementById('input-quantity');

      if (qtyUp && qtyInput) {
        qtyUp.addEventListener('click', function(e) {
          e.preventDefault();
          var cur = parseInt(qtyInput.value, 10) || 1;
          if (cur < 99) qtyInput.value = cur + 1;
        });
      }

      if (qtyDown && qtyInput) {
        qtyDown.addEventListener('click', function(e) {
          e.preventDefault();
          var cur = parseInt(qtyInput.value, 10) || 1;
          if (cur > 1) qtyInput.value = cur - 1;
        });
      }

      // 5. Add to Cart & Buy Now Action Listeners (Capturing Phase)
      document.addEventListener('click', function(e) {
        var targetAdd = e.target.closest('#pdp-add-to-cart, .button-add-to-cart');
        if (targetAdd) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          var vId = variantInput ? variantInput.value : (variants[0] ? variants[0].id : null);
          if (!vId) return;
          var q = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
          if (window.ShopifyCart) {
            window.ShopifyCart.addItem(vId, q, { button: targetAdd });
          }
          return;
        }

        var targetBuy = e.target.closest('#pdp-buy-now, .button-buy-now');
        if (targetBuy) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          var vId = variantInput ? variantInput.value : (variants[0] ? variants[0].id : null);
          if (!vId) return;
          var q = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
          if (window.ShopifyCart) {
            window.ShopifyCart.addItem(vId, q, { button: targetBuy, buyNow: true });
          }
          return;
        }
      }, true);

      // 6. Recently Viewed Tracking & Rendering
      try {
        var currentHandle = document.querySelector('[data-current-handle]')?.getAttribute('data-current-handle');
        if (currentHandle) {
          var STORAGE_KEY = 'brood_recently_viewed';
          var stored = [];
          try {
            var raw = localStorage.getItem(STORAGE_KEY);
            stored = raw ? JSON.parse(raw) : [];
          } catch (err) {}
          if (!Array.isArray(stored)) stored = [];
          stored = stored.filter(function(h) { return h && h !== currentHandle; });
          stored.unshift(currentHandle);
          if (stored.length > 8) stored = stored.slice(0, 8);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

          var otherHandles = stored.filter(function(h) { return h !== currentHandle; });
          if (otherHandles.length > 0) {
            fetch('/api/products?first=12')
              .then(function(res) { return res.json(); })
              .then(function(data) {
                if (!data || !data.htmlCards) return;
                var recentSection = document.getElementById('prestige-recent-section');
                var recentGrid = document.getElementById('prestige-recent-grid');
                if (recentSection && recentGrid) {
                  var parser = new DOMParser();
                  var doc = parser.parseFromString('<div id="wrap">' + data.htmlCards + '</div>', 'text/html');
                  var items = doc.querySelectorAll('.product-item');
                  var fragment = document.createDocumentFragment();
                  items.forEach(function(item) {
                    var card = item.querySelector('[data-handle]');
                    var h = card ? card.getAttribute('data-handle') : null;
                    if (h && otherHandles.indexOf(h) !== -1) {
                      fragment.appendChild(item.cloneNode(true));
                    }
                  });
                  if (fragment.children.length > 0) {
                    recentGrid.innerHTML = '';
                    recentGrid.appendChild(fragment);
                    recentSection.style.display = 'block';
                  }
                }
              })
              .catch(function(e) {});
          }
        }
      } catch (e) {}

      updateVariant();
    })();
    </script>
  `;

  html = html.replace('</body>', `${renderCartDrawerHtml()}\n${pdpClientScript}\n</body>`);

  return html;
}

export function renderLoadingState(): string {
  return `
    <div class="col-12 py-12 text-center" style="grid-column: 1 / -1; padding: 48px 16px;">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style="display:inline-block;width:32px;height:32px;border:3px solid #f3f3f3;border-top:3px solid #333;border-radius:50%;animation:spin 1s linear infinite;"></div>
      <p style="font-size: 14px; color: #666; margin-top: 12px;">Loading catalog...</p>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    </div>
  `;
}

export function renderEmptyState(message = 'No products found.'): string {
  return `
    <div class="col-12 py-12 text-center" style="grid-column: 1 / -1; width: 100%; padding: 48px 16px;">
      <p style="font-size: 16px; color: #444; margin-bottom: 8px; font-weight: 600;">${message}</p>
      <p style="font-size: 12px; color: #888; margin-bottom: 16px;">Try adjusting your sort or return to the main catalog.</p>
      <a href="/shop" class="btn" style="display: inline-block; padding: 10px 24px; background: #111; color: #fff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 2px;">View All Products</a>
    </div>
  `;
}

export function renderErrorState(error: string): string {
  return `
    <div class="col-12 py-12 text-center" style="grid-column: 1 / -1; width: 100%; padding: 32px 16px; background: #fffaf0; border: 1px solid #feebc8; border-radius: 4px; margin: 16px 0;">
      <p style="font-size: 15px; color: #9c4221; font-weight: 600; margin-bottom: 4px;">Unable to Load Products</p>
      <p style="font-size: 12px; color: #7b341e; margin-bottom: 12px;">We encountered a temporary connection issue. Please try again.</p>
      <button onclick="window.location.reload()" class="btn" style="display: inline-block; padding: 8px 20px; background: #9c4221; color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 2px; border: none; cursor: pointer;">Retry</button>
    </div>
  `;
}

export interface ShopFilterParams {
  q?: string | null;
  category?: string | null;
  availability?: string | null;
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  vendor?: string | null;
  size?: string | null;
  color?: string | null;
  tag?: string | null;
}

export function parseFilterParams(searchParams: URLSearchParams): ShopFilterParams {
  return {
    q: searchParams.get('q') || searchParams.get('search') || null,
    category: searchParams.get('category') || null,
    availability: searchParams.get('availability') || null,
    minPrice: searchParams.get('min_price') || searchParams.get('minPrice') || null,
    maxPrice: searchParams.get('max_price') || searchParams.get('maxPrice') || null,
    vendor: searchParams.get('vendor') || searchParams.get('brand') || null,
    size: searchParams.get('size') || null,
    color: searchParams.get('color') || null,
    tag: searchParams.get('tag') || null,
  };
}

export function buildShopifyFilterQuery(filters: ShopFilterParams): string {
  const parts: string[] = [];

  if (filters.q && filters.q.trim()) {
    parts.push(filters.q.trim());
  }

  const categoryMap: Record<string, string> = {
    shoes: 'Footwear',
    footwear: 'Footwear',
    sneakers: 'Footwear',
    boots: 'Footwear',
    watches: 'Watches',
    watch: 'Watches',
    timepieces: 'Watches',
    eyewear: 'Eyewear',
    sunglasses: 'Eyewear',
    glasses: 'Eyewear',
    bags: 'Bags',
    bag: 'Bags',
    handbags: 'Bags',
    jewellery: 'Jewellery',
    jewelry: 'Jewellery',
    accessories: 'Accessories',
    'fashion-accessories': 'Accessories',
    'leather-goods': 'Leather Goods',
    'small-leather-goods': 'Leather Goods',
    lifestyle: 'Lifestyle Accessories',
    'lifestyle-accessories': 'Lifestyle Accessories',
    clothing: 'Clothing',
    apparel: 'Clothing',
  };

  const rawCat = (filters.category || '').toLowerCase().trim();
  if (rawCat) {
    const productType = categoryMap[rawCat] || filters.category!.trim();
    parts.push(`product_type:${productType.includes(' ') ? `"${productType}"` : productType}`);
  }

  if (
    filters.availability === 'in_stock' ||
    filters.availability === 'true' ||
    filters.availability === '1'
  ) {
    parts.push('available_for_sale:true');
  }

  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
    const min = parseFloat(String(filters.minPrice));
    if (!isNaN(min)) {
      parts.push(`variants.price:>=${min}`);
    }
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
    const max = parseFloat(String(filters.maxPrice));
    if (!isNaN(max)) {
      parts.push(`variants.price:<=${max}`);
    }
  }

  if (filters.vendor && filters.vendor.trim()) {
    const v = filters.vendor.trim();
    parts.push(`vendor:${v.includes(' ') ? `"${v}"` : v}`);
  }

  if (filters.size && filters.size.trim()) {
    parts.push(filters.size.trim());
  }

  if (filters.color && filters.color.trim()) {
    parts.push(filters.color.trim());
  }

  if (filters.tag && filters.tag.trim()) {
    const t = filters.tag.trim();
    parts.push(`tag:${t.includes(' ') ? `"${t}"` : t}`);
  }

  return parts.join(' ');
}

export function getActiveFilterCount(filters: ShopFilterParams): number {
  let count = 0;
  if (filters.category) count++;
  if (filters.availability === 'in_stock') count++;
  if (filters.minPrice || filters.maxPrice) count++;
  if (filters.vendor) count++;
  if (filters.size) count++;
  if (filters.color) count++;
  if (filters.tag) count++;
  return count;
}

export function renderFilterButton(activeCount: number): string {
  const badgeHtml =
    activeCount > 0
      ? `<span style="display:inline-flex;align-items:center;justify-content:center;background:#c8a96b;color:#fff;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;margin-left:4px;">${activeCount}</span>`
      : '';

  return `
    <button type="button" id="shop-filter-toggle-btn" class="shop-filter-btn" onclick="if(window.ShopifyFilter) window.ShopifyFilter.open();" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;background:#111;color:#fff;border:1px solid #111;border-radius:3px;cursor:pointer;transition:all 0.2s;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <span>Filters</span>
      ${badgeHtml}
    </button>
  `;
}

export function renderActiveFilterChips(
  filters: ShopFilterParams,
  sort: string,
  basePath = '/shop'
): string {
  const chips: Array<{ label: string; paramKey: keyof ShopFilterParams | 'price' }> = [];

  if (filters.category) {
    chips.push({ label: `Category: ${escapeHtml(filters.category)}`, paramKey: 'category' });
  }
  if (filters.availability === 'in_stock') {
    chips.push({ label: 'In Stock Only', paramKey: 'availability' });
  }
  if (filters.minPrice || filters.maxPrice) {
    const minText = filters.minPrice ? `₹${filters.minPrice}` : '₹0';
    const maxText = filters.maxPrice ? `₹${filters.maxPrice}` : 'Any';
    chips.push({ label: `Price: ${minText} - ${maxText}`, paramKey: 'price' });
  }
  if (filters.vendor) {
    chips.push({ label: `Brand: ${escapeHtml(filters.vendor)}`, paramKey: 'vendor' });
  }
  if (filters.size) {
    chips.push({ label: `Size: ${escapeHtml(filters.size)}`, paramKey: 'size' });
  }
  if (filters.color) {
    chips.push({ label: `Color: ${escapeHtml(filters.color)}`, paramKey: 'color' });
  }
  if (filters.tag) {
    chips.push({ label: `Tag: ${escapeHtml(filters.tag)}`, paramKey: 'tag' });
  }

  if (chips.length === 0) return '';

  const buildRemoveUrl = (paramToRemove: keyof ShopFilterParams | 'price') => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (sort && sort !== 'featured') params.set('sort', sort);

    if (filters.category && paramToRemove !== 'category') params.set('category', filters.category);
    if (filters.availability && paramToRemove !== 'availability') params.set('availability', filters.availability);
    if (paramToRemove !== 'price') {
      if (filters.minPrice) params.set('min_price', String(filters.minPrice));
      if (filters.maxPrice) params.set('max_price', String(filters.maxPrice));
    }
    if (filters.vendor && paramToRemove !== 'vendor') params.set('vendor', filters.vendor);
    if (filters.size && paramToRemove !== 'size') params.set('size', filters.size);
    if (filters.color && paramToRemove !== 'color') params.set('color', filters.color);
    if (filters.tag && paramToRemove !== 'tag') params.set('tag', filters.tag);

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const clearAllParams = new URLSearchParams();
  if (filters.q) clearAllParams.set('q', filters.q);
  if (sort && sort !== 'featured') clearAllParams.set('sort', sort);
  const clearAllUrl = clearAllParams.toString() ? `${basePath}?${clearAllParams.toString()}` : basePath;

  const chipsHtml = chips
    .map(
      (c) => `
      <a href="${buildRemoveUrl(c.paramKey)}" class="filter-chip-item" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#fff;border:1px solid #dcdcdc;border-radius:14px;font-size:11px;font-weight:600;color:#222;text-decoration:none;transition:border-color 0.2s;">
        <span>${c.label}</span>
        <span style="font-size:13px;font-weight:700;color:#888;">✕</span>
      </a>
    `
    )
    .join('');

  return `
    <div class="active-filter-chips-bar" style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px;padding:10px 14px;background:#fcfcfc;border:1px dashed #d5d5d5;border-radius:4px;">
      <span style="font-size:11px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.06em;">Active Filters:</span>
      ${chipsHtml}
      <a href="${clearAllUrl}" style="font-size:11px;font-weight:700;color:#b6914c;text-transform:uppercase;letter-spacing:0.05em;text-decoration:underline;margin-left:4px;">Clear All</a>
    </div>
  `;
}

export function renderFilterDrawerHtml(filters: ShopFilterParams): string {
  const isShoe = !filters.category || filters.category === 'shoes' || filters.category === 'footwear' || filters.category === 'sneakers';
  const sizes = ['40', '41', '42', '43', '44'];

  return `
<!-- SHOPIFY FILTER OVERLAY & DRAWER -->
<div id="shopify-filter-overlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:10020;opacity:0;transition:opacity 0.3s ease;backdrop-filter:blur(2px);"></div>

<div id="shopify-filter-drawer" style="position:fixed;top:0;left:-380px;bottom:0;width:100%;max-width:360px;background:#ffffff;z-index:10030;box-shadow:4px 0 25px rgba(0,0,0,0.2);display:flex;flex-direction:column;transition:left 0.3s cubic-bezier(0.16, 1, 0.3, 1);font-family:inherit;">
  <!-- Header -->
  <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #eee;background:#fafafa;">
    <div style="display:flex;align-items:center;gap:8px;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
      <span style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;">Filter Products</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px;">
      <button type="button" id="shopify-filter-clear-all" style="font-size:11px;font-weight:600;color:#888;background:none;border:none;cursor:pointer;text-transform:uppercase;letter-spacing:0.04em;">Reset</button>
      <button type="button" id="shopify-filter-close" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:none;border:none;font-size:18px;cursor:pointer;color:#333;" aria-label="Close Filters">✕</button>
    </div>
  </div>

  <!-- Scrollable Filter Content -->
  <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:22px;">
    <!-- 1. Category -->
    <div style="border-bottom:1px solid #f0f0f0;padding-bottom:18px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;margin-bottom:12px;">Category</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_category" value="" ${!filters.category ? 'checked' : ''} style="accent-color:#111;" />
          <span>All Categories</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_category" value="shoes" ${filters.category === 'shoes' || filters.category === 'footwear' ? 'checked' : ''} style="accent-color:#111;" />
          <span>Footwear / Shoes</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_category" value="watches" ${filters.category === 'watches' || filters.category === 'watch' ? 'checked' : ''} style="accent-color:#111;" />
          <span>Watches</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_category" value="eyewear" ${filters.category === 'eyewear' || filters.category === 'sunglasses' ? 'checked' : ''} style="accent-color:#111;" />
          <span>Eyewear / Sunglasses</span>
        </label>
      </div>
    </div>

    <!-- 2. Category-Specific: Shoe Sizes -->
    <div id="filter-size-section" style="${isShoe ? '' : 'display:none;'}border-bottom:1px solid #f0f0f0;padding-bottom:18px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;margin-bottom:12px;">Shoe Size (EU)</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${sizes
          .map((sz) => {
            const isChecked = filters.size === sz;
            return `
            <label style="cursor:pointer;margin:0;">
              <input type="radio" name="filter_size" value="${sz}" ${isChecked ? 'checked' : ''} style="display:none;" class="filter-size-input" />
              <span class="filter-size-btn" style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:36px;border:1px solid ${isChecked ? '#111' : '#ddd'};background:${isChecked ? '#111' : '#fff'};color:${isChecked ? '#fff' : '#111'};border-radius:3px;font-size:12px;font-weight:600;transition:all 0.15s;">${sz}</span>
            </label>
          `;
          })
          .join('')}
      </div>
    </div>

    <!-- 3. Availability -->
    <div style="border-bottom:1px solid #f0f0f0;padding-bottom:18px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;margin-bottom:12px;">Availability</div>
      <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
        <input type="checkbox" id="filter-in-stock" name="filter_availability" value="in_stock" ${filters.availability === 'in_stock' ? 'checked' : ''} style="accent-color:#111;width:16px;height:16px;" />
        <span>In Stock Only</span>
      </label>
    </div>

    <!-- 4. Price Range -->
    <div style="border-bottom:1px solid #f0f0f0;padding-bottom:18px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;margin-bottom:12px;">Price Range</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_price_tier" value="all" ${!filters.minPrice && !filters.maxPrice ? 'checked' : ''} style="accent-color:#111;" />
          <span>All Prices</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_price_tier" value="under_7500" data-min="" data-max="7500" ${String(filters.maxPrice) === '7500' && !filters.minPrice ? 'checked' : ''} style="accent-color:#111;" />
          <span>Under ₹7,500</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_price_tier" value="7500_10000" data-min="7500" data-max="10000" ${String(filters.minPrice) === '7500' && String(filters.maxPrice) === '10000' ? 'checked' : ''} style="accent-color:#111;" />
          <span>₹7,500 - ₹10,000</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_price_tier" value="over_10000" data-min="10000" data-max="" ${String(filters.minPrice) === '10000' && !filters.maxPrice ? 'checked' : ''} style="accent-color:#111;" />
          <span>Over ₹10,000</span>
        </label>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="flex:1;">
          <label style="display:block;font-size:10px;font-weight:700;color:#777;margin-bottom:3px;text-transform:uppercase;">Min (₹)</label>
          <input type="number" id="filter-min-price" value="${filters.minPrice || ''}" placeholder="Min" style="width:100%;padding:7px 10px;border:1px solid #ddd;border-radius:3px;font-size:12px;box-sizing:border-box;" />
        </div>
        <span style="margin-top:16px;color:#999;">–</span>
        <div style="flex:1;">
          <label style="display:block;font-size:10px;font-weight:700;color:#777;margin-bottom:3px;text-transform:uppercase;">Max (₹)</label>
          <input type="number" id="filter-max-price" value="${filters.maxPrice || ''}" placeholder="Max" style="width:100%;padding:7px 10px;border:1px solid #ddd;border-radius:3px;font-size:12px;box-sizing:border-box;" />
        </div>
      </div>
    </div>

    <!-- 5. Brand / Vendor -->
    <div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#111;margin-bottom:12px;">Brand</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_vendor" value="" ${!filters.vendor ? 'checked' : ''} style="accent-color:#111;" />
          <span>All Brands</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_vendor" value="brood" ${filters.vendor?.toLowerCase() === 'brood' ? 'checked' : ''} style="accent-color:#111;" />
          <span>brood</span>
        </label>
        <label style="display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;">
          <input type="radio" name="filter_vendor" value="My Store" ${filters.vendor?.toLowerCase() === 'my store' ? 'checked' : ''} style="accent-color:#111;" />
          <span>My Store</span>
        </label>
      </div>
    </div>
  </div>

  <!-- Footer Actions -->
  <div style="padding:16px 20px;border-top:1px solid #eee;background:#fafafa;display:flex;gap:10px;">
    <button type="button" id="shopify-filter-apply-btn" style="flex:1;padding:12px;background:#111;color:#fff;border:none;border-radius:3px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;transition:background 0.2s;">
      Apply Filters
    </button>
  </div>
</div>

<script>
(function() {
  // Global search binder for all templates (desktop header, mobile search bar, and shop search)
  function triggerGlobalSearch(query) {
    var q = (query || '').trim();
    if (q) {
      window.location.href = '/search?q=' + encodeURIComponent(q);
    } else {
      window.location.href = '/shop';
    }
  }

  // Intercept Enter key on search inputs across the site
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var target = e.target;
      if (target && (target.id === 'hoshi-search-input' || target.name === 'search')) {
        e.preventDefault();
        triggerGlobalSearch(target.value);
      }
    }
  });

  // Intercept click on search buttons across the site
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('#search button, .mobile-search, [aria-label="Search"]');
    if (btn && !btn.closest('#shopify-filter-drawer')) {
      var input = document.getElementById('hoshi-search-input') || document.querySelector('input[name="search"]');
      if (input && input.value.trim()) {
        e.preventDefault();
        triggerGlobalSearch(input.value);
      }
    }
  });

  // Filter Drawer Toggle
  var drawer = document.getElementById('shopify-filter-drawer');
  var overlay = document.getElementById('shopify-filter-overlay');
  var openBtn = document.getElementById('shop-filter-toggle-btn');
  var closeBtn = document.getElementById('shopify-filter-close');

  function openFilterDrawer() {
    if (drawer && overlay) {
      overlay.style.display = 'block';
      setTimeout(function() {
        overlay.style.opacity = '1';
        drawer.style.left = '0px';
      }, 10);
      document.body.style.overflow = 'hidden';
    }
  }

  function closeFilterDrawer() {
    if (drawer && overlay) {
      drawer.style.left = '-380px';
      overlay.style.opacity = '0';
      setTimeout(function() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }
  }

  window.ShopifyFilter = {
    open: openFilterDrawer,
    close: closeFilterDrawer
  };

  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('#shop-filter-toggle-btn, .shop-filter-btn');
    if (trigger) {
      e.preventDefault();
      openFilterDrawer();
    }
    if (e.target.closest('#shopify-filter-close') || e.target.id === 'shopify-filter-overlay') {
      e.preventDefault();
      closeFilterDrawer();
    }
  });

  if (openBtn) openBtn.addEventListener('click', openFilterDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeFilterDrawer);
  if (overlay) overlay.addEventListener('click', closeFilterDrawer);

  // Price tier radio clicks update custom min/max inputs
  document.querySelectorAll('input[name="filter_price_tier"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      var minInput = document.getElementById('filter-min-price');
      var maxInput = document.getElementById('filter-max-price');
      if (minInput && maxInput) {
        minInput.value = this.getAttribute('data-min') || '';
        maxInput.value = this.getAttribute('data-max') || '';
      }
    });
  });

  // Custom min/max inputs uncheck price tier radios
  var minP = document.getElementById('filter-min-price');
  var maxP = document.getElementById('filter-max-price');
  function onPriceInput() {
    document.querySelectorAll('input[name="filter_price_tier"]').forEach(function(r) {
      r.checked = false;
    });
  }
  if (minP) minP.addEventListener('input', onPriceInput);
  if (maxP) maxP.addEventListener('input', onPriceInput);

  // Category change dynamically toggles size section visibility
  document.querySelectorAll('input[name="filter_category"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      var sizeSection = document.getElementById('filter-size-section');
      if (sizeSection) {
        var val = this.value;
        if (!val || val === 'shoes' || val === 'footwear') {
          sizeSection.style.display = 'block';
        } else {
          sizeSection.style.display = 'none';
          document.querySelectorAll('input[name="filter_size"]').forEach(function(sr) {
            sr.checked = false;
          });
        }
      }
    });
  });

  // Size pill button visual toggle
  document.querySelectorAll('input[name="filter_size"]').forEach(function(sr) {
    sr.addEventListener('change', function() {
      document.querySelectorAll('.filter-size-btn').forEach(function(btn) {
        btn.style.background = '#fff';
        btn.style.color = '#111';
        btn.style.borderColor = '#ddd';
      });
      if (this.checked && this.nextElementSibling) {
        this.nextElementSibling.style.background = '#111';
        this.nextElementSibling.style.color = '#fff';
        this.nextElementSibling.style.borderColor = '#111';
      }
    });
  });

  // Apply filters button
  var applyBtn = document.getElementById('shopify-filter-apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      var currentUrl = new URL(window.location.href);
      var params = currentUrl.searchParams;

      // Reset cursor
      params.delete('after');

      // Category
      var catRadio = document.querySelector('input[name="filter_category"]:checked');
      if (catRadio && catRadio.value) {
        params.set('category', catRadio.value);
      } else {
        params.delete('category');
      }

      // Availability
      var inStockCheck = document.getElementById('filter-in-stock');
      if (inStockCheck && inStockCheck.checked) {
        params.set('availability', 'in_stock');
      } else {
        params.delete('availability');
      }

      // Price
      var minVal = (document.getElementById('filter-min-price') || {}).value;
      var maxVal = (document.getElementById('filter-max-price') || {}).value;
      if (minVal && minVal.trim()) {
        params.set('min_price', minVal.trim());
      } else {
        params.delete('min_price');
      }
      if (maxVal && maxVal.trim()) {
        params.set('max_price', maxVal.trim());
      } else {
        params.delete('max_price');
      }

      // Vendor
      var vendorRadio = document.querySelector('input[name="filter_vendor"]:checked');
      if (vendorRadio && vendorRadio.value) {
        params.set('vendor', vendorRadio.value);
      } else {
        params.delete('vendor');
      }

      // Size
      var sizeRadio = document.querySelector('input[name="filter_size"]:checked');
      if (sizeRadio && sizeRadio.value) {
        params.set('size', sizeRadio.value);
      } else {
        params.delete('size');
      }

      window.location.href = currentUrl.pathname + '?' + params.toString();
    });
  }

  // Clear / Reset filters inside drawer
  var clearBtn = document.getElementById('shopify-filter-clear-all');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      var currentUrl = new URL(window.location.href);
      var params = new URLSearchParams();
      if (currentUrl.searchParams.has('q')) {
        params.set('q', currentUrl.searchParams.get('q'));
      }
      if (currentUrl.searchParams.has('sort')) {
        params.set('sort', currentUrl.searchParams.get('sort'));
      }
      var qs = params.toString();
      window.location.href = currentUrl.pathname + (qs ? '?' + qs : '');
    });
  }
})();
</script>
  `;
}

export function renderEmptySearchState(query: string): string {
  return `
    <div class="shop-empty-search-state col-xs-12" style="width:100%;grid-column:1/-1;text-align:center;padding:64px 20px;">
      <div style="width:56px;height:56px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;border-radius:50%;color:#777;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <h3 style="font-size:18px;font-weight:700;color:#111;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">
        No Results Found for "${escapeHtml(query)}"
      </h3>
      <p style="font-size:13px;color:#666;max-width:440px;margin:0 auto 24px;line-height:1.5;">
        We couldn't find any products matching your search. Please check for spelling errors or try different keywords.
      </p>
      <a href="/shop" class="btn" style="display:inline-block;padding:12px 28px;background:#111;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:3px;text-decoration:none;">
        View All Products
      </a>
    </div>
  `;
}

export function renderWishlistCard(product: ShopifyProduct): string {
  const minPrice = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const formattedPrice = formatPrice(minPrice.amount, minPrice.currencyCode);
  const formattedComparePrice =
    comparePrice && parseFloat(comparePrice.amount) > parseFloat(minPrice.amount)
      ? formatPrice(comparePrice.amount, comparePrice.currencyCode)
      : null;

  const primaryImage =
    product.images.edges[0]?.node?.url ||
    'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';

  const productLink = `/products/${product.handle}`;
  const availableVariant = product.variants.edges.find((e) => e.node.availableForSale)?.node || product.variants.edges[0]?.node;
  const variantId = availableVariant ? availableVariant.id : '';
  const isAvailable = product.availableForSale && !!availableVariant;

  return `
    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product-item wishlist-item" data-wishlist-item="${escapeHtml(product.handle)}" style="transition:all 0.3s ease;">
      <div class="product-thumb group flex flex-col h-full bg-surface-light dark:bg-surface-dark transition-all duration-300" style="position:relative;border:1px solid #eee;padding:12px;border-radius:4px;background:#fff;">
        <button type="button" 
                class="wishlist-remove-btn" 
                data-wishlist-remove 
                data-handle="${escapeHtml(product.handle)}" 
                title="Remove from Wishlist" 
                aria-label="Remove from Wishlist"
                style="position:absolute;top:16px;right:16px;z-index:10;width:28px;height:28px;border-radius:50%;background:#fff;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#888;box-shadow:0 1px 4px rgba(0,0,0,0.08);transition:all 0.2s;">
          ✕
        </button>

        <div class="image relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-sm mb-2">
          <a href="${productLink}" class="block w-full h-full">
            <img src="${primaryImage}"
                 alt="${escapeHtml(product.title)}"
                 title="${escapeHtml(product.title)}"
                 loading="lazy"
                 decoding="async"
                 class="w-full h-full object-cover bg-white transition-transform duration-700 group-hover:scale-105" />
          </a>
        </div>

        <div class="caption text-center flex flex-col px-0.5" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="margin-bottom:4px;">
              ${isAvailable 
                ? '<span style="font-size:10px;font-weight:700;letter-spacing:0.05em;color:#137333;background:#e6f4ea;padding:2px 6px;border-radius:2px;text-transform:uppercase;">In Stock</span>'
                : '<span style="font-size:10px;font-weight:700;letter-spacing:0.05em;color:#c5221f;background:#fce8e6;padding:2px 6px;border-radius:2px;text-transform:uppercase;">Out of Stock</span>'}
            </div>
            <h4 class="m-0 p-0" style="min-height:32px;">
              <a class="product-name font-bold text-[11px] md:text-sm text-gray-800 dark:text-gray-300 uppercase tracking-[0.05em] leading-[1.3] hover:text-primary transition-colors line-clamp-2 block" 
                 href="${productLink}" 
                 title="${escapeHtml(product.title)}">
                ${escapeHtml(product.title)}
              </a>
            </h4>
            <div class="price-wrapper mt-1">
              <div class="price">
                <span class="price-new font-bold text-sm" style="color:#111;">${formattedPrice}</span>
                ${formattedComparePrice ? `<span class="price-old text-xs text-gray-400 line-through ml-2">${formattedComparePrice}</span>` : ''}
              </div>
            </div>
          </div>

          <div style="margin-top:12px;">
            ${isAvailable 
              ? `<button type="button" 
                         class="btn wishlist-add-to-cart-btn" 
                         data-variant-id="${escapeHtml(variantId)}" 
                         onclick="if(window.ShopifyCart) { window.ShopifyCart.addLine('${variantId}', 1, this); }" 
                         style="width:100%;padding:8px 12px;background:#111;color:#fff;border:none;border-radius:2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:background 0.2s;">
                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                   <span>Add to Bag</span>
                 </button>`
              : `<button type="button" 
                         disabled 
                         style="width:100%;padding:8px 12px;background:#f0f0f0;color:#999;border:none;border-radius:2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:not-allowed;">
                   <span>Out of Stock</span>
                 </button>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderEmptyWishlistState(): string {
  return `
    <div class="wishlist-empty-state col-xs-12" id="wishlist-empty-box" style="width:100%;grid-column:1/-1;text-align:center;padding:72px 20px;">
      <div style="width:64px;height:64px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;border-radius:50%;color:#888;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
      <h3 style="font-size:18px;font-weight:700;color:#111;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">
        Your Wishlist is Empty
      </h3>
      <p style="font-size:13px;color:#666;max-width:440px;margin:0 auto 24px;line-height:1.6;">
        Explore our curated luxury collections and save your favorite pieces to review them anytime or add them to your shopping bag.
      </p>
      <a href="/shop" class="btn" style="display:inline-block;padding:12px 32px;background:#111;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:3px;text-decoration:none;transition:background 0.2s;">
        Continue Shopping
      </a>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderCartDrawerHtml(): string {
  return `
<!-- SHOPIFY CART OVERLAY & DRAWER -->
<div id="shopify-cart-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10040;transition:opacity 0.3s ease;opacity:0;pointer-events:none;"></div>

<div id="shopify-cart-drawer" style="position:fixed;top:0;right:0;bottom:0;width:100%;max-width:400px;background:#ffffff;z-index:10050;box-shadow:-4px 0 24px rgba(0,0,0,0.15);display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);font-family:inherit;">
  <!-- Drawer Header -->
  <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #f0f0f0;">
    <div style="display:flex;align-items:center;gap:10px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      <h3 style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#111;">Shopping Bag (<span id="cart-drawer-count">0</span>)</h3>
    </div>
    <button type="button" id="shopify-cart-close" style="background:none;border:none;cursor:pointer;padding:6px;color:#666;font-size:20px;line-height:1;" aria-label="Close Bag">
      ✕
    </button>
  </div>

  <!-- Drawer Body -->
  <div id="shopify-cart-body" style="flex:1;overflow-y:auto;padding:16px 20px;">
    <!-- Empty State -->
    <div id="shopify-cart-empty" style="padding:60px 0;text-align:center;">
      <div style="width:48px;height:48px;margin:0 auto 16px;color:#bbb;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      </div>
      <p style="font-size:14px;color:#666;margin:0 0 20px;">Your shopping bag is empty.</p>
      <a href="/shop" style="display:inline-block;padding:10px 24px;background:#111;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;border-radius:2px;">Continue Shopping</a>
    </div>

    <!-- Items List -->
    <div id="shopify-cart-items"></div>
  </div>

  <!-- Drawer Footer -->
  <div id="shopify-cart-footer" style="display:none;border-top:1px solid #f0f0f0;padding:20px;background:#fafafa;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
      <span style="font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#444;">Subtotal</span>
      <span id="shopify-cart-subtotal" style="font-size:16px;font-weight:700;color:#111;">₹0.00</span>
    </div>
    <p style="font-size:11px;color:#888;margin:0 0 16px;">Taxes and shipping calculated at checkout.</p>
    <button type="button" id="shopify-checkout-btn" style="width:100%;padding:14px;background:#111;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:none;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 0.2s;">
      <span>Proceed to Checkout</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </button>
  </div>
</div>

<script>
(function() {
  window.ShopifyCart = {
    currentCart: null,
    getCartId: function() {
      try {
        return localStorage.getItem('shopify_cart_id') || null;
      } catch (e) {
        return null;
      }
    },
    setCartId: function(id) {
      try {
        if (id) {
          localStorage.setItem('shopify_cart_id', id);
        } else {
          localStorage.removeItem('shopify_cart_id');
        }
      } catch (e) {}
    },
    openDrawer: function() {
      var drawer = document.getElementById('shopify-cart-drawer');
      var overlay = document.getElementById('shopify-cart-overlay');
      if (drawer) drawer.style.transform = 'translateX(0)';
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
      document.body.style.overflow = 'hidden';
    },
    closeDrawer: function() {
      var drawer = document.getElementById('shopify-cart-drawer');
      var overlay = document.getElementById('shopify-cart-overlay');
      if (drawer) drawer.style.transform = 'translateX(100%)';
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
      document.body.style.overflow = '';
    },
    updateBadges: function(count) {
      var num = count || 0;
      var drawerCount = document.getElementById('cart-drawer-count');
      if (drawerCount) drawerCount.textContent = num;

      var badges = document.querySelectorAll('.cart-count-badge, #cart-total-text, #cart-count');
      badges.forEach(function(b) {
        b.textContent = num;
        if (b.classList && b.classList.contains('hidden') && num > 0) {
          b.classList.remove('hidden');
        }
      });

      var hoshiCartHeaders = document.querySelectorAll('#cart .cart-wrapper div:last-child, .side-cart .cart-wrapper div:last-child');
      hoshiCartHeaders.forEach(function(el) {
        el.textContent = num + ' item(s)';
      });
    },
    fetchCart: function() {
      var self = this;
      var cartId = this.getCartId();
      if (!cartId) {
        self.renderCart(null);
        self.updateBadges(0);
        return Promise.resolve(null);
      }
      return fetch('/api/cart?cartId=' + encodeURIComponent(cartId))
        .then(function(res) {
          if (!res.ok) throw new Error('Cart expired');
          return res.json();
        })
        .then(function(data) {
          if (data && data.cart) {
            self.currentCart = data.cart;
            self.renderCart(data.cart);
            self.updateBadges(data.cart.totalQuantity);
            return data.cart;
          } else {
            self.setCartId(null);
            self.renderCart(null);
            self.updateBadges(0);
            return null;
          }
        })
        .catch(function(err) {
          self.setCartId(null);
          self.renderCart(null);
          self.updateBadges(0);
          return null;
        });
    },
    addLine: function(variantId, quantity, options) {
      return this.addItem(variantId, quantity, options);
    },
    addItem: function(variantId, quantity, options) {
      options = options || {};
      var self = this;
      var cartId = this.getCartId();
      var action = cartId ? 'add' : 'create';
      var payload = {
        action: action,
        cartId: cartId,
        lines: [{ merchandiseId: variantId, quantity: quantity || 1 }]
      };

      var btn = (options && options.button) || (options && options.btn) || (options && options.nodeType ? options : null);
      var btnSpan = btn ? btn.querySelector('span') : null;
      var origText = btnSpan ? btnSpan.textContent : '';
      if (btn) {
        btn.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Adding...';
      }

      return fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: new Blob([JSON.stringify(payload)], { type: 'application/json' })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.cart) {
          self.setCartId(data.cart.id);
          self.currentCart = data.cart;
          self.renderCart(data.cart);
          self.updateBadges(data.cart.totalQuantity);
          if (options.buyNow && data.cart.checkoutUrl) {
            window.location.href = data.cart.checkoutUrl;
            return;
          }
          self.openDrawer();
        } else {
          console.error('Add to cart failed:', data && data.error);
          self._showToast(data && data.error ? data.error : 'Failed to add item to bag.');
        }
      })
      .catch(function(err) {
        console.error('Add to cart error:', err);
        self._showToast('Network error. Please try again.');
      })
      .finally(function() {
        if (btn) {
          btn.disabled = false;
          if (btnSpan) btnSpan.textContent = origText;
        }
      });
    },
    _showToast: function(msg) {
      try {
        var t = document.createElement('div');
        t.textContent = msg;
        t.setAttribute('style', 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 20px;border-radius:4px;z-index:99999;font-size:13px;pointer-events:none;opacity:1;transition:opacity 0.4s;');
        document.body.appendChild(t);
        setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 400); }, 3000);
      } catch(e) { console.warn('Toast error:', msg); }
    },
    updateQuantity: function(lineId, quantity) {
      var self = this;
      var cartId = this.getCartId();
      if (!cartId) return;

      if (quantity <= 0) {
        return this.removeItem(lineId);
      }

      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: new Blob([JSON.stringify({
          action: 'update',
          cartId: cartId,
          lines: [{ id: lineId, quantity: quantity }]
        })], { type: 'application/json' })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.cart) {
          self.currentCart = data.cart;
          self.renderCart(data.cart);
          self.updateBadges(data.cart.totalQuantity);
        }
      })
      .catch(function(err) {
        console.error('Update quantity error:', err);
      });
    },
    removeItem: function(lineId) {
      var self = this;
      var cartId = this.getCartId();
      if (!cartId) return;

      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: new Blob([JSON.stringify({
          action: 'remove',
          cartId: cartId,
          lineIds: [lineId]
        })], { type: 'application/json' })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.cart) {
          self.currentCart = data.cart;
          self.renderCart(data.cart);
          self.updateBadges(data.cart.totalQuantity);
        }
      })
      .catch(function(err) {
        console.error('Remove item error:', err);
      });
    },
    renderCart: function(cart) {
      var emptyEl = document.getElementById('shopify-cart-empty');
      var itemsEl = document.getElementById('shopify-cart-items');
      var footerEl = document.getElementById('shopify-cart-footer');
      var subtotalEl = document.getElementById('shopify-cart-subtotal');
      var checkoutBtn = document.getElementById('shopify-checkout-btn');

      if (!cart || !cart.lines || !cart.lines.edges || cart.lines.edges.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (itemsEl) itemsEl.innerHTML = '';
        if (footerEl) footerEl.style.display = 'none';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';

      var subtotalFormatted = '₹0.00';
      if (cart.cost && cart.cost.subtotalAmount) {
        var subAmount = parseFloat(cart.cost.subtotalAmount.amount);
        try {
          subtotalFormatted = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: cart.cost.subtotalAmount.currencyCode || 'INR',
            maximumFractionDigits: 2
          }).format(subAmount);
        } catch (e) {
          subtotalFormatted = (cart.cost.subtotalAmount.currencyCode || '₹') + ' ' + subAmount.toFixed(2);
        }
      }
      if (subtotalEl) subtotalEl.textContent = subtotalFormatted;

      if (checkoutBtn) {
        checkoutBtn.onclick = function() {
          if (cart.checkoutUrl) {
            window.location.href = cart.checkoutUrl;
          }
        };
      }

      var itemsHtml = cart.lines.edges.map(function(edge) {
        var line = edge.node;
        var merch = line.merchandise || {};
        var prod = merch.product || {};
        var imgUrl = (merch.image && merch.image.url) ||
                     (prod.images && prod.images.edges && prod.images.edges[0] && prod.images.edges[0].node && prod.images.edges[0].node.url) ||
                     'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';

        var priceFormatted = '';
        if (merch.price) {
          var pAmt = parseFloat(merch.price.amount);
          try {
            priceFormatted = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: merch.price.currencyCode || 'INR',
              maximumFractionDigits: 2
            }).format(pAmt);
          } catch (e) {
            priceFormatted = (merch.price.currencyCode || '₹') + ' ' + pAmt.toFixed(2);
          }
        }

        var variantTitle = merch.title && merch.title !== 'Default Title' ? merch.title : '';

        return '<div class="shopify-cart-item-row" style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #f0f0f0;align-items:center;">' +
          '<a href="/products/' + (prod.handle || '') + '" style="width:64px;height:64px;flex-shrink:0;background:#f8f8f8;border:1px solid #eee;border-radius:2px;overflow:hidden;display:block;">' +
            '<img src="' + imgUrl + '" alt="' + (prod.title || '') + '" style="width:100%;height:100%;object-fit:cover;" />' +
          '</a>' +
          '<div style="flex:1;min-width:0;">' +
            '<a href="/products/' + (prod.handle || '') + '" style="font-size:12px;font-weight:700;color:#111;text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (prod.title || '') + '</a>' +
            (variantTitle ? '<div style="font-size:11px;color:#777;margin:2px 0 6px;">' + variantTitle + '</div>' : '<div style="height:6px;"></div>') +
            '<div style="display:flex;align-items:center;justify-content:space-between;">' +
              '<div style="display:inline-flex;align-items:center;border:1px solid #ddd;border-radius:2px;overflow:hidden;background:#fff;">' +
                '<button type="button" class="shopify-cart-qty-btn" data-action="decrease" data-line-id="' + line.id + '" data-qty="' + (line.quantity - 1) + '" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;font-size:14px;">−</button>' +
                '<span style="width:28px;text-align:center;font-size:12px;font-weight:600;">' + line.quantity + '</span>' +
                '<button type="button" class="shopify-cart-qty-btn" data-action="increase" data-line-id="' + line.id + '" data-qty="' + (line.quantity + 1) + '" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;font-size:14px;">+</button>' +
              '</div>' +
              '<span style="font-size:13px;font-weight:700;color:#111;">' + priceFormatted + '</span>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="shopify-cart-remove-btn" data-line-id="' + line.id + '" style="background:none;border:none;color:#999;cursor:pointer;padding:6px;margin-left:4px;" title="Remove">' +
            '✕' +
          '</button>' +
        '</div>';
      }).join('');

      if (itemsEl) itemsEl.innerHTML = itemsHtml;
    }
  };

  // Bind global cart trigger clicks
  document.addEventListener('click', function(e) {
    var cartTrigger = e.target.closest('a[href*="checkout/cart"], a[aria-label="Cart"], #cart, .side-cart');
    if (cartTrigger && !e.target.closest('#shopify-cart-drawer')) {
      e.preventDefault();
      ShopifyCart.openDrawer();
    }
    if (e.target.closest('#shopify-cart-close') || e.target.id === 'shopify-cart-overlay') {
      e.preventDefault();
      ShopifyCart.closeDrawer();
    }
    var qtyBtn = e.target.closest('.shopify-cart-qty-btn');
    if (qtyBtn) {
      e.preventDefault();
      var lineId = qtyBtn.getAttribute('data-line-id');
      var qty = parseInt(qtyBtn.getAttribute('data-qty'), 10) || 0;
      ShopifyCart.updateQuantity(lineId, qty);
    }
    var removeBtn = e.target.closest('.shopify-cart-remove-btn');
    if (removeBtn) {
      e.preventDefault();
      var lineId = removeBtn.getAttribute('data-line-id');
      ShopifyCart.removeItem(lineId);
    }
  });

  // Global search binder for header across all pages
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var target = e.target;
      if (target && (target.id === 'hoshi-search-input' || target.name === 'search')) {
        e.preventDefault();
        var q = (target.value || '').trim();
        window.location.href = q ? '/search?q=' + encodeURIComponent(q) : '/shop';
      }
    }
  });

  document.addEventListener('click', function(e) {
    var searchBtn = e.target.closest('#search button, .mobile-search');
    if (searchBtn && !searchBtn.closest('#shopify-filter-drawer')) {
      var input = document.getElementById('hoshi-search-input') || document.querySelector('input[name="search"]');
      if (input && input.value.trim()) {
        e.preventDefault();
        window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
      }
    }
  });

  // Hydrate cart on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ShopifyCart.fetchCart();
    });
  } else {
    ShopifyCart.fetchCart();
  }

  // ----------------------------------------------------
  // SHOPIFY WISHLIST SUBSYSTEM (STEP 6)
  // ----------------------------------------------------
  var ShopifyWishlist = {
    STORAGE_KEY: 'shopify_wishlist',
    getItems: function() {
      try {
        var raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return [];
        var parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(function(it) {
          return it && (it.handle || it.id);
        }).map(function(it) {
          if (typeof it === 'string') return { id: it, handle: it };
          return {
            id: it.id || '',
            handle: (it.handle || it.id || '').trim().toLowerCase()
          };
        });
      } catch (e) {
        return [];
      }
    },
    saveItems: function(items) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save wishlist:', e);
      }
      this.updateBadges();
      this.updateAllButtons();
      window.dispatchEvent(new CustomEvent('shopify_wishlist_updated', { detail: { items: items } }));
    },
    has: function(handleOrId) {
      if (!handleOrId) return false;
      var target = String(handleOrId).trim().toLowerCase();
      var items = this.getItems();
      return items.some(function(it) {
        return (it.handle && it.handle.toLowerCase() === target) ||
               (it.id && it.id.toLowerCase() === target);
      });
    },
    add: function(item) {
      var handle = typeof item === 'string' ? item : (item.handle || item.id);
      var id = typeof item === 'object' && item.id ? item.id : '';
      if (!handle) return false;
      if (this.has(handle) || (id && this.has(id))) return false;
      var items = this.getItems();
      items.push({ id: id, handle: handle.trim().toLowerCase() });
      this.saveItems(items);
      return true;
    },
    remove: function(handleOrId) {
      if (!handleOrId) return false;
      var target = String(handleOrId).trim().toLowerCase();
      var items = this.getItems();
      var initialLen = items.length;
      items = items.filter(function(it) {
        return !( (it.handle && it.handle.toLowerCase() === target) ||
                  (it.id && it.id.toLowerCase() === target) );
      });
      if (items.length !== initialLen) {
        this.saveItems(items);
        return true;
      }
      return false;
    },
    toggle: function(item) {
      var handle = typeof item === 'string' ? item : (item.handle || item.id);
      if (!handle) return false;
      if (this.has(handle)) {
        this.remove(handle);
        return false;
      } else {
        this.add(item);
        return true;
      }
    },
    getCount: function() {
      return this.getItems().length;
    },
    updateBadges: function() {
      var count = this.getCount();
      // Update text in elements like #wishlist-total, .wishlist-total, .wishlist-count
      document.querySelectorAll('#wishlist-total, .wishlist-total, .wishlist-count, [data-wishlist-count]').forEach(function(el) {
        el.setAttribute('title', 'Wish List (' + count + ')');
        var spans = el.querySelectorAll('span');
        spans.forEach(function(sp) {
          if (sp.textContent && sp.textContent.indexOf('Wish List') !== -1) {
            sp.textContent = 'Wish List (' + count + ')';
          }
        });
        if (el.tagName.toLowerCase() === 'span' && el.classList.contains('wishlist-count')) {
          el.textContent = count;
        }
      });

      // Update wishlist count on /wishlist page if present
      var pageCount = document.getElementById('wishlist-page-count') || document.getElementById('wishlist-items-count');
      if (pageCount) {
        pageCount.textContent = count;
      }

      // Add/update floating numeric badge pill on header links to /wishlist
      document.querySelectorAll('a[href*="/wishlist"], a[href*="account/wishlist"]').forEach(function(a) {
        // Normalize href to /wishlist
        a.setAttribute('href', '/wishlist');
        var badge = a.querySelector('.wishlist-badge');
        if (!badge && count > 0 && (a.querySelector('svg') || a.querySelector('i'))) {
          a.style.position = 'relative';
          badge = document.createElement('span');
          badge.className = 'wishlist-badge';
          badge.style.cssText = 'position:absolute;top:-6px;right:-8px;background:#e53e3e;color:#fff;font-size:10px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,0.2);';
          a.appendChild(badge);
        }
        if (badge) {
          badge.textContent = count;
          badge.style.display = count > 0 ? 'flex' : 'none';
        }
      });
    },
    updateAllButtons: function() {
      var self = this;
      document.querySelectorAll('[data-wishlist-btn], .wishlist-heart-btn, #button-add-to-wishlist').forEach(function(btn) {
        var handle = btn.getAttribute('data-handle') || '';
        var id = btn.getAttribute('data-product-id') || '';
        var isFav = (handle && self.has(handle)) || (id && self.has(id));

        if (isFav) {
          btn.classList.add('is-active', 'active');
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('title', 'Remove from Wishlist');
          var svg = btn.querySelector('svg.heart-icon, svg');
          if (svg) {
            svg.setAttribute('fill', '#e53e3e');
            svg.setAttribute('stroke', '#e53e3e');
          }
          var icon = btn.querySelector('i.fa-heart, i.iconfont');
          if (icon) {
            icon.classList.add('active');
            icon.style.color = '#e53e3e';
          }
        } else {
          btn.classList.remove('is-active', 'active');
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('title', 'Add to Wishlist');
          var svg = btn.querySelector('svg.heart-icon, svg');
          if (svg) {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
          }
          var icon = btn.querySelector('i.fa-heart, i.iconfont');
          if (icon) {
            icon.classList.remove('active');
            icon.style.color = '';
          }
        }
      });
    }
  };

  window.ShopifyWishlist = ShopifyWishlist;

  // Intercept OpenCart legacy wishlist calls to prevent broken /index.php requests
  window.wishlist = {
    add: function(handleOrId) {
      ShopifyWishlist.add(handleOrId);
    },
    remove: function(handleOrId) {
      ShopifyWishlist.remove(handleOrId);
    }
  };

  // Delegated click listener in capture phase for heart buttons across all pages
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-wishlist-btn], .wishlist-heart-btn, #button-add-to-wishlist');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      var handle = btn.getAttribute('data-handle') || '';
      var id = btn.getAttribute('data-product-id') || '';
      if (!handle && !id) return;
      ShopifyWishlist.toggle({ handle: handle, id: id });
    }
  }, true);

  // Delegated click listeners for Prestige Quick-Add actions in capture phase
  document.addEventListener('click', function(e) {
    // 1. Single variant quick-add
    var singleBtn = e.target.closest('[data-quick-add-single]');
    if (singleBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var variantId = singleBtn.getAttribute('data-variant-id');
      if (variantId && window.ShopifyCart) {
        window.ShopifyCart.addItem(variantId, 1, { button: singleBtn });
      }
      return;
    }

    // 2. Multi-variant quick-add toggle drawer
    var toggleBtn = e.target.closest('[data-quick-add-toggle]');
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var handle = toggleBtn.getAttribute('data-handle');
      var drawer = handle ? document.getElementById('quick-variants-' + handle) : null;
      if (drawer) {
        var isOpen = drawer.classList.contains('is-open');
        // Close any other open variant drawers
        document.querySelectorAll('.prestige-quick-variants-drawer.is-open').forEach(function(d) {
          d.classList.remove('is-open');
        });
        if (!isOpen) {
          drawer.classList.add('is-open');
        }
      }
      return;
    }

    // 3. Close variant drawer button
    var closeBtn = e.target.closest('[data-quick-variants-close]');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var drawer = closeBtn.closest('.prestige-quick-variants-drawer');
      if (drawer) drawer.classList.remove('is-open');
      return;
    }

    // 4. Quick add specific variant from drawer
    var variantBtn = e.target.closest('[data-quick-add-variant]');
    if (variantBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var variantId = variantBtn.getAttribute('data-quick-add-variant');
      var drawer = variantBtn.closest('.prestige-quick-variants-drawer');
      if (drawer) drawer.classList.remove('is-open');
      if (variantId && window.ShopifyCart) {
        window.ShopifyCart.addItem(variantId, 1, { button: variantBtn });
      }
      return;
    }

    // 5. Outside click closes all open variant drawers
    if (!e.target.closest('.prestige-quick-variants-drawer') && !e.target.closest('[data-quick-add-toggle]')) {
      document.querySelectorAll('.prestige-quick-variants-drawer.is-open').forEach(function(d) {
        d.classList.remove('is-open');
      });
    }
  }, true);

  // Sync across tabs via storage event
  window.addEventListener('storage', function(e) {
    if (e.key === 'shopify_wishlist') {
      ShopifyWishlist.updateBadges();
      ShopifyWishlist.updateAllButtons();
    }
  });

  // Initial sync
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ShopifyWishlist.updateBadges();
      ShopifyWishlist.updateAllButtons();
    });
  } else {
    ShopifyWishlist.updateBadges();
    ShopifyWishlist.updateAllButtons();
  }
})();
</script>
<style>
.wishlist-heart-btn.is-active svg.heart-icon,
.wishlist-heart-btn.active svg.heart-icon {
  fill: #e53e3e !important;
  stroke: #e53e3e !important;
}
#button-add-to-wishlist.active,
#button-add-to-wishlist.is-active,
#button-add-to-wishlist i.active {
  color: #e53e3e !important;
}
.wishlist-heart-btn:hover {
  transform: scale(1.12);
}

/* ==========================================================================
   PRESTIGE ALLURE PRODUCT CARD STYLES
   ========================================================================== */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
.prestige-product-card {
  background: #ffffff;
  border: none !important;
  box-shadow: none !important;
  margin-bottom: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.prestige-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #f8f8f8;
  overflow: hidden;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prestige-card-image-link {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  text-decoration: none;
}
.prestige-card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  padding: 16px;
  display: block;
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.prestige-primary-img {
  position: relative;
  opacity: 1;
}
.prestige-secondary-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
@media (hover: hover) and (pointer: fine) {
  .prestige-product-card:hover .prestige-primary-img.has-secondary {
    opacity: 0;
  }
  .prestige-product-card:hover .prestige-secondary-img {
    opacity: 1;
    transform: scale(1.04);
  }
  .prestige-product-card:hover .prestige-primary-img:not(.has-secondary) {
    transform: scale(1.04);
  }
  .prestige-product-card:hover .prestige-quick-add-btn {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}
.prestige-card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 4;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  line-height: 1;
  pointer-events: none;
}
.badge--sale, .prestige-badge-sale {
  background: #000000;
  color: #ffffff;
}
.badge--new, .prestige-badge-new {
  background: #1a1a1a;
  color: #ffffff;
}
.badge--soldout, .prestige-badge-soldout {
  background: #666666;
  color: #ffffff;
}
.prestige-wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1), background 0.2s ease, box-shadow 0.2s ease;
}
.prestige-wishlist-btn:hover {
  transform: scale(1.08);
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
}
.prestige-quick-add-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
}
@media (hover: none) or (max-width: 768px) {
  .prestige-quick-add-btn {
    opacity: 1 !important;
    transform: translateY(0) !important;
    pointer-events: auto !important;
  }
}
.prestige-quick-add-btn:hover {
  background: #222222;
  transform: scale(1.08);
}
.prestige-quick-variants-drawer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  padding: 12px 14px;
  z-index: 10;
  border-top: 1px solid rgba(0,0,0,0.08);
  transform: translateY(105%);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
}
.prestige-quick-variants-drawer.is-open {
  transform: translateY(0);
}
.prestige-quick-variants-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.prestige-quick-variants-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #222;
}
.prestige-quick-variants-close {
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 0 4px;
}
.prestige-quick-variants-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.prestige-variant-pill {
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #111;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.prestige-variant-pill:hover {
  border-color: #111;
  background: #111;
  color: #fff;
}
.prestige-variant-pill.disabled {
  opacity: 0.35;
  cursor: not-allowed;
  text-decoration: line-through;
  pointer-events: none;
}
.prestige-card-info {
  padding: 12px 2px 4px;
  text-align: left;
}
.prestige-card-vendor {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 4px;
}
.prestige-card-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
  color: #111;
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.prestige-card-title a {
  color: #111;
  text-decoration: none;
  transition: opacity 0.2s ease;
}
.prestige-card-title a:hover {
  opacity: 0.7;
}
.prestige-card-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}
.prestige-price-current {
  font-weight: 700;
  color: #111;
}
.prestige-price-compare {
  font-size: 12px;
  color: #888;
  text-decoration: line-through;
}
.prestige-card-swatches {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
}
.prestige-card-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.18);
  display: inline-block;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: default;
}
.prestige-card-swatch:hover {
  transform: scale(1.25);
}
.prestige-card-swatch-more {
  font-size: 10px;
  font-weight: 600;
  color: #888;
  margin-left: 2px;
}
.prestige-card-col {
  box-sizing: border-box;
}
#shop-product-grid {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

/* ==========================================================================
   PRESTIGE ALLURE PRODUCT DETAIL PAGE (PDP) STYLES
   ========================================================================== */
.brood-pdp-main-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 80px;
}
.prestige-pdp-container {
  color: #111;
}
.prestige-breadcrumbs {
  padding: 18px 0 24px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.prestige-breadcrumbs a {
  color: #888;
  text-decoration: none;
  transition: color 0.15s ease;
}
.prestige-breadcrumbs a:hover {
  color: #111;
}
.prestige-breadcrumbs .bc-sep {
  color: #ccc;
}
.prestige-breadcrumbs .bc-current {
  color: #111;
  font-weight: 600;
}
.prestige-pdp-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 56px;
  align-items: start;
}
.prestige-gallery-col {
  position: relative;
}
.prestige-gallery-sticky {
  position: sticky;
  top: 90px;
}
.prestige-main-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #f8f8f8;
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prestige-main-slide {
  display: none;
  width: 100%;
  height: 100%;
}
.prestige-main-slide.is-active {
  display: flex;
  align-items: center;
  justify-content: center;
}
.prestige-zoom-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  overflow: hidden;
  position: relative;
}
.prestige-pdp-main-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, transform-origin;
}
.prestige-zoom-trigger {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 5;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}
.prestige-zoom-trigger:hover {
  transform: scale(1.08);
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.14);
}
.prestige-thumbs-strip {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.prestige-thumb-item {
  width: 72px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 2px;
  border: 1.5px solid transparent;
  background: #f8f8f8;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.prestige-thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.prestige-thumb-item.is-active,
.prestige-thumb-item:hover {
  border-color: #111;
}
.prestige-info-col {
  padding-left: 12px;
}
.prestige-info-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.prestige-vendor-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #777;
}
.prestige-stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.prestige-stock-badge.in-stock {
  color: #15803d;
}
.prestige-stock-badge.out-of-stock {
  color: #dc2626;
}
.prestige-stock-badge .stock-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.prestige-stock-badge.in-stock .stock-dot {
  background: #16a34a;
}
.prestige-stock-badge.out-of-stock .stock-dot {
  background: #dc2626;
}
.prestige-product-title {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.03em;
  line-height: 1.25;
  text-transform: uppercase;
  color: #111;
  margin: 0 0 16px;
}
.prestige-price-box {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.prestige-current-price {
  font-size: 24px;
  font-weight: 700;
  color: #111;
}
.prestige-compare-price {
  font-size: 16px;
  color: #888;
  text-decoration: line-through;
}
.prestige-discount-pill {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  background: #111;
  color: #fff;
  border-radius: 2px;
  text-transform: uppercase;
}
.prestige-variants-section {
  margin-bottom: 24px;
}
.prestige-opt-group {
  margin-bottom: 18px;
}
.prestige-opt-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 10px;
}
.prestige-opt-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.prestige-opt-item {
  position: relative;
  cursor: pointer;
  margin: 0;
}
.prestige-opt-item input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.prestige-opt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 42px;
  padding: 0 16px;
  border: 1.5px solid #dcdcdc;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #111;
  border-radius: 2px;
  transition: all 0.18s ease;
}
.prestige-opt-item:hover .prestige-opt-btn {
  border-color: #111;
}
.prestige-opt-item input[type="radio"]:checked + .prestige-opt-btn {
  border-color: #111;
  background: #111;
  color: #fff;
}
.prestige-opt-btn.disabled {
  opacity: 0.35;
  text-decoration: line-through;
  pointer-events: none;
  background: #f5f5f5;
}
.prestige-qty-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.prestige-qty-heading {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #333;
}
.prestige-qty-controls {
  display: flex;
  align-items: center;
  border: 1.5px solid #dcdcdc;
  border-radius: 2px;
  height: 42px;
}
.prestige-qty-btn {
  width: 38px;
  height: 100%;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}
.prestige-qty-btn:hover {
  background: #f0f0f0;
}
.prestige-qty-field {
  width: 44px;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #111;
  background: transparent;
}
.prestige-actions-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}
.prestige-btn-primary {
  width: 100%;
  height: 52px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.prestige-btn-primary:hover {
  background: #000;
}
.prestige-btn-primary:active {
  transform: scale(0.99);
}
.prestige-btn-secondary {
  width: 100%;
  height: 52px;
  background: #fff;
  color: #111;
  border: 1.5px solid #111;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}
.prestige-btn-secondary:hover {
  background: #111;
  color: #fff;
}
.prestige-btn-wishlist {
  width: 100%;
  height: 46px;
  background: transparent;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.18s ease;
}
.prestige-btn-wishlist:hover {
  border-color: #111;
  color: #111;
}
.prestige-trust-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}
.trust-feat-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 12px;
  line-height: 1.4;
}
.trust-feat-item svg {
  flex-shrink: 0;
  color: #111;
  margin-top: 2px;
}
.trust-feat-item strong {
  display: block;
  font-weight: 700;
  color: #111;
}
.trust-feat-item span {
  color: #666;
}
.prestige-accordion-stack {
  display: flex;
  flex-direction: column;
}
.prestige-acc-item {
  border-bottom: 1px solid #eee;
}
.prestige-acc-item summary {
  list-style: none;
  outline: none;
}
.prestige-acc-item summary::-webkit-details-marker {
  display: none;
}
.prestige-acc-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #111;
  transition: color 0.15s ease;
}
.prestige-acc-trigger:hover {
  color: #444;
}
.acc-icon {
  font-size: 18px;
  font-weight: 400;
  color: #888;
  transition: transform 0.2s ease;
}
.prestige-acc-item[open] .acc-icon {
  transform: rotate(45deg);
}
.prestige-acc-content {
  padding: 0 0 18px;
  font-size: 13px;
  line-height: 1.65;
  color: #555;
}
.prestige-acc-content ul {
  margin: 8px 0 0 18px;
  padding: 0;
}
.prestige-acc-content li {
  margin-bottom: 6px;
}
.prestige-specs-table, .prestige-size-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.prestige-specs-table th, .prestige-specs-table td,
.prestige-size-table th, .prestige-size-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}
.prestige-specs-table th, .prestige-size-table th {
  font-weight: 600;
  color: #111;
  width: 35%;
}
.prestige-specs-table td, .prestige-size-table td {
  color: #555;
}
.prestige-recommendations-section, .prestige-recently-viewed-section {
  margin-top: 72px;
}
.prestige-section-header {
  text-align: center;
  margin-bottom: 36px;
}
.prestige-section-subtitle {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
}
.prestige-section-heading {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #111;
  margin: 0;
}
.prestige-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
  background: rgba(0,0,0,0.92);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.prestige-lightbox.is-open {
  display: flex;
}
.prestige-lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 36px;
  cursor: pointer;
  line-height: 1;
  z-index: 10;
  transition: transform 0.2s ease;
}
.prestige-lightbox-close:hover {
  transform: scale(1.15);
}
.prestige-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s ease, transform 0.15s ease;
}
.prestige-lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-50%) scale(1.08);
}
.prestige-lightbox-nav.prev {
  left: 24px;
}
.prestige-lightbox-nav.next {
  right: 24px;
}
.prestige-lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 14px;
  border-radius: 20px;
  pointer-events: none;
}
.prestige-lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#pdp-lightbox-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.prestige-mobile-gallery-stacked {
  display: none;
}

@media (max-width: 1024px) {
  .prestige-pdp-layout {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}
@media (max-width: 768px) {
  .brood-pdp-main-wrapper {
    padding: 0 16px 60px;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .prestige-pdp-container {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .prestige-pdp-layout {
    grid-template-columns: 1fr;
    gap: 24px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .prestige-gallery-col {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .prestige-desktop-gallery {
    display: none;
  }
  .prestige-mobile-gallery-stacked {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .prestige-mobile-media-item {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    background: #f8f8f8;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;
  }
  .prestige-mobile-media-item img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
  .prestige-mobile-zoom-pill {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #111;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .prestige-gallery-sticky {
    position: static;
  }
  .prestige-info-col {
    padding-left: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .prestige-product-title {
    font-size: 22px;
    word-break: break-word;
  }
  .prestige-breadcrumbs {
    padding: 12px 0 16px;
    font-size: 10px;
    word-break: break-word;
  }
  .prestige-specs-table, .prestige-size-table {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .prestige-quick-add-btn {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .prestige-recommendations-section, .prestige-recently-viewed-section {
    margin-top: 48px;
  }
  .prestige-lightbox-nav {
    width: 38px;
    height: 38px;
  }
  .prestige-lightbox-nav.prev {
    left: 8px;
  }
  .prestige-lightbox-nav.next {
    right: 8px;
  }
}
@media (max-width: 390px) {
  .brood-pdp-main-wrapper {
    padding: 0 12px 48px;
  }
  .prestige-product-title {
    font-size: 19px;
  }
  .prestige-btn-primary, .prestige-btn-secondary {
    height: 48px;
    font-size: 12px;
  }
  .prestige-current-price {
    font-size: 20px;
  }
}
</style>
`;
}

