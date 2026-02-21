const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sample_data.xlsx');

try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
        console.error("FAIL: Excel file is empty.");
        process.exit(1);
    }

    const firstRow = jsonData[0];
    const headers = Object.keys(firstRow);

    console.log("Headers found:", headers);

    const requiredColumns = [
        'ID del creador',
        'Nombre de usuario del creador',
        'Diamantes',
        'Duración de LIVE'
    ];

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
        console.error("FAIL: Missing columns:", missingColumns);
        process.exit(1);
    }

    console.log("SUCCESS: Sample data is compatible with the new strict parser.");

} catch (err) {
    console.error("FAIL: Error reading file:", err);
    process.exit(1);
}
