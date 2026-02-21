'use client';

import { useMemo, useState } from 'react';
import { Creator } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Crown, Shield, ChevronDown, ChevronUp, Lock } from 'lucide-react';

// League Configuration
const LEAGUES = [
    {
        id: 'diamond',
        name: 'LEAGUE DIAMANTE',
        minDiamonds: 200000,
        icon: <Crown className="w-6 h-6" />,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/50',
        bgGradient: 'from-cyan-900/50 to-blue-900/10',
        badgeColor: 'bg-cyan-500/20 text-cyan-300'
    },
    {
        id: 'gold',
        name: 'LEAGUE ORO',
        minDiamonds: 50000,
        icon: <Trophy className="w-6 h-6" />,
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500/50',
        bgGradient: 'from-yellow-900/50 to-orange-900/10',
        badgeColor: 'bg-yellow-500/20 text-yellow-300'
    },
    {
        id: 'silver',
        name: 'LEAGUE PLATA',
        minDiamonds: 10000,
        icon: <Medal className="w-6 h-6" />,
        color: 'text-slate-300',
        borderColor: 'border-slate-400/50',
        bgGradient: 'from-slate-800/80 to-slate-900/10',
        badgeColor: 'bg-slate-500/20 text-slate-300'
    },
    {
        id: 'bronze',
        name: 'LEAGUE BRONCE',
        minDiamonds: 0,
        icon: <Shield className="w-6 h-6" />,
        color: 'text-orange-400',
        borderColor: 'border-orange-600/50',
        bgGradient: 'from-orange-900/30 to-red-900/10',
        badgeColor: 'bg-orange-600/20 text-orange-300'
    }
];

export default function LeagueStandings({ creators }: { creators: Creator[] }) {

    // Group creators into leagues
    const leaguesData = useMemo(() => {
        const sortedCreators = [...creators].sort((a, b) => b.diamonds - a.diamonds);

        return LEAGUES.map(league => {
            const leagueCreators = sortedCreators.filter(c => {
                // Check if creator meets minDiamonds AND is effectively below the next tier
                // Actually, simpler logic: find the highest tier they qualify for.
                // But here we iterate leagues.
                // Let's invert: map creators to their league.
                return false;
            });

            // Correct approach:
            // 1. Assign each creator to their highest qualified league
            // 2. Group by league
            return { ...league, members: [] as Creator[] };
        });
    }, [creators]);

    // Better Memo Logic
    const groupedLeagues = useMemo(() => {
        const groups = LEAGUES.map(l => ({ ...l, members: [] as Creator[] }));

        // Sort creators descending by diamonds
        const sorted = [...creators].sort((a, b) => b.diamonds - a.diamonds);

        sorted.forEach(creator => {
            // Find the first league they qualify for (since LEAGUES is ordered desc by minDiamonds)
            const league = groups.find(g => creator.diamonds >= g.minDiamonds);
            if (league) {
                league.members.push(creator);
            }
        });

        return groups;
    }, [creators]);

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        CLASIFICACIÓN DE LIGAS
                    </h3>
                    <p className="text-sm text-slate-400">Escala posiciones aumentando tus diamantes mensuales.</p>
                </div>
            </div>

            <div className="space-y-4">
                {groupedLeagues.map((league) => (
                    <LeagueCard key={league.id} league={league} nextLeagueMin={
                        // Logic to find next league min for progress bars
                        LEAGUES[LEAGUES.indexOf(league) - 1]?.minDiamonds
                    } />
                ))}
            </div>
        </div>
    );
}

function LeagueCard({ league, nextLeagueMin }: { league: any, nextLeagueMin?: number }) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`rounded-2xl border ${league.borderColor} bg-gradient-to-br ${league.bgGradient} overflow-hidden transition-all relative`}>
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-slate-900/50 border border-white/10 ${league.color}`}>
                        {league.icon}
                    </div>
                    <div>
                        <h4 className={`text-lg font-black tracking-tight ${league.color}`}>{league.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <span>Min. {league.minDiamonds.toLocaleString()} 💎</span>
                            <span>•</span>
                            <span className="text-white">{league.members.length} Creadores</span>
                        </div>
                    </div>
                </div>
                <div className={`p-2 rounded-full bg-black/20 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>

            {/* Members List */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="px-4 pb-4 space-y-2">
                            {league.members.length === 0 ? (
                                <div className="text-center py-6 text-slate-500 text-sm italic bg-black/20 rounded-xl border border-white/5">
                                    No hay creadores en esta liga aún.
                                </div>
                            ) : (
                                league.members.map((creator: Creator, idx: number) => {
                                    // Calculate progress to next league
                                    let progressEl = null;
                                    if (nextLeagueMin) {
                                        const current = creator.diamonds;
                                        const target = nextLeagueMin;
                                        const prev = league.minDiamonds;
                                        const percent = Math.min(100, Math.max(0, ((current - prev) / (target - prev)) * 100));
                                        const toGo = target - current;

                                        progressEl = (
                                            <div className="w-32 hidden md:block">
                                                <div className="flex justify-between text-[9px] mb-1 font-mono">
                                                    <span className="text-slate-400">Siguiente Nivel</span>
                                                    <span className={league.color}>{Math.round(percent)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${league.badgeColor.split(' ')[0]} bg-current`} style={{ width: `${percent}%` }} />
                                                </div>
                                                <div className="text-[9px] text-right text-slate-500 mt-0.5">
                                                    Faltan {toGo.toLocaleString()} 💎
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Top league
                                        progressEl = (
                                            <div className="w-32 hidden md:block text-right">
                                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center justify-end gap-1">
                                                    <Crown className="w-3 h-3" /> Máximo Nivel
                                                </span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={creator.creatorId} className="flex items-center gap-3 p-3 bg-black/20 hover:bg-black/40 rounded-xl border border-white/5 transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                                                #{idx + 1}
                                            </div>
                                            <img
                                                src={creator.avatar || `/foto_perfil/${creator.username.replace(/[^a-zA-Z0-9_\.]/g, '')}.jpg`}
                                                onError={(e) => e.currentTarget.src = '/default-user.png'}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm font-bold text-white truncate">{creator.username}</h5>
                                                <p className="text-xs text-slate-400 font-mono">{creator.diamonds.toLocaleString()} 💎</p>
                                            </div>

                                            {progressEl}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
