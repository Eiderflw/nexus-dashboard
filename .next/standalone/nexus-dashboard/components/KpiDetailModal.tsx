'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Diamond, Clock, Zap, AlertTriangle, Users, TrendingUp, TrendingDown, Minus, Search, ArrowUpDown, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { Creator } from '@/types';
import { useState, useMemo } from 'react';

export type KpiCategory = 'total' | 'inactive' | 'regular' | 'super' | 'diamonds' | 'potential' | 'at_risk' | 'total_diamonds' | 'total_hours' | 'active_creators' | 'regulars';

interface KpiDetailModalProps {
    category: KpiCategory;
    creators: Creator[];
    onClose: () => void;
    top3?: Creator[];
    atRisk?: Creator[];
}

/**
 * Smart category logic based on the current day of the month.
 * Super: >= 60% of days worked
 * Regular: >= 20% and < 60%
 * Inactive: < 20%
 */
export function getCreatorCategory(creator: Creator): 'super' | 'regular' | 'inactive' {
    const dayOfMonth = new Date().getDate();
    if (dayOfMonth === 0 || creator.validDays === 0) return 'inactive';
    const ratio = creator.validDays / dayOfMonth;
    if (ratio >= 0.60) return 'super';
    if (ratio >= 0.20) return 'regular';
    return 'inactive';
}

/**
 * "Potenciales Dormidos": creators who CAN earn (diamonds > 50K or good last month)
 * but are underperforming on activity (validDays or liveHours is low).
 */
export function isPotential(creator: Creator): boolean {
    const dayOfMonth = new Date().getDate();
    const ratio = dayOfMonth > 0 ? creator.validDays / dayOfMonth : 0;
    const hasEarningPower = creator.diamonds > 50000 || creator.lastMonthDiamonds > 50000;
    const isUnderperforming = ratio < 0.60 || creator.liveHours < 20;
    return hasEarningPower && isUnderperforming;
}

type SortField = 'diamonds' | 'validDays' | 'liveHours' | 'trend';
type SortDir = 'desc' | 'asc';

const CATEGORY_CONFIG: Record<KpiCategory, {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    bgColor: string;
    filter: (c: Creator) => boolean;
    defaultSort: SortField;
}> = {
    // ... existing ...
    regulars: {
        title: 'Creadores Regulares',
        subtitle: 'Constantes pero con potencial de crecimiento',
        icon: <Users className="w-5 h-5" />,
        color: 'text-indigo-400',
        borderColor: 'border-indigo-500/30',
        bgColor: 'bg-indigo-500/10',
        filter: () => true, // Handled in component
        defaultSort: 'diamonds',
    },
    total: {
        title: 'Todos los Creadores',
        subtitle: 'Base completa de la agencia',
        icon: <Users className="w-5 h-5" />,
        color: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        bgColor: 'bg-blue-500/10',
        filter: () => true,
        defaultSort: 'diamonds',
    },
    // ... rest ...
    // New Categories mapping to existing logic or new filters
    total_diamonds: {
        title: 'Todos los Creadores',
        subtitle: 'Vista general de diamantes',
        icon: <Diamond className="w-5 h-5" />,
        color: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        bgColor: 'bg-blue-500/10',
        filter: () => true,
        defaultSort: 'diamonds',
    },
    total_hours: {
        title: 'Ranking de Horas',
        subtitle: 'Creadores ordenados por horas transmitidas',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        bgColor: 'bg-purple-500/10',
        filter: () => true,
        defaultSort: 'liveHours',
    },
    active_creators: {
        title: 'Creadores Activos',
        subtitle: 'Han transmitido al menos 1 día este mes',
        icon: <Users className="w-5 h-5" />,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/10',
        filter: (c) => c.validDays > 0,
        defaultSort: 'validDays',
    },
    inactive: {
        title: 'Creadores Inactivos',
        subtitle: 'Trabajan menos del 20% de los días del mes',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'text-red-400',
        borderColor: 'border-red-500/30',
        bgColor: 'bg-red-500/10',
        filter: (c) => getCreatorCategory(c) === 'inactive',
        defaultSort: 'diamonds',
    },
    at_risk: {
        title: 'Creadores en Riesgo',
        subtitle: 'Rendimiento crítico bajo',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'text-red-500',
        borderColor: 'border-red-600/30',
        bgColor: 'bg-red-600/10',
        // Simple filter for risk, or reuse logic
        filter: (c) => getCreatorCategory(c) === 'inactive' || (c.diamondsGrowth !== undefined && c.diamondsGrowth < 0),
        defaultSort: 'trend',
    },
    regular: {
        title: 'Creadores Regulares',
        subtitle: 'Trabajan entre el 20% y 60% de los días del mes',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        bgColor: 'bg-yellow-500/10',
        filter: (c) => getCreatorCategory(c) === 'regular',
        defaultSort: 'diamonds',
    },
    super: {
        title: 'Super Trabajadores',
        subtitle: 'Trabajan el 60% o más de los días del mes',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        bgColor: 'bg-purple-500/10',
        filter: (c) => getCreatorCategory(c) === 'super',
        defaultSort: 'diamonds',
    },
    diamonds: {
        title: 'Top Generadores de Diamantes',
        subtitle: 'Creadores ordenados por diamantes generados',
        icon: <Diamond className="w-5 h-5" />,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/30',
        bgColor: 'bg-cyan-500/10',
        filter: (c) => c.diamonds > 0,
        defaultSort: 'diamonds',
    },
    potential: {
        title: 'Potenciales Dormidos',
        subtitle: 'Ganan bien pero trabajan poco — máxima oportunidad',
        icon: <Sparkles className="w-5 h-5" />,
        color: 'text-orange-400',
        borderColor: 'border-orange-500/30',
        bgColor: 'bg-orange-500/10',
        filter: isPotential,
        defaultSort: 'diamonds',
    },
};

const SORT_OPTIONS: { field: SortField; label: string }[] = [
    { field: 'diamonds', label: '💎 Diamantes' },
    { field: 'validDays', label: '📅 Días' },
    { field: 'liveHours', label: '⏱ Horas' },
    { field: 'trend', label: '📈 Tendencia' },
];

function sortCreators(creators: Creator[], field: SortField, dir: SortDir): Creator[] {
    return [...creators].sort((a, b) => {
        let va = 0, vb = 0;
        if (field === 'diamonds') { va = a.diamonds; vb = b.diamonds; }
        else if (field === 'validDays') { va = a.validDays; vb = b.validDays; }
        else if (field === 'liveHours') { va = a.liveHours; vb = b.liveHours; }
        else if (field === 'trend') {
            va = a.diamondsDailyTrend ?? a.diamondsGrowth ?? 0;
            vb = b.diamondsDailyTrend ?? b.diamondsGrowth ?? 0;
        }
        return dir === 'desc' ? vb - va : va - vb;
    });
}

function TrendBadge({ value }: { value: number | undefined }) {
    if (value === undefined) return <span className="flex items-center gap-0.5 text-xs text-slate-500"><Minus className="w-3 h-3" />-</span>;
    if (value > 0.05) return (
        <span className="flex items-center gap-0.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-3 h-3" />+{Math.round(value * 100)}%
        </span>
    );
    if (value < -0.05) return (
        <span className="flex items-center gap-0.5 text-xs text-red-400 font-bold">
            <TrendingDown className="w-3 h-3" />{Math.round(value * 100)}%
        </span>
    );
    return (
        <span className="flex items-center gap-0.5 text-xs text-slate-500">
            <Minus className="w-3 h-3" />Estable
        </span>
    );
}

function CategoryBadge({ creator }: { creator: Creator }) {
    const cat = getCreatorCategory(creator);
    const dayOfMonth = new Date().getDate();
    const ratio = dayOfMonth > 0 ? Math.round((creator.validDays / dayOfMonth) * 100) : 0;
    if (cat === 'super') return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">⚡ Super · {ratio}%</span>
    );
    if (cat === 'regular') return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">🕐 Regular · {ratio}%</span>
    );
    return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">⚠ Inactivo · {ratio}%</span>
    );
}

function CreatorAvatar({ creator }: { creator: Creator }) {
    const safeUsername = creator.username.replace(/[^a-zA-Z0-9_.]/g, '');
    const localPhoto = `/foto_perfil/${safeUsername}.jpg`;
    const [imgSrc, setImgSrc] = useState(creator.avatar || localPhoto);
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white text-sm font-black border border-slate-600 shrink-0">
                {creator.username.charAt(0).toUpperCase()}
            </div>
        );
    }
    return (
        <img
            src={imgSrc}
            alt={creator.username}
            className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
            onError={() => {
                if (imgSrc !== localPhoto) {
                    setImgSrc(localPhoto);
                } else {
                    setFailed(true);
                }
            }}
        />
    );
}

export default function KpiDetailModal({ category, creators, onClose, top3 = [], atRisk = [] }: KpiDetailModalProps) {
    const config = CATEGORY_CONFIG[category];
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>(config.defaultSort);
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const dayOfMonth = new Date().getDate();

    const handleSort = (field: SortField) => {
        if (field === sortField) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const filtered = useMemo(() => {
        let base: Creator[] = [];

        if (category === 'regulars') {
            // Regulares = Active (validDays > 0) AND NOT (Top3 OR Potential)
            base = creators.filter(c => {
                const isActive = c.validDays > 0;
                if (!isActive) return false;

                // Check if in Top 3
                const isTop = top3.some(t => t.creatorId === c.creatorId);

                // Check if Potential
                const isPot = isPotential(c);

                return !isTop && !isPot;
            });
        } else {
            base = config ? creators.filter(config.filter) : [];
        }

        const searched = base.filter(c => c.username.toLowerCase().includes(search.toLowerCase()));
        return sortCreators(searched, sortField, sortDir);
    }, [creators, config, search, sortField, sortDir, category, top3]);

    const totalDiamonds = filtered.reduce((s, c) => s + c.diamonds, 0);
    const totalHours = filtered.reduce((s, c) => s + c.liveHours, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border ${config.borderColor} rounded-2xl shadow-2xl overflow-hidden`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-5 border-b border-slate-800 ${config.bgColor}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-slate-800 ${config.color}`}>{config.icon}</div>
                        <div>
                            <h2 className={`text-lg font-bold ${config.color}`}>{config.title}</h2>
                            <p className="text-xs text-slate-400">{config.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Creadores</p>
                            <p className={`text-xl font-black font-mono ${config.color}`}>{filtered.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Diamantes</p>
                            <p className="text-xl font-black font-mono text-cyan-400">
                                {totalDiamonds >= 1000000 ? `${(totalDiamonds / 1000000).toFixed(2)}M` : `${(totalDiamonds / 1000).toFixed(1)}K`}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Context bar */}
                <div className="px-5 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span>📅 Día <strong className="text-white">{dayOfMonth}</strong></span>
                    <span>·</span>
                    <span>⚡ Super ≥{Math.ceil(dayOfMonth * 0.6)} días</span>
                    <span>·</span>
                    <span>🕐 Regular {Math.ceil(dayOfMonth * 0.2)}–{Math.ceil(dayOfMonth * 0.6) - 1} días</span>
                    <span>·</span>
                    <span>⏱ {totalHours.toFixed(0)}h LIVE total</span>
                </div>

                {/* Search + Sort */}
                <div className="px-4 py-3 border-b border-slate-800 space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar creador..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
                        />
                    </div>
                    {/* Sort buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-600 uppercase font-bold mr-1">Ordenar:</span>
                        {SORT_OPTIONS.map(opt => {
                            const active = sortField === opt.field;
                            return (
                                <button
                                    key={opt.field}
                                    onClick={() => handleSort(opt.field)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${active
                                        ? `${config.color} bg-slate-700 border border-slate-600`
                                        : 'text-slate-500 bg-slate-800/50 border border-transparent hover:border-slate-700 hover:text-slate-300'
                                        }`}
                                >
                                    {opt.label}
                                    {active ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Creator List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <Users className="w-10 h-10 mb-3 opacity-30" />
                            <p className="text-sm">No hay creadores en esta categoría</p>
                        </div>
                    ) : (
                        filtered.map((creator, idx) => (
                            <motion.div
                                key={creator.creatorId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: Math.min(idx * 0.012, 0.25), duration: 0.18 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 group"
                            >
                                <span className="text-xs font-bold text-slate-600 w-6 text-right shrink-0">#{idx + 1}</span>
                                <CreatorAvatar creator={creator} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{creator.username}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-xs text-slate-500">{creator.validDays} días válidos</span>
                                        <CategoryBadge creator={creator} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-slate-500">Horas LIVE</p>
                                        <p className="text-sm font-bold text-slate-300">{creator.liveHours.toFixed(1)}h</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Diamantes</p>
                                        <p className="text-sm font-bold text-cyan-400 font-mono">
                                            {creator.diamonds >= 1000000 ? `${(creator.diamonds / 1000000).toFixed(2)}M`
                                                : creator.diamonds >= 1000 ? `${(creator.diamonds / 1000).toFixed(1)}K`
                                                    : creator.diamonds.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right w-16">
                                        <p className="text-xs text-slate-500">Tendencia</p>
                                        <TrendBadge value={creator.diamondsDailyTrend ?? creator.diamondsGrowth} />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        <span className="text-white font-bold">{filtered.length}</span> creadores · ordenado por <span className="text-white">{SORT_OPTIONS.find(o => o.field === sortField)?.label}</span> {sortDir === 'desc' ? '↓' : '↑'}
                    </p>
                    <p className="text-xs text-slate-500">Lógica: % días vs día {dayOfMonth}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
