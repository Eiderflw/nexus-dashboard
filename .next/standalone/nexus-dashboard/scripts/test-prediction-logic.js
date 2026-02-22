const fs = require('fs');

const files = {
    'aris06248 (US)': 'debug_gift_list_aris06248.json',
    'eltigre6960 (US)': 'debug_gift_list_eltigre6960.json',
    '_michelin1 (COL)': 'debug_gift_list__michelin1.json' // Warning: Need to check file name 
};

// Check if file names correct
if (!fs.existsSync('debug_gift_list__michelin1.json')) {
    // maybe it wasn't saved?
    console.log('Warning: _michelin1 file not found. Skipping.');
    delete files['_michelin1 (COL)'];
}

/* LOGIC FROM search-lives.js */
// Golden Indicators (Refined via Cross-Reference Analysis)
// US: 9971 (Lover's Glasses), 10619 (Gimme The Mic), 8042 (Travel US), 
//     10649 (Convertible), 7086 (Chili - surprising but absent in LATAM sample)
const US_GIFTS = [9971, 10619, 8042, 10649, 7086, 5650, 5651];

// LATAM: Removed 5879 (Doughnut) and 6064 (GG) as they are GLOBAL/US-Present.
// Kept 7032 (Maracas). Added strict check.
const LATAM_GIFTS = [7032];   // Maracas (High confidence LATAM exclusive)

Object.entries(files).forEach(([label, file]) => {
    try {
        if (fs.existsSync(file)) {
            const json = JSON.parse(fs.readFileSync(file, 'utf8'));
            const gifts = json.data?.gifts || [];

            const hasUS = gifts.filter(g => US_GIFTS.includes(g.id) || g.name === 'Travel in the US' || g.name === 'Statue of Liberty');
            const hasLATAM = gifts.filter(g => LATAM_GIFTS.includes(g.id) || g.name === 'Maracas' || g.name === 'Tacos');

            console.log(`\nTesting ${label}:`);
            if (hasUS.length > 0) {
                console.log(`  -> [PREDICTION] US (Reason: ${hasUS.map(g => g.name).join(', ')})`);
            } else if (hasLATAM.length > 0) {
                console.log(`  -> [PREDICTION] CO/LATAM (Reason: ${hasLATAM.map(g => g.name).join(', ')})`);
            } else {
                console.log(`  -> [PREDICTION] UNKNOWN`);
            }
        }
    } catch (e) { console.error(e.message); }
});
