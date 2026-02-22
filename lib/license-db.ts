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
    killed?: boolean;
    bypass_hwid?: boolean;
}

export interface Script {
    name: string;
    content: string;
    updated_at: string;
}

export interface Setting {
    key: string;
    value: string;
    expires_at?: string;
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
            return res.rows.map(r => ({
                key: r.key || '',
                expires_at: r.expires_at || '',
                active: r.active !== false,
                reason: r.reason || '',
                note: r.note || '',
                last_seen: r.last_seen || '',
                hwid: r.hwid || '',
                killed: r.killed || false,
                bypass_hwid: r.bypass_hwid || false
            }));
        } catch (e) {
            console.error('Error fetching from PG:', e);
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
            await pool.query('BEGIN');

            // Delete licenses that are no longer in the array
            if (licenses.length > 0) {
                const keys = licenses.map(l => l.key);
                await pool.query('DELETE FROM licenses WHERE key != ALL($1)', [keys]);
            } else {
                await pool.query('DELETE FROM licenses');
            }

            for (const lic of licenses) {
                if (!lic.key) continue;
                await pool.query(
                    `INSERT INTO licenses (key, expires_at, active, reason, note, last_seen, hwid, killed, bypass_hwid) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                     ON CONFLICT (key) DO UPDATE SET 
                        expires_at = EXCLUDED.expires_at,
                        active = EXCLUDED.active,
                        reason = EXCLUDED.reason,
                        note = EXCLUDED.note,
                        last_seen = EXCLUDED.last_seen,
                        hwid = EXCLUDED.hwid,
                        killed = EXCLUDED.killed,
                        bypass_hwid = EXCLUDED.bypass_hwid`,
                    [lic.key, lic.expires_at || '', lic.active !== false, lic.reason || '', lic.note || '', lic.last_seen || '', lic.hwid || '', lic.killed || false, lic.bypass_hwid || false]
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
                hwid TEXT,
                killed BOOLEAN DEFAULT false,
                bypass_hwid BOOLEAN DEFAULT false
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS scripts (
                name TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                expires_at TEXT
            )
        `);
        // Add killed column if it doesn't exist (for existing DBs)
        try {
            await pool.query(`ALTER TABLE licenses ADD COLUMN IF NOT EXISTS killed BOOLEAN DEFAULT false`);
        } catch (_) { }
        try {
            await pool.query(`ALTER TABLE licenses ADD COLUMN IF NOT EXISTS bypass_hwid BOOLEAN DEFAULT false`);
        } catch (_) { }
    }
};

// ── Settings ──
export const getSettings = async (): Promise<Setting[]> => {
    if (pool) {
        try {
            const res = await pool.query('SELECT * FROM settings');
            return res.rows;
        } catch (e) {
            console.error('Error fetching settings from PG:', e);
            return [];
        }
    }
    return [];
};

export const saveSetting = async (key: string, value: string, expires_at: string | null = null): Promise<void> => {
    if (pool) {
        try {
            await pool.query(
                `INSERT INTO settings (key, value, expires_at) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT (key) DO UPDATE SET 
                 value = EXCLUDED.value, 
                 expires_at = EXCLUDED.expires_at`,
                [key, value, expires_at || '']
            );
        } catch (e) {
            console.error('Error saving setting to PG:', e);
        }
    }
};

export const getScript = async (name: string): Promise<Script | null> => {
    if (pool) {
        try {
            const res = await pool.query('SELECT * FROM scripts WHERE name = $1', [name]);
            return res.rows[0] || null;
        } catch (e) {
            console.error('Error fetching script from PG:', e);
            return null;
        }
    }
    // Local JSON Fallback: read from scripts/ directory
    const scriptPath = path.join(process.cwd(), 'dist-scripts', name) || path.join(process.cwd(), 'scripts', name);
    const paths = [
        path.join(process.cwd(), 'dist-scripts', name),
        path.join(process.cwd(), 'scripts', name)
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) {
            return { name, content: fs.readFileSync(p, 'utf-8'), updated_at: new Date().toISOString() };
        }
    }
    return null;
};

export const saveScript = async (name: string, content: string): Promise<void> => {
    const updated_at = new Date().toISOString();
    if (pool) {
        try {
            await pool.query(
                'INSERT INTO scripts (name, content, updated_at) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET content = $2, updated_at = $3',
                [name, content, updated_at]
            );
        } catch (e) {
            console.error('Error saving script to PG:', e);
        }
        return;
    }
    // Local fallback: save to dist-scripts/
    const dir = path.join(process.cwd(), 'dist-scripts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
};
