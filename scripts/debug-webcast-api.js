const https = require('https');
const fs = require('fs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = { headers: { 'User-Agent': USER_AGENT } };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err));
    });
}

async function debugWebcast(username) {
    try {
        console.log(`[1] Checking @${username}...`);
        const profileHtml = await fetchUrl(`https://www.tiktok.com/@${username}/live`);
        const roomIdMatch = profileHtml.match(/"roomId":"(\d+)"/);

        if (!roomIdMatch) {
            console.log(`   -> Not Live.`);
            return;
        }

        const roomId = roomIdMatch[1];
        console.log(`   -> LIVE! Room ID: ${roomId}`);

        console.log(`[2] Fetching Gift List...`);
        const giftUrl = `https://webcast.tiktok.com/webcast/gift/list/?aid=1988&room_id=${roomId}&display_id=${username}`;
        const giftDataRaw = await fetchUrl(giftUrl);
        const giftData = JSON.parse(giftDataRaw);

        const filename = `debug_gift_list_${username}.json`;
        fs.writeFileSync(filename, JSON.stringify(giftData, null, 2));

        const gifts = giftData.data?.gifts || [];
        console.log(`   -> Total Gifts: ${gifts.length}`);

        // CHECK LOGIC MATCHING search-lives.js
        const US_IDS = [10649, 10619, 8042, 7086, 9971, 11521, 51277, 49556, 49528, 49541, 15156, 7215, 10612, 7037, 7204, 8004, 10482, 9967, 6652, 19086, 13879];
        const LATAM_IDS = [7032, 10168, 5478, 12335, 8239, 6788, 15104, 7096];

        const URL_CHILI_US = 'b8ded3f3d633620616a74e4f30163836';
        const URL_GG_CO = '3f02fa9594bd1495ff4e8aa5ae265eef';

        const hasUS = gifts.filter(g => US_IDS.includes(g.id) || (g.image && g.image.url_list && g.image.url_list[0].includes(URL_CHILI_US)));
        const hasLATAM = gifts.filter(g => LATAM_IDS.includes(g.id) || (g.image && g.image.url_list && g.image.url_list[0].includes(URL_GG_CO)));

        // Favor USA if both exist (since many LATAM triggers leak to US, but US triggers rarely leak to LATAM)
        if (hasUS.length > 0) console.log(`   -> [PREDICTION] US (Reason: ${hasUS.map(g => `${g.name} [${g.id}]`).join(', ')})`);
        else if (hasLATAM.length > 0) console.log(`   -> [PREDICTION] COLOMBIA/LATAM (Reason: ${hasLATAM.map(g => `${g.name} [${g.id}]`).join(', ')})`);
        else console.log(`   -> [PREDICTION] UNKNOWN (No triggers found)`);

    } catch (e) { console.error(e); }
}

(async () => {
    const targets = ['dj.jaironbaladasromantic', 'djguanko'];

    for (const username of targets) {
        await debugWebcast(username);
        // Small delay
        await new Promise(r => setTimeout(r, 1000));
    }
})();
