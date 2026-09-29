import fs from "fs";
import path from "path";
import {
  getProducts,
  renderTemplateProductCard,
  renderTemplateCarouselItem,
  renderEmptyState,
  renderErrorState,
  renderCartDrawerHtml,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const filePath = path.join(process.cwd(), "src/templates/home.html");
  let html = fs.readFileSync(filePath, "utf8");

  // Fetch real Shopify products
  const { products, error } = await getProducts(20);

  if (error) {
    html = html.replace("<!-- SHOPIFY_PRODUCTS_GRID -->", renderErrorState(error));
    html = html.replace("<!-- SHOPIFY_CAROUSEL_PRODUCTS -->", "");
  } else if (!products || products.length === 0) {
    html = html.replace("<!-- SHOPIFY_PRODUCTS_GRID -->", renderEmptyState());
    html = html.replace("<!-- SHOPIFY_CAROUSEL_PRODUCTS -->", "");
  } else {
    const gridCards = products.map((p) => renderTemplateProductCard(p)).join("\n");
    const carouselCards = products.map((p) => renderTemplateCarouselItem(p)).join("\n");

    html = html.replace("<!-- SHOPIFY_PRODUCTS_GRID -->", gridCards);
    html = html.replace("<!-- SHOPIFY_CAROUSEL_PRODUCTS -->", carouselCards);
  }

  html = html.replace("</body>", `${renderCartDrawerHtml()}\n</body>`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
