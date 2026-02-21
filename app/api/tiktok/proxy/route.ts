import { NextResponse } from 'next/server';
import { getTikTokData } from '@/lib/tiktok-browser';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const targetUrl = searchParams.get('url');

        if (!targetUrl) {
            return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
        }

        // 1. Load Cookies
        const cookiePath = path.join(process.cwd(), 'data', 'tiktok_cookies.json');
        if (!fs.existsSync(cookiePath)) {
            return NextResponse.json({ error: 'Cookies not configured. Please create data/tiktok_cookies.json' }, { status: 500 });
        }

        const cookieData = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
        const cookieString = cookieData.cookie;

        // 2. Fetch Data via Puppeteer
        console.log(`[Proxy] Fetching via Browser: ${targetUrl}`);
        const data = await getTikTokData(targetUrl, cookieString);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('[Proxy] Error:', error);

        // Log to file for debugging
        try {
            fs.writeFileSync(path.join(process.cwd(), 'debug_proxy_error.txt'), `[${new Date().toISOString()}] ${error.message}\n${error.stack}\n`);
        } catch (e) {
            console.error('Failed to write error log', e);
        }

        return NextResponse.json({
            error: 'Failed to fetch data',
            details: error.message
        }, { status: 500 });
    }
}
