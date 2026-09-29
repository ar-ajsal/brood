import fs from "fs";
import path from "path";
import {
  renderCartDrawerHtml,
  renderEmptyWishlistState,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const filePath = path.join(process.cwd(), "src/templates/shop.html");
  let html = fs.readFileSync(filePath, "utf8");

  // 1. SEO: Dynamic Title, Meta Description, and Canonical
  html = html.replace(
    /<title>.*?<\/title>/i,
    "<title>Wishlist | HOSHI - Curated Luxury Favourites</title>"
  );
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    '<meta name="description" content="Review and manage your saved luxury favorites on HOSHI. Directly add items to your shopping bag with guaranteed authentic luxury." />'
  );
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    '<link rel="canonical" href="https://thehoshi.to/wishlist" />'
  );

  // 2. Heading and Subtitle
  html = html.replace("<!-- PLP_HEADING -->", "MY WISHLIST");
  html = html.replace(
    "<!-- PLP_SUBTITLE -->",
    "Review your saved luxury pieces and add them directly to your shopping bag."
  );

  // 3. Product Count in toolbar
  html = html.replace(
    "<!-- PRODUCT_COUNT -->",
    '<span id="wishlist-page-count">0</span> Saved Items'
  );

  // 4. Remove PLP filter/sort controls on wishlist page
  html = html.replace("<!-- SORT_OPTIONS -->", "");
  html = html.replace("<!-- FILTER_BUTTON -->", "");
  html = html.replace("<!-- ACTIVE_FILTERS -->", "");

  // Hide the sort select dropdown box on wishlist
  html = html.replace(
    'id="shop-sort-select"',
    'id="shop-sort-select" style="display:none;"'
  );

  // 5. Wishlist Main Container & Client Hydration Script
  const wishlistContainerHtml = `
    <div id="wishlist-loading" style="grid-column:1/-1;width:100%;text-align:center;padding:70px 20px;">
      <div style="display:inline-block;width:32px;height:32px;border:3px solid #eee;border-top-color:#111;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
      <p style="margin-top:14px;font-size:12px;color:#888;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;">Loading Your Saved Items...</p>
    </div>

    ${renderEmptyWishlistState()}

    <div id="wishlist-grid-box" style="display:none;display:contents;"></div>

    <script>
    (function() {
      function formatPriceIn(amount, currency) {
        var num = parseFloat(amount);
        try {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency || 'INR',
            maximumFractionDigits: 2
          }).format(num);
        } catch(e) {
          return (currency || '₹') + ' ' + num.toFixed(2);
        }
      }

      function renderCard(p) {
        var minPrice = p.priceRange.minVariantPrice;
        var compPrice = p.compareAtPriceRange ? p.compareAtPriceRange.minVariantPrice : null;
        var pFmt = formatPriceIn(minPrice.amount, minPrice.currencyCode);
        var hasComp = compPrice && parseFloat(compPrice.amount) > parseFloat(minPrice.amount);
        var compFmt = hasComp ? formatPriceIn(compPrice.amount, compPrice.currencyCode) : null;
        var img = (p.images && p.images.edges && p.images.edges[0] && p.images.edges[0].node && p.images.edges[0].node.url) || 'https://thehoshi.to/image/cache/catalog/app/banner/800-100x100.jpg';
        var link = '/products/' + p.handle;
        var availVar = (p.variants && p.variants.edges && p.variants.edges.find(function(e) { return e.node.availableForSale; })) || (p.variants && p.variants.edges && p.variants.edges[0]);
        var varId = availVar ? availVar.node.id : '';
        var isAvail = p.availableForSale && !!availVar;

        return '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product-item wishlist-item" data-wishlist-item="' + p.handle + '" style="margin-bottom:24px;transition:all 0.3s ease;">' +
          '<div class="product-thumb group flex flex-col h-full bg-white dark:bg-surface-dark transition-all duration-300" style="position:relative;border:1px solid #eee;padding:12px;border-radius:4px;">' +
            '<button type="button" class="wishlist-remove-btn" data-wishlist-remove data-handle="' + p.handle + '" title="Remove from Wishlist" aria-label="Remove from Wishlist" style="position:absolute;top:16px;right:16px;z-index:10;width:28px;height:28px;border-radius:50%;background:#fff;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#888;box-shadow:0 1px 4px rgba(0,0,0,0.08);transition:all 0.2s;">✕</button>' +
            '<div class="image relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-sm mb-2">' +
              '<a href="' + link + '" class="block w-full h-full">' +
                '<img src="' + img + '" alt="' + p.title + '" class="w-full h-full object-cover bg-white" />' +
              '</a>' +
            '</div>' +
            '<div class="caption text-center flex flex-col px-0.5" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">' +
              '<div>' +
                '<div style="margin-bottom:4px;">' +
                  (isAvail ? '<span style="font-size:10px;font-weight:700;letter-spacing:0.05em;color:#137333;background:#e6f4ea;padding:2px 6px;border-radius:2px;text-transform:uppercase;">In Stock</span>' : '<span style="font-size:10px;font-weight:700;letter-spacing:0.05em;color:#c5221f;background:#fce8e6;padding:2px 6px;border-radius:2px;text-transform:uppercase;">Out of Stock</span>') +
                '</div>' +
                '<h4 class="m-0 p-0" style="min-height:32px;">' +
                  '<a class="product-name font-bold text-[11px] md:text-sm text-gray-800 dark:text-gray-300 uppercase tracking-[0.05em] leading-[1.3] line-clamp-2 block" href="' + link + '">' + p.title + '</a>' +
                '</h4>' +
                '<div class="price-wrapper mt-1">' +
                  '<span class="price-new font-bold text-sm" style="color:#111;">' + pFmt + '</span>' +
                  (compFmt ? '<span class="price-old text-xs text-gray-400 line-through ml-2">' + compFmt + '</span>' : '') +
                '</div>' +
              '</div>' +
              '<div style="margin-top:12px;">' +
                (isAvail 
                  ? '<button type="button" class="btn wishlist-add-to-cart-btn" data-variant-id="' + varId + '" style="width:100%;padding:8px 12px;background:#111;color:#fff;border:none;border-radius:2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:background 0.2s;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><span>Add to Bag</span></button>'
                  : '<button type="button" disabled style="width:100%;padding:8px 12px;background:#f0f0f0;color:#999;border:none;border-radius:2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;cursor:not-allowed;"><span>Out of Stock</span></button>') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }

      function loadWishlistPage() {
        var loadingEl = document.getElementById('wishlist-loading');
        var emptyEl = document.getElementById('wishlist-empty-box');
        var gridEl = document.getElementById('wishlist-grid-box');
        var countEl = document.getElementById('wishlist-page-count');

        if (!window.ShopifyWishlist) return;
        var items = window.ShopifyWishlist.getItems();
        var handles = items.map(function(it) { return it.handle; }).filter(Boolean);

        if (countEl) countEl.textContent = handles.length;

        if (handles.length === 0) {
          if (loadingEl) loadingEl.style.display = 'none';
          if (emptyEl) emptyEl.style.display = 'block';
          if (gridEl) { gridEl.style.display = 'none'; gridEl.innerHTML = ''; }
          return;
        }

        fetch('/api/wishlist?handles=' + encodeURIComponent(handles.join(',')))
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (loadingEl) loadingEl.style.display = 'none';
            var products = (data && data.products) || [];
            if (products.length === 0) {
              if (emptyEl) emptyEl.style.display = 'block';
              if (gridEl) { gridEl.style.display = 'none'; gridEl.innerHTML = ''; }
              if (countEl) countEl.textContent = '0';
              return;
            }
            if (emptyEl) emptyEl.style.display = 'none';
            if (gridEl) {
              gridEl.style.display = 'contents';
              gridEl.innerHTML = products.map(renderCard).join('');
            }
            if (countEl) countEl.textContent = products.length;

            // Remove any stale handles from storage
            var returnedHandles = new Set(products.map(function(p) { return p.handle.toLowerCase(); }));
            var validItems = items.filter(function(it) { return returnedHandles.has(it.handle.toLowerCase()); });
            if (validItems.length !== items.length) {
              window.ShopifyWishlist.saveItems(validItems);
            }
          })
          .catch(function(err) {
            console.error('Failed to load wishlist:', err);
            if (loadingEl) loadingEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'block';
          });
      }

      document.addEventListener('click', function(e) {
        // Wishlist Add to Bag click
        var addBtn = e.target.closest('.wishlist-add-to-cart-btn');
        if (addBtn) {
          e.preventDefault();
          var varId = addBtn.getAttribute('data-variant-id');
          if (varId && window.ShopifyCart) {
            window.ShopifyCart.addLine(varId, 1, addBtn);
          }
        }

        // Wishlist Remove button click
        var removeBtn = e.target.closest('.wishlist-remove-btn');
        if (removeBtn) {
          e.preventDefault();
          var handle = removeBtn.getAttribute('data-handle');
          if (handle && window.ShopifyWishlist) {
            window.ShopifyWishlist.remove(handle);
            var card = document.querySelector('[data-wishlist-item="' + handle + '"]');
            if (card) {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.9)';
              setTimeout(function() {
                card.remove();
                var remaining = document.querySelectorAll('.wishlist-item');
                var countEl = document.getElementById('wishlist-page-count');
                if (countEl) countEl.textContent = remaining.length;
                if (remaining.length === 0) {
                  var emptyEl = document.getElementById('wishlist-empty-box');
                  var gridEl = document.getElementById('wishlist-grid-box');
                  if (gridEl) { gridEl.style.display = 'none'; gridEl.innerHTML = ''; }
                  if (emptyEl) emptyEl.style.display = 'block';
                }
              }, 250);
            }
          }
        }
      });

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWishlistPage);
      } else {
        loadWishlistPage();
      }
    })();
    </script>
  `;

  html = html.replace("<!-- SHOPIFY_SHOP_PRODUCTS -->", wishlistContainerHtml);

  // 6. Remove Pagination container on Wishlist page
  html = html.replace("<!-- PAGINATION -->", "");
  html = html.replace('id="shop-load-more-btn"', 'id="shop-load-more-btn" style="display:none;"');

  // 7. Inject Cart Drawer and Wishlist runtime script
  html = html.replace("</body>", `${renderCartDrawerHtml()}\n</body>`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
