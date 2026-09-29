import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import {
  getCollectionByHandle,
  getCollections,
  renderCollectionHtml,
  renderErrorState,
  parseSortParam,
  parseFilterParams,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const filePath = path.join(process.cwd(), "src/templates/shop.html");
  let templateHtml = fs.readFileSync(filePath, "utf8");

  if (!handle) {
    return new Response("Collection handle is required.", { status: 400 });
  }

  // Parse sorting and filter parameters
  const { searchParams } = request.nextUrl;
  const sortParam = searchParams.get("sort");
  const { activeSort } = parseSortParam(sortParam);
  const filters = parseFilterParams(searchParams);

  // Fetch target collection and list of all collections
  const [collectionRes, allCollectionsRes] = await Promise.all([
    getCollectionByHandle(handle, 50),
    getCollections(20),
  ]);

  if (collectionRes.error) {
    const errorPage = templateHtml.replace(
      "<!-- SHOPIFY_SHOP_PRODUCTS -->",
      renderErrorState(collectionRes.error)
    );
    return new Response(errorPage, {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  if (!collectionRes.collection) {
    const notFoundPage = templateHtml
      .replace(/<title>.*?<\/title>/i, `<title>Collection Not Found - TheHoshi</title>`)
      .replace(
        /<h3 class="home-featured-main-title">[\s\S]*?<\/h3>/i,
        `<h3 class="home-featured-main-title">COLLECTION NOT FOUND</h3>`
      )
      .replace(
        /<p class="home-low-price-recommend-subtitle">[\s\S]*?<\/p>/i,
        `<p class="home-low-price-recommend-subtitle">The requested collection "${handle}" does not exist in Shopify.</p>`
      )
      .replace(
        "<!-- SHOPIFY_SHOP_PRODUCTS -->",
        `<div class="col-12 text-center" style="grid-column:1/-1;padding:48px 16px;"><p style="font-size:16px;color:#666;margin-bottom:16px;">This collection was not found or is no longer available.</p><a href="/shop" class="btn btn-primary" style="display:inline-block;padding:10px 24px;background:#1a1a1a;color:#fff;border-radius:2px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">View All Products</a></div>`
      );

    return new Response(notFoundPage, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const html = renderCollectionHtml(
    templateHtml,
    collectionRes.collection,
    allCollectionsRes.collections,
    activeSort,
    filters
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
