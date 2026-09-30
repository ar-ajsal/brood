'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { X, MagnifyingGlass, User, CaretRight } from '@phosphor-icons/react';
import { useStore } from '../layout/ClientRoot';

const NAV_ITEMS = [
  { label: 'Shoes', href: '/collections/shoes' },
  { label: 'Watches', href: '/collections/watches' },
  { label: 'Eyewear', href: '/collections/eyewear' },
  { label: 'Bags', href: '/collections/bags' },
  { label: 'Jewellery', href: '/collections/jewellery' },
  { label: 'Accessories', href: '/collections/accessories' },
];

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useStore();
  const pathname = usePathname();

  useEffect(() => {
    // Close on route change
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[90%] max-w-sm bg-white z-[301] flex flex-col shadow-none border-r border-black/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <span className="font-display text-xl font-bold uppercase tracking-widest">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-black/40 hover:text-black transition-colors" aria-label="Close menu">
                <X size={24} weight="light" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-6 mb-8">
                <button
                  onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                  className="w-full flex items-center gap-3 bg-transparent border border-black/10 px-4 py-3 text-left hover:border-black transition-colors"
                >
                  <MagnifyingGlass size={20} className="text-black" weight="light" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-black/50">Search...</span>
                </button>
              </div>

              <nav className="flex flex-col">
                <Link href="/shop" className="px-6 py-4 flex items-center justify-between border-b border-black/5 hover:bg-black/5 transition-colors">
                  <span className="text-sm font-bold uppercase tracking-widest">All Products</span>
                </Link>
                {NAV_ITEMS.map(cat => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="px-6 py-4 flex items-center justify-between border-b border-black/5 hover:bg-black/5 transition-colors"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest text-black/70">{cat.label}</span>
                    <CaretRight size={16} weight="light" className="text-black/30" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-6 border-t border-black/10 flex flex-col gap-4">
              <Link href="/account" className="flex items-center gap-3 font-bold text-[11px] tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors">
                <User size={20} weight="light" />
                My Account
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
