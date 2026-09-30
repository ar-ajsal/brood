'use client';

import Link from 'next/link';
import { MockProduct } from '@/data/mock/products';
import { ProductCard } from '@/components/product/ProductCard';

export function CollectionClient({ categoryHandle, categoryTitle, products }: { categoryHandle: string; categoryTitle: string, products: MockProduct[] }) {
  return (
    <div className="pt-[var(--header-h)] min-h-[100dvh]">
      <div className="container py-8 lg:py-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-6">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-black">{categoryTitle}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight uppercase">
              {categoryTitle}
            </h1>
            <p className="text-black/50 mt-4 font-medium">{products.length} Results</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-black/50 text-lg">
              No products available in this category yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
