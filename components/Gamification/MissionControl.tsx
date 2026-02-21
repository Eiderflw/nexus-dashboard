'use client';

import { useMemo } from 'react';
import { Creator } from '@/types';
import { Mission } from '@/types/gamification';
import { CheckCircle2, Circle, Clock, Diamond, Calendar, Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── 1. Define Missions (These would ideally come from a DB, but static is fine for now) ───
const MISSIONS: Mission[] = [
    {
        id: 'beginner_streaming',
        title: 'Iniciación al Stream',
        description: 'Transmite tus primeras 15 horas en el mes.',
        icon: 'clock',
        targetType: 'hours',
        targetValue: 15,
        reward: 'Insignia Novato',
        xp: 100,
        color: 'text-blue-400'
    },
    {
        id: 'diamond_hunter',
        title: 'Cazador de Diamantes',
        description: 'Consigue 50,000 diamantes acumulados.',
        icon: 'diamond',
        targetType: 'diamonds',
        targetValue: 50000,
        reward: 'Bono Visibilidad',
        xp: 250,
        color: 'text-cyan-400'
    },
    {
        id: 'consistency_king',
        title: 'Rey de la Constancia',
        description: 'Transmite al menos 20 días válidos este mes.',
        icon: 'calendar',
        targetType: 'days',
        targetValue: 20,
        reward: 'Insignia Elite',
        xp: 500,
        color: 'text-purple-400'
    },
    {
        id: 'pro_league',
        title: 'Liga Profesional',
        description: 'Alcanza 200,000 diamantes. ¡El gran salto!',
        icon: 'trophy',
        targetType: 'diamonds',
        targetValue: 200000,
        reward: 'Acceso a Torneos',
        xp: 1000,
        color: 'text-yellow-400'
    }
];

// ─── 2. Component Logic ───
export default function MissionControl({ creators }: { creators: Creator[] }) {

    // Calculate stats for all creators against all missions
    const missionStats = useMemo(() => {
        return MISSIONS.map(mission => {
            const completedCreators = creators.filter(c => {
                if (mission.targetType === 'diamonds') return c.diamonds >= mission.targetValue;
                if (mission.targetType === 'hours') return c.liveHours >= mission.targetValue;
                if (mission.targetType === 'days') return c.validDays >= mission.targetValue;
                return false;
            });

            return {
                ...mission,
                completedCount: completedCreators.length,
                totalCreators: creators.length,
                progressPercent: (completedCreators.length / creators.length) * 100,
                topPerformers: completedCreators.slice(0, 3) // Top 3 faces
            };
        });
    }, [creators]);

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Misiones Activas de la Agencia
                </h3>
                <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    Mes en curso
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missionStats.map((m) => (
                    <MissionCard key={m.id} missionStat={m} />
                ))}
            </div>
        </div>
    );
}

// ─── 3. Sub-component: Mission Card ───
function MissionCard({ missionStat }: { missionStat: any }) {
    const Icon = missionStat.icon === 'clock' ? Clock : missionStat.icon === 'diamond' ? Diamond : missionStat.icon === 'calendar' ? Calendar : Trophy;

    return (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 transition-all group relative overflow-hidden">
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    style={{ width: `${missionStat.progressPercent}%` }}
                />
            </div>

            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-slate-900 border border-slate-700 ${missionStat.color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">{missionStat.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{missionStat.description}</p>

                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded">
                                {missionStat.xp} XP
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {missionStat.reward}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-black text-white">{missionStat.completedCount}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Completado</p>
                </div>
            </div>

            {/* Top Performers Preview */}
            {missionStat.topPerformers.length > 0 && (
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-700/30">
                    <div className="flex -space-x-2">
                        {missionStat.topPerformers.map((c: Creator) => (
                            <img
                                key={c.creatorId}
                                src={c.avatar || '/default-user.png'}
                                alt={c.username}
                                className="w-6 h-6 rounded-full border border-slate-800 object-cover"
                                onError={(e) => e.currentTarget.src = '/default-user.png'}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-500">
                        y {Math.max(0, missionStat.completedCount - 3)} más...
                    </span>
                </div>
            )}
        </div>
    );
}

// Helper icons
import { Target } from 'lucide-react';
