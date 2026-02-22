import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { keyword, cookie } = await req.json();

        if (!keyword) {
            return NextResponse.json({ error: 'Falta la palabra clave (keyword)' }, { status: 400 });
        }

        // Opaque path resolution to bypass Turbopack static analysis
        const getPath = (d: string, f: string) => path.join(...[process.cwd(), d, f]);
        const scriptPath = getPath('scripts', 'search-lives.js');


        return new Promise<NextResponse>((resolve) => {
            const child = spawn('node', [scriptPath, keyword, cookie || '']);

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
                    console.error('Search Script Error:', stderr);
                    resolve(NextResponse.json({ error: 'Error ejecutando la búsqueda', details: stderr }, { status: 500 }));
                } else {
                    try {
                        // Robust Parsing: Look for the last valid JSON object in stdout
                        // This ignores any previous console.log noise
                        const lines = stdout.trim().split('\n');
                        let result = null;

                        // Try parsing from the last line backwards
                        for (let i = lines.length - 1; i >= 0; i--) {
                            try {
                                const potentialJson = JSON.parse(lines[i]);
                                if (potentialJson && (potentialJson.creators || potentialJson.error)) {
                                    result = potentialJson;
                                    break;
                                }
                            } catch (e) {
                                // Not JSON, continue
                            }
                        }

                        if (!result) {
                            // Fallback: try parsing the whole thing if it's a single blob
                            result = JSON.parse(stdout);
                        }

                        if (result.error) {
                            resolve(NextResponse.json({ error: result.error }, { status: 500 }));
                        } else {
                            resolve(NextResponse.json(result));
                        }
                    } catch (e) {
                        console.error('Parse Error:', e, stdout);
                        resolve(NextResponse.json({ error: 'Error analizando respuesta de búsqueda', details: stdout }, { status: 500 }));
                    }
                }
            });
        });

    } catch (error: any) {
        console.error('Search Proxy Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
    }
}
