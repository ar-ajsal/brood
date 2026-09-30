// src/data/mock/products.ts
// Mock product catalog — schema mirrors future Shopify integration

export interface MockImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface MockVariant {
  id: string;
  title: string;
  available: boolean;
  price: number;
  compareAtPrice?: number;
}

export interface MockColor {
  name: string;
  hex: string;
  available: boolean;
}

export interface MockProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  category: string;
  categoryHandle: string;
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  images: MockImage[];
  variants: MockVariant[];
  colors?: MockColor[];
  sizes?: string[];
  badge?: 'new' | 'sale';
  availableForSale: boolean;
  description: string;
  details: string[];
  materials?: string[];
  tags: string[];
}

// Picsum seeds chosen for fashion/luxury feel
const BASE = 'https://picsum.photos/seed';

export const mockProducts: MockProduct[] = [
  {
    id: 'prod_001',
    handle: 'obsidian-low-sneaker',
    title: 'Obsidian Low Sneaker',
    vendor: 'BROOD',
    category: 'Shoes',
    categoryHandle: 'shoes',
    price: 42000,
    compareAtPrice: 52000,
    currencyCode: 'INR',
    badge: 'sale',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-sneaker-1/800/1000`, alt: 'Obsidian Low Sneaker — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-sneaker-2/800/1000`, alt: 'Obsidian Low Sneaker — side', width: 800, height: 1000 },
      { src: `${BASE}/brood-sneaker-3/800/1000`, alt: 'Obsidian Low Sneaker — sole', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Obsidian', hex: '#1a1a1a', available: true },
      { name: 'Chrome', hex: '#c0c0c8', available: true },
      { name: 'Bone', hex: '#e8e4dc', available: false },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    variants: [
      { id: 'var_001_40', title: '40', available: true, price: 42000, compareAtPrice: 52000 },
      { id: 'var_001_41', title: '41', available: true, price: 42000, compareAtPrice: 52000 },
      { id: 'var_001_42', title: '42', available: true, price: 42000, compareAtPrice: 52000 },
      { id: 'var_001_43', title: '43', available: false, price: 42000, compareAtPrice: 52000 },
    ],
    description: 'A study in restraint. The Obsidian Low rejects ornamentation in favour of structural precision — hand-stitched calfskin over a low-profile EVA compound sole.',
    details: ['Full-grain calfskin upper', 'Low-profile EVA compound sole', 'Ortholite insole', 'Contrast welt stitching'],
    materials: ['Full-grain calfskin', 'EVA compound', 'Leather lining'],
    tags: ['sneaker', 'shoes', 'leather'],
  },
  {
    id: 'prod_002',
    handle: 'arc-tourbillon-watch',
    title: 'Arc Tourbillon Watch',
    vendor: 'BROOD',
    category: 'Watches',
    categoryHandle: 'watches',
    price: 285000,
    currencyCode: 'INR',
    badge: 'new',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-watch-1/800/1000`, alt: 'Arc Tourbillon Watch — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-watch-2/800/1000`, alt: 'Arc Tourbillon Watch — caseback', width: 800, height: 1000 },
      { src: `${BASE}/brood-watch-3/800/1000`, alt: 'Arc Tourbillon Watch — detail', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Silver', hex: '#c8c8d0', available: true },
      { name: 'Gunmetal', hex: '#3a3a42', available: true },
    ],
    variants: [
      { id: 'var_002_1', title: 'Silver / Leather', available: true, price: 285000 },
      { id: 'var_002_2', title: 'Gunmetal / Steel', available: true, price: 295000 },
    ],
    description: 'The Arc Tourbillon — 42mm brushed grade-5 titanium case, open-heart movement, 72-hour power reserve. Sapphire crystal, 50m water resistant.',
    details: ['42mm titanium case', 'In-house automatic movement', '72-hour power reserve', 'Sapphire crystal glass', '50m water resistance'],
    materials: ['Grade-5 titanium', 'Sapphire crystal', 'Calfskin strap'],
    tags: ['watches', 'automatic', 'titanium', 'tourbillon'],
  },
  {
    id: 'prod_003',
    handle: 'void-shield-sunglasses',
    title: 'Void Shield Sunglasses',
    vendor: 'BROOD',
    category: 'Eyewear',
    categoryHandle: 'eyewear',
    price: 28500,
    currencyCode: 'INR',
    badge: 'new',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-eyewear-1/800/1000`, alt: 'Void Shield Sunglasses — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-eyewear-2/800/1000`, alt: 'Void Shield Sunglasses — side', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Matte Black', hex: '#111111', available: true },
      { name: 'Silver Mirror', hex: '#d0d0d8', available: true },
    ],
    variants: [
      { id: 'var_003_1', title: 'Matte Black / Grey', available: true, price: 28500 },
      { id: 'var_003_2', title: 'Silver / Mirror', available: true, price: 28500 },
    ],
    description: 'Architectural shield silhouette — acetate frame, Italian Barberini lenses, 100% UVA/UVB. Zero visible branding.',
    details: ['Italian Mazzucchelli acetate', 'Barberini polarised lenses', 'Spring-hinge temples', '100% UV400 protection'],
    materials: ['Italian acetate', 'Barberini glass'],
    tags: ['eyewear', 'sunglasses', 'shield'],
  },
  {
    id: 'prod_004',
    handle: 'cargo-tote-xl',
    title: 'Cargo Tote XL',
    vendor: 'BROOD',
    category: 'Bags',
    categoryHandle: 'bags',
    price: 64000,
    currencyCode: 'INR',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-bag-1/800/1000`, alt: 'Cargo Tote XL — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-bag-2/800/1000`, alt: 'Cargo Tote XL — open', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Ink', hex: '#0a0a0a', available: true },
      { name: 'Ecru', hex: '#ede9e0', available: true },
    ],
    variants: [
      { id: 'var_004_ink', title: 'Ink', available: true, price: 64000 },
      { id: 'var_004_ecru', title: 'Ecru', available: false, price: 64000 },
    ],
    description: 'Waxed canvas structured tote with bonded leather base, antiqued brass hardware, and a waterproof ripstop lining.',
    details: ['Waxed cotton canvas exterior', 'Bonded vegetable-tan leather base', 'Ripstop nylon lining', 'Antiqued brass hardware', 'Interior laptop sleeve'],
    materials: ['Waxed cotton', 'Vegetable-tanned leather', 'Ripstop nylon'],
    tags: ['bags', 'tote', 'canvas'],
  },
  {
    id: 'prod_005',
    handle: 'signal-chelsea-boot',
    title: 'Signal Chelsea Boot',
    vendor: 'BROOD',
    category: 'Shoes',
    categoryHandle: 'shoes',
    price: 58500,
    currencyCode: 'INR',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-boot-1/800/1000`, alt: 'Signal Chelsea Boot — side', width: 800, height: 1000 },
      { src: `${BASE}/brood-boot-2/800/1000`, alt: 'Signal Chelsea Boot — front', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Midnight', hex: '#111827', available: true },
      { name: 'Saddle', hex: '#5c4033', available: true },
    ],
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 'var_005_40', title: '40 — Midnight', available: true, price: 58500 },
      { id: 'var_005_41', title: '41 — Midnight', available: true, price: 58500 },
      { id: 'var_005_42', title: '42 — Midnight', available: true, price: 58500 },
    ],
    description: 'Goodyear-welted Chelsea in full-grain kipskin. Elasticated side goring, pull tabs, and a Vibram mini-lug sole designed for durability.',
    details: ['Goodyear-welt construction', 'Full-grain kipskin', 'Vibram mini-lug outsole', 'Pull-tab ankles', 'Leather-lined interior'],
    materials: ['Full-grain kipskin', 'Vibram rubber', 'Leather lining'],
    tags: ['shoes', 'boots', 'chelsea', 'leather'],
  },
  {
    id: 'prod_006',
    handle: 'arc-field-watch',
    title: 'Arc Field Watch',
    vendor: 'BROOD',
    category: 'Watches',
    categoryHandle: 'watches',
    price: 89000,
    compareAtPrice: 105000,
    currencyCode: 'INR',
    badge: 'sale',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-fw-1/800/1000`, alt: 'Arc Field Watch — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-fw-2/800/1000`, alt: 'Arc Field Watch — strap', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Olive Dial', hex: '#5c6b47', available: true },
      { name: 'Black Dial', hex: '#111111', available: true },
    ],
    variants: [
      { id: 'var_006_olive', title: 'Olive / NATO', available: true, price: 89000, compareAtPrice: 105000 },
      { id: 'var_006_black', title: 'Black / Leather', available: false, price: 89000, compareAtPrice: 105000 },
    ],
    description: 'Swiss-movement field watch — 38mm brushed steel case, Super-LumiNova indices, anti-magnetic movement, 100m water resistant.',
    details: ['38mm stainless steel case', 'ETA 2824-2 movement', 'Super-LumiNova dial', 'Anti-magnetic', '100m water resistance'],
    materials: ['316L stainless steel', 'Sapphire crystal'],
    tags: ['watches', 'automatic', 'steel'],
  },
  {
    id: 'prod_007',
    handle: 'precision-ring-set',
    title: 'Precision Ring Set',
    vendor: 'BROOD',
    category: 'Jewellery',
    categoryHandle: 'jewellery',
    price: 22000,
    currencyCode: 'INR',
    badge: 'new',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-ring-1/800/1000`, alt: 'Precision Ring Set — stacked', width: 800, height: 1000 },
      { src: `${BASE}/brood-ring-2/800/1000`, alt: 'Precision Ring Set — hand', width: 800, height: 1000 },
    ],
    variants: [
      { id: 'var_007_50', title: 'Size 50', available: true, price: 22000 },
      { id: 'var_007_52', title: 'Size 52', available: true, price: 22000 },
      { id: 'var_007_54', title: 'Size 54', available: true, price: 22000 },
      { id: 'var_007_56', title: 'Size 56', available: false, price: 22000 },
    ],
    description: 'Set of three precision-machined sterling silver bands — textured, mirror, and oxidised finishes. Stackable.',
    details: ['Set of three bands', '925 sterling silver', 'Machined textures', 'Oxidised centre band'],
    materials: ['925 sterling silver'],
    tags: ['jewellery', 'rings', 'silver'],
  },
  {
    id: 'prod_008',
    handle: 'utility-card-wallet',
    title: 'Utility Card Wallet',
    vendor: 'BROOD',
    category: 'Accessories',
    categoryHandle: 'accessories',
    price: 12500,
    currencyCode: 'INR',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-wallet-1/800/1000`, alt: 'Utility Card Wallet — closed', width: 800, height: 1000 },
      { src: `${BASE}/brood-wallet-2/800/1000`, alt: 'Utility Card Wallet — open', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Black', hex: '#111111', available: true },
      { name: 'Chrome', hex: '#c0c0c8', available: true },
      { name: 'Olive', hex: '#4a5240', available: false },
    ],
    variants: [
      { id: 'var_008_blk', title: 'Black', available: true, price: 12500 },
      { id: 'var_008_chr', title: 'Chrome', available: true, price: 12500 },
    ],
    description: 'Slim 6-card wallet — full-grain bridle leather, burnished edges, RFID-blocking interior lining.',
    details: ['6-card capacity', 'Full-grain bridle leather', 'RFID-blocking lining', 'Hand-burnished edges'],
    materials: ['Bridle leather'],
    tags: ['accessories', 'wallet', 'leather'],
  },
  {
    id: 'prod_009',
    handle: 'monolith-high-top',
    title: 'Monolith High-Top',
    vendor: 'BROOD',
    category: 'Shoes',
    categoryHandle: 'shoes',
    price: 52000,
    currencyCode: 'INR',
    badge: 'new',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-hi-1/800/1000`, alt: 'Monolith High-Top — side', width: 800, height: 1000 },
      { src: `${BASE}/brood-hi-2/800/1000`, alt: 'Monolith High-Top — back', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'White', hex: '#f5f5f5', available: true },
      { name: 'Black', hex: '#0a0a0a', available: true },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    variants: [
      { id: 'var_009_40w', title: '40 — White', available: true, price: 52000 },
      { id: 'var_009_41w', title: '41 — White', available: true, price: 52000 },
      { id: 'var_009_42w', title: '42 — White', available: true, price: 52000 },
    ],
    description: 'High-top silhouette — tubular upper in vegetable-tan full-grain, vulcanised cupsole, ankle strap buckle detail.',
    details: ['Vegetable-tan full-grain upper', 'Vulcanised cupsole', 'Ankle strap buckle', 'Cotton canvas lining'],
    materials: ['Full-grain leather', 'Vulcanised rubber'],
    tags: ['shoes', 'high-top', 'leather'],
  },
  {
    id: 'prod_010',
    handle: 'slim-column-bag',
    title: 'Slim Column Bag',
    vendor: 'BROOD',
    category: 'Bags',
    categoryHandle: 'bags',
    price: 48000,
    currencyCode: 'INR',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-col-1/800/1000`, alt: 'Slim Column Bag — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-col-2/800/1000`, alt: 'Slim Column Bag — strap', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Black', hex: '#0a0a0a', available: true },
      { name: 'Stone', hex: '#c8c4bc', available: true },
    ],
    variants: [
      { id: 'var_010_blk', title: 'Black', available: true, price: 48000 },
      { id: 'var_010_stn', title: 'Stone', available: true, price: 48000 },
    ],
    description: 'Architectural column silhouette — full-grain Pueblo leather, single-compartment, detachable adjustable strap, matte hardware.',
    details: ['Full-grain Pueblo leather', 'Single main compartment', 'Detachable adjustable strap', 'Matte gunmetal hardware'],
    materials: ['Full-grain Pueblo leather'],
    tags: ['bags', 'shoulder', 'leather'],
  },
  {
    id: 'prod_011',
    handle: 'silver-chain-bracelet',
    title: 'Silver Chain Bracelet',
    vendor: 'BROOD',
    category: 'Jewellery',
    categoryHandle: 'jewellery',
    price: 18500,
    currencyCode: 'INR',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-bracelet-1/800/1000`, alt: 'Silver Chain Bracelet — wrist', width: 800, height: 1000 },
    ],
    variants: [
      { id: 'var_011_s', title: 'Small — 17cm', available: true, price: 18500 },
      { id: 'var_011_m', title: 'Medium — 19cm', available: true, price: 18500 },
      { id: 'var_011_l', title: 'Large — 21cm', available: false, price: 18500 },
    ],
    description: 'Sterling silver marine-link chain bracelet — machined from solid 925 silver rod, lobster claw clasp.',
    details: ['Marine-link chain', '925 sterling silver', 'Lobster claw clasp', '4mm link width'],
    materials: ['925 sterling silver'],
    tags: ['jewellery', 'bracelet', 'silver'],
  },
  {
    id: 'prod_012',
    handle: 'tread-derby',
    title: 'Tread Derby',
    vendor: 'BROOD',
    category: 'Shoes',
    categoryHandle: 'shoes',
    price: 38000,
    currencyCode: 'INR',
    availableForSale: true,
    images: [
      { src: `${BASE}/brood-derby-1/800/1000`, alt: 'Tread Derby — front', width: 800, height: 1000 },
      { src: `${BASE}/brood-derby-2/800/1000`, alt: 'Tread Derby — sole', width: 800, height: 1000 },
    ],
    colors: [
      { name: 'Black', hex: '#111111', available: true },
      { name: 'Cognac', hex: '#8b5e3c', available: true },
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    variants: [
      { id: 'var_012_41', title: '41 — Black', available: true, price: 38000 },
      { id: 'var_012_42', title: '42 — Black', available: true, price: 38000 },
    ],
    description: 'Open-lacing derby — calf-leather upper, Blake-stitched, chunky TPU tread sole for daily wear.',
    details: ['Calf-leather upper', 'Blake stitch construction', 'Chunky TPU tread sole', 'Padded collar'],
    materials: ['Calfskin', 'TPU rubber'],
    tags: ['shoes', 'derby', 'leather'],
  },
];

export const mockCategories = [
  { handle: 'shoes',       title: 'Shoes',       count: mockProducts.filter(p => p.categoryHandle === 'shoes').length },
  { handle: 'watches',     title: 'Watches',     count: mockProducts.filter(p => p.categoryHandle === 'watches').length },
  { handle: 'eyewear',     title: 'Eyewear',     count: mockProducts.filter(p => p.categoryHandle === 'eyewear').length },
  { handle: 'bags',        title: 'Bags',        count: mockProducts.filter(p => p.categoryHandle === 'bags').length },
  { handle: 'jewellery',   title: 'Jewellery',   count: mockProducts.filter(p => p.categoryHandle === 'jewellery').length },
  { handle: 'accessories', title: 'Accessories', count: mockProducts.filter(p => p.categoryHandle === 'accessories').length },
];

export function getProductByHandle(handle: string): MockProduct | undefined {
  return mockProducts.find(p => p.handle === handle);
}

export function getProductsByCategory(handle: string): MockProduct[] {
  return mockProducts.filter(p => p.categoryHandle === handle);
}

export function formatPrice(amount: number, currencyCode = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function searchProducts(query: string): MockProduct[] {
  const q = query.toLowerCase();
  return mockProducts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q)) ||
    p.description.toLowerCase().includes(q)
  );
}
