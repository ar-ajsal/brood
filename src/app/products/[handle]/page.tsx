import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import { ProductClient } from './ProductClient';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({
    handle: p.handle,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
