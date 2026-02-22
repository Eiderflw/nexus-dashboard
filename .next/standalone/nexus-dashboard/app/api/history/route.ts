import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Creator } from '@/types';
import { HistorySnapshot, getSnapshotKey } from '@/lib/history';

const HISTORY_DIR = path.join(process.cwd(), 'data', 'history');

// Ensure directory exists
if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { creators, date } = body; // date is optional override

        if (!creators || !Array.isArray(creators)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const snapshotDate = date || getSnapshotKey();
        const filePath = path.join(HISTORY_DIR, `${snapshotDate}.json`);

        const snapshot: HistorySnapshot = {
            date: snapshotDate,
            timestamp: Date.now(),
            creators: creators as Creator[],
            metrics: {
                totalDiamonds: creators.reduce((sum: number, c: any) => sum + (c.diamonds || 0), 0),
                totalHours: creators.reduce((sum: number, c: any) => sum + (c.liveHours || 0), 0),
                activeCreators: creators.filter((c: any) => c.validDays > 0).length
            }
        };

        fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));

        return NextResponse.json({ success: true, date: snapshotDate });
    } catch (err) {
        console.error('Failed to save snapshot:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (date) {
            // Get specific snapshot
            const filePath = path.join(HISTORY_DIR, `${date}.json`);
            if (!fs.existsSync(filePath)) {
                return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
            }
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return NextResponse.json(JSON.parse(fileContent));
        } else {
            // List all snapshots
            const files = fs.readdirSync(HISTORY_DIR)
                .filter(f => f.endsWith('.json'))
                .sort()
                .reverse(); // Newest first

            const snapshots = files.map(f => {
                const content = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, f), 'utf-8'));
                return {
                    date: content.date,
                    timestamp: content.timestamp,
                    metrics: content.metrics
                };
            });

            return NextResponse.json({ snapshots });
        }
    } catch (err) {
        console.error('Failed to list snapshots:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
