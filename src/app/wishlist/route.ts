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
        var secImg = (p.images && p.images.edges && p.images.edges[1] && p.images.edges[1].node && p.images.edges[1].node.url) || null;
        if (!secImg && p.variants && p.variants.edges) {
          var altV = p.variants.edges.find(function(e) { return e.node && e.node.image && e.node.image.url && e.node.image.url !== img; });
          if (altV && altV.node && altV.node.image) secImg = altV.node.image.url;
        }

        var link = '/products/' + p.handle;
        var variants = (p.variants && p.variants.edges && p.variants.edges.map(function(e) { return e.node; })) || [];
        var realOptions = (p.options || []).filter(function(o) {
          return o.name !== 'Title' || (o.values.length > 1 || o.values[0] !== 'Default Title');
        });
        var isSingleVar = variants.length <= 1 || realOptions.length === 0;
        var defaultVar = variants.find(function(v) { return v.availableForSale; }) || variants[0];
        var defaultVarId = defaultVar ? defaultVar.id : '';
        var isSoldOut = !p.availableForSale;

        // Badge
        var badgeHtml = '';
        if (isSoldOut) {
          badgeHtml = '<span class="prestige-card-badge badge--soldout prestige-badge-soldout" aria-label="Sold out">Sold Out</span>';
        } else if (hasComp) {
          var cur = parseFloat(minPrice.amount);
          var orig = parseFloat(compPrice.amount);
          var pct = Math.round(((orig - cur) / orig) * 100);
          badgeHtml = '<span class="prestige-card-badge badge--sale prestige-badge-sale" aria-label="On sale: -' + pct + '%">' + (pct > 0 ? '-' + pct + '%' : 'Sale') + '</span>';
        }

        // Color swatches
        var colorOpt = (p.options || []).find(function(o) {
          var n = (o.name || '').toLowerCase();
          return n === 'color' || n === 'colour';
        });
        var swatchesHtml = '';
        if (colorOpt && colorOpt.values && colorOpt.values.length > 0) {
          var colorMap = {
            black: '#111111', white: '#fcfcfc', grey: '#888888', gray: '#888888',
            navy: '#0f1c3f', blue: '#1e3a8a', brown: '#6e473b', tan: '#d2b48c',
            beige: '#f5f5dc', gold: '#d4af37', silver: '#c0c0c0', green: '#1b4332',
            red: '#b91c1c', yellow: '#eab308', orange: '#ea580c', pink: '#f472b6'
          };
          var dots = colorOpt.values.slice(0, 5).map(function(val) {
            var hex = colorMap[val.toLowerCase().trim()] || val.toLowerCase().trim();
            return '<span class="prestige-card-swatch" style="background-color:' + hex + ';" title="' + val + '"></span>';
          }).join('');
          var moreCount = colorOpt.values.length - 5;
          var morePill = moreCount > 0 ? '<span class="prestige-card-swatch-more">+' + moreCount + '</span>' : '';
          swatchesHtml = '<div class="prestige-card-swatches" aria-label="Color options">' + dots + morePill + '</div>';
        }

        // Quick add
        var quickAddHtml = '';
        if (!isSoldOut) {
          if (isSingleVar) {
            quickAddHtml = '<button type="button" class="prestige-quick-add-btn" data-quick-add-single data-variant-id="' + defaultVarId + '" data-handle="' + p.handle + '" title="Quick Add to Bag" aria-label="Quick Add to Bag">' +
              '<svg class="plus-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
                '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>' +
              '</svg>' +
            '</button>';
          } else {
            var optName = realOptions[0] ? realOptions[0].name : 'Size';
            var pillBtns = variants.map(function(v) {
              var optVal = (v.selectedOptions && v.selectedOptions[0] && v.selectedOptions[0].value) || v.title;
              if (!v.availableForSale) {
                return '<button type="button" class="prestige-variant-pill disabled" disabled title="Out of stock">' + optVal + '</button>';
              }
              return '<button type="button" class="prestige-variant-pill" data-quick-add-variant="' + v.id + '" data-handle="' + p.handle + '" title="Add ' + optVal + ' to cart">' + optVal + '</button>';
            }).join('');

            quickAddHtml = '<button type="button" class="prestige-quick-add-btn" data-quick-add-toggle data-handle="' + p.handle + '" title="Select ' + optName + '" aria-label="Select ' + optName + '">' +
              '<svg class="plus-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
                '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>' +
              '</svg>' +
            '</button>' +
            '<div class="prestige-quick-variants-drawer" id="quick-variants-' + p.handle + '">' +
              '<div class="prestige-quick-variants-header">' +
                '<span class="prestige-quick-variants-title">Select ' + optName + '</span>' +
                '<button type="button" class="prestige-quick-variants-close" data-quick-variants-close aria-label="Close variant selector">&times;</button>' +
              '</div>' +
              '<div class="prestige-quick-variants-pills">' + pillBtns + '</div>' +
            '</div>';
          }
        }

        return '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product-item prestige-card-col wishlist-item" data-wishlist-item="' + p.handle + '" style="margin-bottom:24px;transition:all 0.3s ease;">' +
          '<div class="product-thumb prestige-product-card group" data-handle="' + p.handle + '" data-product-id="' + p.id + '">' +
            '<div class="image prestige-card-media">' +
              badgeHtml +
              '<button type="button" class="prestige-wishlist-btn wishlist-remove-btn is-active active" data-wishlist-remove data-handle="' + p.handle + '" title="Remove from Wishlist" aria-label="Remove from Wishlist">' +
                '<svg class="heart-icon" width="15" height="15" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                  '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>' +
                '</svg>' +
              '</button>' +
              '<a href="' + link + '" class="prestige-card-image-link" aria-label="' + p.title + '">' +
                '<img src="' + img + '" alt="' + p.title + '" title="' + p.title + '" loading="lazy" decoding="async" class="prestige-card-img prestige-primary-img ' + (secImg ? 'has-secondary' : '') + '" />' +
                (secImg ? '<img src="' + secImg + '" alt="' + p.title + '" title="' + p.title + '" loading="lazy" decoding="async" class="prestige-card-img prestige-secondary-img" />' : '') +
              '</a>' +
              quickAddHtml +
            '</div>' +
            '<div class="caption prestige-card-info">' +
              '<div class="prestige-card-vendor">' + (p.vendor || 'BROOD') + '</div>' +
              '<h3 class="name prestige-card-title m-0 p-0">' +
                '<a class="product-name font-bold text-[11px] md:text-sm text-gray-800 dark:text-gray-300 uppercase tracking-[0.05em] leading-[1.3] line-clamp-2 block" href="' + link + '" title="' + p.title + '">' + p.title + '</a>' +
              '</h3>' +
              '<div class="price price-wrapper prestige-card-price-row mt-1">' +
                '<span class="price-new prestige-price-current font-bold">' + pFmt + '</span>' +
                (compFmt ? '<span class="price-old prestige-price-compare text-xs text-gray-400 line-through ml-2">' + compFmt + '</span>' : '') +
              '</div>' +
              swatchesHtml +
            '</div>' +
          '</div>' +
        '</div>';
      }

      function loadWishlistPage() {
        var loadingEl = document.getElementById('wishlist-loading');
        var emptyEl = document.getElementById('wishlist-empty-box');
        var gridEl = document.getElementById('wishlist-grid-box');
        var countEl = document.getElementById('wishlist-page-count');

        if (!window.ShopifyWishlist) {
          setTimeout(loadWishlistPage, 50);
          return;
        }
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
