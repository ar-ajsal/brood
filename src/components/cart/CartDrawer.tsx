'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash, Plus, Minus, ArrowRight } from '@phosphor-icons/react';
import { useStore } from '../layout/ClientRoot';
import { formatPrice } from '@/lib/shopify';

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, cartTotal, checkoutUrl } = useStore();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const isEmpty = cart.length === 0;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-white z-[301] flex flex-col shadow-none border-l border-black/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <h2 className="font-display text-xl font-bold uppercase tracking-widest">Bag</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 -mr-2 text-black/40 hover:text-black transition-colors" aria-label="Close bag">
                <X size={24} weight="light" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEmpty ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-none bg-transparent border border-black/10 flex items-center justify-center text-black/20">
                    <ShoppingBagEmptyIcon />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] uppercase tracking-widest text-black/50">Your bag is empty</p>
                  </div>
                  <Link 
                    href="/shop" 
                    onClick={() => setCartOpen(false)}
                    className="btn btn--primary mt-4"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      {/* Image */}
                      <Link 
                        href={`/products/${item.productHandle}`} 
                        onClick={() => setCartOpen(false)}
                        className="relative w-24 aspect-[4/5] bg-black/5 overflow-hidden rounded-sm flex-shrink-0"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col py-1">
                        <div className="flex justify-between items-start gap-2">
                          <Link 
                            href={`/products/${item.productHandle}`}
                            onClick={() => setCartOpen(false)}
                            className="font-semibold text-sm leading-snug hover:underline"
                          >
                            {item.title}
                          </Link>
                          <button 
                            onClick={() => removeFromCart(item.lineId)}
                            className="text-black/40 hover:text-black transition-colors p-1 -mr-1 -mt-1"
                            aria-label="Remove item"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-black/60 mt-1">{item.variantTitle}</p>
                        
                        <div className="mt-auto flex items-end justify-between">
                          {/* Qty Controls */}
                          <div className="flex items-center border border-black/10 rounded-none">
                            <button 
                              onClick={() => updateQty(item.lineId, item.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} weight="bold" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-medium">{item.qty}</span>
                            <button 
                              onClick={() => updateQty(item.lineId, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} weight="bold" />
                            </button>
                          </div>
                          
                          <p className="font-bold text-[13px]">
                            {formatPrice(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="p-6 bg-black/5 border-t border-black/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-[11px] uppercase tracking-widest">Subtotal</span>
                  <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-[11px] font-medium text-black/50 mb-6 uppercase tracking-widest">Shipping & taxes calculated at checkout.</p>
                {checkoutUrl ? (
                  <a 
                    href={checkoutUrl}
                    className="btn btn--primary w-full text-sm h-14 flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight size={16} weight="bold" />
                  </a>
                ) : (
                  <button 
                    disabled
                    className="btn btn--primary w-full text-sm h-14 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                  >
                    Loading...
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ShoppingBagEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}
