const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

const username = process.argv[2] || 'djprendepeovallenatero';

(async () => {
    let browser;
    try {
        const userDataDir = path.join(process.cwd(), 'tiktok-session-data');
        browser = await puppeteerExtra.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            userDataDir: userDataDir
        });

        const page = await browser.newPage();
        const url = `https://www.tiktok.com/@${username}/live`;
        console.error(`Navigating to ${url}...`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const data = await page.evaluate(() => {
            const result = {};
            const uniEl = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
            if (uniEl) result.universal = JSON.parse(uniEl.textContent);

            const sigiEl = document.getElementById('SIGI_STATE');
            if (sigiEl) result.sigi = JSON.parse(sigiEl.textContent);

            return result;
        });

        fs.writeFileSync('debug_live_structure.json', JSON.stringify(data, null, 2));
        console.error("Data saved to debug_live_structure.json");

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        if (browser) await browser.close();
    }
})();
