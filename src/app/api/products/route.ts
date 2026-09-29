import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  parseSortParam,
  renderShopProductCard,
  parseFilterParams,
  buildShopifyFilterQuery,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const firstParam = parseInt(searchParams.get("first") || "12", 10);
    const first = Math.min(Math.max(1, isNaN(firstParam) ? 12 : firstParam), 50);
    const after = searchParams.get("after") || undefined;
    const sortParam = searchParams.get("sort");

    const { sortKey, reverse } = parseSortParam(sortParam);

    // Support all search and filter params
    const filters = parseFilterParams(searchParams);
    const filterQuery = buildShopifyFilterQuery(filters);

    const result = await getProducts({
      first,
      after,
      sortKey,
      reverse,
      query: filterQuery,
    });

    if (result.error) {
      return NextResponse.json(
        { error: "Failed to fetch products from catalog" },
        { status: 502 }
      );
    }

    const htmlCards = (result.products || [])
      .map((p) => renderShopProductCard(p))
      .join("\n");

    return NextResponse.json({
      products: result.products || [],
      pageInfo: result.pageInfo || { hasNextPage: false, endCursor: null },
      htmlCards,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching products" },
      { status: 500 }
    );
  }
}
