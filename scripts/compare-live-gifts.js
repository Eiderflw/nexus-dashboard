const fs = require('fs');

function getGifts(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return data.gifts.map(g => ({ id: g.id, name: g.name }));
}

const alejaGifts = getGifts('debug_live_v2_aleja.c07.json');
const maaGifts = getGifts('debug_live_v2_maa.awura.lala.json');

const alejaIds = new Set(alejaGifts.map(g => g.id));
const maaIds = new Set(maaGifts.map(g => g.id));

console.log(`Aleja Total: ${alejaGifts.length}`);
console.log(`Maa Total: ${maaGifts.length}`);

// Gifts in Maa (US) NOT in Aleja (LATAM)
const maaOnly = maaGifts.filter(g => !alejaIds.has(g.id));
// Gifts in Aleja (LATAM) NOT in Maa (US)
const alejaOnly = alejaGifts.filter(g => !maaIds.has(g.id));

console.log('\n--- GIFTS IN MAA (USA) ONLY (First 50) ---');
console.log(JSON.stringify(maaOnly.slice(0, 50), null, 2));

console.log('\n--- GIFTS IN ALEJA (LATAM) ONLY (First 50) ---');
console.log(JSON.stringify(alejaOnly.slice(0, 50), null, 2));

fs.writeFileSync('gift_comparison.json', JSON.stringify({ maaOnly, alejaOnly }, null, 2));
