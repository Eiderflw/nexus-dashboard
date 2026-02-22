import { NextRequest, NextResponse } from 'next/server';
import { getLicenses, initDb, saveLicenses, getScript } from '@/lib/license-db';

export async function POST(req: NextRequest) {
    try {
        const { key, hwid, scriptName } = await req.json();
        await initDb();

        if (!key || !hwid || !scriptName) {
            return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
        }

        // 1. Validate License & HWID
        const licenses = await getLicenses();
        const licIndex = licenses.findIndex(l => {
            if (!l.key) return false;
            return l.key.trim().toUpperCase() === key.trim().toUpperCase();
        });

        if (licIndex === -1) {
            return NextResponse.json({ error: 'Licencia no encontrada' }, { status: 403 });
        }

        const license = licenses[licIndex];

        if (!license.active) {
            return NextResponse.json({ error: `Licencia suspendida. Razón: ${license.reason || 'Sin razón'}` }, { status: 403 });
        }

        // 2. HWID Binding: Bind on first use, reject if mismatch
        if (!license.hwid || license.hwid === '') {
            // First time: bind this HWID to the license
            licenses[licIndex].hwid = hwid;
            licenses[licIndex].last_seen = new Date().toISOString();
            await saveLicenses(licenses);
        } else if (license.hwid !== hwid) {
            return NextResponse.json({ error: 'HWID incorrecto. Esta licencia está bloqueada a otro PC.' }, { status: 403 });
        } else {
            // HWID matches: update last_seen
            licenses[licIndex].last_seen = new Date().toISOString();
            await saveLicenses(licenses);
        }

        // 3. Check expiry
        if (license.expires_at && new Date(license.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Licencia vencida.' }, { status: 403 });
        }

        // 4. Fetch script from DB (not filesystem!)
        const script = await getScript(scriptName);

        if (!script) {
            return NextResponse.json({ error: `Script '${scriptName}' no encontrado. Súbelo desde el Panel Admin.` }, { status: 404 });
        }

        // 5. Return the script content
        return NextResponse.json({
            success: true,
            content: script.content,
            version: script.updated_at
        });

    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Error en la sincronización' }, { status: 500 });
    }
}
