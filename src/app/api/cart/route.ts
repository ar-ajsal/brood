import { NextRequest, NextResponse } from "next/server";
import {
  createCart,
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    const result = await getCart(cartId);

    if (result.error || !result.cart) {
      return NextResponse.json(
        { error: result.error || "Cart not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({ cart: result.cart });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred while retrieving the cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse body: read as text first to avoid double-consume, then parse
    // Supports both JSON and URL-encoded JSON (legacy OpenCart template compat)
    const rawText = await request.text();
    type CartBody = {
      action?: string;
      cartId?: string;
      lines?: Array<{ merchandiseId?: string; id?: string; quantity: number }>;
      lineIds?: string[];
    };
    let body: CartBody;
    try {
      body = JSON.parse(rawText) as CartBody;
    } catch {
      // Body might be URL-encoded JSON
      try {
        const decoded = decodeURIComponent(rawText);
        body = JSON.parse(decoded) as CartBody;
      } catch (parseErr) {
        console.error("POST /api/cart: Could not parse body. Raw snippet:", rawText.slice(0, 200), parseErr);
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    }
    const { action, cartId, lines, lineIds } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required (create, add, update, remove)" },
        { status: 400 }
      );
    }

    if (action === "create") {
      const merchandiseLines = lines
        ? lines.map((l) => ({
            merchandiseId: l.merchandiseId || l.id || "",
            quantity: l.quantity,
          }))
        : undefined;
      const result = await createCart(merchandiseLines);
      if (result.error || !result.cart) {
        return NextResponse.json(
          { error: result.error || "Failed to create cart" },
          { status: 400 }
        );
      }
      return NextResponse.json({ cart: result.cart });
    }

    if (action === "add") {
      if (!lines || !Array.isArray(lines) || lines.length === 0) {
        return NextResponse.json(
          { error: "Lines array is required for adding to cart" },
          { status: 400 }
        );
      }

      const merchandiseLines = lines.map((l) => ({
        merchandiseId: l.merchandiseId || l.id || "",
        quantity: l.quantity,
      }));

      if (!cartId) {
        // If no cart exists yet, create one
        const createResult = await createCart(merchandiseLines);
        if (createResult.error || !createResult.cart) {
          return NextResponse.json(
            { error: createResult.error || "Failed to create cart" },
            { status: 400 }
          );
        }
        return NextResponse.json({ cart: createResult.cart });
      }

      // If cartId exists, add to existing cart
      const addResult = await addToCart(cartId, merchandiseLines);
      if (addResult.error || !addResult.cart) {
        // If cart expired or invalid, fallback to creating a fresh cart
        const fallbackResult = await createCart(merchandiseLines);
        if (fallbackResult.cart) {
          return NextResponse.json({ cart: fallbackResult.cart });
        }
        return NextResponse.json(
          { error: addResult.error || "Failed to add items to cart" },
          { status: 400 }
        );
      }
      return NextResponse.json({ cart: addResult.cart });
    }

    if (action === "update") {
      if (!cartId || !lines || !Array.isArray(lines)) {
        return NextResponse.json(
          { error: "Cart ID and lines are required for update" },
          { status: 400 }
        );
      }

      const updateLines = lines.map((l) => ({
        id: l.id || l.merchandiseId || "",
        quantity: l.quantity,
      }));

      const updateResult = await updateCart(cartId, updateLines);
      if (updateResult.error || !updateResult.cart) {
        return NextResponse.json(
          { error: updateResult.error || "Failed to update cart" },
          { status: 400 }
        );
      }
      return NextResponse.json({ cart: updateResult.cart });
    }

    if (action === "remove") {
      if (!cartId || !lineIds || !Array.isArray(lineIds)) {
        return NextResponse.json(
          { error: "Cart ID and lineIds are required for remove" },
          { status: 400 }
        );
      }

      const removeResult = await removeFromCart(cartId, lineIds);
      if (removeResult.error || !removeResult.cart) {
        return NextResponse.json(
          { error: removeResult.error || "Failed to remove item from cart" },
          { status: 400 }
        );
      }
      return NextResponse.json({ cart: removeResult.cart });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/cart unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the cart request" },
      { status: 500 }
    );
  }
}
