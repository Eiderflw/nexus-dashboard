'use client';

import {
    ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Creator } from '@/types';
import { useMemo } from 'react';

interface ChartProps {
    creators: Creator[];
}

export default function CohortChart({ creators }: ChartProps) {
    const data = useMemo(() => {
        const cohorts = {
            new: { name: 'Nuevos (<30d)', diamonds: 0, hours: 0, count: 0 },
            mid: { name: 'Establecidos (30-90d)', diamonds: 0, hours: 0, count: 0 },
            vet: { name: 'Veteranos (>90d)', diamonds: 0, hours: 0, count: 0 }
        };

        creators.forEach(c => {
            if (c.daysSinceJoin <= 30) {
                cohorts.new.diamonds += c.diamonds;
                cohorts.new.hours += c.liveHours;
                cohorts.new.count++;
            } else if (c.daysSinceJoin <= 90) {
                cohorts.mid.diamonds += c.diamonds;
                cohorts.mid.hours += c.liveHours;
                cohorts.mid.count++;
            } else {
                cohorts.vet.diamonds += c.diamonds;
                cohorts.vet.hours += c.liveHours;
                cohorts.vet.count++;
            }
        });

        const format = (cohort: any) => ({
            name: cohort.name,
            avgDiamonds: cohort.count ? Math.round(cohort.diamonds / cohort.count) : 0,
            avgHours: cohort.count ? Number((cohort.hours / cohort.count).toFixed(1)) : 0,
            count: cohort.count
        });

        return [format(cohorts.new), format(cohorts.mid), format(cohorts.vet)];
    }, [creators]);

    return (
        <div className="h-[350px] w-full bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                Análisis de Rendimiento por Antigüedad
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        unit="h"
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number | undefined, name: string | undefined) => [
                            value?.toLocaleString() || '0',
                            name === 'avgDiamonds' ? 'Promedio Diamantes' : 'Promedio Horas'
                        ]}
                    />
                    <Legend iconType="circle" />
                    <Bar yAxisId="left" dataKey="avgDiamonds" fill="#8b5cf6" name="Promedio Diamantes" barSize={40} radius={[8, 8, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="avgHours" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name="Promedio Horas" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
