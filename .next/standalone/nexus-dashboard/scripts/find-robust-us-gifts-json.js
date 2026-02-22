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

    const usKeys = ['us_speed', 'us_aris', 'us_tigre'];

    // 1. Robust US
    const robustUS = [];
    if (data.us_speed) {
        data.us_speed.forEach((name, id) => {
            if (!data.latam_dj.has(id)) {
                let count = 0;
                usKeys.forEach(k => { if (data[k] && data[k].has(id)) count++; });
                if (count >= 2) robustUS.push({ id, name });
            }
        });
    }

    // 2. False Positives
    const latamTriggers = [7032, 6064, 5879];
    const falsePositives = [];
    latamTriggers.forEach(id => {
        let found = false;
        usKeys.forEach(k => { if (data[k] && data[k].has(id)) found = true; });
        if (found) falsePositives.push(id);
    });

    fs.writeFileSync('robust_gifts.json', JSON.stringify({ robustUS, falsePositives }, null, 2));
    console.log('Saved to robust_gifts.json');

} catch (e) { console.error(e); }
