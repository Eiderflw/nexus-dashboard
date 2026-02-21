const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const downloadsDir = path.join(process.cwd(), 'downloads');
const files = fs.readdirSync(downloadsDir).filter(f => f.endsWith('.xlsx'));
if (files.length === 0) {
    console.error('No Excel files found in downloads/');
    process.exit(1);
}

const latestFile = path.join(downloadsDir, files.sort((a, b) => fs.statSync(path.join(downloadsDir, b)).mtimeMs - fs.statSync(path.join(downloadsDir, a)).mtimeMs)[0]);
console.log('Inspecting file:', latestFile);

const workbook = xlsx.some_internal_read_logic; // Wait, I'll use standard xlsx read
const wb = xlsx.readFile(latestFile);
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const json = xlsx.utils.sheet_to_json(sheet);

if (json.length > 0) {
    console.log('--- HEADERS ---');
    console.log(Object.keys(json[0]));
    console.log('--- SAMPLE ROW ---');
    console.log(JSON.stringify(json[0], null, 2));

    // Calculate sum of all likely diamond columns
    let sumDiamantes = 0;
    let sumTotal = 0;
    json.forEach(row => {
        sumDiamantes += Number(row['Diamantes'] || 0);
        // Look for other columns
        Object.keys(row).forEach(key => {
            if (key.toLowerCase().includes('total') && key.toLowerCase().includes('diamante')) {
                sumTotal += Number(row[key] || 0);
            }
        });
    });
    console.log('--- SUMS ---');
    console.log('Sum of "Diamantes":', sumDiamantes);
    console.log('Sum of potential "Total Diamonds":', sumTotal);
}
