const fs = require('fs');

const home = fs.readFileSync('src/templates/home.html', 'utf8');
const shop = fs.readFileSync('src/templates/shop.html', 'utf8');

// Find all occurrences of "search" in home header
console.log('--- Home header search elements ---');
const homeHeader = home.slice(0, 50000);
const homeMatches = homeHeader.match(/<[^>]*search[^>]*>/gi);
console.log(homeMatches);

console.log('--- Shop search bar context ---');
const shopSearchIdx = shop.indexOf('hoshi-search-input');
if (shopSearchIdx !== -1) {
  console.log(shop.slice(shopSearchIdx - 300, shopSearchIdx + 500));
}
