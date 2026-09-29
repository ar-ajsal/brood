/**
 * Product Data Layer
 * Note: Real dynamic product data is sourced directly from Shopify Storefront API via @/lib/shopify.
 * Static/hardcoded mock product data has been decommissioned.
 */

export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  gallery: string[];
  category: string;
  brand: string;
  sku: string;
  rating: number;
  reviewsCount: number;
  description: string;
  sizes?: string[];
  colors?: string[];
}

// All product catalog data is sourced live from Shopify Storefront API.
export const products: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category?: string): Product[] {
  if (!category || category === 'All') return products;
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}
