const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

const username = 'djprendepeovallenatero';

(async () => {
    let browser;
    try {
        const userDataDir = path.join(process.cwd(), 'tiktok-session-data');
        browser = await puppeteerExtra.launch({
            headless: true,
            userDataDir: userDataDir,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(`https://www.tiktok.com/@${username}`, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const sigi = document.getElementById('SIGI_STATE')?.textContent || '';
            const universal = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__')?.textContent || '';
            return { sigi, universal };
        });

        fs.writeFileSync('debug_raw_state.json', JSON.stringify(data, null, 2));
        console.log("Full state saved to debug_raw_state.json");

    } catch (e) {
        console.error(e);
    } finally {
        if (browser) await browser.close();
    }
})();
