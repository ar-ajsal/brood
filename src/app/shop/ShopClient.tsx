'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Faders, CaretDown, X } from '@phosphor-icons/react';
import { MockProduct } from '@/data/mock/products';
import { ProductCard } from '@/components/product/ProductCard';

export function ShopClient({ initialProducts }: { initialProducts: MockProduct[] }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('Featured');
  
  const categories = ['Shoes', 'Watches', 'Eyewear', 'Bags', 'Jewellery', 'Accessories'];

  return (
    <div className="pt-[var(--header-h)] min-h-[100dvh]">
      <div className="container py-8 lg:py-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex gap-2 text-[11px] font-bold uppercase tracking-widest text-black/50 mb-6">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-black">All Products</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight uppercase">
              All Products
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-black/50 mt-4 font-bold">{initialProducts.length} Results</p>
          </div>
          <p className="max-w-md text-black/70 leading-relaxed text-[13px] hidden md:block">
            The complete Brood collection. Engineered utility and structural precision.
          </p>
        </div>

        <div className="sticky top-[var(--header-h)] z-[10] bg-white/90 backdrop-blur-md border-y border-black/10 py-4 mb-8 flex items-center justify-between">
          <button 
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-black/60 transition-colors"
          >
            <Faders size={16} weight="light" />
            Filter
          </button>
          
          <div className="relative group cursor-pointer flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-black/60 transition-colors">
            Sort: {activeSort}
            <CaretDown size={12} weight="bold" />
            <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-black/10 shadow-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'].map(s => (
                <button 
                  key={s}
                  onClick={() => setActiveSort(s)}
                  className={`block w-full text-left px-4 py-3 text-[11px] uppercase tracking-widest hover:bg-black/5 ${s === activeSort ? 'font-bold' : 'font-medium text-black/70'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {initialProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full md:w-[380px] bg-white z-[301] flex flex-col shadow-none border-r border-black/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/10">
                <span className="font-display text-xl font-bold uppercase tracking-widest">Filters</span>
                <button onClick={() => setFilterOpen(false)} className="p-2 -mr-2 text-black/40 hover:text-black transition-colors" aria-label="Close filters">
                  <X size={24} weight="light" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/50 mb-4">Category</h3>
                  <div className="space-y-3">
                    {categories.map(c => (
                      <label key={c} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-black/20 group-hover:border-black rounded-none flex items-center justify-center transition-colors">
                          <div className="w-2 h-2 bg-black opacity-0 transition-opacity" />
                        </div>
                        <span className="text-[13px] font-medium tracking-wide">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/50 mb-4">Availability</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-black/20 group-hover:border-black rounded-none flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 bg-black opacity-0 transition-opacity" />
                      </div>
                      <span className="text-[13px] font-medium tracking-wide">In Stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-black/20 group-hover:border-black rounded-none flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 bg-black opacity-0 transition-opacity" />
                      </div>
                      <span className="text-[13px] font-medium tracking-wide">Out of Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black/5 border-t border-black/10 flex gap-4">
                <button className="btn btn--secondary flex-1" onClick={() => setFilterOpen(false)}>Clear All</button>
                <button className="btn btn--primary flex-1" onClick={() => setFilterOpen(false)}>Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
