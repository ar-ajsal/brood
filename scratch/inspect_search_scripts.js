const fs = require('fs');

for (const f of ['src/templates/home.html', 'src/templates/product.html', 'src/templates/shop.html']) {
  const content = fs.readFileSync(f, 'utf8');
  console.log('=== ' + f + ' ===');
  
  // Search for any script touching name="search" or search button
  const searchScriptMatches = content.match(/[\s\S]{0,100}name=["']search["'][\s\S]{0,200}/g);
  if (searchScriptMatches) {
    searchScriptMatches.forEach((m, idx) => console.log(`Match ${idx}:\n`, m));
  }
  
  // Search for search icon click or form submit
  const searchClicks = content.match(/[\s\S]{0,100}search[\s\S]{0,100}\.click[\s\S]{0,100}/g);
  if (searchClicks) {
    searchClicks.forEach((m, idx) => console.log(`Search Click ${idx}:\n`, m));
  }
}
