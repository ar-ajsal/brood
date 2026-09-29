"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Right Action Stack */}
      <div className="fixed right-2.5 top-1/2 -translate-y-1/2 z-[9000] flex flex-col items-center gap-2 pointer-events-auto">
        {/* WhatsApp */}
        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Concierge"
          className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <i className="fab fa-whatsapp text-lg"></i>
        </a>

        {/* Telegram */}
        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          title="Telegram VIP Channel"
          className="w-9 h-9 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <i className="fab fa-telegram-plane text-base"></i>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <i className="fab fa-instagram text-base"></i>
        </a>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          title="Back to Top"
          className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center shadow backdrop-blur-sm hover:bg-black transition-colors mt-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* Main Luxury Magazine Footer */}
      <footer className="bg-[#111] text-[#a5a5a5] border-t border-white/10 mt-16 pt-14 pb-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top USP badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[#d4af37] text-2xl mb-2">✦</span>
              <h4 className="text-white text-xs font-serif uppercase tracking-widest font-bold">1:1 Master Quality</h4>
              <p className="text-[11px] text-gray-400 mt-1">Identical materials & exact craft</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#d4af37] text-2xl mb-2">✈</span>
              <h4 className="text-white text-xs font-serif uppercase tracking-widest font-bold">Worldwide Express</h4>
              <p className="text-[11px] text-gray-400 mt-1">Discreet & insured air transit</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#d4af37] text-2xl mb-2">🔒</span>
              <h4 className="text-white text-xs font-serif uppercase tracking-widest font-bold">Secure Checkout</h4>
              <p className="text-[11px] text-gray-400 mt-1">Encrypted & private transactions</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#d4af37] text-2xl mb-2">★</span>
              <h4 className="text-white text-xs font-serif uppercase tracking-widest font-bold">VIP After-Sales</h4>
              <p className="text-[11px] text-gray-400 mt-1">Dedicated 24/7 personal concierge</p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-white/10">
            <div>
              <span className="font-serif text-xl tracking-[0.2em] text-[#d4af37] font-bold block mb-4">THE HOSHI</span>
              <p className="text-xs text-gray-400 leading-relaxed">
                The leading bespoke luxury destination offering master quality handcrafted bags, accessories, and haute horlogerie.
              </p>
            </div>

            <div>
              <h5 className="text-white font-serif uppercase text-xs tracking-widest font-bold mb-4">Quick Navigation</h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="/" className="hover:text-[#d4af37] transition-colors">Home Page</Link></li>
                <li><Link href="/shop" className="hover:text-[#d4af37] transition-colors">All Collections</Link></li>
                <li><Link href="/shop?category=Bags" className="hover:text-[#d4af37] transition-colors">Handbags & Clutches</Link></li>
                <li><Link href="/shop?category=Watches" className="hover:text-[#d4af37] transition-colors">Haute Horlogerie</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-serif uppercase text-xs tracking-widest font-bold mb-4">Customer Care</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Quality Inspection (QC Photos)</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Worldwide Shipping Policies</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Custom Orders & Requests</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">VIP Warranty & Guarantee</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-serif uppercase text-xs tracking-widest font-bold mb-4">Newsletter & Concierge</h5>
              <p className="text-xs text-gray-400 mb-3">Subscribe to receive secret flash sale drops and VIP catalog updates.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-[#222] text-white text-xs px-3 py-2 rounded-l focus:outline-none w-full"
                />
                <button
                  onClick={() => alert("Thank you for joining our VIP list!")}
                  className="bg-[#d4af37] text-black text-xs font-bold px-3 py-2 rounded-r hover:bg-[#c39e2c]"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500">
            <p>© 2026 THE HOSHI. All rights reserved. Private Luxury Services.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-gray-400 cursor-pointer">Discreet Delivery</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
