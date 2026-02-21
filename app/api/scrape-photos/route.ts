import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Headers from user's TikTokRealTime library
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0'
};

const PHOTOS_DIR = path.join(process.cwd(), 'public', 'foto_perfil');

export async function POST(request: Request) {
    let username = '';
    try {
        const body = await request.json();
        username = body.username;
        if (!username) return NextResponse.json({ success: false, error: 'Username required' }, { status: 400 });

        const safeUsername = username.replace(/[^a-zA-Z0-9_\.]/g, '');
        const imagePath = path.join(PHOTOS_DIR, `${safeUsername}.jpg`);
        const publicUrl = `/foto_perfil/${safeUsername}.jpg`;

        if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });

        // --- STRATEGY: User's "TikTokRealTime" Logic (Lightweight & Fast) ---
        console.log(`fetching profile for ${username}...`);

        let imageUrl = '';
        let sourceUsed = 'tiktok-realtime';

        try {
            const url = `https://www.tiktok.com/@${username}`;
            const response = await axios.get(url, {
                headers: HEADERS,
                timeout: 10000 // 10s timeout
            });
            const html = response.data;

            // 1. Try __UNIVERSAL_DATA_FOR_REHYDRATION__
            const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/);
            if (scriptMatch && scriptMatch[1]) {
                const jsonData = JSON.parse(scriptMatch[1]);
                const user = jsonData?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user;
                if (user) imageUrl = user.avatarLarger || user.avatarMedium || user.avatarThumb;
            }

            // 2. Try SIGI_STATE (Fallback)
            if (!imageUrl) {
                const altMatch = html.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/);
                if (altMatch && altMatch[1]) {
                    const data = JSON.parse(altMatch[1]);
                    const user = Object.values(data.UserModule?.users || {}).find((u: any) =>
                        u.uniqueId.toLowerCase() === username.toLowerCase()
                    ) as any;
                    if (user) imageUrl = user.avatarLarger || user.avatarMedium || user.avatarThumb;
                }
            }

        } catch (e: any) {
            console.log(`Direct fetch failed for ${username}: ${e.message}`);
        }

        // --- Fallback: Urlebird (Backup) ---
        if (!imageUrl) {
            try {
                // Using Urlebird as a backup source
                const mirrorUrl = `https://urlebird.com/user/${username}/`;
                const response = await axios.get(mirrorUrl, {
                    headers: HEADERS,
                    timeout: 8000
                });
                // Simple regex for Urlebird image
                const match = response.data.match(/src="([^"]+)" class="[^"]*rounded-circle[^"]*"/);
                if (match && match[1]) {
                    imageUrl = match[1];
                    sourceUsed = 'urlebird';
                }
            } catch (e) { }
        }

        if (!imageUrl) {
            return NextResponse.json({ success: false, error: 'Image not found' });
        }

        // Download Image
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: HEADERS
        });

        fs.writeFileSync(imagePath, imageResponse.data);
        return NextResponse.json({ success: true, url: publicUrl, source: sourceUsed });

    } catch (error: any) {
        console.error(`API Error for ${username}:`, error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
