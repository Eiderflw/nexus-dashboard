const XLSX = require('xlsx');
const path = require('path');

const targetFile = process.argv[2];

if (!targetFile) {
    console.error("Usage: node read-excel-headers.js <path-to-excel>");
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(targetFile);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Get JSON with header:1 to get array of arrays
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log(`Sheet Name: ${sheetName}`);
    console.log(`Total Rows: ${json.length}`);

    if (json.length > 0) {
        console.log('\n--- HEADERS ---');
        json[0].forEach((h, i) => console.log(`[${i}] ${h}`));
    }

    if (json.length > 1) {
        console.log('\n--- ROW 1 SAMPLE ---');
        json[1].forEach((d, i) => console.log(`[${i}] ${d}`));
    }
} catch (e) {
    console.error('Error:', e.message);
}
