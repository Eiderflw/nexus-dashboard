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
            data[key] = new Map(gifts.map(g => [g.id, g.name]));
        }
    }

    // 1. Robust US Gifts (Present in >=2 US, Absent in LATAM)
    const usKeys = ['us_speed', 'us_aris', 'us_tigre'];
    const candidates = new Map();

    usKeys.forEach(k => {
        if (!data[k]) return;
        data[k].forEach((name, id) => {
            if (!data.latam_dj.has(id)) {
                candidates.set(id, name);
            }
        });
    });

    const robustUS = [];
    candidates.forEach((name, id) => {
        let count = 0;
        usKeys.forEach(k => {
            if (data[k] && data[k].has(id)) count++;
        });
        if (count >= 2) robustUS.push({ id, name });
    });

    console.log('ROBUST_US_IDS: ' + robustUS.map(g => g.id).join(','));
    console.log('ROBUST_US_NAMES: ' + robustUS.map(g => g.name).join(', '));

    // 2. Audit LATAM Triggers
    const latamTriggers = [7032, 6064, 5879]; // Maracas, GG, Doughnut
    const falsePositives = [];
    latamTriggers.forEach(id => {
        let foundInUS = false;
        usKeys.forEach(k => {
            if (data[k] && data[k].has(id)) foundInUS = true;
        });
        if (foundInUS) falsePositives.push(id);
    });

    console.log('FALSE_POSITIVE_LATAM_IDS: ' + falsePositives.join(','));

} catch (e) {
    console.error(e);
}
