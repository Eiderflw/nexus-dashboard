const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');

const HUB_URL = 'https://nexus-hub-3c3v.onrender.com';
const CURRENT_VERSION = '1.0.0';
const CONFIG_PATH = path.join(process.cwd(), 'config.json');
const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

// ─── 1. Get HWID (Windows UUID) ───────────────────────────────────────────────
function getHWID() {
    try {
        const output = execSync('wmic csproduct get uuid', { encoding: 'utf8' });
        return output.split('\n')[1].trim();
    } catch (e) {
        try {
            // Fallback for Windows 11 / wmic deprecated
            const output = execSync('powershell -command "(Get-WmiObject -Class Win32_ComputerSystemProduct).UUID"', { encoding: 'utf8' });
            return output.trim();
        } catch (e2) {
            return 'UNKNOWN-HWID-' + require('os').hostname();
        }
    }
}

// ─── 2. Heartbeat: pings hub every 2 mins, shuts down if kill:true ────────────
let childProcess = null;
let heartbeatTimer = null;

async function heartbeat(licenseKey, hwid) {
    try {
        const res = await axios.post(`${HUB_URL}/api/scripts/heartbeat`, {
            key: licenseKey,
            hwid: hwid
        }, { timeout: 10000 });

        if (res.data.kill === true) {
            const reason = res.data.reason || 'Sesión terminada por el administrador.';
            console.error('\n🔴 KILL-SWITCH ACTIVADO:', reason);
            console.error('   El administrador ha terminado tu sesión.');
            cleanup();
            process.exit(1);
        }
        // Heartbeat OK
        process.stdout.write('.');
    } catch (err) {
        // Network error: don't kill, just log (benefit of doubt)
        process.stdout.write('?');
    }
}

function cleanup() {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    const tempFile = path.join(process.cwd(), '.engine.tmp.js');
    if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch (_) { }
    }
    if (childProcess) {
        try { childProcess.kill('SIGTERM'); } catch (_) { }
    }
}

process.on('uncaughtException', (err) => {
    console.error('\n❌ Error interno inesperado:', err.message);
    cleanup();
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('\n❌ Falla inesperada (Promesa):', reason);
    cleanup();
    process.exit(1);
});

// ─── 3. Main ──────────────────────────────────────────────────────────────────
async function start() {
    console.log('╔══════════════════════════════════════╗');
    console.log('║     NEXUS HUNTER  —  SECURE BOOT     ║');
    console.log('╚══════════════════════════════════════╝\n');

    // Load Config
    let licenseKey = '';

    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
            licenseKey = config.licenseKey || '';
        } catch (e) { }
    }

    if (!licenseKey || licenseKey === 'PONER_TU_LLAVE_AQUI') {
        console.log('⚠ No se detectó una licencia guardada.');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        licenseKey = await new Promise(resolve => {
            rl.question('👉 Por favor, ingresa tu clave de licencia: ', ans => {
                rl.close();
                resolve(ans.trim());
            });
        });

        if (!licenseKey) {
            console.error('❌ No ingresaste ninguna licencia. Cerrando...');
            process.exit(1);
        }

        // Save it for next time
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ licenseKey }, null, 4));
        console.log('✅ Licencia guardada para futuras ejecuciones.\n');
    }

    const hwid = getHWID();
    console.log(`🔑 Licencia : ${licenseKey}`);
    console.log(`💻 Hardware : ${hwid}\n`);

    try {
        // ── Handshake & Script Download ──────────────────────────────────────
        console.log('🌐 Conectando con Nexus Hub...');
        const syncRes = await axios.post(`${HUB_URL}/api/scripts/sync`, {
            key: licenseKey,
            hwid: hwid,
            scriptName: 'check-agency.js'
        }, { timeout: 30000 });

        if (!syncRes.data.success) {
            console.error('❌ Sincronización fallida:', syncRes.data.error);
            process.exit(1);
        }

        if (syncRes.data.latestVersion && syncRes.data.latestVersion !== CURRENT_VERSION) {
            console.log('\n==================================================');
            console.log('❌ VERSIÓN OBSOLETA ❌');
            console.log('Tu versión de Nexus Hunter es demasiado antigua.');
            console.log(`Tu versión: ${CURRENT_VERSION} | Versión exigida: ${syncRes.data.latestVersion}`);
            console.log('Por favor, contacta con nosotros para recibir la actualización obligatoria.');
            console.log('==================================================\n');
            process.exit(1);
        }

        if (syncRes.data.announcement && syncRes.data.announcement.message) {
            console.log('');
            console.log('╔═════════════════════════════════════════════════╗');
            console.log('║               📰 NOVEDADES DEL HUB              ║');
            console.log('╠═════════════════════════════════════════════════╣');
            const lines = syncRes.data.announcement.message.split('\n');
            lines.forEach(line => {
                const sublines = line.match(/.{1,45}/g) || [''];
                sublines.forEach(subline => {
                    console.log(`║ ${subline.padEnd(47)} ║`);
                });
            });
            console.log('╚═════════════════════════════════════════════════╝\n');
            console.log('Iniciando sistema en 5 segundos...');
            await new Promise(r => setTimeout(r, 5000));
        }

        const scriptContent = syncRes.data.content;
        console.log(`\n✅ Sincronización OK | SCRIPT V.${new Date(syncRes.data.version).toLocaleString()}`);
        console.log('🚀 Iniciando motor de búsqueda...\n');

        // Write temp script
        const tempFile = path.join(process.cwd(), '.engine.tmp.js');
        fs.writeFileSync(tempFile, scriptContent);

        // ── Start Heartbeat ──────────────────────────────────────────────────
        console.log('💓 Heartbeat activo (cada 2 min). Ctrl+C para salir.\n');
        heartbeatTimer = setInterval(() => heartbeat(licenseKey, hwid), HEARTBEAT_INTERVAL_MS);

        // ── Launch Script ────────────────────────────────────────────────────
        const creators = process.argv[2] || '';
        childProcess = spawn('node', [tempFile, creators, 'none'], {
            stdio: 'inherit'
        });

        childProcess.on('exit', (code) => {
            console.log(`\n🏁 Motor finalizado (código: ${code}).`);
            cleanup();
            process.exit(code || 0);
        });

        // Handle Ctrl+C
        process.on('SIGINT', () => {
            console.log('\n\n🛑 Cerrando Nexus Hunter...');
            cleanup();
            process.exit(0);
        });

    } catch (error) {
        if (error.response) {
            console.error(`\n❌ Error del servidor (${error.response.status}): ${error.response.data?.error || 'Error desconocido'}`);
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error('\n❌ Sin conexión al Nexus Hub. Verifica tu internet.');
        } else {
            console.error('\n❌ Error:', error.message);
        }
        process.exit(1);
    }
}

start();
