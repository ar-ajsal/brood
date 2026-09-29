# Brood - Headless Shopify Storefront

A high-performance headless luxury e-commerce storefront powered by Next.js and Shopify Storefront API.

## Features

- **Shopify Storefront API Integration**: Real-time product catalog, collections, and variant inventory.
- **Dynamic Catalog & Navigation**: Dynamic homepage, collections page, and `/shop` catalog.
- **Search, Filters & Sorting**: Real-time client-side and server-side filtering by collection, type, and price.
- **Shopify Cart & Checkout**:
  - Live Shopify Cart integration (`/api/cart`).
  - Slide-out Cart Drawer with line-item management and real-time total updates.
  - Direct Buy Now checkout flow seamlessly passing to Shopify checkout.
- **Wishlist & Favorites**:
  - Anonymous customer wishlist backed by browser `localStorage` (`shopify_wishlist`).
  - Dynamic `/wishlist` management page with live Shopify variant data.
  - Add to bag directly from wishlist with drawer feedback.

## Getting Started

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Configure your Shopify store credentials:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN=your_public_storefront_access_token
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```
