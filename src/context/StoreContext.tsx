"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdPriceStr: string) => string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCurrencyModalOpen: boolean;
  setIsCurrencyModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string }> = {
  USD: { rate: 1.0, symbol: "$" },
  EUR: { rate: 0.92, symbol: "€" },
  GBP: { rate: 0.79, symbol: "£" },
  CAD: { rate: 1.35, symbol: "C$" },
  AUD: { rate: 1.52, symbol: "A$" },
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("brood_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedCurr = localStorage.getItem("brood_currency") as CurrencyCode;
      if (savedCurr && CURRENCY_RATES[savedCurr]) setCurrency(savedCurr);
    } catch (e) {}
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("brood_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save currency
  useEffect(() => {
    try {
      localStorage.setItem("brood_currency", currency);
    } catch (e) {}
  }, [currency]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
    showToast(`Added "${product.title.substring(0, 30)}..." to shopping cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce((sum, item) => {
    const rawNum = parseFloat(item.product.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + rawNum * item.quantity;
  }, 0);

  const formatPrice = (usdPriceStr: string) => {
    const num = parseFloat(usdPriceStr.replace(/[^0-9.]/g, "")) || 0;
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = num * rateInfo.rate;
    return `${rateInfo.symbol}${converted.toFixed(2)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrency,
        formatPrice,
        toastMessage,
        showToast,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isCurrencyModalOpen,
        setIsCurrencyModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
