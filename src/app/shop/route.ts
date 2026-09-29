import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  getTotalProductCount,
  getCollections,
  parseSortParam,
  renderSortOptions,
  renderShopProductCard,
  renderPaginationUi,
  renderEmptyState,
  renderErrorState,
  renderCartDrawerHtml,
  parseFilterParams,
  buildShopifyFilterQuery,
  getActiveFilterCount,
  renderFilterButton,
  renderActiveFilterChips,
  renderFilterDrawerHtml,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // If search query `q` is provided on /shop, redirect to dedicated /search route
  const qParam = searchParams.get("q") || searchParams.get("search");
  if (qParam && qParam.trim()) {
    const searchUrl = new URL("/search", request.url);
    searchParams.forEach((val, key) => {
      searchUrl.searchParams.set(key, val);
    });
    return NextResponse.redirect(searchUrl);
  }

  const filePath = path.join(process.cwd(), "src/templates/shop.html");
  let html = fs.readFileSync(filePath, "utf8");

  // Read sort param from URL query
  const sortParam = searchParams.get("sort");
  const { activeSort, sortKey, reverse } = parseSortParam(sortParam);

  // Parse filters and build Shopify Storefront query
  const filters = parseFilterParams(searchParams);
  const filterQuery = buildShopifyFilterQuery(filters);
  const activeCount = getActiveFilterCount(filters);

  // Fetch products, total filtered catalog count, and collections in parallel
  const [productsRes, totalCount, collectionsRes] = await Promise.all([
    getProducts({ first: 12, sortKey, reverse, query: filterQuery }),
    getTotalProductCount(filterQuery),
    getCollections(20),
  ]);

  // 1. SEO: Title, Meta Description, and Canonical
  html = html.replace(
    /<title>.*?<\/title>/i,
    "<title>Shop All Products - Luxury Footwear, Watches & Accessories | TheHoshi</title>"
  );
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    '<meta name="description" content="Explore our full collection of luxury footwear, designer eyewear, and precision timepieces. Guaranteed master quality with worldwide delivery." />'
  );

  // 2. PLP Header & Subtitle
  let plpHeading = "ALL PRODUCTS";
  let plpSubtitle = "Discover the complete catalog of luxury footwear, precision watches, and designer eyewear.";
  if (filters.category) {
    plpHeading = `${filters.category.toUpperCase()} COLLECTION`;
    plpSubtitle = `Discover our curated selection of authentic ${filters.category}.`;
  }
  html = html.replace("<!-- PLP_HEADING -->", plpHeading);
  html = html.replace("<!-- PLP_SUBTITLE -->", plpSubtitle);

  // 3. Dynamic Product Count
  const finalCount = (!productsRes.pageInfo.hasNextPage && productsRes.products)
    ? productsRes.products.length
    : totalCount;
  const countText = `${finalCount} ${finalCount === 1 ? "Product" : "Products"}`;
  html = html.replace("<!-- PRODUCT_COUNT -->", countText);

  // 4. Shopify-backed Sorting Controls & Filter Buttons
  html = html.replace("<!-- SORT_OPTIONS -->", renderSortOptions(activeSort));
  html = html.replace("<!-- FILTER_BUTTON -->", renderFilterButton(activeCount));
  html = html.replace("<!-- ACTIVE_FILTERS -->", renderActiveFilterChips(filters, activeSort, "/shop"));

  // 5. Product Grid & Pagination
  if (productsRes.error) {
    html = html.replace("<!-- SHOPIFY_SHOP_PRODUCTS -->", renderErrorState(productsRes.error));
    html = html.replace("<!-- SHOPIFY_PAGINATION -->", "");
  } else if (!productsRes.products || productsRes.products.length === 0) {
    html = html.replace(
      "<!-- SHOPIFY_SHOP_PRODUCTS -->",
      renderEmptyState("No products match the selected filters.")
    );
    html = html.replace("<!-- SHOPIFY_PAGINATION -->", "");
  } else {
    const shopCards = productsRes.products.map((p) => renderShopProductCard(p)).join("\n");
    html = html.replace("<!-- SHOPIFY_SHOP_PRODUCTS -->", shopCards);
    html = html.replace(
      "<!-- SHOPIFY_PAGINATION -->",
      renderPaginationUi(productsRes.pageInfo, productsRes.products.length, finalCount)
    );
  }

  // 6. Sliding Category Drawer Navigation
  if (collectionsRes.collections && collectionsRes.collections.length > 0) {
    const menuItems = [
      `<div class="border-b border-gray-100"><a href="/shop" class="block text-gray-700 font-bold text-primary" style="padding: 10px 16px; font-size: 14px;">All Products</a></div>`,
      ...collectionsRes.collections
        .filter((c) => c.handle !== "frontpage")
        .map(
          (c) => `
        <div class="border-b border-gray-100">
          <a href="/collections/${c.handle}" class="block text-gray-700" style="padding: 10px 16px; font-size: 14px;">${c.title}</a>
        </div>
      `
        ),
    ].join("\n");

    html = html.replace(
      /(<div class="flex-1 overflow-y-auto py-2" id="hoshi-menu-tree">)[\s\S]*?(<\/aside>)/i,
      `$1\n${menuItems}\n    </div>\n</div>\n$2`
    );
  }

  // 7. Inject Filter Drawer and Cart Drawer
  html = html.replace(
    "</body>",
    `${renderFilterDrawerHtml(filters)}\n${renderCartDrawerHtml()}\n</body>`
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
