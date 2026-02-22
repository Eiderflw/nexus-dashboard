const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

async function debugLive(username) {
    console.log(`\n=== DEBUGGING: ${username} ===`);
    const userDataDir = path.join(process.cwd(), 'tiktok-session-data');

    const browser = await puppeteerExtra.launch({
        headless: true, // Use headless for speed if possible, or false if debug needed
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');

        await page.goto(`https://www.tiktok.com/@${username}/live`, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const result = await page.evaluate(async () => {
            const res = { roomId: null, region: null, gifts: [], ranks: [] };
            try {
                // Get Room ID
                const html = document.documentElement.innerHTML;
                const roomIdMatch = html.match(/"roomId":"(\d+)"/);
                if (roomIdMatch) {
                    const roomId = roomIdMatch[1];
                    res.roomId = roomId;

                    // Fetch Room Info
                    const roomResponse = await fetch(`https://webcast.tiktok.com/webcast/room/info/?room_id=${roomId}&aid=1988`);
                    const roomJson = await roomResponse.json();
                    res.region = roomJson?.data?.owner?.region;

                    // Fetch Gifts
                    const giftsResponse = await fetch(`https://webcast.tiktok.com/webcast/gift/list/?aid=1988&room_id=${roomId}`);
                    const giftsJson = await giftsResponse.json();
                    res.gifts = giftsJson?.data?.gifts || [];

                    // Fetch Ranks
                    const rankResponse = await fetch(`https://webcast.tiktok.com/webcast/ranklist/gift/?aid=1988&room_id=${roomId}&rank_type=30`);
                    const rankJson = await rankResponse.json();
                    res.ranks = rankJson?.data?.ranks || [];
                }
            } catch (e) {
                res.error = e.message;
            }
            return res;
        });

        console.log(`   -> Room ID: ${result.roomId}`);
        console.log(`   -> Room Region: ${result.region}`);
        console.log(`   -> Gifts Count: ${result.gifts.length}`);
        console.log(`   -> Top Ranks Regions: ${result.ranks.slice(0, 3).map(r => r.user?.region).join(', ')}`);

        fs.writeFileSync(`debug_live_v2_${username}.json`, JSON.stringify(result, null, 2));

    } catch (err) {
        console.error(`   -> Error: ${err.message}`);
    } finally {
        await browser.close();
    }
}

(async () => {
    const targets = ['aleja.c07', 'maa.awura.lala'];
    for (const t of targets) {
        await debugLive(t);
    }
})();
