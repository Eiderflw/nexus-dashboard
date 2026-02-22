'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Creator } from '@/types';
import { useMemo } from 'react';

// For simplicity in MVP, we might aggregate data or just show individual bars for top creators
// Ideally we show daily trends if data supported it, but our store is current snapshot.
// So we compare Categories or Top Creators.

interface ChartProps {
    creators: Creator[];
    metric: 'diamonds' | 'liveHours';
}

export default function TopPerformersChart({ creators, metric }: ChartProps) {
    const data = useMemo(() => {
        return creators
            .sort((a, b) => b[metric] - a[metric])
            .slice(0, 10)
            .map(c => ({
                name: c.username.length > 10 ? c.username.substring(0, 10) + '...' : c.username,
                value: c[metric],
                fullValue: c[metric]
            }));
    }, [creators, metric]);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        itemStyle={{ color: '#38bdf8' }}
                        formatter={(value: number | undefined) => [value?.toLocaleString() || '0', metric === 'diamonds' ? 'Diamantes' : 'Horas']}
                    />
                    <Bar
                        dataKey="value"
                        fill="url(#colorGradient)"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                    />
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
