import { notFound } from 'next/navigation';
import { getCategories, getProductsByCategory } from '@/lib/shopify';
import { CollectionClient } from './CollectionClient';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(c => ({
    handle: c.handle,
  }));
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.handle === handle);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(handle);

  return <CollectionClient categoryHandle={handle} categoryTitle={category.title} products={products} />;
}
