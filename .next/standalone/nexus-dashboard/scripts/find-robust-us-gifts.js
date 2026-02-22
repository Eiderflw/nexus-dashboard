const fs = require('fs');

const files = {
    us_speed: 'debug_gift_list_ishowspeed.json',
    us_aris: 'debug_gift_list_aris06248.json',
    us_tigre: 'debug_gift_list_eltigre6960.json',
    latam_dj: 'debug_gift_list_djprendepeovallenatero.json'
};

try {
    const data = {};
    for (const [key, file] of Object.entries(files)) {
        if (fs.existsSync(file)) {
            const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
            const gifts = raw.data?.gifts || [];
            // Map ID -> Name
            data[key] = new Map(gifts.map(g => [g.id, g.name]));
            console.log(`${key}: ${data[key].size} gifts`);
        } else {
            console.log(`Missing file: ${file}`);
        }
    }

    // 1. Find Truly Unique US Gifts (Present in ALL 3 US, Absent in LATAM)
    // Relaxation: Present in AT LEAST 2 US, Absent in LATAM
    console.log('\n--- ROBUST US GIFTS (In >=2 US inputs, NOT in LATAM) ---');
    const usKeys = ['us_speed', 'us_aris', 'us_tigre'];
    const candidates = new Map();

    // Collect all potential US gifts
    usKeys.forEach(k => {
        if (!data[k]) return;
        data[k].forEach((name, id) => {
            if (!data.latam_dj.has(id)) {
                candidates.set(id, name);
            }
        });
    });

    // Score them
    const robustUS = [];
    candidates.forEach((name, id) => {
        let count = 0;
        usKeys.forEach(k => {
            if (data[k] && data[k].has(id)) count++;
        });

        if (count >= 2) {
            console.log(`[${id}] ${name} (Found in ${count}/3 US files)`);
            robustUS.push(id);
        }
    });

    console.log(`\nFound ${robustUS.length} Robust US Markers.`);

    // 2. Audit Current LATAM Triggers
    console.log('\n--- AUDITING LATAM TRIGGERS in US FILES ---');
    const latamTriggers = [7032, 6064, 5879]; // Maracas, GG, Doughnut
    const latamNames = { 7032: 'Maracas', 6064: 'GG', 5879: 'Doughnut' };

    latamTriggers.forEach(id => {
        let foundInUS = false;
        usKeys.forEach(k => {
            if (data[k] && data[k].has(id)) {
                console.log(`[⚠️ FALSE POSITIVE] ${latamNames[id]} (ID ${id}) found in ${k}`);
                foundInUS = true;
            }
        });
        if (!foundInUS) console.log(`[✅ CLEAN] ${latamNames[id]} (ID ${id}) NOT found in any US file.`);
    });

} catch (e) {
    console.error(e);
}
