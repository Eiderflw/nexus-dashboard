const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

async function detectRegion(username) {
    console.log(`\n=== TESTING REGION FOR: ${username} ===`);

    const browser = await puppeteerExtra.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');

        let interceptedRoomInfo = null;
        let interceptedGifts = null;

        page.on('response', async (response) => {
            const url = response.url();
            const status = response.status();

            if (url.includes('webcast')) {
                console.log(`   [DEBUG_URL] ${status} - ${url.substring(0, 100)}...`);
            }

            try {
                if (url.includes('/webcast/room/info/') && status === 200) {
                    interceptedRoomInfo = await response.json();
                    console.log(`   [INTERCEPT] Captured Room Info!`);
                }
                if (url.includes('/webcast/gift/list/') && status === 200) {
                    interceptedGifts = await response.json();
                    console.log(`   [INTERCEPT] Captured Gift List!`);
                }
            } catch (e) { }
        });

        // Load Live Page
        console.log(`   -> Navigating to @${username}/live...`);
        const response = await page.goto(`https://www.tiktok.com/@${username}/live`, { waitUntil: 'networkidle2', timeout: 30000 });
        console.log(`   -> Page Status: ${response.status()}`);

        // Take a screenshot to see what's happening
        await page.screenshot({ path: `debug_screen_${username}.png` });
        console.log(`   -> Saved screenshot debug_screen_${username}.png`);

        // Wait for Interception
        for (let i = 0; i < 15; i++) {
            if (interceptedRoomInfo || interceptedGifts) break;
            await new Promise(r => setTimeout(r, 1000));
        }

        const result = { username, region: 'Unknown', method: 'none' };

        if (interceptedRoomInfo?.data?.owner?.region) {
            result.region = interceptedRoomInfo.data.owner.region.toUpperCase();
            result.method = 'webcast_room_info';
        }

        if (interceptedGifts?.data?.gifts) {
            const gifts = interceptedGifts.data.gifts;
            const US_IDS = [10649, 10619, 8042, 7086, 9971, 11521, 51277];
            const LATAM_IDS = [7032, 10168];

            const hasUS = gifts.filter(g => US_IDS.includes(g.id) || (g.name && g.name.includes('Travel in the US')));
            const hasLATAM = gifts.filter(g => LATAM_IDS.includes(g.id) || (g.name && g.name.includes('Maracas')));

            console.log(`   -> [DEBUG_GIFTS] Found ${gifts.length} gifts. US Triggers: ${hasUS.length}, LATAM Triggers: ${hasLATAM.length}`);

            if (hasUS.length > 0) {
                result.region = 'US';
                result.method = 'gift_inventory_us';
                result.triggers = hasUS.map(g => g.name);
            } else if (hasLATAM.length > 0) {
                result.region = 'CO';
                result.method = 'gift_inventory_latam';
                result.triggers = hasLATAM.map(g => g.name);
            }
        }

        console.log(`   -> FINAL RESULT: ${result.region} (Method: ${result.method})`);

    } catch (err) {
        console.error(`   -> Error: ${err.message}`);
    } finally {
        await browser.close();
    }
}

(async () => {
    const targets = ['aleja.c07', 'maa.awura.lala'];
    for (const t of targets) {
        await detectRegion(t);
    }
})();
