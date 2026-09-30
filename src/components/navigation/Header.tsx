'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { List, MagnifyingGlass, Heart, ShoppingBag, User } from '@phosphor-icons/react';
import { useStore } from '../layout/ClientRoot';

const NAV_ITEMS = [
  { label: 'Shoes', href: '/collections/shoes' },
  { label: 'Watches', href: '/collections/watches' },
  { label: 'Eyewear', href: '/collections/eyewear' },
  { label: 'Bags', href: '/collections/bags' },
  { label: 'Jewellery', href: '/collections/jewellery' },
  { label: 'Accessories', href: '/collections/accessories' },
];

export function Header() {
  const { setCartOpen, setMobileMenuOpen, setSearchOpen, cart, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartQty = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header
      className={`fixed top-0 inset-x-0 w-full z-[var(--z-sticky)] transition-all duration-500 border-b border-transparent ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-[var(--color-border)]' : 'bg-transparent'
      }`}
    >
      {/* Announcement Bar */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[var(--color-ink)] text-[var(--color-bg)] h-9 flex items-center justify-center text-[10px] tracking-[0.2em] uppercase font-semibold overflow-hidden w-full"
          >
            Complimentary international delivery on all orders
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container h-[var(--header-h)] flex items-center justify-between">
        
        {/* Mobile Nav Toggle */}
        <div className="lg:hidden flex shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[var(--color-ink)] hover:text-black/50 transition-colors"
            aria-label="Open menu"
          >
            <List size={22} weight="light" />
          </button>
        </div>

        {/* Desktop Primary Nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[10px] font-semibold tracking-[0.2em] uppercase hover:text-black/50 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-center">
          <Link href="/" className="inline-block text-center hover:opacity-70 transition-opacity">
            <span className="font-display text-2xl lg:text-3xl font-bold tracking-widest uppercase block leading-none">
              Brood
            </span>
          </Link>
        </div>

        {/* Utilities */}
        <div className="flex-1 flex items-center justify-end gap-3 lg:gap-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1.5 hover:text-black/50 transition-colors hidden lg:block"
            aria-label="Search"
          >
            <MagnifyingGlass size={20} weight="light" />
          </button>
          <Link href="/account" className="p-1.5 hover:text-black/50 transition-colors hidden lg:block" aria-label="Account">
            <User size={20} weight="light" />
          </Link>
          <Link href="/wishlist" className="p-1.5 hover:text-black/50 transition-colors relative" aria-label="Wishlist">
            <Heart size={20} weight={wishlist.length > 0 ? "fill" : "light"} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--color-ink)] rounded-full border border-white" />
            )}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="p-1.5 hover:text-black/50 transition-colors relative flex items-center gap-1.5"
            aria-label="Cart"
          >
            <ShoppingBag size={20} weight="light" />
            <span className="text-[11px] font-mono font-medium pt-0.5 w-3 text-left">
              {cartQty}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
