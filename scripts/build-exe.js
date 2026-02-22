const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function build() {
    console.log('--- Starting Executable Build ---');

    // 1. Obfuscate first
    console.log('Step 1: Obfuscating scripts...');
    execSync('npm run obfuscate', { stdio: 'inherit' });

    // 2. Build with PKG
    // We package the dist-scripts/check-agency.js as a starting point
    console.log('Step 2: Packaging with pkg...');

    const targets = 'node18-win-x64'; // Build for Windows
    const outputPath = 'build/NexusHunter.exe';

    if (!fs.existsSync('build')) fs.mkdirSync('build');

    try {
        // We use the obfuscated version from dist-scripts
        execSync(`npx pkg dist-scripts/check-agency.js --targets ${targets} --output ${outputPath}`, { stdio: 'inherit' });
        console.log(`Success! Executable created at: ${outputPath}`);
    } catch (e) {
        console.error('Build failed:', e);
    }

    console.log('--- Build Process Complete ---');
}

build();
