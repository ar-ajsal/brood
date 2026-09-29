const fs = require('fs');

const html = fs.readFileSync('src/templates/shop.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];

[10, 11].forEach(idx => {
  console.log(`=== SCRIPT ${idx} FULL ===`);
  const raw = scripts[idx];
  console.log(raw.slice(0, 400));
  // Try node vm
  const vm = require('vm');
  try {
    const code = raw.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    new vm.Script(code);
    console.log('VM parsed successfully!');
  } catch (e) {
    console.log('VM Error:', e.message, 'at line', e.stack);
  }
});
