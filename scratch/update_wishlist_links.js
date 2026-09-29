const fs = require('fs');

const files = [
  'src/templates/shop.html',
  'src/templates/product.html',
  'src/templates/home.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/https:\/\/thehoshi\.to\/account\/wishlist/g, '/wishlist');
  content = content.replace(/"account\/wishlist"/g, '"/wishlist"');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated wishlist links in', file);
});
