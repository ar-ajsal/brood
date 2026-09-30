import { searchProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product/ProductCard';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams;
  const query = q || '';
  
  const results = query.trim().length > 1 ? await searchProducts(query) : [];

  return (
    <div className="pt-[var(--header-h)] min-h-[100dvh]">
      <div className="container py-12 lg:py-24 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight uppercase text-center mb-12">
          Search
        </h1>
        
        <form method="GET" action="/search" className="relative mb-16">
          <MagnifyingGlass size={24} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search products, materials, etc..."
            className="w-full text-2xl font-display font-medium tracking-tight bg-transparent border-b border-black/20 outline-none pl-10 py-4 placeholder-black/20 focus:border-black transition-colors"
          />
        </form>

        {query.length > 1 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-black/50">
                {results.length} Results
              </h2>
            </div>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-black/50 text-sm font-medium">
                No results found for "{query}". Try checking your spelling or using more general terms.
              </div>
            )}
          </div>
        )}

        {query.length <= 1 && (
          <div className="text-center py-20 text-black/50 text-sm font-medium">
            Enter a search term above to find products.
          </div>
        )}
      </div>
    </div>
  );
}
