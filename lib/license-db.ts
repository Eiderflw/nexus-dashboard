import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const DATA_DIR = process.env.DATA_DIR || process.cwd();
const DB_PATH = path.join(DATA_DIR, 'nexus-licenses.json');
const DATABASE_URL = process.env.DATABASE_URL;

export interface License {
    key: string;
    expires_at: string;
    active: boolean;
    reason?: string;
    note?: string;
    last_seen?: string;
    hwid?: string;
}

// PostgreSQL Pool (only initialized if DATABASE_URL is present)
let pool: Pool | null = null;
if (DATABASE_URL) {
    pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });
}

export const getLicenses = async (): Promise<License[]> => {
    if (pool) {
        try {
            const res = await pool.query('SELECT * FROM licenses');
            return res.rows;
        } catch (e) {
            console.error('Error fetching from PG:', e);
            // Fallback to empty or throw error? For now, empty list.
            return [];
        }
    }

    // Local JSON Fallback
    if (!fs.existsSync(DB_PATH)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading license DB:', e);
        return [];
    }
};

export const saveLicenses = async (licenses: License[]) => {
    if (pool) {
        try {
            // Very simple sync for now: Clear and re-insert all
            // In a real app we'd do incremental updates, but this matches the JSON logic
            await pool.query('BEGIN');
            await pool.query('DELETE FROM licenses');
            for (const lic of licenses) {
                await pool.query(
                    'INSERT INTO licenses (key, expires_at, active, reason, note, last_seen, hwid) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [lic.key, lic.expires_at, lic.active, lic.reason || '', lic.note || '', lic.last_seen || '', lic.hwid || '']
                );
            }
            await pool.query('COMMIT');
        } catch (e) {
            await pool.query('ROLLBACK');
            console.error('Error saving to PG:', e);
        }
        return;
    }

    // Local JSON Fallback
    try {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(licenses, null, 2));
    } catch (e) {
        console.error('Error saving license DB:', e);
    }
};

// Helper to create the table if it doesn't exist (only for Supabase)
export const initDb = async () => {
    if (pool) {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS licenses (
                key TEXT PRIMARY KEY,
                expires_at TEXT NOT NULL,
                active BOOLEAN NOT NULL,
                reason TEXT,
                note TEXT,
                last_seen TEXT,
                hwid TEXT
            )
        `);
    }
};
