async function test() {
  const res = await fetch('http://localhost:3000/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      lines: [{ merchandiseId: 'gid://shopify/ProductVariant/67587276472473', quantity: 1 }]
    })
  });
  console.log('Status:', res.status);
  const data = await res.text();
  console.log('Response:', data);
}
test().catch(console.error);
