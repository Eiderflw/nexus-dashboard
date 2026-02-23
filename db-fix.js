
const { Pool } = require('pg');

const DATABASE_URL = "postgresql://postgres.kbvcpezmusipnadvcilz:Eider1993.1%40@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        console.log("Connecting directly to Supabase...");

        // Ensure column exists
        console.log("Checking schema...");
        await pool.query('ALTER TABLE licenses ADD COLUMN IF NOT EXISTS bypass_hwid BOOLEAN DEFAULT false');

        const res = await pool.query('SELECT * FROM licenses WHERE key = $1', ['EIDER-2026']);
        const eider = res.rows[0];

        if (eider) {
            console.log("Current License EIDER-2026:", JSON.stringify({ key: eider.key, bypass: eider.bypass_hwid, active: eider.active }, null, 2));
            console.log("Force fixing license EIDER-2026...");
            await pool.query('UPDATE licenses SET bypass_hwid = true, active = true, hwid = null WHERE key = $1', ['EIDER-2026']);
            console.log("SUCCESS: bypass_hwid set to true and hwid cleared for EIDER-2026.");
        } else {
            console.log("License EIDER-2026 not found in DB.");
            // Create it if it doesn't exist? Eider said he has it.
        }
    } catch (e) {
        console.error("CRITICAL DB Error:", e);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

check();
