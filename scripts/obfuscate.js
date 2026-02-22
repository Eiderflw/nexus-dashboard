const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const filesToObfuscate = [
    'scripts/check-agency.js',
    'scripts/search-lives.js'
];

const options = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    splitStrings: true,
    splitStringsChunkLength: 10,
    unicodeEscapeSequence: false
};

async function obfuscate() {
    console.log('--- Starting Obfuscation ---');

    for (const file of filesToObfuscate) {
        const filePath = path.join(process.cwd(), file);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${file}`);
            continue;
        }

        console.log(`Obfuscating: ${file}...`);
        const sourceCode = fs.readFileSync(filePath, 'utf8');
        const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, options);

        // Save as .obfuscated.js for now or overwrite?
        // Let's create a dist folder for the final build
        const distDir = path.join(process.cwd(), 'dist-scripts');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir);
        }

        const fileName = path.basename(file);
        fs.writeFileSync(path.join(distDir, fileName), obfuscationResult.getObfuscatedCode());
        console.log(`Done: dist-scripts/${fileName}`);
    }

    console.log('--- Obfuscation Complete ---');
}

obfuscate();
