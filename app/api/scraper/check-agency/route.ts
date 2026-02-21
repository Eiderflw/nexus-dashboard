import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { creators, cookie } = await req.json();

        if (!creators || !Array.isArray(creators) || creators.length === 0) {
            return NextResponse.json({ error: 'Lista de creadores inválida' }, { status: 400 });
        }

        // Opaque path resolution to bypass Turbopack static analysis
        const getPath = (d: string, f: string) => path.join(...[process.cwd(), d, f]);
        const scriptPath = getPath('scripts', 'check-agency.js');
        const creatorsArg = creators.join(',');
        const cookieArg = cookie || 'none';

        return new Promise<NextResponse>((resolve) => {
            const child = spawn('node', [scriptPath, creatorsArg, cookieArg]);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    console.error('Script Error:', stderr);
                    resolve(NextResponse.json({ error: 'Error ejecutando el script de validación', details: stderr }, { status: 500 }));
                } else {
                    try {
                        const result = JSON.parse(stdout);
                        if (result.error) {
                            resolve(NextResponse.json({ error: result.error }, { status: 500 }));
                        } else {
                            resolve(NextResponse.json(result));
                        }
                    } catch (e) {
                        console.error('Parse Error:', e, stdout);
                        resolve(NextResponse.json({ error: 'Error analizando respuesta del script', details: stdout }, { status: 500 }));
                    }
                }
            });
        });

    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
    }
}
