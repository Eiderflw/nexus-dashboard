
import { getLicenses, saveLicenses } from './lib/license-db';

async function check() {
    console.log("Fetching licenses...");
    const licenses = await getLicenses();
    const eider = licenses.find(l => l.key === 'EIDER-2026');

    if (eider) {
        console.log("Current License EIDER-2026:", JSON.stringify(eider, null, 2));
        if (!eider.bypass_hwid) {
            console.log("Bypass HWID is FALSE. Fixing it now...");
            eider.bypass_hwid = true;
            eider.active = true;
            await saveLicenses(licenses);
            console.log("Fixed! bypass_hwid set to true.");
        } else {
            console.log("Bypass HWID is already TRUE. Investigation continues.");
        }
    } else {
        console.log("License EIDER-2026 not found in DB.");
    }
    process.exit(0);
}

check();
