import { NextRequest, NextResponse } from 'next/server';
import { getLicenses, saveLicenses, initDb } from '@/lib/license-db';

export async function POST(req: NextRequest) {
    try {
        const { key } = await req.json();
        await initDb();

        if (!key) {
            return NextResponse.json({ valid: false, message: 'Llave requerida' }, { status: 400 });
        }

        const licenses = await getLicenses();
        const searchKey = key.trim().toUpperCase();
        const license = licenses.find(l => l.key.trim().toUpperCase() === searchKey);

        if (!license) {
            return NextResponse.json({ valid: false, message: 'La licencia no existe o es inválida.' });
        }

        if (!license.active) {
            return NextResponse.json({
                valid: false,
                message: license.reason || 'Esta licencia ha sido desactivada por el administrador.'
            });
        }

        const expiryDate = new Date(license.expires_at);
        const now = new Date();

        if (now > expiryDate) {
            return NextResponse.json({
                valid: false,
                message: `Tu licencia expiró el ${license.expires_at}. Contacta a soporte.`
            });
        }

        // Update last_seen
        const updatedLicenses = licenses.map(l =>
            l.key.trim().toUpperCase() === searchKey
                ? { ...l, last_seen: new Date().toISOString() }
                : l
        );
        await saveLicenses(updatedLicenses);

        return NextResponse.json({
            valid: true,
            expires_at: license.expires_at,
            server_time: new Date().toISOString(),
            message: 'Licencia activa'
        });

    } catch (error) {
        return NextResponse.json({ valid: false, message: 'Error interno de validación' }, { status: 500 });
    }
}
