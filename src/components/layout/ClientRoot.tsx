'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { MockProduct } from '@/data/mock/products';
import { createCart, getCart, addToCartMutation, updateCartLinesMutation, removeFromCartMutation } from '@/lib/shopify';

// ---- Global UI State ----
interface BroodStore {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWishlist: (handle: string) => void;
  cart: CartItem[];
  addToCart: (product: MockProduct, variantId: string, qty?: number) => Promise<void>;
  buyNow: (product: MockProduct, variantId: string, qty?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQty: (lineId: string, qty: number) => Promise<void>;
  cartTotal: number;
  checkoutUrl: string | null;
}

export interface CartItem {
  lineId: string;
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  price: number;
  image: string;
  qty: number;
}

const StoreCtx = createContext<BroodStore | null>(null);
export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be inside ClientRoot');
  return ctx;
};

export function ClientRoot({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Hydrate wishlist & cart from local storage
  useEffect(() => {
    const w = localStorage.getItem('brood_wishlist');
    if (w) setWishlist(JSON.parse(w));

    const cId = localStorage.getItem('brood_cartId');
    if (cId) {
      setCartId(cId);
      refreshCart(cId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('brood_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshCart = async (id: string) => {
    try {
      const cartData = await getCart(id);
      if (cartData) {
        setCheckoutUrl(cartData.checkoutUrl);
        setCartTotal(parseFloat(cartData.cost.totalAmount.amount));
        const items = cartData.lines.edges.map(({ node }: any) => ({
          lineId: node.id,
          variantId: node.merchandise.id,
          productHandle: node.merchandise.product.handle,
          title: node.merchandise.product.title,
          variantTitle: node.merchandise.title,
          price: parseFloat(node.merchandise.price.amount),
          image: node.merchandise.product.images.edges[0]?.node.url || '',
          qty: node.quantity,
        }));
        setCart(items);
      } else {
        // Cart invalid/expired
        localStorage.removeItem('brood_cartId');
        setCartId(null);
        setCart([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const ensureCart = async () => {
    if (cartId) return cartId;
    const newCart = await createCart();
    setCartId(newCart.id);
    setCheckoutUrl(newCart.checkoutUrl);
    localStorage.setItem('brood_cartId', newCart.id);
    return newCart.id;
  };

  const toggleWishlist = (handle: string) => {
    setWishlist(prev =>
      prev.includes(handle) ? prev.filter(h => h !== handle) : [...prev, handle]
    );
  };

  const addToCart = async (product: MockProduct, variantId: string, qty = 1) => {
    setCartOpen(true);
    const id = await ensureCart();
    await addToCartMutation(id, [{ merchandiseId: variantId, quantity: qty }]);
    await refreshCart(id);
  };

  const buyNow = async (product: MockProduct, variantId: string, qty = 1) => {
    const id = await ensureCart();
    await addToCartMutation(id, [{ merchandiseId: variantId, quantity: qty }]);
    const updatedCart = await getCart(id);
    if (updatedCart?.checkoutUrl) {
      window.location.href = updatedCart.checkoutUrl;
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;
    await removeFromCartMutation(cartId, [lineId]);
    await refreshCart(cartId);
  };

  const updateQty = async (lineId: string, qty: number) => {
    if (!cartId) return;
    if (qty < 1) { 
      await removeFromCart(lineId); 
      return; 
    }
    await updateCartLinesMutation(cartId, [{ id: lineId, quantity: qty }]);
    await refreshCart(cartId);
  };

  const store: BroodStore = {
    cartOpen, setCartOpen,
    mobileMenuOpen, setMobileMenuOpen,
    searchOpen, setSearchOpen,
    wishlist, toggleWishlist,
    cart, addToCart, buyNow, removeFromCart, updateQty,
    cartTotal, checkoutUrl
  };

  return (
    <StoreCtx.Provider value={store}>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
    </StoreCtx.Provider>
  );
}
