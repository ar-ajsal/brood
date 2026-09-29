function buildShopifyFilterQuery(filters) {
  const parts = [];

  // Search keyword (q)
  if (filters.q && filters.q.trim()) {
    parts.push(filters.q.trim());
  }

  // Category / Product type mapping
  const categoryMap = {
    shoes: 'Footwear',
    footwear: 'Footwear',
    sneakers: 'Footwear',
    boots: 'Footwear',
    watches: 'Watches',
    watch: 'Watches',
    timepieces: 'Watches',
    eyewear: 'Eyewear',
    sunglasses: 'Eyewear',
    glasses: 'Eyewear',
    bags: 'Bags',
    bag: 'Bags',
    jewellery: 'Jewellery',
    jewelry: 'Jewellery',
    accessories: 'Accessories'
  };

  const rawCat = (filters.category || '').toLowerCase().trim();
  if (rawCat) {
    const productType = categoryMap[rawCat] || filters.category.trim();
    parts.push(`product_type:${productType.includes(' ') ? `"${productType}"` : productType}`);
  }

  // Availability
  if (filters.availability === 'in_stock' || filters.availability === 'true' || filters.availability === '1') {
    parts.push('available_for_sale:true');
  }

  // Price range
  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
    const min = parseFloat(String(filters.minPrice));
    if (!isNaN(min)) {
      parts.push(`variants.price:>=${min}`);
    }
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
    const max = parseFloat(String(filters.maxPrice));
    if (!isNaN(max)) {
      parts.push(`variants.price:<=${max}`);
    }
  }

  // Vendor / Brand
  if (filters.vendor && filters.vendor.trim()) {
    const v = filters.vendor.trim();
    parts.push(`vendor:${v.includes(' ') ? `"${v}"` : v}`);
  }

  // Size option
  if (filters.size && filters.size.trim()) {
    parts.push(filters.size.trim());
  }

  // Color option
  if (filters.color && filters.color.trim()) {
    parts.push(filters.color.trim());
  }

  // Tag
  if (filters.tag && filters.tag.trim()) {
    const t = filters.tag.trim();
    parts.push(`tag:${t.includes(' ') ? `"${t}"` : t}`);
  }

  return parts.join(' ');
}

console.log('Test 1 (watch):', buildShopifyFilterQuery({ q: 'watch' }));
console.log('Test 2 (shoes + in_stock):', buildShopifyFilterQuery({ category: 'shoes', availability: 'in_stock' }));
console.log('Test 3 (price range):', buildShopifyFilterQuery({ minPrice: 5000, maxPrice: 10000 }));
console.log('Test 4 (vendor with space):', buildShopifyFilterQuery({ vendor: 'My Store' }));
console.log('Test 5 (combined):', buildShopifyFilterQuery({ q: 'sneakers', category: 'footwear', size: '42', availability: 'in_stock', minPrice: 8000 }));
