const fs = require('fs');

const home = fs.readFileSync('src/templates/home.html', 'utf8');
const scriptSrcs = (home.match(/src="[^"]+"/g) || []).filter(s => s.toLowerCase().includes('common') || s.toLowerCase().includes('search'));
console.log('Script srcs in home:', scriptSrcs);
