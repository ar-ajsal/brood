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

  if (handle) {
    const res = await getProductByHandle(handle);
    product = res.product;
    errorMsg = res.error;
  } else {
    // If no handle is specified in query, fetch first Shopify product
    const res = await getProducts(1);
    if (res.products && res.products.length > 0) {
      product = res.products[0];
    }
    errorMsg = res.error;
  }

  if (errorMsg) {
    const errorPage = templateHtml.replace(
      /(<div class="default-product-info-column">)[\s\S]*?(<\/section>\s*<\/div>)/i,
      `$1${renderErrorState(errorMsg)}$2`
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
    return new Response(templateHtml, {
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
