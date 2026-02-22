const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

puppeteerExtra.use(StealthPlugin());

async function test() {
    console.log('Launching browser (Headful)...');

    // Explicitly use the executable path from the full 'puppeteer' package
    const executablePath = puppeteer.executablePath();
    console.log(`Executable Path: ${executablePath}`);

    try {
        const browser = await puppeteerExtra.launch({
            headless: false, // Show the browser
            executablePath: executablePath,
            defaultViewport: null,
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });
        console.log('Browser launched!');

        const page = await browser.newPage();

        // Load cookie
        const cookiePath = path.join(process.cwd(), 'data', 'tiktok_cookies.json');
        if (fs.existsSync(cookiePath)) {
            const cookieData = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
            const cookieString = cookieData.cookie;
            const cookies = cookieString.split(';').map(c => {
                const [key, ...v] = c.trim().split('=');
                return {
                    name: key,
                    value: v.join('='),
                    domain: '.tiktok.com'
                };
            });
            await page.setCookie(...cookies);
            console.log('Cookies set.');
        }

        console.log('Navigating to Home (Warmup)...');
        await page.goto("https://live-backstage.tiktok.com/", { waitUntil: 'networkidle2', timeout: 60000 });
        console.log('Home loaded. Waiting 5s...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('Navigating to API...');
        const url = "https://live-backstage.tiktok.com/creators/live/union_platform_api/agency/anchor_detail/get_valid_date_range?QueryType=4&user_id=7332634735384871942&faction_id=103895&msToken=dbFqyrfZO1LympnghIOOIzvwWAn7KyN2OJWKjeLDLOXzBDhxAMjH4aySjwbwh2qsZHO8lnxr8rpyq7-TaL4EUFhuPduGW_3iylKAnqI9ppg6hO1fsHK0XPWF-dIF5Gy8VaA1mBqWmg==&X-Bogus=DFSzswVYK3kANxh-CNuwoeH15sIB&X-Gnarly=MFgPfQU84SKhzusWnPc8NNkZ2HnG2KDV0us3utMcz8NXMlEXbtDPfc1yx-yjcRmdzPbcF72MH6SJdl-mY8Uiq3W1NnKjtoTpfW5KtYcaSZOzJFfnJTbCkCULEyqYd1HpTIl9UyY5uREznETtJPv0P2SBoacnnggwVmBm0oXkV-V2DfeH/esxqdWjIqga1PDJmy2tKW-uEgPyPsJqNO18iFijSjC33zUD6rhZA0di2m4cO1Gr0jOZksQeU6NwftrDbfFdXHRAWlW5as26IIkDnsEt4Gv65PBFAS0bP88H7pGY";

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        await page.screenshot({ path: 'debug_screenshot_api.png' });
        console.log('Screenshot saved.');

        const content = await page.evaluate(() => document.body.innerText);
        console.log('CONTENT SAMPLE:', content.substring(0, 500));

        await browser.close();
        console.log('Done.');

    } catch (e) {
        console.error('ERROR:', e);
    }
}

test();
