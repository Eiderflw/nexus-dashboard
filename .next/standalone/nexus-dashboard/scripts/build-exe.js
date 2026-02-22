const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function build() {
    console.log('--- Construyendo Nexus Hunter EXE ---');

    const buildDir = path.join(process.cwd(), 'build');
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

    try {
        console.log('1. Empaquetando Secure Loader (NexusHunter.exe)...');
        // Usamos pkg para convertir el loader en un binario de Windows
        execSync('npx pkg loader.js --targets node18-win-x64 --output build/NexusHunter.exe', { stdio: 'inherit' });

        console.log('\n✅ ÉXITO: build/NexusHunter.exe generado.');
        console.log('Instrucciones: Entrega este archivo junto con un config.json a la agencia.');

    } catch (e) {
        console.error('❌ Error en la construcción:', e);
    }
}

build();
