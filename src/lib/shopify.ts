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
 * Render single product card for shop and collection listing.
 * Grid responsive breakdown:
 * - Desktop: 4 columns (col-md-3, col-lg-3)
 * - Tablet: 3 columns (col-sm-4)
 * - Mobile: 2 columns (col-xs-6)
 */
export function renderShopProductCard(product: ShopifyProduct): string {
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
    discountBadge = `<span class="home-low-price-recommend-discount">-${pct}%</span>`;
  }

  const primaryImage =
    product.images.edges[0]?.node?.url ||
    'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';

  const productLink = `/products/${product.handle}`;

  return `
    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product-item hoshi-recommend-item home-low-price-recommend-item">
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
              <div>
                <div class="product-price">
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
 * Render entire Product Detail HTML dynamically into the existing template.
 */
export function renderProductDetailHtml(templateHtml: string, product: ShopifyProduct): string {
  const minPrice = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const formattedPrice = formatPrice(minPrice.amount, minPrice.currencyCode);
  const formattedComparePrice =
    comparePrice && parseFloat(comparePrice.amount) > parseFloat(minPrice.amount)
      ? formatPrice(comparePrice.amount, comparePrice.currencyCode)
      : null;

  let html = templateHtml;

  // 1. Page title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(product.title)} - TheHoshi</title>`);

  // 2. Swiper slides & thumbnails
  const images = product.images.edges;
  let slidesHtml = '';
  let thumbsHtml = '';

  if (images.length > 0) {
    slidesHtml = images
      .map(
        (edge, idx) => `
      <div class="swiper-slide flex items-center justify-center overflow-hidden">
        <img src="${edge.node.url}" alt="${escapeHtml(edge.node.altText || product.title)}" loading="${idx === 0 ? 'eager' : 'lazy'}" decoding="async" class="w-full h-full object-contain" />
      </div>
    `
      )
      .join('\n');

    thumbsHtml = images
      .map(
        (edge, idx) => `
      <button type="button" class="product-thumb-item ${idx === 0 ? 'active' : ''}" data-slide-index="${idx}" aria-label="View product image ${idx + 1}">
        <img src="${edge.node.url}" alt="${escapeHtml(edge.node.altText || product.title)} thumbnail ${idx + 1}" loading="lazy" decoding="async" />
      </button>
    `
      )
      .join('\n');
  } else {
    slidesHtml = `
      <div class="swiper-slide flex items-center justify-center overflow-hidden">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#888;">No image available</div>
      </div>
    `;
    thumbsHtml = '';
  }

  // Inject slides
  html = html.replace(
    /(<div id="product-slides-ajax"[^>]*>[\s\S]*?<div class="swiper-wrapper">)[\s\S]*?(<\/div>\s*<\/div>\s*<div id="swipe-hint-bottom")/i,
    `$1\n${slidesHtml}\n$2`
  );

  // Inject thumbnails
  html = html.replace(
    /(<div id="product-thumb-grid"[^>]*>)[\s\S]*?(<\/div>\s*<button type="button" class="product-thumb-nav product-thumb-next")/i,
    `$1\n${thumbsHtml}\n$2`
  );

  // Swipe fraction
  html = html.replace(
    /<div id="swipe-fraction" class="swipe-fraction">[\s\S]*?<\/div>/i,
    `<div id="swipe-fraction" class="swipe-fraction">1 / ${Math.max(1, images.length)}</div>`
  );

  // 3. Product Info: Title, Brand, Availability, Prices
  const availabilityBadge = product.availableForSale
    ? `<span style="display:inline-block;padding:3px 10px;font-size:11px;font-weight:700;letter-spacing:0.05em;background:#e6f4ea;color:#137333;border-radius:3px;margin-bottom:8px;">IN STOCK</span>`
    : `<span style="display:inline-block;padding:3px 10px;font-size:11px;font-weight:700;letter-spacing:0.05em;background:#fce8e6;color:#c5221f;border-radius:3px;margin-bottom:8px;">OUT OF STOCK</span>`;

  const metaLine = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px;color:#777;text-transform:uppercase;letter-spacing:0.06em;"><span>${escapeHtml(product.vendor || 'TheHoshi')}</span>${product.productType ? `<span>•</span><span>${escapeHtml(product.productType)}</span>` : ''}</div>`;

  const priceBlock = `
    <div class="px-5 pt-5 pb-2">
      ${availabilityBadge}
      ${metaLine}
      <h2 class="text-lg font-medium leading-tight text-gray-900 mb-2">${escapeHtml(product.title)}</h2>
      <div class="flex items-end gap-2 mb-4">
        <span class="text-2xl font-bold text-[#E60000]">${formattedPrice}</span>
        ${formattedComparePrice ? `<span class="text-sm text-gray-400 line-through mb-1">${formattedComparePrice}</span>` : ''}
        ${formattedComparePrice ? `<span class="reference-retail-price" style="display:inline-block;white-space:nowrap;margin-left:8px;color:#777;font-size:12px;text-decoration:line-through;">≈ ${formattedComparePrice} Luxury Retail</span>` : ''}
      </div>
    </div>
  `;

  html = html.replace(
    /<div class="px-5 pt-5 pb-2">[\s\S]*?<\/div>\s*<\/div>/i,
    priceBlock
  );

  // 4. Options / Variants & Quantity
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
      <div class="option-group-wrapper required">
        <div class="option-label luxury-label">${escapeHtml(opt.name)}</div>
        <div class="luxury-option-grid">
          ${opt.values
            .map((val) => {
              const isChecked = val === defaultVal;
              return `
            <label class="luxury-option-item">
              <input type="radio" 
                     class="required-1 luxury-variant-radio ${isChecked ? 'active' : ''}" 
                     name="option[${escapeHtml(opt.name)}]" 
                     data-option-name="${escapeHtml(opt.name)}" 
                     value="${escapeHtml(val)}" 
                     ${isChecked ? 'checked="checked"' : ''} />
              <div class="option-btn-content">${escapeHtml(val)}</div>
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

  const quantityHtml = `
    <div class="option-group-wrapper" id="pdp-quantity-wrapper" style="margin-top: 14px;">
      <div class="option-label luxury-label" style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Quantity</div>
      <div class="luxury-quantity-wrapper flex items-center" id="product-quantity" style="display:inline-flex;align-items:center;border:1px solid #d9d9d9;border-radius:2px;overflow:hidden;background:#fff;">
        <button type="button" class="quantity-down" id="pdp-qty-down" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;cursor:pointer;font-size:16px;color:#333;">−</button>
        <input type="text" name="quantity" value="1" size="2" id="input-quantity" class="form-control text-center" style="width:48px;height:36px;border:none;border-left:1px solid #eee;border-right:1px solid #eee;text-align:center;font-weight:600;font-size:14px;color:#111;padding:0;" readonly />
        <button type="button" class="quantity-up" id="pdp-qty-up" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;cursor:pointer;font-size:16px;color:#333;">+</button>
      </div>
    </div>
  `;

  const variantControls = `
    <input type="hidden" name="variant_id" id="selected-variant-id" value="${defaultVariant ? defaultVariant.id : ''}" />
    <script id="shopify-variants-data" type="application/json">${JSON.stringify(variants)}</script>
    ${optionsHtml}
    ${quantityHtml}
  `;

  html = html.replace(
    /(<div id="options" class="space-y-6">)[\s\S]*?(<\/div>\s*<script type="text\/javascript"><!--)/i,
    `$1\n${variantControls}\n$2`
  );

  // 5. Description tab
  const descriptionContent =
    product.descriptionHtml && product.descriptionHtml.trim().length > 0
      ? product.descriptionHtml
      : product.description
      ? `<p style="padding:16px 0;line-height:1.7;color:#444;">${escapeHtml(product.description)}</p>`
      : `<p style="padding:16px 0;color:#888;">No description available for this product.</p>`;

  html = html.replace(
    /(<div class="tab-pane active" id="tab-description">)[\s\S]*?(<\/div>\s*<style>)/i,
    `$1\n<div class="prose prose-sm max-w-none luxury-detail" style="padding:16px 0;">${descriptionContent}</div>\n$2`
  );

  // 6. Wishlist Button on Product Page
  html = html.replace(
    /id="button-add-to-wishlist"[^>]*>/i,
    `id="button-add-to-wishlist" data-wishlist-btn data-handle="${escapeHtml(product.handle)}" data-product-id="${escapeHtml(product.id)}" aria-label="Add to Wishlist" title="Add to Wishlist">`
  );

  const pdpScript = `
    <script>
    (function() {
      var variantsEl = document.getElementById('shopify-variants-data');
      if (!variantsEl) return;
      var variants = JSON.parse(variantsEl.textContent || '[]');
      var variantInput = document.getElementById('selected-variant-id');
      var priceDisplay = document.querySelector('.text-2xl.font-bold') || document.querySelector('.total-price-info');

      function getSelectedOptions() {
        var selected = {};
        var checked = document.querySelectorAll('.luxury-variant-radio:checked');
        checked.forEach(function(r) {
          var optName = r.getAttribute('data-option-name');
          if (optName) selected[optName] = r.value;
        });
        return selected;
      }

      function updateVariant() {
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

          var addBtns = document.querySelectorAll('.button-add-to-cart, [data-action="add-to-cart"]');
          var buyBtns = document.querySelectorAll('.button-buy-now, [data-action="buy-now"]');

          if (!matched.availableForSale) {
            addBtns.forEach(function(btn) {
              btn.disabled = true;
              btn.style.opacity = '0.4';
              btn.style.cursor = 'not-allowed';
              var s = btn.querySelector('span');
              if (s) s.textContent = 'Out of Stock';
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
              var s = btn.querySelector('span');
              if (s) s.textContent = 'Add to Cart';
            });
            buyBtns.forEach(function(btn) {
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.cursor = 'pointer';
            });
          }
        }
      }

      // Variant selection radio listeners
      document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('luxury-variant-radio')) {
          updateVariant();
        }
      });
      document.addEventListener('click', function(e) {
        var label = e.target.closest('.luxury-option-item');
        if (label) {
          var radio = label.querySelector('.luxury-variant-radio');
          if (radio && !radio.checked) {
            radio.checked = true;
            updateVariant();
          }
        }
      });

      // Quantity buttons
      document.addEventListener('click', function(e) {
        var up = e.target.closest('#pdp-qty-up, .quantity-up');
        if (up) {
          e.preventDefault();
          var input = document.getElementById('input-quantity');
          if (input) {
            var cur = parseInt(input.value, 10) || 1;
            input.value = cur + 1;
          }
        }
        var down = e.target.closest('#pdp-qty-down, .quantity-down');
        if (down) {
          e.preventDefault();
          var input = document.getElementById('input-quantity');
          if (input) {
            var cur = parseInt(input.value, 10) || 1;
            if (cur > 1) input.value = cur - 1;
          }
        }
      });

      // Add to Cart & Buy Now interception with capturing phase to preempt legacy handlers
      document.addEventListener('click', function(e) {
        var addBtn = e.target.closest('.button-add-to-cart, [data-action="add-to-cart"]');
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          var vId = variantInput ? variantInput.value : (variants[0] ? variants[0].id : null);
          if (!vId) return;
          var qtyInput = document.getElementById('input-quantity');
          var q = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
          if (window.ShopifyCart) {
            window.ShopifyCart.addItem(vId, q, { button: addBtn });
          } else {
            console.error('ShopifyCart not ready');
          }
          return;
        }

        var buyBtn = e.target.closest('.button-buy-now, [data-action="buy-now"]');
        if (buyBtn) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          var vId = variantInput ? variantInput.value : (variants[0] ? variants[0].id : null);
          if (!vId) return;
          var qtyInput = document.getElementById('input-quantity');
          var q = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
          if (window.ShopifyCart) {
            window.ShopifyCart.addItem(vId, q, { button: buyBtn, buyNow: true });
          } else {
            console.error('ShopifyCart not ready');
          }
          return;
        }
      }, true);

      updateVariant();
    })();
    </script>
  `;

  html = html.replace('</body>', `${renderCartDrawerHtml()}\n${pdpScript}\n</body>`);

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
    jewellery: 'Jewellery',
    jewelry: 'Jewellery',
    accessories: 'Accessories',
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
</style>
`;
}

