'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CaretDown, CaretUp, Heart } from '@phosphor-icons/react';
import { MockProduct } from '@/data/mock/products';
import { formatPrice } from '@/lib/shopify';
import { useStore } from '@/components/layout/ClientRoot';

export function ProductClient({ product }: { product: MockProduct }) {
  const { addToCart, buyNow, wishlist, toggleWishlist } = useStore();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const isWishlisted = wishlist.includes(product.handle);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  return (
    <div className="pt-[var(--header-h)] min-h-[100dvh]">
      <div className="container py-8 lg:py-16">
        
        {/* Breadcrumb */}
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/collections/${product.categoryHandle}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* LEFT: Gallery (Sticky on Desktop) */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-[120px] flex gap-4">
              {/* Thumbnails */}
              <div className="hidden lg:flex flex-col gap-4 w-20 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-[4/5] bg-black/5 overflow-hidden transition-all ${
                      i === activeImage ? 'ring-2 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.src} alt={`${product.title} thumbnail ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative aspect-[4/5] bg-black/5 flex-1 overflow-hidden group cursor-zoom-in rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={product.images[activeImage].src} 
                      alt={product.title} 
                      fill 
                      priority
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Mobile Thumbnails */}
            <div className="flex lg:hidden gap-4 mt-4 overflow-x-auto snap-x pb-4">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-[4/5] w-20 flex-shrink-0 snap-start bg-black/5 overflow-hidden transition-all ${
                    i === activeImage ? 'ring-1 ring-black' : 'opacity-60'
                  }`}
                >
                  <Image src={img.src} alt={`${product.title} thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-black/50 block mb-2">{product.vendor}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 text-xl font-semibold">
                <span>{formatPrice(selectedVariant.price, product.currencyCode)}</span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-black/40 line-through text-lg">
                    {formatPrice(selectedVariant.compareAtPrice, product.currencyCode)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[var(--text-md)] leading-relaxed text-black/70 mb-10">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black/50">
                    Select Option
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.available}
                      className={`h-12 border flex items-center justify-center text-sm font-medium transition-all ${
                        !variant.available 
                          ? 'border-black/5 text-black/30 bg-black/5 cursor-not-allowed' 
                          : selectedVariant.id === variant.id
                            ? 'border-black bg-black text-white'
                            : 'border-black/20 hover:border-black'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-16">
              <button 
                onClick={() => addToCart(product, selectedVariant.id, 1)}
                disabled={!selectedVariant.available}
                className="btn btn--primary w-full h-14"
              >
                {selectedVariant.available ? 'Add To Bag' : 'Out Of Stock'}
              </button>
              
              <div className="flex gap-4">
                <button 
                  disabled={!selectedVariant.available}
                  onClick={() => buyNow(product, selectedVariant.id, 1)}
                  className="btn btn--secondary flex-1 h-14"
                >
                  Buy It Now
                </button>
                <button 
                  onClick={() => toggleWishlist(product.handle)}
                  className="btn btn--secondary btn--icon w-14 h-14 flex-shrink-0"
                  aria-label="Wishlist"
                >
                  <Heart size={20} weight={isWishlisted ? "fill" : "regular"} className={isWishlisted ? "text-black" : ""} />
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-black/10">
              {product.details && product.details.length > 0 && (
                <Accordion 
                  id="details" 
                  title="Details" 
                  isOpen={openAccordion === 'details'} 
                  onToggle={() => toggleAccordion('details')}
                >
                  <ul className="list-disc pl-4 space-y-2 text-sm text-black/70">
                    {product.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </Accordion>
              )}
              
              {product.materials && product.materials.length > 0 && (
                <Accordion 
                  id="materials" 
                  title="Materials" 
                  isOpen={openAccordion === 'materials'} 
                  onToggle={() => toggleAccordion('materials')}
                >
                  <ul className="list-disc pl-4 space-y-2 text-sm text-black/70">
                    {product.materials.map((mat, i) => (
                      <li key={i}>{mat}</li>
                    ))}
                  </ul>
                </Accordion>
              )}

              <Accordion 
                id="shipping" 
                title="Delivery & Returns" 
                isOpen={openAccordion === 'shipping'} 
                onToggle={() => toggleAccordion('shipping')}
              >
                <div className="space-y-4 text-sm text-black/70">
                  <p>Complimentary international delivery on all orders via DHL Express.</p>
                  <p>Returns accepted within 14 days of delivery. Items must be in unworn, original condition.</p>
                </div>
              </Accordion>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ id, title, isOpen, onToggle, children }: { id: string; title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-black/10">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left hover:bg-black/5 transition-colors px-2 -mx-2"
      >
        <span className="text-sm font-bold uppercase tracking-widest">{title}</span>
        {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden px-2 -mx-2"
          >
            <div className="pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
