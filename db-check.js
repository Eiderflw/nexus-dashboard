
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        console.log("Connecting to DB...");
        const res = await pool.query('SELECT * FROM licenses WHERE key = $1', ['EIDER-2026']);
        const eider = res.rows[0];

        if (eider) {
            console.log("Current License EIDER-2026:", JSON.stringify(eider, null, 2));
            if (!eider.bypass_hwid) {
                console.log("Bypass HWID is FALSE. Fixing it now...");
                await pool.query('UPDATE licenses SET bypass_hwid = true, active = true WHERE key = $1', ['EIDER-2026']);
                console.log("Fixed! bypass_hwid set to true.");
            } else {
                console.log("Bypass HWID is already TRUE.");
            }
        } else {
            console.log("License EIDER-2026 not found in DB.");
        }
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

check();
