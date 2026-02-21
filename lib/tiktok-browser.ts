import { spawn } from 'child_process';
import path from 'path';

export async function getTikTokData(url: string, cookieString: string): Promise<any> {
    console.log('[TikTokBrowser] Spawning external script (Fire-and-Forget)...');

    // Opaque path resolution to bypass Turbopack static analysis
    const getPath = (d: string, f: string) => path.join(...[process.cwd(), d, f]);
    const scriptPath = getPath('scripts', 'fetch-tiktok-data.js');
    const logPath = path.join(process.cwd(), 'public', 'sync_status.json');

    // Reset status file
    const fs = require('fs');
    fs.writeFileSync(logPath, JSON.stringify({ status: 'running', timestamp: Date.now() }));

    // Spawn detached
    const child = spawn('node', [scriptPath, url, ""], {
        detached: true,
        stdio: 'ignore'
    });

    child.unref();

    return { status: 'started', message: 'Sync started in background.' };
}
