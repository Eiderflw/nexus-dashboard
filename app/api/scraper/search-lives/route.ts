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
                const stdoutTrimmed = stdout.trim();
                const stderrTrimmed = stderr.trim();

                if (code !== 0) {
                    console.error('Search Script Error (exit code ' + code + '):', stderrTrimmed);
                    // Extract last meaningful error line from stderr
                    const errLines = stderrTrimmed.split('\n').filter(l => l.trim());
                    const lastErr = errLines[errLines.length - 1] || 'Error desconocido';
                    resolve(NextResponse.json({
                        error: 'Error ejecutando el escáner',
                        details: lastErr
                    }, { status: 500 }));
                    return;
                }

                // Script exited 0 but stdout is empty – crash mid-run
                if (!stdoutTrimmed) {
                    console.error('Search Script: empty stdout. stderr=', stderrTrimmed.slice(0, 500));
                    resolve(NextResponse.json({
                        error: 'El escáner terminó sin resultados. Verifica la cookie de sesión de TikTok e intenta de nuevo.',
                        details: stderrTrimmed.slice(0, 300)
                    }, { status: 500 }));
                    return;
                }

                try {
                    // Robust Parsing: Look for the last valid JSON object in stdout
                    // This ignores any previous console.log noise
                    const lines = stdoutTrimmed.split('\n');
                    let result = null;

                    // Try parsing from the last line backwards
                    for (let i = lines.length - 1; i >= 0; i--) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        try {
                            const potentialJson = JSON.parse(line);
                            if (potentialJson && (potentialJson.creators !== undefined || potentialJson.error)) {
                                result = potentialJson;
                                break;
                            }
                        } catch (e) {
                            // Not JSON, continue
                        }
                    }

                    if (!result) {
                        // Last resort: try parsing the whole stdout blob
                        result = JSON.parse(stdoutTrimmed);
                    }

                    if (result.error) {
                        resolve(NextResponse.json({ error: result.error }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json(result));
                    }
                } catch (e) {
                    console.error('Parse Error:', e, stdoutTrimmed.slice(0, 200));
                    resolve(NextResponse.json({
                        error: 'Error analizando respuesta de búsqueda',
                        details: stdoutTrimmed.slice(0, 500)
                    }, { status: 500 }));
                }
            });
        });

    } catch (error: any) {
        console.error('Search Proxy Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
    }
}
