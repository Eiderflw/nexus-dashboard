const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

const COUNTRY_MAP = {
    'CO': 'COLOMBIA',
    'MY': 'MALASIA',
    'US': 'ESTADOS UNIDOS',
    'VE': 'VENEZUELA',
    'BR': 'BRASIL',
    'AR': 'ARGENTINA',
    'CL': 'CHILE',
    'PE': 'PERU',
    'EC': 'ECUADOR',
    'MX': 'MEXICO',
    'ES': 'ESPAÑA',
    'ID': 'INDONESIA',
    'SG': 'SINGAPUR',
    'TH': 'TAILANDIA',
    'PH': 'FILIPINAS',
    'VN': 'VIETNAM',
    'CN': 'CHINA',
    'JP': 'JAPON',
    'KR': 'COREA DEL SUR',
    'GB': 'REINO UNIDO',
    'FR': 'FRANCIA',
    'DE': 'ALEMANIA',
    'IT': 'ITALIA',
    'RU': 'RUSIA',
    'TR': 'TURQUIA',
    'SA': 'ARABIA SAUDITA',
    'AE': 'EMIRATOS ARABES',
    'CH': 'SUIZA',
    'PT': 'PORTUGAL'
};

function mapIsoToName(code) {
    if (!code) return 'Unknown';
    const clean = code.toUpperCase();
    return COUNTRY_MAP[clean] || clean;
}

const args = process.argv.slice(2);
const username = args[0] || '';
const cookieString = args[1];

if (!username) {
    console.log(JSON.stringify({ error: 'Username required' }));
    process.exit(1);
}

(async () => {
    let browser;
    try {
        const userDataDir = path.join(process.cwd(), 'tiktok-session-data');
        browser = await puppeteerExtra.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        if (cookieString) {
            try {
                const cookies = cookieString.split(';').map(c => {
                    const [key, ...v] = c.trim().split('=');
                    return { name: key, value: v.join('='), domain: '.tiktok.com' };
                });
                await page.setCookie(...cookies);
            } catch (e) { }
        }

        // Set a mobile-like user agent as it sometimes simplifies the structure
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');

        await page.goto(`https://www.tiktok.com/@${username}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const result = await page.evaluate(() => {
            const data = {
                username: '',
                region: 'Unknown',
                method: 'none'
            };

            try {
                // 1. Try __UNIVERSAL_DATA_FOR_REHYDRATION__
                const uniEl = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
                if (uniEl) {
                    const json = JSON.parse(uniEl.textContent);
                    const user = json?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user;
                    if (user) {
                        data.username = user.uniqueId;
                        data.region = user.region || user.country || user.location;
                        if (data.region) data.method = 'universal_data';
                    }
                }

                // 2. Try SIGI_STATE
                if (!data.region || data.region === 'Unknown') {
                    const sigiEl = document.getElementById('SIGI_STATE');
                    if (sigiEl) {
                        const json = JSON.parse(sigiEl.textContent);
                        const userMap = json?.UserModule?.users || {};
                        const userId = Object.keys(userMap)[0];
                        if (userId && userMap[userId]) {
                            data.username = userMap[userId].uniqueId;
                            data.region = userMap[userId].region || userMap[userId].country;
                            if (data.region) data.method = 'sigi_state';
                        }
                    }
                }

                // 3. Try __UNIVERSAL_DATA_FOR_REHYDRATION__ (Modern method - Highly Reliable)
                if (!data.region || data.region === 'Unknown') {
                    const uniEl = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
                    if (uniEl) {
                        try {
                            const json = JSON.parse(uniEl.textContent);
                            const scope = json?.__DEFAULT_SCOPE__;
                            // Search in app-context (definitive)
                            const appRegion = scope?.['webapp.app-context']?.user?.region;
                            // Also check user-detail as backup
                            const detailRegion = scope?.['webapp.user-detail']?.userInfo?.user?.region;

                            data.region = appRegion || detailRegion;
                            if (data.region) data.method = 'universal_data_region';
                        } catch (e) { }
                    }
                }

                // 4. Try Meta Tags (SEO)

                // 4. Try TT_SELLER REGEX (Commonly found in some profile states) - DEPRIORITIZED
                // (Moved to after all other methods)

                if (data.region) data.region = data.region.toUpperCase();

                // 5. Try to get username from page URL if all else fails
                if (!data.username) {
                    const urlMatch = window.location.href.match(/@([^/?#]+)/);
                    if (urlMatch) data.username = urlMatch[1];
                }

                // 5. IDC & clusterRegion Heuristics - REMOVED (Caused false positives)

            } catch (e) {
                data.error = e.message;
            }

            return data;
        });

        // 6. DEEP DIVE: If still unknown, try the Webcast API using tiktok-live-connector
        if (result.region === 'Unknown') {
            try {
                const { WebcastPushConnection } = require('tiktok-live-connector');
                const conn = new WebcastPushConnection(username);

                // Fetch Room Info for Region
                const roomInfo = await conn.getRoomInfo().catch(() => null);
                if (roomInfo && roomInfo.owner && roomInfo.owner.region) {
                    result.region = roomInfo.owner.region.toUpperCase();
                    result.method = 'webcast_api_connector';
                }

                // If still unknown, fetch Gifts for heuristics
                if (result.region === 'Unknown') {
                    const gifts = await conn.getAvailableGifts().catch(() => null);
                    if (gifts && gifts.length > 0) {
                        const US_IDS = [10649, 10619, 8042, 7086, 9971, 11521, 51277, 49556, 49528, 49541, 15156, 7215, 10612, 7037, 7204, 8004, 10482, 9967, 6652, 19086, 13879];
                        const LATAM_IDS = [7032, 10168, 5478, 12335, 8239, 6788, 15104, 7096];

                        const URL_CHILI_US = 'b8ded3f3d633620616a74e4f30163836';
                        const URL_GG_CO = '3f02fa9594bd1495ff4e8aa5ae265eef';

                        const hasUS = gifts.filter(g => US_IDS.includes(g.id) || (g.image && g.image.url_list && g.image.url_list[0].includes(URL_CHILI_US)));
                        const hasLATAM = gifts.filter(g => LATAM_IDS.includes(g.id) || (g.image && g.image.url_list && g.image.url_list[0].includes(URL_GG_CO)));

                        if (hasUS.length > 0) {
                            result.region = 'US';
                            result.method = 'webcast_gift_heuristic';
                        } else if (hasLATAM.length > 0) {
                            result.region = 'CO';
                            result.method = 'webcast_gift_heuristic';
                        }
                    }
                }
            } catch (e) {
                // Ignore API errors if user is offline or not found
            }
        }

        // 7. FINAL DESPERATE REGEX (Only if everything else failed)
        if (result.region === 'Unknown') {
            const html = await page.content();
            const specificRegex = /"owner":\{.*?"region":"([A-Z]{2})"/; // Look for owner region specifically
            const match = html.match(specificRegex);
            if (match) {
                result.region = match[1].toUpperCase();
                result.method = 'desperate_owner_regex';
            } else {
                // Last ditch: any valid ISO code after "region":"
                const genericRegex = /"region":"([A-Z]{2})"/g;
                let m;
                while ((m = genericRegex.exec(html)) !== null) {
                    if (m[1] !== 'CH' && m[1] !== 'US') { // Filter out common generic codes
                        result.region = m[1];
                        result.method = 'generic_region_regex';
                        break;
                    }
                }
            }
        }

        if (result.region) result.region = mapIsoToName(result.region);
        console.log(JSON.stringify(result));

    } catch (error) {
        console.log(JSON.stringify({ error: error.message }));
    } finally {
        if (browser) await browser.close();
    }
})();
