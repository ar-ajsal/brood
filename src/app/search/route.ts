import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import {
  getProducts,
  getTotalProductCount,
  getCollections,
  parseSortParam,
  renderSortOptions,
  renderShopProductCard,
  renderPaginationUi,
  renderEmptySearchState,
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
  const qParam = (searchParams.get("q") || searchParams.get("search") || "").trim();

  const filePath = path.join(process.cwd(), "src/templates/shop.html");
  let html = fs.readFileSync(filePath, "utf8");

  // Read sort param from URL query
  const sortParam = searchParams.get("sort");
  const { activeSort, sortKey, reverse } = parseSortParam(sortParam);

  // Parse filters and build Shopify Storefront query
  const filters = parseFilterParams(searchParams);
  // Ensure the search keyword is preserved in filters
  filters.q = qParam;
  const filterQuery = buildShopifyFilterQuery(filters);
  const activeCount = getActiveFilterCount(filters);

  // Fetch products, total search count, and collections in parallel
  const [productsRes, totalCount, collectionsRes] = await Promise.all([
    getProducts({ first: 12, sortKey, reverse, query: filterQuery }),
    getTotalProductCount(filterQuery),
    getCollections(20),
  ]);

  // 1. SEO: Dynamic Title and Description
  const titleText = qParam
    ? `Search: "${escapeHtml(qParam)}" - Real Shopify Products | TheHoshi`
    : "Search Products - Luxury Footwear, Watches & Eyewear | TheHoshi";
  html = html.replace(/<title>.*?<\/title>/i, `<title>${titleText}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="Search results for ${escapeHtml(qParam || "all products")} in the official TheHoshi luxury catalog. Guaranteed authentic quality." />`
  );

  // 2. Pre-fill Search input value in header/bar
  if (qParam) {
    html = html.replace(
      'id="hoshi-search-input"',
      `id="hoshi-search-input" value="${escapeHtml(qParam)}"`
    );
    html = html.replace(
      'name="search" value=""',
      `name="search" value="${escapeHtml(qParam)}"`
    );
  }

  // 3. Search Header & Subtitle
  const headingText = qParam ? "SEARCH RESULTS" : "CATALOG SEARCH";
  const subtitleText = qParam
    ? `Showing search results matching "${escapeHtml(qParam)}"`
    : "Search the complete collection of luxury footwear, precision watches, and designer eyewear.";
  html = html.replace("<!-- PLP_HEADING -->", headingText);
  html = html.replace("<!-- PLP_SUBTITLE -->", subtitleText);

  // 4. Dynamic Product Count
  const finalCount = (!productsRes.pageInfo.hasNextPage && productsRes.products)
    ? productsRes.products.length
    : totalCount;
  const countText = `${finalCount} ${finalCount === 1 ? "Product" : "Products"} found`;
  html = html.replace("<!-- PRODUCT_COUNT -->", countText);

  // 5. Shopify-backed Sorting Controls & Filter Buttons
  html = html.replace("<!-- SORT_OPTIONS -->", renderSortOptions(activeSort));
  html = html.replace("<!-- FILTER_BUTTON -->", renderFilterButton(activeCount));
  html = html.replace("<!-- ACTIVE_FILTERS -->", renderActiveFilterChips(filters, activeSort, "/search"));

  // 6. Product Grid & Pagination
  if (productsRes.error) {
    html = html.replace("<!-- SHOPIFY_SHOP_PRODUCTS -->", renderErrorState(productsRes.error));
    html = html.replace("<!-- SHOPIFY_PAGINATION -->", "");
  } else if (!productsRes.products || productsRes.products.length === 0) {
    html = html.replace(
      "<!-- SHOPIFY_SHOP_PRODUCTS -->",
      renderEmptySearchState(qParam || "your query")
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

  // 7. Sliding Category Drawer Navigation
  if (collectionsRes.collections && collectionsRes.collections.length > 0) {
    const menuItems = [
      `<div class="border-b border-gray-100"><a href="/shop" class="block text-gray-700" style="padding: 10px 16px; font-size: 14px; font-weight: 600;">All Products</a></div>`,
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

  // 8. Inject Filter Drawer and Cart Drawer
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

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
