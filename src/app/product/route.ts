import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { getProducts, getProductByHandle, renderProductDetailHtml, renderErrorState } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const filePath = path.join(process.cwd(), "src/templates/product.html");
  let templateHtml = fs.readFileSync(filePath, "utf8");

  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get("handle");

  let product = null;
  let errorMsg: string | undefined;

  const catalogPromise = getProducts(8);
  let catalogRes: any = null;

  if (handle) {
    const [res, cat] = await Promise.all([getProductByHandle(handle), catalogPromise]);
    product = res.product;
    errorMsg = res.error;
    catalogRes = cat;
  } else {
    // If no handle is specified in query, fetch first Shopify product
    const [res, cat] = await Promise.all([getProducts(1), catalogPromise]);
    if (res.products && res.products.length > 0) {
      product = res.products[0];
    }
    errorMsg = res.error;
    catalogRes = cat;
  }

  if (errorMsg) {
    const errorMarkup = renderErrorState(errorMsg);
    const errorPage = templateHtml.includes("<!-- BROOD_PRESTIGE_PDP_CONTENT -->")
      ? templateHtml.replace("<!-- BROOD_PRESTIGE_PDP_CONTENT -->", errorMarkup)
      : templateHtml.replace(
          /(<div class="default-product-info-column">)[\s\S]*?(<\/section>\s*<\/div>)/i,
          `$1${errorMarkup}$2`
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
    const notFoundMarkup = `<div class="p-8 text-center" style="padding:64px 16px;max-width:600px;margin:0 auto;"><h2 class="text-2xl font-bold mb-2" style="font-size:24px;font-weight:600;margin-bottom:8px;">Product Not Found</h2><p class="text-gray-500 mb-6" style="color:#666;margin-bottom:24px;">The requested product does not exist or has been removed.</p><a href="/shop" class="btn" style="display:inline-block;padding:12px 28px;background:#111;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;">Return to Shop</a></div>`;
    const notFoundPage = templateHtml.includes("<!-- BROOD_PRESTIGE_PDP_CONTENT -->")
      ? templateHtml.replace("<!-- BROOD_PRESTIGE_PDP_CONTENT -->", notFoundMarkup)
      : templateHtml;
    return new Response(notFoundPage, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const relatedProducts = (catalogRes?.products || []).filter((p: any) => p.handle !== product?.handle);
  const html = renderProductDetailHtml(templateHtml, product, relatedProducts);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
