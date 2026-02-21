const fs = require('fs');

const usFile = 'debug_gift_list_ishowspeed.json';
const latamFile = 'debug_gift_list_djprendepeovallenatero.json';

try {
    const usData = JSON.parse(fs.readFileSync(usFile, 'utf8'));
    const latamData = JSON.parse(fs.readFileSync(latamFile, 'utf8'));

    // Maps: ID -> Name
    const usMap = new Map();
    usData.data.gifts.forEach(g => usMap.set(g.id, g.name));

    const latamMap = new Map();
    latamData.data.gifts.forEach(g => latamMap.set(g.id, g.name));

    const uniqueToUS = [];
    usMap.forEach((name, id) => {
        if (!latamMap.has(id)) uniqueToUS.push({ id, name });
    });

    const uniqueToLATAM = [];
    latamMap.forEach((name, id) => {
        if (!usMap.has(id)) uniqueToLATAM.push({ id, name });
    });

    const result = {
        unique_US: uniqueToUS,
        unique_LATAM: uniqueToLATAM
    };

    fs.writeFileSync('unique_gifts.json', JSON.stringify(result, null, 2));
    console.log(`Saved ${uniqueToUS.length} US-only and ${uniqueToLATAM.length} LATAM-only gifts to unique_gifts.json`);

} catch (e) {
    console.error(e);
}
