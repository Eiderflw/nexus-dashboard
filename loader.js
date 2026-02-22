const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HUB_URL = 'https://nexus-hub-3c3v.onrender.com';
const CONFIG_PATH = path.join(process.cwd(), 'config.json');

// 1. Get HWID (Windows UUID)
function getHWID() {
    try {
        const output = execSync('wmic csproduct get uuid', { encoding: 'utf8' });
        return output.split('\n')[1].trim();
    } catch (e) {
        return 'UNKNOWN-HWID-' + Date.now();
    }
}

async function start() {
    console.log('--- NEXUS HUNTER SECURE LOADER ---');

    // 2. Load Config
    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ licenseKey: 'PONER_TU_LLAVE_AQUI' }, null, 4));
        console.error('ERROR: Archivo config.json no encontrado. Se ha creado uno, por favor pon tu licencia.');
        process.exit(1);
    }

    const { licenseKey } = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    const hwid = getHWID();

    console.log(`Licencia: ${licenseKey}`);
    console.log(`Hardware ID: ${hwid}`);

    try {
        // 3. Handshake & Sync
        console.log('Sincronizando con Nexus Hub...');
        const syncRes = await axios.post(`${HUB_URL}/api/scripts/sync`, {
            key: licenseKey,
            hwid: hwid,
            scriptName: 'check-agency.js'
        });

        if (syncRes.data.success) {
            const scriptContent = syncRes.data.content;
            console.log('✅ Sincronización exitosa. Iniciando motor...');

            // 4. In-Memory Execution (using eval or temporary file)
            // For stability with complex scripts like Puppeteer, a temp file is safer
            const tempFile = path.join(process.cwd(), '.engine.tmp.js');
            fs.writeFileSync(tempFile, scriptContent);

            // Execute the scanner
            const creators = process.argv[2] || '';
            const { spawn } = require('child_process');

            const child = spawn('node', [tempFile, creators, 'none'], {
                stdio: 'inherit'
            });

            child.on('exit', () => {
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                console.log('Cierre del motor.');
            });

        } else {
            console.error('❌ Error de sincronización:', syncRes.data.error);
        }

    } catch (error) {
        if (error.response) {
            console.error(`❌ Error de sincronización (Status ${error.response.status}):`, error.response.data.error || error.response.data);
        } else {
            console.error('❌ Error de conexión:', error.message);
        }
    }
}

start();
