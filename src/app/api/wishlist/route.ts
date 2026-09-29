import { NextRequest, NextResponse } from "next/server";
import { getProductByHandle, ShopifyProduct } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const handlesParam = searchParams.get("handles") || "";
    const handles = handlesParam
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    if (handles.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await fetchProductsByHandles(handles);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Wishlist API GET error:", error);
    return NextResponse.json({ products: [], error: "Failed to fetch wishlist products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const handles: string[] = Array.isArray(body?.handles)
      ? body.handles.map((h: unknown) => String(h).trim().toLowerCase()).filter(Boolean)
      : [];

    if (handles.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await fetchProductsByHandles(handles);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Wishlist API POST error:", error);
    return NextResponse.json({ products: [], error: "Failed to fetch wishlist products" }, { status: 500 });
  }
}

async function fetchProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  const uniqueHandles = Array.from(new Set(handles)).slice(0, 50); // limit to 50 items

  const productPromises = uniqueHandles.map(async (handle) => {
    try {
      const res = await getProductByHandle(handle);
      return res.product;
    } catch (e) {
      console.warn(`Could not load wishlist product for handle: ${handle}`, e);
      return null;
    }
  });

  const results = await Promise.all(productPromises);
  return results.filter((p): p is ShopifyProduct => p !== null && !!p.id);
}
