const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

async function debugSearchAPI(keyword) {
    console.log(`\n=== DEBUGGING SEARCH API FOR: ${keyword} ===`);
    const userDataDir = path.join(process.cwd(), 'tiktok-session-data');

    const browser = await puppeteerExtra.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');

        let interceptedSearchJson = null;

        page.on('response', async (response) => {
            const url = response.url();
            if (url.includes('/api/search/live/') || url.includes('/api/search/general/')) {
                console.log(`   [INTERCEPT] Found Search API call: ${url.substring(0, 100)}...`);
                try {
                    const text = await response.text();
                    interceptedSearchJson = JSON.parse(text);
                    console.log(`   [INTERCEPT] Captured JSON! Item count: ${interceptedSearchJson.data?.length || 0}`);
                } catch (e) { }
            }
        });

        const searchUrl = `https://www.tiktok.com/search/live?q=${encodeURIComponent(keyword)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        await new Promise(r => setTimeout(r, 5000));

        if (interceptedSearchJson) {
            fs.writeFileSync('debug_search_api_results.json', JSON.stringify(interceptedSearchJson, null, 2));
            console.log(`   -> Saved debug_search_api_results.json`);

            // Analyze the first creator found
            const item = interceptedSearchJson.data?.[0]?.item;
            if (item) {
                console.log(`   -> Sample Creator Analysis (@${item.author?.uniqueId}):`);
                console.log(`      - Region (Author): ${item.author?.region || 'MISSING'}`);
                console.log(`      - Region (Live): ${item.live_room?.owner?.region || 'MISSING'}`);
            }
        } else {
            console.log(`   -> FAILED: No Search API JSON captured.`);
            await page.screenshot({ path: 'debug_search_fail.png' });
        }

    } catch (err) {
        console.error(`   -> Error: ${err.message}`);
    } finally {
        await browser.close();
    }
}

debugSearchAPI('live');
