"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export function Header() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, currency, setIsCurrencyModalOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#111] text-[#cfc7a7] text-[10px] uppercase tracking-[0.2em] py-1.5 px-4 text-center font-medium border-b border-white/10 flex justify-between items-center">
        <span className="hidden sm:inline">WORLDWIDE EXPRESS SHIPPING • 100% QUALITY GUARANTEE</span>
        <span className="mx-auto sm:mx-0">NEW 2026 MASTER COLLECTIONS AVAILABLE</span>
        <button
          onClick={() => setIsCurrencyModalOpen(true)}
          className="text-white hover:text-[#cfc7a7] flex items-center gap-1 font-bold text-[10px]"
        >
          <span>{currency}</span>
          <span className="text-[8px]">▼</span>
        </button>
      </div>

      {/* Main Topbar */}
      <header className="hoshi-mobile-topbar bg-black text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60] tracking-[0.15em] uppercase border-b border-white/10">
        {/* Left: Menu & VIP */}
        <div className="flex-1 flex items-center space-x-3 text-[10px]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center space-x-1 hover:text-[#cfc7a7] transition-colors focus:outline-none"
            aria-label="Open Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden md:inline font-bold">MENU</span>
          </button>
          <Link href="/shop" className="hidden sm:flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
            <span>COLLECTIONS</span>
          </Link>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="block">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#d4af37] uppercase select-none">
              THE HOSHI
            </span>
          </Link>
        </div>

        {/* Right: Currency, Search link, Cart */}
        <div className="flex-1 flex justify-end items-center space-x-3 sm:space-x-4">
          <Link
            href="/shop"
            className="hidden md:flex items-center text-[10px] text-gray-300 hover:text-white transition-colors"
          >
            <span>SHOP</span>
          </Link>
          <button
            onClick={() => setIsCurrencyModalOpen(true)}
            className="text-[10px] text-gray-300 hover:text-white border border-white/20 px-2 py-0.5 rounded font-mono"
          >
            {currency}
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center text-white hover:text-[#d4af37] transition-colors p-1"
            aria-label="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black font-bold rounded-full w-4 h-4 flex items-center justify-center text-[9px]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Quick Search Strip */}
      <div className="bg-[#181818] border-b border-white/10 px-4 py-2.5">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Louis Vuitton, Gucci, Chanel, Rolex, Bags, Watches..."
              className="w-full bg-[#242424] text-white text-xs pl-9 pr-8 py-2 rounded border border-white/10 focus:outline-none focus:border-[#d4af37] placeholder-gray-400 font-sans"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
              <i className="fa fa-search text-xs"></i>
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#d4af37] hover:bg-[#c39e2c] text-black text-[11px] font-bold uppercase tracking-wider px-5 py-2 rounded transition-colors whitespace-nowrap shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Mobile / Sidebar Mega Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9990] flex bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-80 max-w-[85vw] bg-[#141414] text-white h-full flex flex-col shadow-2xl animate-slideRight">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black">
              <span className="font-serif text-lg tracking-[0.2em] text-[#d4af37] font-bold">THE HOSHI</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-xs uppercase tracking-widest font-bold text-white hover:bg-white/10 rounded"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-xs uppercase tracking-widest font-bold text-[#d4af37] hover:bg-white/10 rounded"
                >
                  All Collections & Shop
                </Link>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2 px-3">Categories</p>
                <div className="space-y-1">
                  {["Bags", "Shoes", "Watches", "Accessories", "Jewelry"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/shop?category=${cat}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2 px-3">Featured Maisons</p>
                <div className="space-y-1">
                  {["Louis Vuitton", "Gucci", "Chanel", "Hermès", "Dior", "Rolex", "Prada"].map((brand) => (
                    <Link
                      key={brand}
                      href={`/shop?brand=${encodeURIComponent(brand)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-gray-300 hover:text-[#d4af37] hover:bg-white/5 rounded"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] text-gray-400 space-y-2 px-3">
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-green-400 hover:underline"
                >
                  <i className="fab fa-whatsapp"></i> WhatsApp VIP Concierge
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:underline"
                >
                  <i className="fab fa-telegram"></i> Telegram Updates
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black text-center text-[10px] text-gray-500">
              © 2026 THE HOSHI. ALL RIGHTS RESERVED.
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
}
