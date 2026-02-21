const fs = require('fs');

try {
    const raw = JSON.parse(fs.readFileSync('debug_raw_state.json', 'utf8'));
    const sigi = JSON.parse(raw.sigi || '{}');
    const universal = JSON.parse(raw.universal || '{}');

    console.log("--- SIGI STATE SCAN ---");
    findKey(sigi, ['region', 'country', 'location']);

    console.log("\n--- UNIVERSAL STATE SCAN ---");
    findKey(universal, ['region', 'country', 'location']);

} catch (e) {
    console.error("Error reading or parsing state:", e.message);
}

function findKey(obj, targets, path = '') {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;

        if (targets.includes(key.toLowerCase())) {
            console.log(`FOUND [${key}] at [${currentPath}]:`, obj[key]);
        }

        if (typeof obj[key] === 'object') {
            findKey(obj[key], targets, currentPath);
        }
    }
}
