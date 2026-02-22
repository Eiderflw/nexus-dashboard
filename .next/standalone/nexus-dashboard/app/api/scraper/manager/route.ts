import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const STATE_FILE = path.join(process.cwd(), 'scraper-state.json');
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'foto_perfil');

// --- USER AGENT ROTATION POOL ---
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
];

const getHeaders = () => ({
    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.google.com/',
    'Connection': 'keep-alive'
});

// --- DATA STRUCTURES ---
interface ScraperState {
    isRunning: boolean;
    queue: string[];
    currentIndex: number;
    total: number;
    successCount: number;
    errorCount: number;
    currentUsername: string;
    lastUpdated: number;
    errorLogs?: Record<string, string>;
}

// --- HELPER FUNCTIONS ---
function loadState(): ScraperState {
    if (fs.existsSync(STATE_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
            if (!data.errorLogs) data.errorLogs = {};
            return data;
        } catch (e) { console.error("Error reading state", e); }
    }
    return { isRunning: false, queue: [], currentIndex: 0, total: 0, successCount: 0, errorCount: 0, currentUsername: '', lastUpdated: Date.now(), errorLogs: {} };
}

function saveState(state: ScraperState) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// --- BACKGROUND WORKER ---
let isWorkerRunning = false;

async function runBackgroundWorker() {
    if (isWorkerRunning) return;
    isWorkerRunning = true;
    console.log("🚀 Background Scraper Started (V5 - UA Rotation)");

    try {
        while (true) {
            let state = loadState();

            if (!state.isRunning) break;
            if (state.currentIndex >= state.total) {
                state.isRunning = false;
                saveState(state);
                break;
            }

            const username = state.queue[state.currentIndex];
            state.currentUsername = username;
            saveState(state);

            try {
                const result = await scrapePhoto(username);
                state = loadState();
                if (result.success) {
                    state.successCount++;
                    if (state.errorLogs?.[username]) delete state.errorLogs[username];
                } else {
                    state.errorCount++;
                    if (!state.errorLogs) state.errorLogs = {};
                    state.errorLogs[username] = result.error || 'Fallo desconocido';
                }
            } catch (e) {
                state = loadState();
                state.errorCount++;
                if (!state.errorLogs) state.errorLogs = {};
                state.errorLogs[username] = 'Error técnico de red';
            }

            state.currentIndex++;
            state.lastUpdated = Date.now();
            saveState(state);

            // Wait between 3 and 7 seconds (Anti-Bot)
            const waitTime = 3000 + Math.random() * 4000;
            await new Promise(r => setTimeout(r, waitTime));
        }
    } finally {
        isWorkerRunning = false;
    }
}

// --- SCRAPING LOGIC ---
async function scrapePhoto(username: string): Promise<{ success: boolean; error?: string }> {
    try {
        const safeUsername = username.replace(/[^a-zA-Z0-9_\.]/g, '');
        const imagePath = path.join(PHOTOS_DIR, `${safeUsername}.jpg`);

        if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });

        let imageUrl = '';
        let lastError = '';

        // 1. TikTok Direct (Modern Rehydration)
        try {
            const url = `https://www.tiktok.com/@${username}`;
            const response = await axios.get(url, { headers: getHeaders(), timeout: 12000 });
            const scriptMatch = response.data.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/);
            if (scriptMatch) {
                const jsonData = JSON.parse(scriptMatch[1]);
                const user = jsonData?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user;
                if (user) {
                    imageUrl = user.avatarLarger || user.avatarMedium;
                } else {
                    lastError = "TikTok: Usuario no encontrado/privado";
                }
            } else {
                lastError = "TikTok: Bloqueo de seguridad (Bot Detect)";
            }
        } catch (e) {
            lastError = "TikTok: Acceso denegado (Rate Limit)";
        }

        // 2. Mirror Fallback (Urlebird)
        if (!imageUrl) {
            try {
                const response = await axios.get(`https://urlebird.com/user/${username}/`, { headers: getHeaders(), timeout: 8000 });
                const match = response.data.match(/src="([^"]+)" class="[^"]*rounded-circle[^"]*"/);
                if (match) {
                    imageUrl = match[1];
                } else {
                    lastError = "Metodos 1 y 2 fallaron (Bloqueo total)";
                }
            } catch (e) {
                lastError = "Mirror bloqueado por TikTok";
            }
        }

        // 3. Final Fallback: TikTok Embed (Metadata)
        if (!imageUrl) {
            try {
                const response = await axios.get(`https://www.tiktok.com/embed/@${username}`, { headers: getHeaders(), timeout: 8000 });
                const match = response.data.match(/"avatarLarger":"([^"]+)"/);
                if (match) {
                    imageUrl = JSON.parse(`"${match[1]}"`);
                }
            } catch (e) { }
        }

        if (imageUrl) {
            try {
                const imgRes = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    headers: { ...getHeaders(), 'Referer': 'https://www.tiktok.com/' }
                });
                fs.writeFileSync(imagePath, imgRes.data);
                return { success: true };
            } catch (e) {
                return { success: false, error: "Error de descarga (CDN bloqueado)" };
            }
        }

        return { success: false, error: lastError || "Protección de TikTok activa" };

    } catch (e) {
        return { success: false, error: "Error en el sistema de sincronización" };
    }
}

// --- API HANDLERS ---
export async function GET() {
    const state = loadState();
    if (state.isRunning && !isWorkerRunning && state.currentIndex < state.total) {
        runBackgroundWorker();
    }
    return NextResponse.json(state);
}

export async function POST(request: Request) {
    const body = await request.json();
    const state = loadState();

    if (body.action === 'start') {
        saveState({
            isRunning: true, queue: body.usernames, currentIndex: 0, total: body.usernames.length,
            successCount: 0, errorCount: 0, currentUsername: '', lastUpdated: Date.now(), errorLogs: {}
        });
        runBackgroundWorker();
        return NextResponse.json({ success: true });
    }

    if (body.action === 'stop') state.isRunning = false;
    if (body.action === 'resume') state.isRunning = true;
    if (body.action === 'reset') {
        Object.assign(state, { isRunning: false, queue: [], currentIndex: 0, total: 0, successCount: 0, errorCount: 0, currentUsername: '', errorLogs: {} });
    }

    saveState(state);
    if (body.action === 'resume') runBackgroundWorker();
    return NextResponse.json({ success: true });
}
