const fs = require('fs');

// Fetch the HTML from http://localhost:3000/shop
async function findSyntaxError() {
  const res = await fetch('http://localhost:3000/shop');
  const html = await res.text();

  // Extract all script tags
  const scripts = html.match(/<script[\s\S]*?<\/script>/gi) || [];
  console.log(`Found ${scripts.length} script tags`);

  scripts.forEach((tag, idx) => {
    const code = tag.replace(/<\/?script[^>]*>/gi, '').trim();
    if (!code) return;
    try {
      new Function(code);
    } catch (err) {
      console.log(`\nSYNTAX ERROR IN SCRIPT #${idx}:`);
      console.log('Error message:', err.message);
      console.log('Snippet:\n', code.slice(0, 400));
    }
  });
}

findSyntaxError();
