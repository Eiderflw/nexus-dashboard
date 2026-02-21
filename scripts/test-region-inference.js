const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
puppeteer.use(StealthPlugin());

const targetUser = process.argv[2] || 'djprendepeovallenatero';
const userDataPath = path.resolve(__dirname, '../user_data');

(async () => {
    console.log(`\n🔍 Testing Region Inference for: @${targetUser}\n`);
    console.log(`Using UserDataDir: ${userDataPath}`);

    // Launch with persistent profile
    const browser = await puppeteer.launch({
        headless: "new",
        userDataDir: userDataPath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

        console.log("1. Navigating to LIVE page...");
        await page.goto(`https://www.tiktok.com/@${targetUser}/live`, { waitUntil: 'domcontentloaded', timeout: 30000 });

        await new Promise(r => setTimeout(r, 5000));

        const result = await page.evaluate(async () => {
            const log = [];
            const debug = (msg) => log.push(msg);

            // Native fetch is better if cookies are present
            const safeFetch = async (url) => {
                try {
                    const resp = await fetch(url);
                    if (!resp.ok) throw new Error("Status " + resp.status);
                    return await resp.json();
                } catch (e) {
                    throw e;
                }
            };

            try {
                // 1. Get Room ID
                let roomId = null;
                const sigi = document.getElementById('SIGI_STATE');
                if (sigi) {
                    const json = JSON.parse(sigi.textContent);
                    roomId = json?.LiveRoom?.liveRoomUserInfo?.user?.roomId || json?.LiveRoom?.liveRoomUserInfo?.liveRoom?.roomId;
                }

                if (!roomId) {
                    const html = document.documentElement.innerHTML;
                    const rMatch = html.match(/"roomId":"(\d+)"/);
                    if (rMatch) roomId = rMatch[1];
                }

                if (!roomId) return { error: "Room ID not found", log };
                debug(`RoomID: ${roomId}`);

                // 2. Owner Region
                let ownerRegion = null;
                try {
                    const infoJson = await safeFetch(`https://webcast.tiktok.com/webcast/room/info/?room_id=${roomId}&aid=1988`);
                    if (infoJson.data && infoJson.data.owner) ownerRegion = infoJson.data.owner.region;
                } catch (e) { debug("Info Fetch Error: " + e.toString()); }
                debug(`Owner Region: ${ownerRegion}`);

                // 3. Audience Inference
                let gifters = [];
                let inferredRegion = null;
                const rankTypes = [30, 20, 11, 4];

                for (const rType of rankTypes) {
                    debug(`Trying Rank Type ${rType}...`);
                    try {
                        const url = `https://webcast.tiktok.com/webcast/ranklist/gift/?aid=1988&room_id=${roomId}&rank_type=${rType}`;
                        const rankJson = await safeFetch(url);

                        const ranks = rankJson?.data?.ranks || [];

                        if (ranks.length > 0) {
                            debug(`Found ${ranks.length} gifters with Type ${rType}`);

                            const regionCounts = {};
                            ranks.slice(0, 10).forEach((r, i) => {
                                const u = r.user;
                                const reg = u.region || u.country || 'Unknown';
                                gifters.push(`#${i + 1} ${u.display_id} (${reg})`);
                                if (reg !== 'Unknown') regionCounts[reg] = (regionCounts[reg] || 0) + 1;
                            });

                            let max = 0;
                            for (const [r, c] of Object.entries(regionCounts)) {
                                if (c > max) { max = c; inferredRegion = r; }
                            }
                            break;
                        } else {
                            debug(`No gifters found for Type ${rType}`);
                        }
                    } catch (e) { debug(`Rank ${rType} Error: ` + e.toString()); }
                }

                return {
                    ownerRegion: ownerRegion || 'Unknown',
                    inferredRegion: inferredRegion || 'None',
                    gifters: gifters.slice(0, 5),
                    log
                };

            } catch (e) {
                return { error: e.toString(), log };
            }
        });

        fs.writeFileSync('test_inference_result.json', JSON.stringify(result, null, 2));
        console.log("Saved result to 'test_inference_result.json'");

    } catch (e) {
        console.error("Critical Error:", e);
    } finally {
        await browser.close();
    }
})();
