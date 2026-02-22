const us = require('./us_only.json').sort((a, b) => a.d - b.d);
const co = require('./co_only.json').sort((a, b) => a.d - b.d);
console.log('== US ONLY LOW COST ==');
console.log(us.filter(g => g.d <= 5).map(g => `${g.name} (${g.id} - ${g.d})`).join('\n'));
console.log('\n== CO ONLY LOW COST ==');
console.log(co.filter(g => g.d <= 5).map(g => `${g.name} (${g.id} - ${g.d})`).join('\n'));
