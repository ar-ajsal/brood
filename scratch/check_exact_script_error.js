const fs = require('fs');

const html = fs.readFileSync('src/templates/shop.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];

[10, 11].forEach(idx => {
  const code = scripts[idx].replace(/<\/?script[^>]*>/gi, '').trim();
  console.log(`\n=== SCRIPT ${idx} ===`);
  try {
    new Function(code);
    console.log('No error!');
  } catch (e) {
    console.log('Error:', e.message);
    // Find approximate line by splitting
    const lines = code.split('\n');
    let testStr = '';
    for (let i = 0; i < lines.length; i++) {
      testStr += lines[i] + '\n';
      try {
        new Function(testStr);
      } catch (lineErr) {
        if (!lineErr.message.includes('Unexpected end of input')) {
          console.log(`Error at line ${i + 1}: ${lineErr.message}`);
          console.log('Line content:', lines[i]);
          console.log('Surrounding:', lines.slice(Math.max(0, i - 3), i + 4).join('\n'));
          break;
        }
      }
    }
  }
});
