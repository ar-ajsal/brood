import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import {
  getProductByHandle,
  getProducts,
  renderProductDetailHtml,
  renderErrorState,
} from "@/lib/shopify";

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

  const [productRes, catalogRes] = await Promise.all([
    getProductByHandle(handle),
    getProducts(8),
  ]);

  if (productRes.error) {
    const errorPage = templateHtml.replace(
      "<!-- BROOD_PRESTIGE_PDP_CONTENT -->",
      renderErrorState(productRes.error)
    );
    return new Response(errorPage, {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  if (!productRes.product) {
    const notFoundPage = templateHtml.replace(
      "<!-- BROOD_PRESTIGE_PDP_CONTENT -->",
      `<div class="p-8 text-center" style="padding:64px 16px;max-width:600px;margin:0 auto;"><h2 class="text-2xl font-bold mb-2" style="font-size:24px;font-weight:600;margin-bottom:8px;">Product Not Found</h2><p class="text-gray-500 mb-6" style="color:#666;margin-bottom:24px;">The requested product "${handle}" does not exist or has been removed.</p><a href="/shop" class="btn" style="display:inline-block;padding:12px 28px;background:#111;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;">Return to Shop</a></div>`
    );
    return new Response(notFoundPage, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const relatedProducts = (catalogRes.products || []).filter((p) => p.handle !== handle);
  const html = renderProductDetailHtml(templateHtml, productRes.product, relatedProducts);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

