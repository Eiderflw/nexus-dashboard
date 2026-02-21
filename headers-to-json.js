const XLSX = require('xlsx');
const fs = require('fs');

const targetFile = process.argv[2];

if (!targetFile) {
    console.error("Usage: node headers-to-json.js <path-to-excel>");
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(targetFile);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (json.length > 0) {
        fs.writeFileSync('headers.json', JSON.stringify(json[0], null, 2));
        console.log("Headers saved to headers.json");
    } else {
        console.log("Empty sheet");
    }
} catch (e) {
    console.error('Error:', e.message);
}
