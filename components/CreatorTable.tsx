'use client';

import { Creator } from '@/types';
import { useState } from 'react';
import { ArrowUp, ArrowDown, Search, CheckCircle2, AlertTriangle, TrendingDown, Copy, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAiAdvice } from '@/lib/analysis';

// ─── Avatar Component ─────────────────────────────────────────────────────────
function CreatorAvatar({ url, name, size = 'md' }: { url?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);

    // Initials logic
    const initials = name ? name.substring(0, 2).toUpperCase() : '??';

    // Size classes
    const sizeClasses = {
        sm: 'w-6 h-6 text-[9px]',
        md: 'w-8 h-8 text-[10px]',
        lg: 'w-10 h-10 text-xs',
        xl: 'w-12 h-12 text-sm'
    };
    const sClass = sizeClasses[size];

    // Determine initial source (Local > Remote)
    // Format: /foto_perfil/[username].jpg
    const localPath = `/foto_perfil/${name}.jpg`;

    if (error) {
        return (
            <div className={`${sClass} rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300 shrink-0 select-none`}>
                {initials}
            </div>
        );
    }

    return (
        <div className={`${sClass} rounded-full bg-slate-800 border border-slate-600 overflow-hidden shrink-0`}>
            <img
                src={imageSrc || localPath}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Try local -> then remote -> then error
                    if (imageSrc === localPath || !imageSrc) {
                        if (url && url !== localPath) {
                            setImageSrc(url);
                        } else {
                            setError(true);
                        }
                    } else {
                        // If remote fails too
                        setError(true);
                    }
                }}
            />
        </div>
    );
}

export default function CreatorTable({ creators }: { creators: Creator[] }) {
    const [sortField, setSortField] = useState<keyof Creator | 'tier'>('tier');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Tier 0 (Green) first
    const [filter, setFilter] = useState('');

    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedProgress = Math.round((currentDay / daysInMonth) * 100);

    // Helper to determine Tier (0=Green, 1=Yellow, 2=Red)
    const getTier = (c: Creator) => {
        const achieved = (c.diamondsAchieved || 0) * 100;
        const trend = (c.diamondsGrowth || 0) * 100;

        // Green: Above expected progress OR crushing it daily (>50% growth)
        if (achieved >= expectedProgress || trend > 50) return 0;

        // Red: Way behind schedule (<70% of expected) AND not recovering daily
        if (achieved < expectedProgress * 0.7 && trend < 0) return 2;

        // Yellow: Everything else (Average/Warning)
        return 1;
    };

    const sortedCreators = [...creators]
        .filter(c => c.username.toLowerCase().includes(filter.toLowerCase()) || c.creatorId.includes(filter))
        .map(c => ({ ...c, tier: getTier(c) })) // Attach tier for sorting
        .sort((a, b) => {
            // Primary Sort: Tier
            if (sortField === 'tier') {
                const tierDiff = a.tier - b.tier;
                if (tierDiff !== 0) return sortOrder === 'asc' ? tierDiff : -tierDiff;
                // Secondary Sort: Diamonds (always Descending for same tier)
                return b.diamonds - a.diamonds;
            }

            // Standard Sort
            const valA = a[sortField as keyof Creator];
            const valB = b[sortField as keyof Creator];

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortOrder === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        });

    const handleSort = (field: any) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleCopyAdvice = (creator: Creator) => {
        const msg = generateAiAdvice(creator);
        navigator.clipboard.writeText(msg);
        alert(`Plan copiado para ${creator.username}`);
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-white">Estado de Agencia (Tier View)</h3>
                    <div className="flex gap-2 text-[10px] items-center bg-black/30 p-1 rounded-lg border border-slate-800">
                        <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded"><CheckCircle2 className="w-3 h-3" /> Top</span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded"><AlertTriangle className="w-3 h-3" /> Medio</span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 rounded"><TrendingDown className="w-3 h-3" /> Riesgo</span>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-nexus-500 outline-none w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800/50 text-slate-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-3 cursor-pointer hover:text-white" onClick={() => handleSort('tier')}>Estado</th>
                            <th className="px-6 py-3 cursor-pointer hover:text-white" onClick={() => handleSort('username')}>Creador</th>
                            <th className="px-6 py-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('diamonds')}>Diamantes</th>
                            <th className="px-6 py-3 cursor-pointer hover:text-white text-center" onClick={() => handleSort('diamondsAchieved')}>Progreso Mensual</th>
                            <th className="px-6 py-3 cursor-pointer hover:text-white text-center" onClick={() => handleSort('diamondsGrowth')}>Tendencia Diaria</th>
                            <th className="px-6 py-3">Acción IA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {sortedCreators.map((creator) => {
                            const tier = creator.tier;

                            // Progreso Mensual (Goal vs Last Month)
                            const goalBase = creator.lastMonthDiamonds || 1;
                            const goalProgress = (creator.diamonds / goalBase) * 100;
                            const achieved = Math.round(goalProgress);

                            // Tendencia Diaria (Pace)
                            // Use the new diamondsDailyTrend if available, otherwise fallback to general growth
                            const dailyTrend = Math.round((creator.diamondsDailyTrend || creator.diamondsGrowth || 0) * 100);
                            const isPositiveTrend = dailyTrend >= 0;

                            // Dynamic Styling based on Tier
                            let rowClass = "hover:bg-slate-800/50 transition-colors group border-l-2";
                            let statusColor = "";
                            let TierIcon = CheckCircle2;

                            if (tier === 0) {
                                rowClass += " border-l-emerald-500 bg-emerald-950/5";
                                statusColor = "text-emerald-400";
                                TierIcon = CheckCircle2;
                            } else if (tier === 1) {
                                rowClass += " border-l-yellow-500 bg-yellow-950/5";
                                statusColor = "text-yellow-400";
                                TierIcon = AlertTriangle;
                            } else {
                                rowClass += " border-l-red-500 bg-red-950/10";
                                statusColor = "text-red-400";
                                TierIcon = TrendingDown;
                            }

                            return (
                                <tr key={creator.creatorId} className={rowClass}>
                                    <td className="px-6 py-4">
                                        <div className={`p-2 rounded-full w-fit ${tier === 0 ? 'bg-emerald-500/10 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : tier === 1 ? 'bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.4)]'}`}>
                                            <TierIcon className={`w-4 h-4 ${statusColor}`} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <CreatorAvatar url={creator.avatar} name={creator.username} size="lg" />
                                        <div>
                                            <div className="font-bold">{creator.username}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">ID: {creator.creatorId}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-white font-bold">
                                        {creator.diamonds.toLocaleString()}
                                        <div className="text-[10px] text-slate-500 font-normal">
                                            vs {creator.lastMonthDiamonds?.toLocaleString() || '0'} (Mes Pasado)
                                        </div>
                                    </td>

                                    {/* Progreso Mensual (Vs Last Month Total) */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                                                <div
                                                    className={`h-full ${achieved >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${Math.min(100, achieved)}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-bold ${achieved >= 100 ? 'text-emerald-400' : 'text-blue-400'}`}>
                                                {achieved}% <span className="text-slate-500 font-normal">de Meta</span>
                                            </span>
                                        </div>
                                    </td>

                                    {/* Tendencia Diaria (Pace) */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "px-2 py-1 rounded-md text-xs font-bold border",
                                            isPositiveTrend
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {isPositiveTrend ? '+' : ''}{dailyTrend}%
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleCopyAdvice(creator)}
                                            className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                                        >
                                            <MessageCircle className="w-3 h-3" /> Ver Plan
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
