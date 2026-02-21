import { NextRequest, NextResponse } from 'next/server';
import { getLicenses, saveLicenses, initDb, License } from '@/lib/license-db';

// SECRET_ADMIN_TOKEN is used to protect this API. 
// On Fly.io, set this as an environment variable (fly secrets set ADMIN_TOKEN=your_pass)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'nexus-master-key';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== ADMIN_TOKEN) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await initDb();

    const licenses = await getLicenses();
    return NextResponse.json(licenses);
}

export async function POST(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== ADMIN_TOKEN) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    await initDb();

    try {
        const { action, licenseData } = await req.json();
        let licenses = await getLicenses();

        if (action === 'add') {
            licenses.push(licenseData);
        } else if (action === 'update') {
            licenses = licenses.map(l => l.key === licenseData.key ? { ...l, ...licenseData } : l);
        } else if (action === 'delete') {
            licenses = licenses.filter(l => l.key !== licenseData.key);
        }

        await saveLicenses(licenses);
        return NextResponse.json({ success: true, licenses });
    } catch (e) {
        return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 });
    }
}
