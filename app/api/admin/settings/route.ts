import { NextRequest, NextResponse } from 'next/server';
import { initDb, getSettings, saveSetting } from '@/lib/license-db';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'nexus-master-key';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== ADMIN_TOKEN) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await initDb();
    const settings = await getSettings();

    // Parse array to object for easier consumption
    const config: Record<string, any> = {};
    for (const s of settings) {
        config[s.key] = { value: s.value, expires_at: s.expires_at };
    }

    return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== ADMIN_TOKEN) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await initDb();

    try {
        const body = await req.json();

        // Expected body format:
        // { announcement: { value: "...", expires_at: "..." }, exe_version: { value: "..." } }

        if (body.announcement !== undefined) {
            await saveSetting('announcement', body.announcement.value, body.announcement.expires_at || null);
        }

        if (body.exe_version !== undefined) {
            await saveSetting('exe_version', body.exe_version.value, null);
        }

        return NextResponse.json({ success: true, message: "Configuración global actualizada" });
    } catch (e) {
        console.error('Settings save error:', e);
        return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 });
    }
}
