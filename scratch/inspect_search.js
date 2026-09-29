const fs = require('fs');

const templates = ['src/templates/home.html', 'src/templates/product.html', 'src/templates/shop.html'];

for (const f of templates) {
  const content = fs.readFileSync(f, 'utf8');
  console.log('=== ' + f + ' ===');
  console.log('has executeSearch:', content.includes('executeSearch'));
  console.log('has hoshi-search-input:', content.includes('hoshi-search-input'));
  
  // Find all search inputs
  const matches = content.match(/<input[^>]*search[^>]*>/gi);
  console.log('search input tags:', matches ? matches.slice(0, 5) : 'none');
}
