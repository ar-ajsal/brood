import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { getProductByHandle, renderProductDetailHtml, renderErrorState } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const filePath = path.join(process.cwd(), "src/templates/product.html");
  let templateHtml = fs.readFileSync(filePath, "utf8");

  if (!handle) {
    return new Response("Product handle is required.", { status: 400 });
  }

  const { product, error } = await getProductByHandle(handle);

  if (error) {
    const errorPage = templateHtml.replace(
      /(<div class="default-product-info-column">)[\s\S]*?(<\/section>\s*<\/div>)/i,
      `$1${renderErrorState(error)}$2`
    );
    return new Response(errorPage, {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  if (!product) {
    const notFoundPage = templateHtml.replace(
      /(<div class="default-product-info-column">)[\s\S]*?(<\/section>\s*<\/div>)/i,
      `$1<div class="p-8 text-center" style="padding:48px 16px;"><h2 class="text-xl font-bold mb-2">Product Not Found</h2><p class="text-gray-500 mb-4">The requested Shopify product "${handle}" does not exist or has been removed.</p><a href="/" class="btn btn-primary" style="display:inline-block;padding:8px 20px;background:#1a1a1a;color:#fff;border-radius:2px;">Return Home</a></div>$2`
    );
    return new Response(notFoundPage, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const html = renderProductDetailHtml(templateHtml, product);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
