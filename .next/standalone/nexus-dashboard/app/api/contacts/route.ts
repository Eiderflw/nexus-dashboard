import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json');

export async function POST(request: Request) {
    try {
        const { creatorId, whatsapp } = await request.json();

        // Ensure directory exists
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Read existing data
        let data: Record<string, string> = {};
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf-8');
            try {
                data = JSON.parse(content);
            } catch (e) {
                console.error("Error parsing contacts.json", e);
            }
        }

        // Update data
        data[creatorId] = whatsapp;

        // Write back
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, allContacts: data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save contact' }, { status: 500 });
    }
}

export async function GET() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json({});
        }
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(content);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({});
    }
}
