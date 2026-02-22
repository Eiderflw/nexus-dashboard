import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { username, cookie } = await req.json();

        if (!username) {
            return NextResponse.json({ error: 'Falta el nombre de usuario (username)' }, { status: 400 });
        }

        // Opaque path resolution to bypass Turbopack static analysis
        const getPath = (d: string, f: string) => path.join(...[process.cwd(), d, f]);
        const scriptPath = getPath('scripts', 'get-account-region.js');

        return new Promise<NextResponse>((resolve) => {
            const child = spawn('node', [scriptPath, username, cookie || '']);

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
                    console.error('Region Script Error:', stderr);
                    resolve(NextResponse.json({ error: 'Error obteniendo la región', details: stderr }, { status: 500 }));
                } else {
                    try {
                        // Robust Parsing: Look for the last valid JSON object in stdout
                        const lines = stdout.trim().split('\n');
                        let result = null;

                        for (let i = lines.length - 1; i >= 0; i--) {
                            try {
                                const potentialJson = JSON.parse(lines[i]);
                                if (potentialJson && (potentialJson.region || potentialJson.error)) {
                                    result = potentialJson;
                                    break;
                                }
                            } catch (e) { }
                        }

                        if (!result) result = JSON.parse(stdout);

                        if (result.error) {
                            resolve(NextResponse.json({ error: result.error }, { status: 500 }));
                        } else {
                            resolve(NextResponse.json(result));
                        }
                    } catch (e) {
                        console.error('Parse Error:', e, stdout);
                        resolve(NextResponse.json({ error: 'Error analizando respuesta de región', details: stdout }, { status: 500 }));
                    }
                }
            });
        });

    } catch (error: any) {
        console.error('Region Proxy Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
    }
}
