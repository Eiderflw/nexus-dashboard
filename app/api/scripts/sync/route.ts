import { NextRequest, NextResponse } from 'next/server';
import { getLicenses, initDb } from '@/lib/license-db';
import fs from 'fs';
import path from 'path';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'nexus-master-key';

export async function POST(req: NextRequest) {
    try {
        const { key, hwid, scriptName } = await req.json();
        await initDb();

        if (!key || !hwid || !scriptName) {
            return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
        }

        // Diagnostic logging
        console.log('CWD:', process.cwd());
        try {
            console.log('Root Files:', fs.readdirSync(process.cwd()));
            if (fs.existsSync(path.join(process.cwd(), 'scripts'))) {
                console.log('Scripts Folder Content:', fs.readdirSync(path.join(process.cwd(), 'scripts')));
            }
        } catch (e) {
            console.error('Debug logs failed', e);
        }

        // 1. Validate License & HWID
        const licenses = await getLicenses();
        const license = licenses.find(l => l.key.trim().toUpperCase() === key.trim().toUpperCase());

        if (!license || !license.active || license.hwid !== hwid) {
            return NextResponse.json({ error: 'Acceso denegado (Licencia/HWID inválido)' }, { status: 403 });
        }

        // 2. Locate the obfuscated script
        // We look in dist-scripts first (the protected version)
        const possiblePaths = [
            path.join(process.cwd(), 'dist-scripts', scriptName),
            path.join(process.cwd(), 'scripts', scriptName)
        ];

        let scriptContent = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                scriptContent = fs.readFileSync(p, 'utf-8');
                break;
            }
        }

        if (!scriptContent) {
            return NextResponse.json({ error: 'Script no encontrado' }, { status: 404 });
        }

        // 3. Return the content (In a real app, we'd encrypt this)
        return NextResponse.json({
            success: true,
            content: scriptContent,
            version: Date.now()
        });

    } catch (error) {
        return NextResponse.json({ error: 'Error en la sincronización' }, { status: 500 });
    }
}
