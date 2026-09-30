'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import { useStore } from '../layout/ClientRoot';
import { MockProduct } from '@/data/mock/products';
import { formatPrice } from '@/lib/shopify';
import { useRouter } from 'next/navigation';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            setResults(data.slice(0, 4));
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }, 300); // debounce
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const close = () => setSearchOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 1) {
      close();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[var(--z-modal)]"
          />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 inset-x-0 bg-white z-[var(--z-modal)] shadow-2xl"
          >
            <div className="container py-6 lg:py-12">
              <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center">
                <MagnifyingGlass size={28} className="absolute left-0 text-black/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, or materials..."
                  className="w-full text-2xl lg:text-4xl font-display font-medium tracking-tight bg-transparent border-none outline-none pl-12 pr-12 py-2 placeholder-black/20"
                />
                <button 
                  type="button"
                  onClick={close}
                  className="absolute right-0 p-2 text-black/40 hover:text-black transition-colors"
                  aria-label="Close search"
                >
                  <X size={28} />
                </button>
              </form>

              <div className="max-w-4xl mx-auto mt-8 lg:mt-16 min-h-[40vh]">
                {query.length > 1 ? (
                  loading ? (
                    <div className="text-center py-20 text-black/50 text-sm font-bold uppercase tracking-widest">
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/50">Products</h3>
                        <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={close} className="text-[11px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                          View all <ArrowRight size={12} weight="bold" />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                        {results.map((product) => (
                          <Link 
                            key={product.id} 
                            href={`/products/${product.handle}`}
                            onClick={close}
                            className="group block"
                          >
                            <div className="relative aspect-[4/5] bg-black/5 mb-4 overflow-hidden rounded-none">
                              {product.images[0] && (
                                <Image
                                  src={product.images[0].src}
                                  alt={product.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              )}
                            </div>
                            <h4 className="font-bold text-[11px] uppercase tracking-widest mb-1 leading-snug">{product.title}</h4>
                            <p className="text-[11px] font-medium text-black/60">{formatPrice(product.price, product.currencyCode)}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-black/50 text-[11px] font-bold uppercase tracking-widest">
                      No results found for "{query}".
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-2 gap-8 lg:gap-16">
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/40 mb-6">Suggested Searches</h3>
                      <ul className="space-y-4 font-medium text-[13px] tracking-wide">
                        <li><button onClick={() => setQuery('Leather')} className="hover:text-black/50 transition-colors">Leather Goods</button></li>
                        <li><button onClick={() => setQuery('Sneaker')} className="hover:text-black/50 transition-colors">Sneakers</button></li>
                        <li><button onClick={() => setQuery('Titanium')} className="hover:text-black/50 transition-colors">Titanium Watches</button></li>
                        <li><button onClick={() => setQuery('Canvas')} className="hover:text-black/50 transition-colors">Canvas Totes</button></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-black/40 mb-6">Categories</h3>
                      <ul className="space-y-4 font-medium text-[13px] tracking-wide">
                        <li><Link href="/collections/shoes" onClick={close} className="hover:text-black/50 transition-colors">Shoes</Link></li>
                        <li><Link href="/collections/watches" onClick={close} className="hover:text-black/50 transition-colors">Watches</Link></li>
                        <li><Link href="/collections/bags" onClick={close} className="hover:text-black/50 transition-colors">Bags</Link></li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
