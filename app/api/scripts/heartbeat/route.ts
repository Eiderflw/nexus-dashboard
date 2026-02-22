import { NextRequest, NextResponse } from 'next/server';
import { getLicenses, initDb, saveLicenses } from '@/lib/license-db';

export async function POST(req: NextRequest) {
    try {
        const { key, hwid } = await req.json();
        await initDb();

        if (!key || !hwid) {
            return NextResponse.json({ kill: true, reason: 'Parámetros inválidos' }, { status: 400 });
        }

        const licenses = await getLicenses();
        const licIndex = licenses.findIndex(l => l.key.trim().toUpperCase() === key.trim().toUpperCase());

        if (licIndex === -1) {
            return NextResponse.json({ kill: true, reason: 'Licencia no encontrada' });
        }

        const license = licenses[licIndex];

        // Check if suspended (Kill-switch)
        if (!license.active) {
            return NextResponse.json({ kill: true, reason: license.reason || 'Licencia suspendida por el administrador.' });
        }

        // Check HWID mismatch
        if (license.hwid && license.hwid !== hwid) {
            return NextResponse.json({ kill: true, reason: 'HWID no coincide. Sesión terminada.' });
        }

        // Check expiry
        if (license.expires_at && new Date(license.expires_at) < new Date()) {
            return NextResponse.json({ kill: true, reason: 'Licencia vencida.' });
        }

        // All good - update last_seen
        licenses[licIndex].last_seen = new Date().toISOString();
        await saveLicenses(licenses);

        return NextResponse.json({ kill: false, status: 'ok' });

    } catch (error: any) {
        console.error('Heartbeat error:', error);
        // Don't kill on server errors, give benefit of the doubt
        return NextResponse.json({ kill: false, status: 'server_error' });
    }
}
