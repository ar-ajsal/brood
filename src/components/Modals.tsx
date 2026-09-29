"use client";

import React from "react";
import { useStore, CurrencyCode } from "@/context/StoreContext";

export function CurrencyModal() {
  const { isCurrencyModalOpen, setIsCurrencyModalOpen, currency, setCurrency } = useStore();

  if (!isCurrencyModalOpen) return null;

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: "USD", label: "US Dollar", symbol: "$" },
    { code: "EUR", label: "Euro", symbol: "€" },
    { code: "GBP", label: "British Pound", symbol: "£" },
    { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl relative animate-fadeIn">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="font-serif text-lg uppercase tracking-wider text-gray-900 font-bold">Select Currency</h3>
          <button
            onClick={() => setIsCurrencyModalOpen(false)}
            className="text-gray-400 hover:text-gray-800 text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code);
                setIsCurrencyModalOpen(false);
              }}
              className={`flex flex-col items-center justify-center p-3 rounded border text-sm transition-all ${
                currency === c.code
                  ? "border-black bg-black text-white font-bold"
                  : "border-gray-200 hover:border-gray-400 text-gray-700 bg-gray-50"
              }`}
            >
              <span className="text-base font-bold">{c.code}</span>
              <span className="text-xs opacity-75">{c.symbol} - {c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, formatPrice } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-black text-white">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#b8ab8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-serif tracking-widest text-sm uppercase font-bold">Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-serif text-gray-600 font-semibold mb-1">Your bag is empty</p>
              <p className="text-xs text-gray-400 mb-6">Discover luxury items in our shop</p>
              <a
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="bg-black text-white text-xs uppercase tracking-widest px-6 py-2.5 font-bold hover:bg-[#1f1f1f]"
              >
                Browse Shop
              </a>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id + (item.selectedSize || "")} className="flex gap-3 border-b border-gray-100 pb-4">
                <div className="w-20 h-20 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden rounded">
                  <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">{item.product.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.product.brand} {item.selectedSize ? `• ${item.selectedSize}` : ""}</p>
                  <p className="text-xs font-bold text-gray-900 mt-1">{formatPrice(item.product.price)}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Estimated Subtotal</span>
              <span className="text-base font-bold text-gray-900">{formatPrice("$" + cartTotal.toFixed(2))}</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4 text-center">Shipping, taxes, and discounts calculated at checkout.</p>
            <button
              onClick={() => alert("Checkout initiated! Thank you for ordering.")}
              className="w-full bg-black text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 hover:bg-[#222] transition-colors shadow-lg"
            >
              Secure Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
