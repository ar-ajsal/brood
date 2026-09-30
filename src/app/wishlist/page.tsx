import { getProducts } from '@/lib/shopify';
import { WishlistClient } from './WishlistClient';

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistClient products={products} />;
}
