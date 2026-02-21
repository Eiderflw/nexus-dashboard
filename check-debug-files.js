const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.startsWith('debug_response_') && f.endsWith('.json'));

console.log(`Checking ${files.length} files...`);

for (const file of files) {
    try {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const json = JSON.parse(content);
        const items = json.data?.anchorAnalysisDataInfos || [];

        if (items.length === 0) {
            console.log(`File ${file}: 0 items.`);
            continue;
        }

        let missingCount = 0;
        let keysOfbadItem = [];

        for (const item of items) {
            if (!item.user_base_info || !item.user_base_info.user_id) {
                missingCount++;
                keysOfbadItem = Object.keys(item);
            }
        }

        if (missingCount > 0) {
            console.log(`[FAIL] File ${file}: ${missingCount}/${items.length} items missing UID.`);
            console.log(`       Keys of bad item: ${keysOfbadItem.join(', ')}`);
        } else {
            console.log(`[PASS] File ${file}: ${items.length} items. All good.`);
        }

    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
}
