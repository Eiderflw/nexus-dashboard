const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const XLSX = require('xlsx');

puppeteerExtra.use(StealthPlugin());

// --- LOGGING SETUP (HOISTED) ---
const logFile = path.join(process.cwd(), 'debug_log.txt');
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}
// Ensure clean log
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
// -------------------------------

// Get args
const args = process.argv.slice(2);
let targetUrl = args[0] || "https://live-backstage.tiktok.com/portal/data/data";
let cookieString = args[1];

if (!cookieString) {
    try {
        const cookiePath = path.join(process.cwd(), 'data', 'tiktok_cookies.json');
        if (fs.existsSync(cookiePath)) {
            const cookieData = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
            cookieString = cookieData.cookie;
            console.log('[Script] Loaded cookies from data/tiktok_cookies.json');
        }
    } catch (e) {
        console.error('[Script] Failed to load local cookies:', e.message);
    }
}

if (!cookieString) {
    console.error(JSON.stringify({ error: "Missing cookies. Run via UI or ensure data/tiktok_cookies.json exists." }));
    process.exit(1);
}

// Ensure download directory exists
const downloadPath = path.join(process.cwd(), 'downloads');
if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
}

// Clear old Excel files (DISABLED FOR DEBUGGING)
// fs.readdirSync(downloadPath).forEach(file => {
//     if (file.endsWith('.xlsx')) {
//         fs.unlinkSync(path.join(downloadPath, file));
//     }
// });

log("Download Path: " + downloadPath);

(async () => {
    let browser;
    let page;
    try {
        log('[Script] Starting...');
        const executablePath = puppeteer.executablePath();
        const userDataDir = path.join(os.tmpdir(), 'nexus_dashboard_chrome_data');

        browser = await puppeteerExtra.launch({
            headless: false,
            executablePath: executablePath,
            userDataDir: userDataDir,
            defaultViewport: null,
            args: [
                '--start-maximized',
                '--window-size=1920,1080',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });

        page = await browser.newPage();

        // Enable file download behavior
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath,
        });

        page.setDefaultNavigationTimeout(0);

        // Cookies
        const cookies = cookieString.split(';').map(c => {
            const [key, ...v] = c.trim().split('=');
            return {
                name: key,
                value: v.join('='),
                domain: '.tiktok.com'
            };
        });
        await page.setCookie(...cookies);

        log(`[Script] Navigating to Analysis: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 300000 });

        // Wait for Table
        try {
            await page.waitForSelector('div[class*="table"], tbody, .semi-table-row', { timeout: 30000 });
            log("[Script] Table loaded.");
        } catch (e) { log("[Script] Table wait timeout."); }

        // EXPORT BUTTON DEBUG
        log("[Script] Looking for Export button...");

        // Wait specifically for the button
        let exportBtn = null;
        try {
            exportBtn = await page.waitForSelector('button[data-id="export"]', { timeout: 10000 });
        } catch (e) { /* Ignore */ }

        if (exportBtn) {
            log("[Script] Primary Export button FOUND. Clicking...");
            await exportBtn.click();
            await new Promise(r => setTimeout(r, 3000)); // Wait for selection bar to appear

            // STEP 2: "Select all" (Seleccionar todo)
            log("[Script] Looking for 'Select all' / 'Seleccionar todo'...");
            try {
                const selectAllClick = await page.evaluate(() => {
                    const btns = Array.from(document.querySelectorAll('button, span, div'));
                    const btn = btns.find(el => {
                        const txt = el.innerText?.toLowerCase() || "";
                        return (txt.includes('select all') || txt.includes('seleccionar todo') || txt.includes('seleccionar todos')) && !txt.includes('0');
                    }) || btns.find(el => {
                        const txt = el.innerText?.toLowerCase() || "";
                        return txt.includes('select all') || txt.includes('seleccionar todo');
                    });

                    if (btn) {
                        btn.click();
                        return true;
                    }
                    return false;
                });

                if (selectAllClick) {
                    log("[Script] 'Select all' clicked successfully.");
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    log("[Script] 'Select all' button NOT found via text, attempting to check a checkbox manually if any...");
                    // Fallback: Click the first checkbox in the table header if possible
                    await page.click('th input[type="checkbox"], .semi-table-selection-column input').catch(() => { });
                }
            } catch (e) {
                log("[Script] Error during selection step: " + e.message);
            }

            // STEP 3: Final Export button (usually in the bottom bar)
            log("[Script] Looking for FINAL Export button in the selection bar...");
            try {
                const finalExportBtn = await page.evaluateHandle(() => {
                    const elements = Array.from(document.querySelectorAll('div[class*="selection"], div[class*="bar"], footer, .semi-modal-footer, .semi-button'));
                    // Look for Export button specifically within a bar context or with specific class
                    return elements.find(el => {
                        const txt = el.innerText?.toLowerCase() || "";
                        return (txt === 'export' || txt === 'exportar') && el.closest('div[class*="bar"], div[class*="selection"]');
                    }) || elements.find(el => {
                        const txt = el.innerText?.toLowerCase() || "";
                        return (txt === 'export' || txt === 'exportar');
                    });
                });

                if (finalExportBtn && await finalExportBtn.asElement()) {
                    log("[Script] Final Export button found. Clicking...");
                    await finalExportBtn.asElement().click();
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    log("[Script] Final Export button NOT found via text, clicking all buttons called 'Export' as fallback...");
                    await page.evaluate(() => {
                        Array.from(document.querySelectorAll('button')).forEach(b => {
                            if (b.innerText.toLowerCase().includes('export')) b.click();
                        });
                    });
                }
            } catch (e) {
                log("[Script] Error during final export click: " + e.message);
            }

            // Wait for file
            log("[Script] Waiting for download...");
            let downloadedFile = null;
            let checks = 0;
            while (checks < 60) {
                // Take screenshot every 10 checks to debug UI state
                if (checks % 10 === 0) {
                    await page.screenshot({ path: path.join(process.cwd(), `debug_download_${checks}.png`) });
                    log(`[Script] Captured debug screenshot: debug_download_${checks}.png`);
                }

                const files = fs.readdirSync(downloadPath).filter(f => f.endsWith('.xlsx'));
                log(`[Script] Loop ${checks}: Found files: ${files.join(', ')}`);

                if (files.length > 0) {
                    downloadedFile = path.join(downloadPath, files[0]);
                    await new Promise(r => setTimeout(r, 2000));
                    break;
                }

                // FALLBACK: Check User Downloads for fresh file
                try {
                    const userDownloads = path.join(os.homedir(), 'Downloads');
                    if (fs.existsSync(userDownloads)) {
                        const userFiles = fs.readdirSync(userDownloads)
                            .filter(f => f.endsWith('.xlsx'))
                            .map(f => ({ name: f, time: fs.statSync(path.join(userDownloads, f)).mtime.getTime() }))
                            .sort((a, b) => b.time - a.time);

                        if (userFiles.length > 0) {
                            const latest = userFiles[0];
                            const now = new Date().getTime();
                            if (now - latest.time < 120000) { // Created in last 2 mins
                                log(`[Script] Found fresh export in User Downloads: ${latest.name}`);
                                const source = path.join(userDownloads, latest.name);
                                const dest = path.join(downloadPath, latest.name);
                                fs.copyFileSync(source, dest);
                                downloadedFile = dest;
                                break;
                            }
                        }
                    }
                } catch (e) { /* content with limited permission */ }

                await new Promise(r => setTimeout(r, 1000));
                checks++;
            }

            if (downloadedFile) {
                log(`[Script] Download detected: ${downloadedFile}`);
                processExcelAndSave(downloadedFile);
            } else {
                log("[Script] Error: Download timed out.");
                throw new Error("Download timed out");
            }
        } else {
            log("[Script] Export button NOT found!");
            // List all buttons for debug
            try {
                const buttons = await page.$$eval('button', btns => btns.map(b => ({
                    text: b.innerText,
                    class: b.className,
                    dataId: b.getAttribute('data-id')
                })));
                log("Buttons found: " + JSON.stringify(buttons, null, 2));
            } catch (e) { log("Error listing buttons: " + e.message); }

            throw new Error("Export button missing");
        }

    } catch (error) {
        log('[Script] ERROR: ' + error.message);
        if (page) await page.screenshot({ path: path.join(process.cwd(), 'error_screenshot.png') });

        // Update Status File (Error)
        const statusPath = path.join(process.cwd(), 'public', 'sync_status.json');
        fs.writeFileSync(statusPath, JSON.stringify({
            status: 'error',
            timestamp: Date.now(),
            error: error.message
        }));

        process.exit(1);
    } finally {
        log('[Script] Closing browser...');
        if (browser) await browser.close();
    }
})();

function processExcelAndSave(filePath) {
    log(`[Script] Processing Excel data from: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    log(`[Script] Parsed ${json.length} rows from Excel.`);

    const creators = json.map(row => {
        const uid = row["ID del creador"] || "";
        if (!uid) return null;

        const diamonds = parseNum(row["Diamantes"]);
        const lastDiamonds = parseNum(row["Diamantes en el último mes"]);

        let growVal = 0;
        const growRaw = row["Diamantes - frente al mes pasado"];
        if (typeof growRaw === 'string' && growRaw.includes('%')) {
            growVal = parseFloat(growRaw.replace('%', '')) / 100;
        } else {
            growVal = parseFloat(growRaw) || 0;
        }

        return {
            period: "Excel Sync",
            creatorId: String(uid),
            username: row["Nombre de usuario del creador"] || "Unknown",
            avatar: "",
            group: row["Grupo"] || "N/A",
            agent: row["Agente"] || "N/A",
            joinTime: new Date().toISOString(),
            daysSinceJoin: parseNum(row["Días desde la incorporación"]),

            diamonds: diamonds,
            liveHours: parseNum(row["Duración de LIVE"]),
            validDays: parseNum(row["Días válidos de emisiones LIVE"]),
            newFollowers: parseNum(row["Nuevos seguidores"]),
            liveSessions: parseNum(row["Emisiones LIVE"]),

            lastMonthDiamonds: lastDiamonds,
            lastMonthLiveHours: parseNum(row["Duración de emisiones LIVE (en horas) durante el último mes"]),

            diamondsGrowth: growVal,

            diamondsDailyTrend: (() => {
                const now = new Date();
                const dayOfMonth = now.getDate();
                if (dayOfMonth === 0) return 0;

                const currentDaily = diamonds / dayOfMonth;
                const lastDaily = lastDiamonds / 30;

                if (lastDaily === 0) return 1;
                return (currentDaily - lastDaily) / lastDaily;
            })(),

            battles: parseNum(row["Partidas"]),
            battleDiamonds: parseNum(row["Diamantes de partidas"]),
            multiGuestDiamonds: parseNum(row["Diamantes del modo de varios invitados"]),

            graduationStatus: row["Estado de graduación"] || "Active",
            _source: "excel"
        };
    }).filter(Boolean);

    // AVATAR RECOVERY STRATEGY
    const previousDataPath = path.join(process.cwd(), 'public', 'tiktok_full_data.json');
    if (fs.existsSync(previousDataPath)) {
        try {
            const oldData = JSON.parse(fs.readFileSync(previousDataPath, 'utf-8'));
            const oldCreators = oldData.analysis?.data?.anchorAnalysisDataInfos || [];
            const avatarMap = new Map();
            oldCreators.forEach(c => {
                if (c.creatorId && c.avatar) avatarMap.set(String(c.creatorId), c.avatar);
            });

            creators.forEach(c => {
                if (avatarMap.has(c.creatorId)) {
                    c.avatar = avatarMap.get(c.creatorId);
                }
            });
            log(`[Script] Recovered avatars for ${avatarMap.size} creators.`);
        } catch (e) { log("[Script] Could not recover avatars: " + e.message); }
    }

    const finalOutput = {
        analysis: {
            data: {
                anchorAnalysisDataInfos: creators,
                dailyTotalAmount: creators.length
            }
        }
    };

    const dumpPath = path.join(process.cwd(), 'public', 'tiktok_full_data.json');
    fs.writeFileSync(dumpPath, JSON.stringify(finalOutput, null, 2));
    log(`[Script] JSON Saved with ${creators.length} items to ${dumpPath}`);

    // Update Status File
    const statusPath = path.join(process.cwd(), 'public', 'sync_status.json');
    fs.writeFileSync(statusPath, JSON.stringify({
        status: 'success',
        timestamp: Date.now(),
        count: creators.length
    }));
}

function parseNum(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        return parseFloat(val.replace(/,/g, '')) || 0;
    }
    return 0;
}
