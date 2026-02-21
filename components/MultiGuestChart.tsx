'use client';

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Creator } from '@/types';
import { useMemo } from 'react';

interface ChartProps {
    creators: Creator[];
}

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f97316'];

export default function MultiGuestChart({ creators }: ChartProps) {
    const data = useMemo(() => {
        let totalBattle = 0;
        let totalMultiHost = 0;
        let totalMultiGuest = 0;
        let totalSolo = 0;

        creators.forEach(c => {
            totalBattle += c.battleDiamonds || 0;
            totalMultiHost += c.multiGuestHostDiamonds || 0;
            totalMultiGuest += c.multiGuestGuestDiamonds || 0;

            // Derive Solo
            const nonSolo = (c.battleDiamonds || 0) + (c.multiGuestDiamonds || 0);
            const solo = c.diamonds - nonSolo;
            totalSolo += solo > 0 ? solo : 0;
        });

        return [
            { name: 'Solo Content', value: totalSolo },
            { name: 'Multi-Guest (Host)', value: totalMultiHost },
            { name: 'Multi-Guest (Guest)', value: totalMultiGuest },
            { name: 'PK Battles', value: totalBattle },
        ].filter(d => d.value > 0);
    }, [creators]);

    return (
        <div className="h-[350px] w-full bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Distribución de Ingresos
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number | undefined) => value?.toLocaleString() || '0'}
                    />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
