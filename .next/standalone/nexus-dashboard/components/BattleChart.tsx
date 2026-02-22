'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Creator } from '@/types';
import { useMemo } from 'react';

interface ChartProps {
    creators: Creator[];
}

export default function BattleChart({ creators }: ChartProps) {
    const data = useMemo(() => {
        return creators
            .sort((a, b) => b.diamonds - a.diamonds)
            .slice(0, 10)
            .map(c => ({
                name: c.username.length > 10 ? c.username.substring(0, 10) + '...' : c.username,
                Battle: c.battleDiamonds || 0,
                Solo: (c.diamonds - (c.battleDiamonds || 0)) < 0 ? 0 : (c.diamonds - (c.battleDiamonds || 0)),
                fullValue: c.diamonds
            }));
    }, [creators]);

    return (
        <div className="h-[350px] w-full bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                Análisis de Batallas vs Solo
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
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
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number | undefined) => [value?.toLocaleString() || '0', 'Diamantes']}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="Solo" stackId="a" fill="#3b82f6" name="Contenido Solo" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Battle" stackId="a" fill="#f97316" name="Batallas (PK)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
