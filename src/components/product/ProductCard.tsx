'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus } from '@phosphor-icons/react';
import { useStore } from '../layout/ClientRoot';
import { MockProduct } from '@/data/mock/products';
import { formatPrice } from '@/lib/shopify';

export function ProductCard({ product }: { product: MockProduct }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.handle);

  return (
    <div className="group block relative">
      <Link href={`/products/${product.handle}`} className="block relative aspect-[4/5] bg-[var(--color-bg-soft)] mb-4 overflow-hidden rounded-sm">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.badge && (
            <div className={`badge ${product.badge === 'sale' ? 'badge--sale' : 'badge--new'}`}>
              {product.badge}
            </div>
          )}
        </div>

        {/* Wishlist Quick Action (Desktop Hover / Mobile Visible) */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.handle); }}
          className="absolute top-3 right-3 z-20 p-2 text-black/40 hover:text-black transition-colors bg-white/80 backdrop-blur-sm rounded-full md:opacity-0 group-hover:opacity-100"
          aria-label="Toggle wishlist"
        >
          <Heart size={18} weight={isWishlisted ? "fill" : "regular"} className={isWishlisted ? "text-[var(--color-ink)]" : ""} />
        </button>

        {/* Quick Add Action */}
        {product.availableForSale && (
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              // Add first available variant
              const firstAvailable = product.variants.find(v => v.available);
              if (firstAvailable) addToCart(product, firstAvailable.id, 1);
            }}
            className="absolute bottom-3 right-3 z-20 p-2 text-white bg-black hover:bg-black/80 transition-colors rounded-full md:opacity-0 group-hover:opacity-100 shadow-sm md:translate-y-2 group-hover:translate-y-0"
            aria-label="Quick add"
          >
            <Plus size={18} weight="bold" />
          </button>
        )}

        {/* Images */}
        {product.images[0] && (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[800ms] group-hover:scale-105"
          />
        )}
        {product.images[1] && (
          <Image
            src={product.images[1].src}
            alt={product.images[1].alt || product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="flex justify-between items-start gap-4">
        <div>
          <Link href={`/products/${product.handle}`} className="font-semibold text-sm leading-snug mb-1 hover:underline">
            {product.title}
          </Link>
          <p className="text-xs text-[var(--color-muted)]">{product.colors?.length || 1} Colors</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">
            {formatPrice(product.price, product.currencyCode)}
          </p>
          {product.compareAtPrice && (
            <p className="text-xs text-[var(--color-muted)] line-through mt-0.5">
              {formatPrice(product.compareAtPrice, product.currencyCode)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
