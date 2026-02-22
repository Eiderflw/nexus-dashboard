require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        const dateStr = expires.toISOString();

        await pool.query(`
            CREATE TABLE IF NOT EXISTS licenses (
                key TEXT PRIMARY KEY,
                expires_at TEXT,
                active BOOLEAN,
                reason TEXT,
                note TEXT,
                last_seen TEXT,
                hwid TEXT,
                killed BOOLEAN DEFAULT false
            )
        `);

        await pool.query(
            'INSERT INTO licenses (key, expires_at, active, note) VALUES ($1, $2, $3, $4) ON CONFLICT (key) DO UPDATE SET active=true, hwid=NULL, killed=false, expires_at=$2 RETURNING *',
            ['TEST-KEY-1234', dateStr, true, 'Test DB License']
        );
        console.log('Test license injected!');
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
main();
