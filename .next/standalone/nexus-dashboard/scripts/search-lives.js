const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { WebcastPushConnection } = require('tiktok-live-connector');

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
const keyword = args[0] || 'live';
const cookieString = args[1];
const statusFile = path.join(process.cwd(), 'public', 'scraper_status.json');

function updateStatus(state, message) {
    try {
        fs.writeFileSync(statusFile, JSON.stringify({
            state,
            message,
            timestamp: Date.now(),
            type: 'search'
        }));
    } catch (e) {
        // Ignore status write errors
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Stop scrolling after a certain depth to avoid infinite loops if it's truly infinite
                // Or if we reach the bottom (less reliable on infinite scroll)
                if (totalHeight >= 15000) { // Scroll deep enough for ~50-100 results
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

(async () => {
    let browser;
    try {
        updateStatus('initializing', 'Iniciando navegador con soporte de Sesión...');

        const userDataDir = path.join(process.cwd(), 'tiktok-session-data');

        // Force clear lock if it exists (fixes "The browser is already running" error)
        const lockPath = path.join(userDataDir, 'SingletonLock');
        if (fs.existsSync(lockPath)) {
            try { fs.unlinkSync(lockPath); } catch (e) { }
        }

        const launchBrowser = async (isHeadless = true) => {
            return await puppeteerExtra.launch({
                headless: isHeadless ? "new" : false,
                defaultViewport: null,
                userDataDir: userDataDir,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
            });
        };

        try {
            browser = await launchBrowser(true); // Return to default headless
        } catch (e) {
            console.error("First launch attempt failed, retrying...");
            await new Promise(r => setTimeout(r, 2000));
            browser = await launchBrowser(true);
        }

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

        const searchUrl = `https://www.tiktok.com/search/live?q=${encodeURIComponent(keyword)}&enterMethod=click_icon&searchSource=search_history`;
        console.error(`Navigating to ${searchUrl}`);
        updateStatus('navigating', 'Navegando a TikTok...');
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        console.error("Checking login status...");
        const maxWaitTime = 600000; // 10 Minutes
        const startTime = Date.now();

        let isWaitingForUser = false;

        while (Date.now() - startTime < maxWaitTime) {
            const pageState = await page.evaluate(() => {
                const loginModals = document.querySelectorAll('[data-e2e="modal-close-inner-button"], #login-modal, .login-modal-div, iframe[src*="login"]');
                const avatar = document.querySelector('[data-e2e="profile-icon"], img[class*="avatar"]');
                const loginBtns = document.querySelectorAll('button[data-e2e="top-login-button"], a[href*="/login"]');
                const captcha = document.querySelector('.captcha-disable-scroll, #captcha_container');

                if (loginModals.length > 0) return 'login_modal_visible';
                if (captcha) return 'captcha';
                if (avatar) return 'logged_in';
                if (loginBtns.length > 0) return 'guest_with_login_btn';
                return 'unknown';
            });

            if (pageState === 'logged_in') {
                console.error("Login detected (Avatar)! Proceeding...");
                updateStatus('scraping', 'Sesión detectada. Escaneando resultados...');
                break;
            } else if (pageState === 'captcha') {
                updateStatus('waiting_captcha', '⚠️ CAPTCHA DETECTADO: Por favor resuélvelo.');
            } else {
                updateStatus('scraping', 'Analizando estado de sesión...');
            }

            await new Promise(r => setTimeout(r, 2000));
        }

        // 4. SCROLL LOOP WITH "END OF RESULTS" CHECK
        updateStatus('scraping', 'Escaneando resultados...');
        console.error("Starting smart scroll...");

        await page.evaluate(async () => {
            const sleep = (ms) => new Promise(res => setTimeout(res, ms));

            // Helper to scroll
            const scrollElement = (selector) => {
                const el = document.querySelector(selector);
                if (el) {
                    el.scrollTop += 1500;
                    el.dispatchEvent(new Event('scroll'));
                }
            };

            for (let i = 0; i < 50; i++) { // Increased limit
                // 1. Scroll actions
                window.scrollBy(0, 1500);
                scrollElement('[data-e2e="search_results"]');
                scrollElement('[data-e2e="search-layout-container"]');
                scrollElement('main');

                // 2. Check for "End of Results"
                const bodyText = document.body.innerText;
                if (bodyText.includes('No more results') ||
                    bodyText.includes('No hay más resultados') ||
                    bodyText.includes('End of results')) {
                    // Found end marker
                    console.log("End of results detected.");
                    break;
                }

                // 3. Keep session alive
                if (i % 5 === 0) {
                    window.scrollTo(0, window.scrollY + 100);
                    document.body.click();
                }

                await sleep(1500); // Wait longer for content load
            }
        });

        console.error("Scrolling done. Extracting data...");
        updateStatus('scraping', 'Analizando usuarios (Texto y Enlaces)...');

        const creators = await page.evaluate(() => {
            const results = new Map();

            const isValidStream = (card) => {
                const text = card.innerText;
                if (text.match(/[0-9]+[.]?[0-9]*[KkMm]?\s*(viewer|espectad)/i)) return true;
                const treeWalker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
                let node;
                while (node = treeWalker.nextNode()) {
                    if (node.nodeValue.trim() === 'LIVE') return true;
                }
                return false;
            };

            // Heuristic DOM fetcher for true region
            const getTrueRegionFromDom = (targetUsername) => {
                try {
                    const sigiEl = document.getElementById('SIGI_STATE');
                    if (sigiEl) {
                        const json = JSON.parse(sigiEl.textContent);
                        const userMap = json?.UserModule?.users || {};
                        for (const userId in userMap) {
                            const user = userMap[userId];
                            if (user.uniqueId === targetUsername) {
                                return user.region || user.country || null;
                            }
                        }
                    }
                } catch (e) { }
                return null;
            };

            document.querySelectorAll('[data-e2e="search_live_card"]').forEach(card => {
                try {
                    let username = '';
                    const idEl = card.querySelector('[data-e2e="search_card_unique_id"]');
                    if (idEl) username = idEl.innerText;
                    if (!username) {
                        const link = card.querySelector('a[href*="/@"]');
                        if (link) {
                            const match = link.getAttribute('href').match(/@([^/?]+)/);
                            if (match) username = match[1];
                        }
                    }
                    if (username) {
                        const img = card.querySelector('img[src*="user"], img[src*="avatar"]');
                        const descEl = card.querySelector('.search-result-card-desc, [class*="Desc"], [data-e2e="search_card_desc"]');
                        let viewers = 'LIVE';
                        const text = card.innerText;
                        const viewerMatch = text.match(/([0-9]+[.]?[0-9]*[KkMm]?)\s*(viewer|espectad)/i);
                        if (viewerMatch) viewers = viewerMatch[1];
                        results.set(username, {
                            username,
                            avatar: img ? img.src : '',
                            viewers,
                            title: descEl ? descEl.innerText : 'Live',
                            type: 'live',
                            domRegion: getTrueRegionFromDom(username)
                        });
                    }
                } catch (e) { }
            });

            document.querySelectorAll('[data-e2e="search_user_card"], div[class*="DivItemContainer"]').forEach(card => {
                try {
                    if (!isValidStream(card)) return;
                    const link = card.querySelector('a[href*="/@"]');
                    if (link) {
                        const match = link.getAttribute('href').match(/@([^/?&]+)/);
                        if (match && match[1]) {
                            const username = match[1];
                            if (!results.has(username)) {
                                const img = card.querySelector('img');
                                const text = card.innerText;
                                let viewers = 'LIVE';
                                const viewerMatch = text.match(/([0-9]+[.]?[0-9]*[KkMm]?)\s*(viewer|espectad)/i);
                                if (viewerMatch) viewers = viewerMatch[1];
                                results.set(username, {
                                    username,
                                    avatar: img ? img.src : '',
                                    viewers,
                                    title: 'Detected Active Stream',
                                    type: 'fallback_live',
                                    domRegion: getTrueRegionFromDom(username)
                                });
                            }
                        }
                    }
                } catch (e) { }
            });

            return Array.from(results.values());
        });

        const initialResults = creators;
        if (initialResults.length > 0) {
            console.error(`Found ${initialResults.length} active streams. Starting Deep Analysis...`);
            updateStatus('scraping', `Detectados ${initialResults.length} lives. Analizando perfiles...`);

            const getProfileDetails = async (username) => {
                const details = { followers: '-', videos: '-', region: 'Unknown' };
                try {
                    const conn = new WebcastPushConnection(username);
                    console.error(`[DEEP_DIVE] Fetching Webcast API for @${username}...`);

                    // Try to fetch Room Info to get followers (and explicit region if present)
                    const roomInfo = await conn.getRoomInfo().catch(() => null);
                    if (roomInfo && roomInfo.owner) {
                        details.followers = roomInfo.owner.follower_count || '-';
                        if (roomInfo.owner.region) {
                            details.region = roomInfo.owner.region.toUpperCase();
                            console.error(`[ROOM_INFO] Confirmed region ${details.region} for @${username}`);
                            return details;
                        }
                    }

                    // Try to fetch Gift List for region heuristic
                    const gifts = await conn.getAvailableGifts().catch(() => null);
                    if (gifts && gifts.length > 0) {
                        const US_IDS = [10649, 10619, 8042, 7086, 9971, 11521, 51277, 49556, 49528, 49541, 15156, 7215, 10612, 7037, 7204, 8004, 10482, 9967, 6652, 19086, 13879];
                        const LATAM_IDS = [7032, 10168, 5478, 12335, 8239, 6788, 15104, 7096];

                        const URL_CHILI_US = 'b8ded3f3d633620616a74e4f30163836';
                        const URL_GG_CO = '3f02fa9594bd1495ff4e8aa5ae265eef';

                        const hasUS = gifts.filter(g => US_IDS.includes(g.id) || (g.image && g.image.url_list && g.image.url_list[0].includes(URL_CHILI_US)));
                        const hasLATAM = gifts.filter(g => LATAM_IDS.includes(g.id) || (g.image && g.image.url_list && g.image.url_list[0].includes(URL_GG_CO)));

                        console.error(`[DEBUG_GIFTS] @${username}: Found ${gifts.length} gifts. US Triggers: ${hasUS.length}, LATAM Triggers: ${hasLATAM.length}`);

                        if (hasUS.length > 0) {
                            details.region = 'US';
                            console.error(`[INVENTORY] Forced US region for @${username} based on: ${hasUS.map(g => g.name).join(', ')}`);
                        } else if (hasLATAM.length > 0) {
                            details.region = 'CO';
                            console.error(`[INVENTORY] Forced LATAM region for @${username} based on: ${hasLATAM.map(g => g.name).join(', ')}`);
                        }
                    }
                    return details;
                } catch (e) {
                    console.error(`[ERROR] Deep Dive failed for @${username}: ${e.message}`);
                    return details;
                }
            };

            const enrichedCreators = [];
            const BATCH_SIZE = 10; // Process 10 profiles concurrently since it's just an API call
            for (let i = 0; i < initialResults.length; i += BATCH_SIZE) {
                const batch = initialResults.slice(i, i + BATCH_SIZE);
                console.error(`[PROCESS] Analizando bloque ${i + 1} a ${Math.min(i + BATCH_SIZE, initialResults.length)} de ${initialResults.length}...`);

                const batchPromises = batch.map(async (c) => {
                    const d = await getProfileDetails(c.username);
                    const result = { ...c, ...d };

                    // Critical Fallback logic for profiles that completely evade API detection
                    if (result.region === 'Unknown' && c.domRegion) {
                        result.region = c.domRegion.toUpperCase();
                        console.error(`[DOM_FALLBACK] Applied domRegion ${result.region} for @${c.username}`);
                    }

                    if (result.region) result.region = mapIsoToName(result.region);
                    return result;
                });

                const batchResults = await Promise.all(batchPromises);
                enrichedCreators.push(...batchResults);

                updateStatus('scraping', `Analizados ${Math.min(i + BATCH_SIZE, initialResults.length)}/${initialResults.length} creadores...`);

                // Small delay between batches to avoid TikTok rate limits (1-1.5 seconds)
                if (i + BATCH_SIZE < initialResults.length) {
                    const delay = 1000 + Math.random() * 500;
                    await new Promise(r => setTimeout(r, delay));
                }
            }

            console.log(JSON.stringify({ creators: enrichedCreators }));
            updateStatus('completed', `Búsqueda finalizada. ${enrichedCreators.length} creadores analizados.`);
            fs.writeFileSync(path.join(process.cwd(), 'debug_creators_found.json'), JSON.stringify(enrichedCreators));
        } else {
            console.log(JSON.stringify({ creators: [] }));
            updateStatus('completed', `Búsqueda finalizada. 0 creadores encontrados.`);
        }

    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        updateStatus('error', `Error en la búsqueda: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
})();
