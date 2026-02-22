import { NextRequest, NextResponse } from 'next/server';
import { initDb, getScript, saveScript } from '@/lib/license-db';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'nexus-master-key';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== ADMIN_TOKEN) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await initDb();
    const scriptName = req.nextUrl.searchParams.get('name') || 'check-agency.js';
    const script = await getScript(scriptName);

    return NextResponse.json({ script: script || null });
}

export async function POST(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');
    if (token !== ADMIN_TOKEN) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await initDb();
    const { name, content } = await req.json();

    if (!name || !content) {
        return NextResponse.json({ error: 'Faltan parámetros name/content' }, { status: 400 });
    }

    await saveScript(name, content);

    return NextResponse.json({ success: true, message: `Script '${name}' guardado correctamente en la DB.` });
}
