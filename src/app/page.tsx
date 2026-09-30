import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product/ProductCard';

export default async function HomePage() {
  const allProducts = await getProducts();
  const newArrivals = allProducts.filter(p => p.badge === 'new' || p.tags.includes('new')).slice(0, 4);
  const featuredBags = allProducts.filter(p => p.category === 'Bags' || p.categoryHandle === 'bags').slice(0, 2);

  // Fallback to latest products if not enough tagged
  const displayArrivals = newArrivals.length >= 2 ? newArrivals : allProducts.slice(0, 4);

  return (
    <>
      {/* 1. Hero Section (Cold Luxury) */}
      <section className="relative min-h-[100dvh] flex items-center bg-[var(--color-bg-soft)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/brood-hero-chrome/2000/1200" 
            alt="Chrome utility hardware"
            fill
            className="object-cover opacity-80 mix-blend-multiply"
            priority
          />
        </div>
        
        {/* Content stacked in a container */}
        <div className="container relative z-10 pt-24 pb-12 flex flex-col justify-end min-h-[100dvh]">
          <div className="max-w-2xl text-white">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none mb-6">
              Structural<br />Precision
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-[420px] mb-8 leading-snug">
              Exploring the intersection of industrial craft and modern utility. The new season collection.
            </p>
            <div className="flex gap-4">
              <Link href="/shop" className="btn bg-white text-black hover:bg-white/90">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. New Arrivals (Horizontal Scroll Snap or Grid) */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="heading-2 uppercase">New Arrivals</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-black/60 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Feature (Bags) - Split Layout */}
      <section className="section bg-[var(--color-bg-soft)]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="label-sm text-[var(--color-muted)] mb-4 block">Utility</span>
              <h2 className="display-3 uppercase mb-6 max-w-[15ch]">
                Engineered for daily transit.
              </h2>
              <p className="body-lg text-[var(--color-muted)] max-w-md mb-8">
                Constructed from heavy-duty waxed canvas and bonded vegetable-tan leather, designed to age beautifully over decades of use.
              </p>
              <Link href="/collections/bags" className="btn btn--secondary">
                Shop Bags
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] bg-black/5 rounded-sm overflow-hidden">
              <Image 
                src="https://picsum.photos/seed/brood-bags-editorial/1000/1250" 
                alt="Cargo Tote on location"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Materiality Grid (Bento style) */}
      <section className="section bg-black text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-2 relative aspect-video md:aspect-auto bg-zinc-900 overflow-hidden flex flex-col justify-end p-8 md:p-12">
              <Image 
                src="https://picsum.photos/seed/brood-titanium/1200/800" 
                alt="Titanium machining"
                fill
                className="object-cover opacity-50 mix-blend-luminosity"
              />
              <div className="relative z-10">
                <h3 className="heading-1 uppercase mb-2">Grade-5 Titanium</h3>
                <p className="max-w-md text-zinc-400">Exceptional strength-to-weight ratio. Used extensively across our horology and eyewear collections.</p>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-auto bg-zinc-900 overflow-hidden flex flex-col justify-end p-8 md:p-12">
              <Image 
                src="https://picsum.photos/seed/brood-leather/800/800" 
                alt="Vegetable tanned leather"
                fill
                className="object-cover opacity-50 mix-blend-luminosity"
              />
              <div className="relative z-10">
                <h3 className="heading-2 uppercase mb-2">Vachetta</h3>
                <p className="text-zinc-400">Untreated Italian calfskin.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
