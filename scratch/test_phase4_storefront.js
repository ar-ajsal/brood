const puppeteer = require('puppeteer-core');
const os = require('os');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('PHASE 4 — PRESTIGE STOREFRONT REAL-BROWSER TEST SUITE');
  console.log('====================================================\n');

  const tempDir = path.join(os.tmpdir(), 'puppeteer_phase4_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  let allPassed = true;
  function report(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name} ${details ? '(' + details + ')' : ''}`);
    } else {
      console.error(`[FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
      allPassed = false;
    }
  }

  try {
    // =========================================================================
    // 1. DESKTOP VIEWPORT TESTS (1280x800)
    // =========================================================================
    console.log('\n--- 1. DESKTOP HOMEPAGE INSPECTION ---');
    await page.setViewport({ width: 1280, height: 800 });
    const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    report('Homepage HTTP Status', response.status() === 200, `Status: ${response.status()}`);

    // Wait for product cards to load
    await page.waitForSelector('.brood-header-wrapper', { timeout: 10000 });
    await page.waitForSelector('.prestige-product-card', { timeout: 10000 });

    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        announcement: document.querySelector('.brood-announcement-bar')?.textContent?.trim(),
        logoText: document.querySelector('.brood-logo-text')?.textContent?.trim(),
        logoSub: document.querySelector('.brood-logo-sub')?.textContent?.trim(),
        navItems: Array.from(document.querySelectorAll('.brood-nav-desktop .brood-nav-link')).map(a => a.textContent.trim()),
        hasSearchBtn: !!document.querySelector('[data-search-toggle]'),
        hasAccountBtn: !!document.querySelector('a[href="/account"]'),
        hasWishlistBtn: !!document.querySelector('a[href="/wishlist"]'),
        hasCartBtn: !!document.querySelector('[data-cart-toggle]'),
        newArrivalCardsCount: document.querySelectorAll('.brood-section[aria-label="New Arrivals"] .prestige-product-card').length,
        bestSellerCardsCount: document.querySelectorAll('.brood-section[aria-label="Best Sellers"] .prestige-product-card').length,
        categoryCardsCount: document.querySelectorAll('.brood-category-card').length,
        categories: Array.from(document.querySelectorAll('.brood-category-card')).map(c => ({
          href: c.getAttribute('href'),
          name: c.querySelector('.brood-category-name')?.textContent?.trim()
        })),
        editorialTitle: document.querySelector('.brood-editorial-title')?.textContent?.trim(),
        storiesCount: document.querySelectorAll('.brood-story-tile').length,
        hasNewsletter: !!document.querySelector('.brood-newsletter-card'),
        footerColumns: document.querySelectorAll('.brood-footer-grid > div').length,
        footerCopyright: document.querySelector('.brood-footer-bottom')?.textContent?.trim()
      };
    });

    report('Title contains Brood & Luxury', pageInfo.title.includes('Brood') && pageInfo.title.includes('Luxury'), pageInfo.title);
    report('Announcement Bar content', pageInfo.announcement.includes('NEW 2026 COLLECTIONS NOW AVAILABLE'));
    report('Brand Logo is BROOD ATELIER', pageInfo.logoText === 'BROOD' && pageInfo.logoSub === 'ATELIER');

    const expectedCategories = ['Men', 'Women', 'Shoes', 'Watches', 'Eyewear', 'Bags', 'Jewellery', 'Accessories'];
    const navMatch = expectedCategories.every(cat => pageInfo.navItems.includes(cat));
    report('Desktop Navigation has all 8 categories', navMatch, pageInfo.navItems.join(', '));

    report('Header Action Buttons present (Search, Account, Wishlist, Cart)', 
      pageInfo.hasSearchBtn && pageInfo.hasAccountBtn && pageInfo.hasWishlistBtn && pageInfo.hasCartBtn);

    report('New Arrivals section populated with live Shopify cards', pageInfo.newArrivalCardsCount > 0, `Count: ${pageInfo.newArrivalCardsCount}`);
    report('Best Sellers section populated with live Shopify cards', pageInfo.bestSellerCardsCount > 0, `Count: ${pageInfo.bestSellerCardsCount}`);
    report('Featured Categories has 6 department cards', pageInfo.categoryCardsCount === 6, `Count: ${pageInfo.categoryCardsCount}`);

    const validCatLinks = pageInfo.categories.every(c => c.href && c.href.startsWith('/collections/'));
    report('Category links point to valid /collections/ paths', validCatLinks, pageInfo.categories.map(c => c.href).join(', '));

    report('Editorial / Shop the Look section present', pageInfo.editorialTitle.length > 0, pageInfo.editorialTitle);
    report('Category Craftsmanship Stories (2 tiles)', pageInfo.storiesCount === 2);
    report('Newsletter Signup Card present', pageInfo.hasNewsletter);
    report('Prestige 4-Column Footer present', pageInfo.footerColumns === 4);
    report('Footer Copyright is BROOD ATELIER', pageInfo.footerCopyright.includes('BROOD ATELIER'));

    // =========================================================================
    // 2. MEGA MENU INTERACTION
    // =========================================================================
    console.log('\n--- 2. MEGA MENU INTERACTION ---');
    const megaMenuData = await page.evaluate(() => {
      const shoesNavItem = Array.from(document.querySelectorAll('.brood-nav-item')).find(el => {
        return el.querySelector('.brood-nav-link')?.textContent?.trim() === 'Shoes';
      });
      if (!shoesNavItem) return { found: false };
      const panel = shoesNavItem.querySelector('.brood-mega-menu-panel');
      const links = Array.from(panel?.querySelectorAll('.brood-mega-link') || []).map(a => a.textContent.trim());
      const featuredTitle = panel?.querySelector('.brood-mega-featured-title')?.textContent?.trim();
      return {
        found: true,
        linksCount: links.length,
        links,
        featuredTitle
      };
    });

    report('Mega Menu panel exists for Shoes', megaMenuData.found && megaMenuData.linksCount > 0, `Links: ${megaMenuData.linksCount}, Featured: ${megaMenuData.featuredTitle}`);

    // =========================================================================
    // 3. SEARCH MODAL INTERACTION
    // =========================================================================
    console.log('\n--- 3. SEARCH MODAL INTERACTION ---');
    await page.click('[data-search-toggle]');
    await page.waitForSelector('.brood-search-modal.is-active', { timeout: 3000 });
    
    const searchModalActive = await page.evaluate(() => {
      const modal = document.querySelector('.brood-search-modal');
      const input = document.querySelector('#hoshi-search-input');
      return modal && modal.classList.contains('is-active') && !!input;
    });
    report('Search modal opens on trigger click', searchModalActive);

    // Close search modal
    await page.click('[data-search-close]');
    await new Promise(r => setTimeout(r, 400));
    const searchModalClosed = await page.evaluate(() => {
      const modal = document.querySelector('.brood-search-modal');
      return !modal.classList.contains('is-active');
    });
    report('Search modal closes on close button click', searchModalClosed);

    // =========================================================================
    // 4. CART DRAWER & WISHLIST ON HOMEPAGE
    // =========================================================================
    console.log('\n--- 4. CART DRAWER & WISHLIST ON HOMEPAGE ---');
    await page.click('[data-cart-toggle]');
    await page.waitForSelector('#shopify-cart-drawer', { timeout: 3000 });
    await new Promise(r => setTimeout(r, 400));
    
    const cartDrawerOpened = await page.evaluate(() => {
      const drawer = document.getElementById('shopify-cart-drawer');
      return drawer && drawer.style.transform === 'translateX(0px)';
    });
    report('Shopping Bag drawer slides open on cart icon click', cartDrawerOpened);

    // Close cart drawer
    await page.click('#shopify-cart-close');
    await new Promise(r => setTimeout(r, 400));
    const cartDrawerClosed = await page.evaluate(() => {
      const drawer = document.getElementById('shopify-cart-drawer');
      return drawer && drawer.style.transform === 'translateX(100%)';
    });
    report('Shopping Bag drawer closes on close button click', cartDrawerClosed);

    // Test Quick-Add on Homepage
    console.log('Testing Quick Add on homepage card...');
    const quickAddResult = await page.evaluate(async () => {
      const card = document.querySelector('.brood-section[aria-label="New Arrivals"] .prestige-product-card');
      if (!card) return { success: false, reason: 'No card found' };
      const quickAddBtn = card.querySelector('.prestige-quick-add-btn');
      if (!quickAddBtn) return { success: false, reason: 'No quick add button' };
      quickAddBtn.click();
      return { success: true };
    });
    report('Quick Add button clicked on homepage product card', quickAddResult.success);

    // =========================================================================
    // 5. MOBILE VIEWPORT TESTS (375px, 390px, 768px)
    // =========================================================================
    console.log('\n--- 5. MOBILE VIEWPORTS & HORIZONTAL OVERFLOW ---');
    const viewports = [
      { name: 'Mobile Small', width: 375, height: 667 },
      { name: 'Mobile Standard (iPhone)', width: 390, height: 844 },
      { name: 'Tablet (iPad Mini)', width: 768, height: 1024 }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('.brood-header-wrapper', { timeout: 10000 });
      await page.waitForSelector('.prestige-product-card', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));

      const overflow = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        return {
          scrollWidth,
          innerWidth,
          hasOverflow: scrollWidth > innerWidth
        };
      });

      report(`Zero Horizontal Overflow @ ${vp.name} (${vp.width}px)`, 
        !overflow.hasOverflow, 
        `scrollWidth: ${overflow.scrollWidth}, innerWidth: ${overflow.innerWidth}`);
    }

    // =========================================================================
    // 6. MOBILE ACCORDION DRAWER FUNCTIONALITY @ 390px
    // =========================================================================
    console.log('\n--- 6. MOBILE DRAWER & ACCORDION VERIFICATION @ 390px ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('[data-mobile-menu-toggle]', { timeout: 5000 });

    // Open mobile menu
    await page.click('[data-mobile-menu-toggle]');
    await page.waitForSelector('#brood-mobile-menu.is-active', { timeout: 3000 });
    report('Mobile drawer slides in when hamburger clicked', true);

    // Test accordion expansion
    const accordionResult = await page.evaluate(() => {
      const items = document.querySelectorAll('.brood-accordion-item');
      if (items.length === 0) return { success: false, reason: 'No accordion items' };
      const firstBtn = items[0].querySelector('.brood-accordion-btn');
      firstBtn.click();
      const isOpenAfterClick = items[0].classList.contains('is-open');
      const contentVisible = items[0].querySelector('.brood-accordion-content') && window.getComputedStyle(items[0].querySelector('.brood-accordion-content')).display !== 'none';
      return {
        success: isOpenAfterClick && contentVisible,
        itemsCount: items.length
      };
    });
    report('Mobile accordion item expands with sub-category links', accordionResult.success, `Items: ${accordionResult.itemsCount}`);

    // Close mobile menu
    await page.click('[data-mobile-menu-close]');
    await new Promise(r => setTimeout(r, 600));
    const mobileMenuClosed = await page.evaluate(() => {
      const drawer = document.getElementById('brood-mobile-menu');
      return !drawer.classList.contains('is-active');
    });
    report('Mobile drawer closes when close button clicked', mobileMenuClosed);

    // =========================================================================
    // 7. REGRESSION TESTING ACROSS OTHER STOREFRONT ROUTES
    // =========================================================================
    console.log('\n--- 7. REGRESSION TESTING ACROSS ROUTES ---');
    const routesToTest = [
      { name: 'Shop / PLP', url: `${BASE_URL}/shop`, selector: '.prestige-product-card' },
      { name: 'Shoes Collection', url: `${BASE_URL}/collections/shoes`, selector: '.prestige-product-card' },
      { name: 'Watches Collection', url: `${BASE_URL}/collections/watches`, selector: '.prestige-product-card' },
      { name: 'Bags Collection (Planned)', url: `${BASE_URL}/collections/bags`, selector: 'body' },
      { name: 'Product Detail Page (PDP)', url: `${BASE_URL}/products/premium-sneakers`, selector: '.prestige-product-title' },
      { name: 'Search Page', url: `${BASE_URL}/search?q=sneakers`, selector: '.prestige-product-card' },
      { name: 'Wishlist Page', url: `${BASE_URL}/wishlist`, selector: 'body' },
    ];

    for (const r of routesToTest) {
      const res = await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      let hasSelector = false;
      try {
        await page.waitForSelector(r.selector, { timeout: 6000 });
        hasSelector = true;
      } catch (e) {
        hasSelector = false;
      }
      report(`Regression: ${r.name}`, res.status() === 200 && hasSelector, `Status: ${res.status()}`);
    }

  } catch (err) {
    console.error('Test execution error:', err);
    allPassed = false;
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('>>> ALL PHASE 4 VERIFICATION CHECKS PASSED <<<');
  } else {
    console.log('>>> SOME CHECKS FAILED — REVIEW LOGS ABOVE <<<');
  }
  console.log('====================================================\n');
  process.exit(allPassed ? 0 : 1);
}

runPhase4Tests();
