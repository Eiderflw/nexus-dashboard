import { Creator } from '@/types';

export interface HistorySnapshot {
    date: string; // YYYY-MM-DD
    timestamp: number;
    creators: Creator[];
    metrics: {
        totalDiamonds: number;
        totalHours: number;
        activeCreators: number;
    };
}

export interface ComparisonResult {
    dateA: string;
    dateB: string;
    newCreators: Creator[];
    lostCreators: Creator[]; // Present in A but not B
    growth: {
        creatorId: string;
        username: string;
        diamondDelta: number;
        hourDelta: number;
    }[];
}

// Helper to generate a standardized date key
export const getSnapshotKey = (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0];
};

// Logic to compare two lists of creators
export const compareSnapshots = (prev: Creator[], current: Creator[]): ComparisonResult => {
    const prevMap = new Map(prev.map(c => [c.creatorId, c]));
    const currMap = new Map(current.map(c => [c.creatorId, c]));

    const newCreators = current.filter(c => !prevMap.has(c.creatorId));
    const lostCreators = prev.filter(c => !currMap.has(c.creatorId));

    const growth = current
        .filter(c => prevMap.has(c.creatorId))
        .map(curr => {
            const prev = prevMap.get(curr.creatorId)!;
            return {
                creatorId: curr.creatorId,
                username: curr.username,
                diamondDelta: curr.diamonds - prev.diamonds,
                hourDelta: curr.liveHours - prev.liveHours
            };
        })
        .sort((a, b) => b.diamondDelta - a.diamondDelta); // Biggest winners first

    return {
        dateA: 'Previous',
        dateB: 'Current',
        newCreators,
        lostCreators,
        growth
    };
};
