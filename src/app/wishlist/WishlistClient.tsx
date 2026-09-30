'use client';

import Link from 'next/link';
import { useStore } from '@/components/layout/ClientRoot';
import { MockProduct } from '@/data/mock/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Heart } from '@phosphor-icons/react';

export function WishlistClient({ products }: { products: MockProduct[] }) {
  const { wishlist } = useStore();
  
  const wishlistProducts = wishlist
    .map(handle => products.find(p => p.handle === handle))
    .filter(Boolean) as MockProduct[];

  return (
    <div className="pt-[var(--header-h)] min-h-[100dvh] bg-[var(--color-bg-soft)]">
      <div className="container py-8 lg:py-16">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <Heart size={40} className="mb-6 text-black/20" />
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight uppercase">
            Wishlist
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-black/50 mt-4">{wishlistProducts.length} Items</p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 bg-white p-4 md:p-8 rounded-none shadow-none border border-black/10">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 md:p-24 rounded-none shadow-none border border-black/10 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Your wishlist is empty</h2>
            <p className="text-sm font-medium text-black/50 mb-8 max-w-sm">
              Save pieces you love to your wishlist to review and purchase them later.
            </p>
            <Link href="/shop" className="btn btn--primary">
              Continue Shopping
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
