const fs = require('fs');

['src/templates/home.html', 'src/templates/product.html', 'src/templates/shop.html'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes("&quot;'https://thehoshi.to/")) {
    console.log(`Fixing corrupted string in ${f}`);
    content = content.replace(/&quot;'https:\/\/thehoshi\.to\//g, '&quot;');
    fs.writeFileSync(f, content, 'utf8');
  } else {
    console.log(`No corrupted string in ${f}`);
  }
});
