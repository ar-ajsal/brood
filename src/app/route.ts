import fs from "fs";
import path from "path";
import {
  getProducts,
  renderShopProductCard,
  renderEmptyState,
  renderErrorState,
  renderCartDrawerHtml,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const filePath = path.join(process.cwd(), "src/templates/home.html");
  let html = fs.readFileSync(filePath, "utf8");

  // Fetch live Shopify products in parallel:
  // 1. New Arrivals: latest created products
  // 2. Best Sellers / Featured: top selling catalog items
  const [newArrivalsRes, bestSellersRes] = await Promise.all([
    getProducts({ first: 8, sortKey: "CREATED_AT", reverse: true }),
    getProducts({ first: 8, sortKey: "BEST_SELLING", reverse: false }),
  ]);

  // Handle New Arrivals
  if (newArrivalsRes.error) {
    html = html.replace("<!-- SHOPIFY_NEW_ARRIVALS -->", renderErrorState(newArrivalsRes.error));
  } else if (!newArrivalsRes.products || newArrivalsRes.products.length === 0) {
    html = html.replace("<!-- SHOPIFY_NEW_ARRIVALS -->", renderEmptyState("No new arrivals found."));
  } else {
    const newArrivalCards = newArrivalsRes.products.map((p) => renderShopProductCard(p)).join("\n");
    html = html.replace("<!-- SHOPIFY_NEW_ARRIVALS -->", newArrivalCards);
  }

  // Handle Best Sellers / Featured
  if (bestSellersRes.error) {
    html = html.replace("<!-- SHOPIFY_BEST_SELLERS -->", renderErrorState(bestSellersRes.error));
  } else if (!bestSellersRes.products || bestSellersRes.products.length === 0) {
    html = html.replace("<!-- SHOPIFY_BEST_SELLERS -->", renderEmptyState("No best sellers available."));
  } else {
    const bestSellerCards = bestSellersRes.products.map((p) => renderShopProductCard(p)).join("\n");
    html = html.replace("<!-- SHOPIFY_BEST_SELLERS -->", bestSellerCards);
  }

  // Inject global Cart Drawer & Wishlist subsystem into </body>
  html = html.replace("</body>", `${renderCartDrawerHtml()}\n</body>`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
