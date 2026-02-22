const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

puppeteerExtra.use(StealthPlugin());

const args = process.argv.slice(2);
const creatorsArg = args[0];
const cookieString = args[1];

const statusFile = path.join(process.cwd(), 'public', 'scraper_status.json');

function updateStatus(state, message) {
    try {
        fs.writeFileSync(statusFile, JSON.stringify({
            state,
            message,
            timestamp: Date.now(),
            type: 'agency'
        }));
    } catch (e) {
        console.error("Error writing status:", e);
    }
}

if (!creatorsArg) {
    console.error(JSON.stringify({ error: "Missing arguments: creators" }));
    process.exit(1);
}

const creators = creatorsArg.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).slice(0, 30);

(async () => {
    let browser;
    try {
        updateStatus('initializing', 'Iniciando validador...');

        const hasCookie = cookieString && cookieString !== 'none';

        const userDataDir = path.join(process.cwd(), 'tiktok-session-data');

        // Force clear lock if it exists (fixes "The browser is already running" error)
        const lockPath = path.join(userDataDir, 'SingletonLock');
        if (fs.existsSync(lockPath)) {
            try { fs.unlinkSync(lockPath); } catch (e) { }
        }

        const launchOptions = {
            headless: "new",
            defaultViewport: null,
            userDataDir: userDataDir,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
        };

        const launchBrowser = async () => {
            return await puppeteerExtra.launch(launchOptions);
        };

        try {
            browser = await launchBrowser();
        } catch (e) {
            console.error("Launch collision, retrying in 2s...");
            await new Promise(r => setTimeout(r, 2000));
            browser = await launchBrowser();
        }

        const page = await browser.newPage();

        // 1. Set Cookies (Sync if provided)
        if (cookieString && cookieString !== 'none') {
            try {
                const cookies = cookieString.split(';').map(c => {
                    const [key, ...v] = c.trim().split('=');
                    return { name: key, value: v.join('='), domain: '.tiktok.com' };
                });
                await page.setCookie(...cookies);
            } catch (e) { }
        }

        // 2. Navigate
        // console.log("Navigating to Portal...");
        updateStatus('navigating', 'Entrando al Portal de Agencias...');
        await page.goto('https://live-backstage.tiktok.com/portal/anchor/relation', { waitUntil: 'networkidle2' });

        // 3. STRICT LOGIN CHECK
        // console.log("Checking login status...");
        const maxWaitTime = 600000; // 10 Minutes
        const startTime = Date.now();
        let inviteBtnFound = false;

        while (Date.now() - startTime < maxWaitTime) {
            const pageState = await page.evaluate(() => {
                // Check if we are on login page
                if (location.href.includes('login') || location.href.includes('signin') || location.href.includes('passport')) {
                    return 'login_page';
                }

                // Check for invite button (ultimate proof of agency page)
                const btns = Array.from(document.querySelectorAll('button'));
                const hasInviteBtn = btns.some(b => b.innerText.includes('Invitar a creadores') || b.innerText.includes('Invite creators'));
                if (hasInviteBtn) return 'ready';

                const btn2 = document.querySelector('button[data-id="add-host"]');
                if (btn2) return 'ready';

                // Check for Relation text
                if (document.body.innerText.includes('Relation') || document.body.innerText.includes('Relación')) {
                    // Might be loading
                    return 'loading_portal';
                }

                return 'unknown';
            });

            if (pageState === 'ready') {
                // console.log("Login confirmed (Invite button found)!");
                inviteBtnFound = true;
                break;
            } else if (pageState === 'login_page') {
                updateStatus('processing', 'Entrando...');
            } else if (pageState === 'loading_portal') {
                updateStatus('processing', 'Cargando portal...');
            } else {
                updateStatus('processing', 'Verificando acceso...');
            }

            await new Promise(r => setTimeout(r, 2000));
        }

        if (!inviteBtnFound) {
            throw new Error("Tiempo de espera agotado. No se detectó inicio de sesión.");
        }

        updateStatus('processing', 'Sesión activa. Iniciando proceso...');

        // 4. Click "Invitar a creadores"
        // console.log("Looking for Invite button...");
        try {
            // Keep retrying for up to 15 seconds to click the invite button
            let clicked = false;
            for (let i = 0; i < 15; i++) {
                const clickSuccess = await page.evaluate(() => {
                    // Try data-id first
                    const btn2 = document.querySelector('button[data-id="add-host"]');
                    if (btn2) {
                        btn2.click();
                        return true;
                    }
                    // Fallback to text
                    const btns = Array.from(document.querySelectorAll('button'));
                    const btn = btns.find(b => b.innerText.includes('Invitar a creadores') || b.innerText.includes('Invite creators'));
                    if (btn) {
                        btn.click();
                        return true;
                    }
                    return false;
                });

                if (clickSuccess) {
                    clicked = true;
                    break;
                }
                await new Promise(r => setTimeout(r, 1000));
            }
            if (!clicked) throw new Error("Invite button could not be clicked.");
        } catch (e) {
            console.error("Failed clicking invite button:", e);
        }
        await new Promise(r => setTimeout(r, 2000));

        updateStatus('processing', 'Pegando lista de creadores...');

        // 5. Paste Creators
        // console.log("Pasting creators...");
        const textareaSelector = 'textarea[data-testid="inviteHostTextArea"]';
        await page.waitForSelector(textareaSelector, { timeout: 5000 });
        await page.type(textareaSelector, creators.join('\n'));
        await new Promise(r => setTimeout(r, 1000));

        // 6. Click "Siguiente"
        // console.log("Clicking Next...");
        const nextBtnSelector = 'button[data-id="invite-host-next"]';
        await page.click(nextBtnSelector);

        // console.log("Waiting for results...");
        updateStatus('processing', 'Analizando resultados...');
        await new Promise(r => setTimeout(r, 5000));

        // 7. Scrape Results
        const checkResults = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('.semi-table-row, tr'));
            const rowData = [];

            rows.forEach(row => {
                const text = row.innerText;
                // Ignore headers
                if ((text.includes('Información') && text.includes('Estado')) || text.includes('Creator info')) return;
                // Ignore empty
                if (text.trim().length < 3) return;

                let status = 'Desconocido';
                let inviteType = '-';

                // STATUS DETECTION (Translations included) - PRIORITY: Specific reasons first
                if (text.match(/Región no admitida|Region not supported|Unsupported region/i)) {
                    status = 'Región no admitida';
                } else if (text.match(/En otra agencia|Signed|Another agency|agencia/i)) {
                    status = 'En otra agencia';
                } else if (text.match(/Otro motivo|Other reason/i)) {
                    status = 'Otro motivo';
                } else if (text.match(/Invitado|Invited|Solicitado|Requested/i)) {
                    status = 'Invitado';
                } else if (text.match(/Disponible|Available|No firmado|Not signed/i)) {
                    status = 'Disponible';
                } else if (text.match(/No elegible|Ineligible|No disponible|Not accessible|Not accessible|Not available/i)) {
                    status = 'No disponible';
                }

                // INVITE TYPE DETECTION (Elite vs Normal)
                if (text.match(/Elite/i)) {
                    inviteType = 'Elite';
                } else if (text.match(/Normal|Estándar|Standard/i)) {
                    inviteType = 'Normal';
                } else if (status === 'Disponible' || status === 'Invitado') {
                    // Fallback to Normal if status is valid but type not explicitly found
                    inviteType = 'Normal';
                }

                const img = row.querySelector('img');
                const avatar = img ? img.src : 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default-avatar.png';

                rowData.push({
                    raw: text,
                    status,
                    inviteType,
                    avatar
                });
            });
            return rowData;
        });

        const refinedResults = creators.map(creator => {
            const match = checkResults.find(r => r.raw.toLowerCase().includes(creator.toLowerCase()));
            if (match) {
                return {
                    username: creator,
                    status: match.status,
                    inviteType: match.inviteType,
                    avatar: match.avatar,
                    details: match.raw
                };
            }
            return { username: creator, status: 'No encontrado', inviteType: '-', avatar: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default-avatar.png' };
        });

        console.log(JSON.stringify({ results: refinedResults }));
        updateStatus('completed', 'Validación finalizada.');

    } catch (error) {
        // Output errors as proper JSON for NextJS backend intercept via stdout
        console.log(JSON.stringify({ error: error.message }));
        updateStatus('error', 'Error: ' + error.message);
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (e) { }
        }
    }
})();
