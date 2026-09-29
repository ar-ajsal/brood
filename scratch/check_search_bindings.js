const fs = require('fs');

const home = fs.readFileSync('src/templates/home.html', 'utf8');

// Find all script blocks with 'search'
const scripts = home.match(/<script[\s\S]*?<\/script>/gi) || [];
scripts.forEach((s, idx) => {
  if (s.includes('input[name=\'search\']') || s.includes('input[name="search"]') || s.includes('#search button') || s.includes('route=product/search') || s.includes('/product/search')) {
    console.log(`Script ${idx}:\n`, s.slice(0, 500));
  }
});
